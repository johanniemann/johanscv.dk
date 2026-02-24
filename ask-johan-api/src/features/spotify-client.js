const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_WEB_API_BASE = 'https://api.spotify.com/v1'
const DEFAULT_TIMEOUT_MS = 12_000

export class SpotifyApiError extends Error {
  constructor(message, { status = 500, retryAfterSeconds = 0, code = 'SPOTIFY_API_ERROR', details = '' } = {}) {
    super(message)
    this.name = 'SpotifyApiError'
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
    this.code = code
    this.details = details
  }
}

export class SpotifyAuthError extends SpotifyApiError {
  constructor(message = 'Spotify authorization is required.', options = {}) {
    super(message, { ...options, status: options.status || 401, code: 'SPOTIFY_AUTH_REQUIRED' })
    this.name = 'SpotifyAuthError'
  }
}

export class SpotifyRateLimitError extends SpotifyApiError {
  constructor(message = 'Spotify rate limit reached. Please retry shortly.', retryAfterSeconds = 0) {
    super(message, { status: 429, retryAfterSeconds, code: 'SPOTIFY_RATE_LIMITED' })
    this.name = 'SpotifyRateLimitError'
  }
}

export async function exchangeSpotifyCode({
  code,
  codeVerifier,
  clientId,
  redirectUri,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  })

  const response = await fetchWithTimeout(
    SPOTIFY_ACCOUNTS_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    },
    timeoutMs,
    fetchImpl
  )

  const payload = await safeParseJson(response)
  if (response.status === 429) {
    throw new SpotifyRateLimitError('Spotify token endpoint is rate limited.', getRetryAfterSeconds(response))
  }
  if (response.status === 400 || response.status === 401) {
    throw new SpotifyAuthError('Spotify callback validation failed.', { status: response.status })
  }
  if (!response.ok) {
    throw new SpotifyApiError('Spotify token exchange failed.', { status: response.status })
  }

  return normalizeTokenPayload(payload, {
    fallbackRefreshToken: '',
    authErrorMessage: 'Spotify token response is invalid.'
  })
}

export async function refreshSpotifyAccessToken({
  refreshToken,
  clientId,
  clientSecret = '',
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId
  })
  const normalizedClientSecret = String(clientSecret || '').trim()
  if (normalizedClientSecret) {
    params.set('client_secret', normalizedClientSecret)
  }

  const response = await fetchWithTimeout(
    SPOTIFY_ACCOUNTS_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    },
    timeoutMs,
    fetchImpl
  )

  const payload = await safeParseJson(response)
  if (response.status === 429) {
    throw new SpotifyRateLimitError('Spotify token refresh is rate limited.', getRetryAfterSeconds(response))
  }
  if (response.status === 400 || response.status === 401) {
    throw new SpotifyAuthError('Spotify token refresh failed.', { status: response.status })
  }
  if (!response.ok) {
    throw new SpotifyApiError('Spotify token refresh failed.', { status: response.status })
  }

  return normalizeTokenPayload(payload, {
    fallbackRefreshToken: refreshToken,
    authErrorMessage: 'Spotify refresh token response is invalid.'
  })
}

export async function fetchSpotifyClientCredentialsToken({
  clientId,
  clientSecret,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: String(clientId || '').trim(),
    client_secret: String(clientSecret || '').trim()
  })

  const response = await fetchWithTimeout(
    SPOTIFY_ACCOUNTS_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    },
    timeoutMs,
    fetchImpl
  )

  const payload = await safeParseJson(response)
  const errorDetails = parseSpotifyErrorDetails(payload)
  if (response.status === 429) {
    throw new SpotifyRateLimitError('Spotify client credentials token endpoint is rate limited.', getRetryAfterSeconds(response))
  }
  if (response.status === 400 || response.status === 401 || response.status === 403) {
    throw new SpotifyApiError('Spotify client credentials request failed.', {
      status: 502,
      code: 'SPOTIFY_CLIENT_CREDENTIALS_FAILED',
      details: errorDetails
    })
  }
  if (!response.ok) {
    throw new SpotifyApiError('Spotify client credentials request failed.', {
      status: response.status,
      code: 'SPOTIFY_CLIENT_CREDENTIALS_FAILED',
      details: errorDetails
    })
  }

  const accessToken = String(payload?.access_token || '').trim()
  const tokenType = String(payload?.token_type || 'Bearer').trim() || 'Bearer'
  const expiresIn = Number(payload?.expires_in || 0)

  if (!accessToken || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new SpotifyApiError('Spotify client credentials token response is invalid.', {
      status: 502,
      code: 'SPOTIFY_CLIENT_CREDENTIALS_FAILED'
    })
  }

  return {
    accessToken,
    tokenType,
    expiresInSeconds: Math.floor(expiresIn)
  }
}

