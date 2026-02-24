import rateLimit from 'express-rate-limit'
import { getRequestIp, setNoStore } from '../shared/http.js'
import { buildSpotifyDashboardSnapshot, InsufficientSpotifyDataError } from './music-dashboard-build.js'
import {
  fetchSpotifyClientCredentialsToken,
  fetchSpotifyApiJson,
  refreshSpotifyAccessToken,
  SpotifyApiError,
  SpotifyAuthError,
  SpotifyRateLimitError
} from './spotify-client.js'

const SPOTIFY_ARTIST_BATCH_SIZE = 50
const SPOTIFY_APP_TOKEN_SKEW_MS = 15_000

const spotifyAppTokenCache = {
  cacheKey: '',
  accessToken: '',
  expiresAt: 0
}

const spotifyOwnerTokenCache = {
  accessToken: '',
  refreshToken: '',
  expiresAt: 0
}

const spotifyDashboardSnapshotCache = {
  snapshot: null,
  expiresAt: 0
}

export function createMusicDashboardSnapshotRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      return res.status(429).json({ message: 'Too many Spotify dashboard requests. Please try again shortly.' })
    }
  })
}

export function createMusicDashboardSnapshotHandler({
  spotifyConfig,
  fetchImpl = fetch,
  spotifyDailyCapMax = 100,
  takeDailyQuotaOrFail,
  logger = console
}) {
  return async function musicDashboardSnapshotHandler(req, res) {
    setNoStore(res)

    if (!spotifyConfig?.dashboardEnabled) {
      return res.status(503).json({ message: 'Spotify dashboard source account is not configured on this API.' })
    }

    const forceRefresh = parseRefreshQuery(req.query.refresh)
    if (forceRefresh === null) {
      return res.status(400).json({ message: 'Invalid "refresh" query value. Use true/false or 1/0.' })
    }

    const requestIp = getRequestIp(req)
    const dailyQuota = await takeDailyQuotaOrFail(requestIp, res)
    if (!dailyQuota) return
    if (!dailyQuota.allowed) {
      return res
        .status(429)
        .json({ message: `Daily Spotify dashboard limit reached (${spotifyDailyCapMax}/day per IP). Please try again tomorrow.` })
    }
    if (dailyQuota.remaining >= 0) {
      res.setHeader('X-Spotify-Dashboard-Daily-Remaining', String(dailyQuota.remaining))
    }

    const cachedSnapshot = !forceRefresh && getValidSnapshotCache(Date.now())
    if (cachedSnapshot) {
      return res.json(cachedSnapshot)
    }

    try {
      const snapshot = await loadDashboardSnapshotFromSpotify({
        spotifyConfig,
        fetchImpl,
        logger
      })

      spotifyDashboardSnapshotCache.snapshot = snapshot
      spotifyDashboardSnapshotCache.expiresAt = Date.now() + spotifyConfig.snapshotCacheTtlMs
      return res.json(snapshot)
    } catch (error) {
      if (error instanceof SpotifyAuthError) {
        spotifyOwnerTokenCache.accessToken = ''
        spotifyOwnerTokenCache.expiresAt = 0
        const authReason = extractSpotifyAuthReason(error?.details)
        const reasonText = authReason ? ` (Spotify reason: ${authReason})` : ''
        logger.warn?.(
          `Spotify dashboard auth failed. status=${error?.status || 'unknown'} details=${String(error?.details || 'n/a')}`
        )
        return res.status(503).json({
          message:
            `Spotify dashboard auth failed on server. Check SPOTIFY_OWNER_REFRESH_TOKEN, SPOTIFY_CLIENT_ID, and SPOTIFY_CLIENT_SECRET configuration.${reasonText}`
        })
      }

      if (error instanceof SpotifyRateLimitError) {
        return res.status(429).json({
          message: 'Spotify is rate limiting requests right now. Please wait and try again.',
          retryAfterSeconds: error.retryAfterSeconds || 0
        })
      }

      if (error instanceof InsufficientSpotifyDataError) {
        return res.status(422).json({ message: error.message })
      }

      if (error instanceof SpotifyApiError) {
        if (error.status === 403) {
          return res.status(403).json({
            message: 'Spotify denied access to the configured dashboard account data.'
          })
        }
        return res.status(error.status || 502).json({ message: 'Could not load Spotify dashboard data right now.' })
      }

      logger.error?.('Unexpected Spotify dashboard error:', error)
      return res.status(500).json({ message: 'Unexpected Spotify dashboard error.' })
    }
  }
}

