import crypto from 'node:crypto'
import { exchangeSpotifyCode, SpotifyApiError } from './spotify-client.js'
import { setNoStore } from '../shared/http.js'

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const DEFAULT_FRONTEND_DASHBOARD_PATH = '/playground'
const OAUTH_CODE_MAX_LENGTH = 1024
const OAUTH_STATE_MAX_LENGTH = 256

export function createSpotifyLoginHandler({ spotifyConfig, sessionService }) {
  return function spotifyLoginHandler(req, res) {
    setNoStore(res)
    if (!spotifyConfig?.isConfigured) {
      return res.status(503).json({ message: 'Spotify dashboard is not configured on this API.' })
    }

    const sessionContext = sessionService.loadSession(req) || sessionService.createSession({})
    const codeVerifier = createPkceVerifier()
    const state = createOAuthState()
    const expiresAt = Date.now() + spotifyConfig.pkceTtlMs

    sessionContext.session.spotifyAuth = {
      state,
      codeVerifier,
      expiresAt
    }

    sessionService.persistSession(res, sessionContext)
    return res.redirect(302, buildSpotifyAuthorizeUrl({ spotifyConfig, state, codeVerifier }))
  }
}

export function createSpotifyCallbackHandler({ spotifyConfig, sessionService, fetchImpl = fetch, logger = console }) {
  return async function spotifyCallbackHandler(req, res) {
    setNoStore(res)
    const frontendDashboardUrl = buildFrontendDashboardUrl(spotifyConfig?.appBaseUrl, DEFAULT_FRONTEND_DASHBOARD_PATH)

    if (!spotifyConfig?.isConfigured) {
      return res.redirect(302, frontendDashboardUrl)
    }

    const code = normalizeQueryValue(req.query.code, OAUTH_CODE_MAX_LENGTH)
    const state = normalizeQueryValue(req.query.state, OAUTH_STATE_MAX_LENGTH)
    if (!code || !state) {
      return res.redirect(302, frontendDashboardUrl)
    }

    const sessionContext = sessionService.loadSession(req)
    const pendingAuth = sessionContext?.session?.spotifyAuth
    if (!sessionContext || !pendingAuth || !isPendingAuthValid(pendingAuth, state)) {
      if (sessionContext) {
        sessionContext.session.spotifyAuth = null
        sessionService.persistSession(res, sessionContext)
      }
      return res.redirect(302, frontendDashboardUrl)
    }

    try {
      const tokenPayload = await exchangeSpotifyCode({
        code,
        codeVerifier: pendingAuth.codeVerifier,
        clientId: spotifyConfig.clientId,
        redirectUri: spotifyConfig.redirectUri,
        fetchImpl,
        timeoutMs: spotifyConfig.requestTimeoutMs
      })

      const now = Date.now()
      sessionContext.session.spotifyTokens = {
        accessToken: tokenPayload.accessToken,
        refreshToken: tokenPayload.refreshToken,
        tokenType: tokenPayload.tokenType,
        scope: tokenPayload.scope,
        expiresAt: now + tokenPayload.expiresInSeconds * 1000 - 30_000,
        updatedAt: now
      }
      sessionContext.session.spotifyAuth = null
      sessionContext.session.musicDashboardCache = null

      sessionService.persistSession(res, sessionContext)
      return res.redirect(302, frontendDashboardUrl)
    } catch (error) {
      sessionContext.session.spotifyAuth = null
      sessionContext.session.spotifyTokens = null
      sessionContext.session.musicDashboardCache = null
      sessionService.persistSession(res, sessionContext)

      if (error instanceof SpotifyApiError && error.status === 429) {
        return res.redirect(302, frontendDashboardUrl)
      }

      logger.warn?.('Spotify callback failed.')
      return res.redirect(302, frontendDashboardUrl)
    }
  }
}

export function createSpotifyLogoutHandler({ sessionService }) {
  return function spotifyLogoutHandler(req, res) {
    setNoStore(res)
    const sessionContext = sessionService.loadSession(req)
    if (sessionContext) {
      sessionService.destroySession(res, sessionContext)
    } else {
      sessionService.clearSessionCookie(res)
    }

    return res.json({ ok: true })
  }
}

export function buildSpotifyAuthorizeUrl({ spotifyConfig, state, codeVerifier }) {
  const challenge = createPkceChallenge(codeVerifier)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyConfig.clientId,
    redirect_uri: spotifyConfig.redirectUri,
    scope: spotifyConfig.scopes,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    show_dialog: 'true'
  })

  return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`
}

export function createPkceVerifier() {
  return crypto.randomBytes(64).toString('base64url')
}

export function createPkceChallenge(codeVerifier) {
  return crypto.createHash('sha256').update(String(codeVerifier || '')).digest('base64url')
}

export function createOAuthState() {
  return crypto.randomBytes(24).toString('base64url')
}

function normalizeQueryValue(value, maxLength) {
  if (typeof value !== 'string') return ''
  const normalized = value.trim()
  if (!normalized || normalized.length > maxLength || /\s/.test(normalized)) return ''
  return normalized
}

function isPendingAuthValid(pendingAuth, expectedState) {
  const expiresAt = Number(pendingAuth?.expiresAt || 0)
  if (!expiresAt || Date.now() > expiresAt) {
    return false
  }

  const storedState = String(pendingAuth?.state || '')
  if (!storedState) return false
  return safeEqual(storedState, String(expectedState || ''))
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''))
  const right = Buffer.from(String(b || ''))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function buildFrontendDashboardUrl(appBaseUrl, routePath) {
  const baseUrl = String(appBaseUrl || '').trim().replace(/\/$/, '')
  if (!baseUrl) return routePath
  return `${baseUrl}${routePath}`
}