export async function fetchSpotifyApiJson({
  path,
  query = {},
  accessToken,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  const url = buildSpotifyUrl(path, query)
  const response = await fetchWithTimeout(
    url,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    timeoutMs,
    fetchImpl
  )
  const errorPayload = response.ok ? null : await safeParseJson(response)
  const headerDetails = String(response.headers.get('www-authenticate') || '').trim()
  const errorDetails = parseSpotifyErrorDetails(errorPayload, headerDetails)

  if (response.status === 401) {
    throw new SpotifyAuthError('Spotify authorization is missing or expired.', { status: 401 })
  }
  if (response.status === 403) {
    const detailWithPath = [`path=${path}`, errorDetails].filter(Boolean).join('; ')
    throw new SpotifyApiError('Spotify denied access to this resource.', {
      status: 403,
      code: 'SPOTIFY_FORBIDDEN',
      details: detailWithPath
    })
  }
  if (response.status === 429) {
    throw new SpotifyRateLimitError('Spotify is handling too many requests right now.', getRetryAfterSeconds(response))
  }
  if (!response.ok) {
    throw new SpotifyApiError('Spotify API request failed.', {
      status: response.status,
      details: errorDetails
    })
  }

  const payload = await safeParseJson(response)
  if (!payload || typeof payload !== 'object') {
    throw new SpotifyApiError('Spotify API returned an invalid payload.', { status: 502 })
  }

  return payload
}

function normalizeTokenPayload(payload, { fallbackRefreshToken, authErrorMessage }) {
  const accessToken = String(payload?.access_token || '').trim()
  const refreshToken = String(payload?.refresh_token || fallbackRefreshToken || '').trim()
  const tokenType = String(payload?.token_type || 'Bearer').trim() || 'Bearer'
  const scope = String(payload?.scope || '').trim()
  const expiresIn = Number(payload?.expires_in || 0)
  if (!accessToken || !refreshToken || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new SpotifyAuthError(authErrorMessage, { status: 502 })
  }

  return {
    accessToken,
    refreshToken,
    tokenType,
    scope,
    expiresInSeconds: Math.floor(expiresIn)
  }
}

function buildSpotifyUrl(path, query = {}) {
  const normalizedPath = String(path || '').trim()
  if (!normalizedPath.startsWith('/')) {
    throw new SpotifyApiError('Spotify path must start with "/".', { status: 500 })
  }

  const url = new URL(`${SPOTIFY_WEB_API_BASE}${normalizedPath}`)
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    url.searchParams.set(key, String(value))
  }
  return url.toString()
}

function getRetryAfterSeconds(response) {
  const value = Number(response.headers.get('retry-after') || 0)
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.floor(value)
}

function parseSpotifyErrorDetails(payload, headerDetails = '') {
  const header = String(headerDetails || '').trim()
  if (!payload || typeof payload !== 'object') return header

  const nestedMessage = String(payload?.error?.message || '').trim()
  if (nestedMessage) return combineDetails(nestedMessage, header)

  const flatMessage = String(payload?.message || '').trim()
  if (flatMessage) return combineDetails(flatMessage, header)

  const nestedError = String(payload?.error || '').trim()
  if (nestedError) return combineDetails(nestedError, header)

  return header
}

function combineDetails(message, header) {
  const normalizedMessage = String(message || '').trim()
  const normalizedHeader = String(header || '').trim()
  if (!normalizedMessage) return normalizedHeader
  if (!normalizedHeader) return normalizedMessage
  if (normalizedMessage.includes(normalizedHeader)) return normalizedMessage
  return `${normalizedMessage}; auth=${normalizedHeader}`
}

async function fetchWithTimeout(url, options, timeoutMs, fetchImpl) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    return await fetchImpl(url, {
      ...options,
      signal: controller.signal
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new SpotifyApiError('Spotify request timed out.', { status: 504, code: 'SPOTIFY_TIMEOUT' })
    }
    throw new SpotifyApiError('Spotify request failed.', { status: 502, code: 'SPOTIFY_NETWORK' })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function safeParseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}