async function loadDashboardSnapshotFromSpotify({ spotifyConfig, fetchImpl, logger = console }) {
  const recentlyPlayedPayload = await spotifyGetJsonWithOwnerToken({
    spotifyConfig,
    fetchImpl,
    path: '/me/player/recently-played',
    query: { limit: 50 }
  })
  const recentItems = Array.isArray(recentlyPlayedPayload?.items) ? recentlyPlayedPayload.items : []

  const primaryArtistIds = collectPrimaryArtistIds(recentItems)
  let artistsById = {}

  if (primaryArtistIds.length) {
    try {
      artistsById = await fetchArtistsById({
        artistIds: primaryArtistIds,
        spotifyConfig,
        fetchImpl,
        logger
      })
    } catch (error) {
      const details = String(error?.details || '')
      if (error instanceof SpotifyApiError && error.status === 403 && details.includes('path=/artists')) {
        logger.warn?.('Spotify artist lookup denied for dashboard. Continuing without artist portraits.')
      } else {
        throw error
      }
    }
  }

  return buildSpotifyDashboardSnapshot({
    recentlyPlayedItems: recentItems,
    artistsById,
    now: new Date()
  })
}

async function fetchArtistsById({ artistIds, spotifyConfig, fetchImpl, logger = console }) {
  if (!artistIds.length) return {}

  const clientCredentialsAccessToken = await getSpotifyAppAccessToken({
    spotifyConfig,
    fetchImpl,
    logger
  })

  logger.info?.(
    `Spotify dashboard artist lookup auth mode: ${clientCredentialsAccessToken ? 'app-token' : 'owner-token'} (artists=${artistIds.length})`
  )

  const artistsById = {}
  for (let i = 0; i < artistIds.length; i += SPOTIFY_ARTIST_BATCH_SIZE) {
    const batchIds = artistIds.slice(i, i + SPOTIFY_ARTIST_BATCH_SIZE)
    const payload = clientCredentialsAccessToken
      ? await spotifyGetJsonWithAppToken({
          accessToken: clientCredentialsAccessToken,
          fetchImpl,
          spotifyConfig,
          logger,
          path: '/artists',
          query: {
            ids: batchIds.join(',')
          }
        })
      : await spotifyGetJsonWithOwnerToken({
          spotifyConfig,
          fetchImpl,
          path: '/artists',
          query: {
            ids: batchIds.join(',')
          }
        })

    const artists = Array.isArray(payload?.artists) ? payload.artists : []
    for (const artist of artists) {
      const artistId = String(artist?.id || '').trim()
      if (!artistId) continue
      artistsById[artistId] = {
        name: String(artist?.name || '').trim(),
        imageUrl: normalizeImage(artist?.images),
        externalUrl: String(artist?.external_urls?.spotify || '').trim()
      }
    }
  }

  return artistsById
}

async function spotifyGetJsonWithOwnerToken({ spotifyConfig, fetchImpl, path, query }) {
  const accessToken = await getOwnerAccessToken({
    spotifyConfig,
    fetchImpl
  })

  try {
    return await fetchSpotifyApiJson({
      path,
      query,
      accessToken,
      fetchImpl,
      timeoutMs: spotifyConfig.requestTimeoutMs
    })
  } catch (error) {
    if (!(error instanceof SpotifyAuthError)) {
      throw error
    }

    spotifyOwnerTokenCache.accessToken = ''
    spotifyOwnerTokenCache.expiresAt = 0

    const refreshedAccessToken = await getOwnerAccessToken({
      spotifyConfig,
      fetchImpl,
      forceRefresh: true
    })

    return fetchSpotifyApiJson({
      path,
      query,
      accessToken: refreshedAccessToken,
      fetchImpl,
      timeoutMs: spotifyConfig.requestTimeoutMs
    })
  }
}

async function getOwnerAccessToken({ spotifyConfig, fetchImpl, forceRefresh = false }) {
  const clientId = String(spotifyConfig?.clientId || '').trim()
  const clientSecret = String(spotifyConfig?.clientSecret || '').trim()
  const configuredRefreshToken = String(spotifyConfig?.ownerRefreshToken || '').trim()
  const currentRefreshToken = spotifyOwnerTokenCache.refreshToken || configuredRefreshToken

  if (!clientId || !currentRefreshToken) {
    throw new SpotifyAuthError('Spotify dashboard owner credentials are missing.')
  }

  if (
    !forceRefresh &&
    spotifyOwnerTokenCache.accessToken &&
    Date.now() + SPOTIFY_APP_TOKEN_SKEW_MS < spotifyOwnerTokenCache.expiresAt
  ) {
    return spotifyOwnerTokenCache.accessToken
  }

  const refreshed = await refreshSpotifyAccessToken({
    refreshToken: currentRefreshToken,
    clientId,
    clientSecret,
    fetchImpl,
    timeoutMs: spotifyConfig.requestTimeoutMs
  })

  const now = Date.now()
  spotifyOwnerTokenCache.accessToken = refreshed.accessToken
  spotifyOwnerTokenCache.refreshToken = refreshed.refreshToken || currentRefreshToken
  spotifyOwnerTokenCache.expiresAt = now + refreshed.expiresInSeconds * 1000 - 30_000

  return spotifyOwnerTokenCache.accessToken
}

