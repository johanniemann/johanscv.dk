import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { sendAnswer, setNoStore, getRequestIp } from '../shared/http.js'

export const AUTH_FAILURE_MESSAGE = 'Too many failed authentication attempts. Please wait a few minutes and try again.'
export const AUTH_REQUIRED_MESSAGE = 'Authentication required. Log in at /auth/login and send Authorization: Bearer <token>.'
export const LEGACY_HEADER_DEPRECATION =
  '299 - "x-access-code is deprecated and will be removed. Use /auth/login and Bearer token auth."'

export function createAuthLoginHandler({
  hasAccessCode,
  normalizedAccessCode,
  hasJwtSecret,
  jwtSecret,
  tokenTtl,
  authCompatMode,
  authSecurity
}) {
  return async function authLoginHandler(req, res) {
    setNoStore(res)
    const requestIp = getRequestIp(req)
    if (await authSecurity.isLimited('auth login check', requestIp, res)) {
      return
    }

    if (!req.is('application/json')) {
      return sendAnswer(res, 415, 'Unsupported content type.')
    }

    const providedCode = typeof req.body?.accessCode === 'string' ? req.body.accessCode.trim() : ''
    if (hasAccessCode && !safeEqual(providedCode, normalizedAccessCode)) {
      await authSecurity.recordFailure('auth login failure record', requestIp)
      return sendAnswer(res, 401, 'Access denied. Invalid access code.')
    }

    if (!hasJwtSecret) {
      return sendAnswer(res, 500, 'Server auth is not configured. Missing JWT_SECRET.')
    }

    if (!(await authSecurity.clearFailures('auth login clear', requestIp, res))) {
      return
    }

    const token = issueJwtToken(jwtSecret, tokenTtl)
    return res.json({
      token,
      tokenType: 'Bearer',
      expiresIn: tokenTtl,
      legacyAccessCodeAccepted: Boolean(authCompatMode && hasAccessCode)
    })
  }
}

export function getBearerToken(req) {
  const rawHeader = req.header('authorization') || ''
  const match = rawHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) return ''
  return match[1].trim()
}

export function verifyJwtToken(token, secret) {
  try {
    return jwt.verify(token, secret, {
      issuer: 'ask-johan-api',
      audience: 'ask-johan-client'
    })
  } catch {
    return null
  }
}

export function issueJwtToken(secret, tokenTtl) {
  return jwt.sign(
    {
      sub: 'ask-johan',
      scope: 'ask-johan'
    },
    secret,
    {
      expiresIn: tokenTtl,
      issuer: 'ask-johan-api',
      audience: 'ask-johan-client'
    }
  )
}

export function safeEqual(a, b) {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}
