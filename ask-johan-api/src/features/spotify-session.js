import crypto from 'node:crypto'
import { appendSetCookie, parseCookieHeader, serializeCookie } from '../shared/cookies.js'

const COOKIE_VERSION = 'v1'
const SESSION_ID_RE = /^[A-Za-z0-9_-]{20,120}$/

export function createSpotifySessionService({
  sessionStore,
  cookieName = 'johanscv_spotify_sid',
  cookieSecret,
  sessionTtlMs = 7 * 24 * 60 * 60 * 1000,
  isProduction = false
}) {
  if (!sessionStore) {
    throw new Error('Spotify session store is required.')
  }

  const normalizedCookieName = String(cookieName || 'johanscv_spotify_sid').trim() || 'johanscv_spotify_sid'
  const signingSecret = String(cookieSecret || '').trim()
  if (!signingSecret) {
    throw new Error('Spotify session cookie secret is required.')
  }

  const maxAgeSeconds = Math.max(60, Math.floor(Number(sessionTtlMs || 0) / 1000) || 600)
  const baseCookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: Boolean(isProduction),
    path: '/',
    maxAge: maxAgeSeconds
  }

  const encodeCookieValue = (sessionId) => {
    const signature = signSessionId(sessionId, signingSecret)
    return `${COOKIE_VERSION}.${sessionId}.${signature}`
  }

  const decodeCookieValue = (rawCookieValue) => {
    const value = String(rawCookieValue || '').trim()
    if (!value) return ''
    const parts = value.split('.')
    if (parts.length !== 3 || parts[0] !== COOKIE_VERSION) return ''

    const sessionId = parts[1]
    const signature = parts[2]
    if (!SESSION_ID_RE.test(sessionId) || !/^[A-Za-z0-9_-]{16,120}$/.test(signature)) return ''

    const expected = signSessionId(sessionId, signingSecret)
    return safeEqual(signature, expected) ? sessionId : ''
  }

  const setSessionCookie = (res, sessionId) => {
    appendSetCookie(res, serializeCookie(normalizedCookieName, encodeCookieValue(sessionId), baseCookieOptions))
  }

  const clearSessionCookie = (res) => {
    appendSetCookie(
      res,
      serializeCookie(normalizedCookieName, '', {
        ...baseCookieOptions,
        maxAge: 0,
        expires: new Date(0)
      })
    )
  }

  return {
    cookieName: normalizedCookieName,
    loadSession(req) {
      const cookies = parseCookieHeader(req.headers.cookie || '')
      const sessionId = decodeCookieValue(cookies[normalizedCookieName])
      if (!sessionId) return null

      const session = sessionStore.getSession(sessionId)
      if (!session) return null

      return { sessionId, session }
    },
    createSession(initialData = {}) {
      const { sessionId, data } = sessionStore.createSession(initialData)
      return { sessionId, session: data }
    },
    persistSession(res, sessionContext) {
      if (!sessionContext?.sessionId || !sessionContext?.session) return
      sessionStore.setSession(sessionContext.sessionId, sessionContext.session)
      setSessionCookie(res, sessionContext.sessionId)
    },
    destroySession(res, sessionContext) {
      const sessionId = typeof sessionContext === 'string' ? sessionContext : sessionContext?.sessionId
      if (sessionId) {
        sessionStore.deleteSession(sessionId)
      }
      clearSessionCookie(res)
    },
    clearSessionCookie
  }
}

function signSessionId(sessionId, secret) {
  return crypto.createHmac('sha256', secret).update(String(sessionId)).digest('base64url')
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''))
  const right = Buffer.from(String(b || ''))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}