async function spotifyGetJsonWithAppToken({ accessToken, spotifyConfig, fetchImpl, path, query, logger = console }) {
  try {
    return await fetchSpotifyApiJson({
      path,
      query,
      accessToken,
      fetchImpl,
      timeoutMs: spotifyConfig.requestTimeoutMs
    })
  } catch (error) {
    if (!(error instanceof SpotifyAuthError)) {
      throw error
    }

    const refreshedAccessToken = await getSpotifyAppAccessToken({
      spotifyConfig,
      fetchImpl,
      forceRefresh: true,
      logger
    })
    if (!refreshedAccessToken) {
      throw error
    }

    return fetchSpotifyApiJson({
      path,
      query,
      accessToken: refreshedAccessToken,
      fetchImpl,
      timeoutMs: spotifyConfig.requestTimeoutMs
    })
  }
}

async function getSpotifyAppAccessToken({ spotifyConfig, fetchImpl, forceRefresh = false, logger = console }) {
  const clientId = String(spotifyConfig?.clientId || '').trim()
  const clientSecret = String(spotifyConfig?.clientSecret || '').trim()
  if (!clientId || !clientSecret) return ''

  const cacheKey = `${clientId}:${clientSecret}`
  if (
    !forceRefresh &&
    spotifyAppTokenCache.cacheKey === cacheKey &&
    spotifyAppTokenCache.accessToken &&
    Date.now() + SPOTIFY_APP_TOKEN_SKEW_MS < spotifyAppTokenCache.expiresAt
  ) {
    return spotifyAppTokenCache.accessToken
  }

  let tokenPayload
  try {
    tokenPayload = await fetchSpotifyClientCredentialsToken({
      clientId,
      clientSecret,
      fetchImpl,
      timeoutMs: spotifyConfig.requestTimeoutMs
    })
  } catch (error) {
    logger.warn?.(`Spotify client credentials token failed. code=${error?.code || 'unknown'}`)
    throw error
  }

  spotifyAppTokenCache.cacheKey = cacheKey
  spotifyAppTokenCache.accessToken = tokenPayload.accessToken
  spotifyAppTokenCache.expiresAt = Date.now() + tokenPayload.expiresInSeconds * 1000 - 30_000

  return spotifyAppTokenCache.accessToken
}

function collectPrimaryArtistIds(items) {
  const uniqueArtistIds = new Set()
  for (const item of items) {
    const artistId = String(item?.track?.artists?.[0]?.id || '').trim()
    if (!artistId) continue
    uniqueArtistIds.add(artistId)
  }
  return [...uniqueArtistIds]
}

function getValidSnapshotCache(now) {
  if (!spotifyDashboardSnapshotCache.snapshot) return null
  if (!spotifyDashboardSnapshotCache.expiresAt || now > spotifyDashboardSnapshotCache.expiresAt) {
    spotifyDashboardSnapshotCache.snapshot = null
    spotifyDashboardSnapshotCache.expiresAt = 0
    return null
  }
  return spotifyDashboardSnapshotCache.snapshot
}

function parseRefreshQuery(value) {
  if (value === undefined) return false
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized || normalized === '0' || normalized === 'false') return false
  if (normalized === '1' || normalized === 'true') return true
  return null
}

function normalizeImage(images) {
  if (!Array.isArray(images)) return ''
  for (const image of images) {
    const url = String(image?.url || '').trim()
    if (url) return url
  }
  return ''
}

function extractSpotifyAuthReason(details) {
  const normalized = String(details || '').trim().toLowerCase()
  if (!normalized) return ''
  if (normalized.includes('invalid_client')) return 'invalid_client'
  if (normalized.includes('invalid_grant')) return 'invalid_grant'
  if (normalized.includes('invalid_scope')) return 'invalid_scope'
  return ''
}
