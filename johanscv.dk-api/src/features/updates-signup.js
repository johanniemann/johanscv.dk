import crypto from 'node:crypto'
import rateLimit from 'express-rate-limit'
import { sendAnswer, setNoStore, getRequestIp } from '../shared/http.js'
import { UpdatesSignupServiceError } from './resend-client.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_TOPICS = ['projects', 'resume', 'interactive_services']
const RATE_LIMIT_MESSAGE = 'Too many signup attempts. Please try again shortly.'
const INVALID_EMAIL_MESSAGE = 'Enter a valid email address.'
const NO_TOPICS_MESSAGE = 'Select at least one update type.'
const INVALID_TOPIC_MESSAGE = 'Select valid update types.'
const SUCCESS_MESSAGE = "You're signed up for updates."
const GENERIC_UNAVAILABLE_MESSAGE = 'Updates signup is temporarily unavailable. Please try again later.'
const INVALID_UNSUBSCRIBE_MESSAGE = 'This unsubscribe link is invalid or has expired.'
const UNSUBSCRIBE_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000

export function createUpdatesSignupRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      return sendAnswer(res, 429, RATE_LIMIT_MESSAGE)
    }
  })
}

export function createUpdatesSignupHandler({
  updatesSignupService,
  dailyCapMax,
  takeDailyQuotaOrFail,
  unsubscribeSecret = '',
  logger = console
}) {
  return async function updatesSignupHandler(req, res) {
    setNoStore(res)
    const requestIp = getRequestIp(req)

    if (!req.is('application/json')) {
      return sendAnswer(res, 415, 'Unsupported content type.')
    }

    const honeypot = typeof req.body?.company === 'string' ? req.body.company.trim() : ''
    if (honeypot) {
      return res.json({
        ok: true,
        message: SUCCESS_MESSAGE,
        subscribedTopics: []
      })
    }

    const email = normalizeEmail(req.body?.email)
    if (!email || !EMAIL_PATTERN.test(email)) {
      return sendAnswer(res, 400, INVALID_EMAIL_MESSAGE)
    }

    const { topics, hasInvalidTopic } = normalizeTopics(req.body?.topics)
    if (hasInvalidTopic) {
      return sendAnswer(res, 400, INVALID_TOPIC_MESSAGE)
    }
    if (!topics.length) {
      return sendAnswer(res, 400, NO_TOPICS_MESSAGE)
    }

    const dailyQuota = await takeDailyQuotaOrFail(requestIp, res)
    if (!dailyQuota) {
      return
    }
    if (!dailyQuota.allowed) {
      return sendAnswer(res, 429, `Daily signup limit reached (${dailyCapMax}/day per IP). Please try again tomorrow.`)
    }
    if (dailyQuota.remaining >= 0) {
      res.setHeader('X-Updates-Signup-Daily-Remaining', String(dailyQuota.remaining))
    }

    const locale = normalizeLocale(req.body?.locale)
    const source = normalizeSource(req.body?.source)

    try {
      const result = await updatesSignupService.upsertSubscription({
        email,
        topics,
        locale,
        source
      })

      if (result.created) {
        const unsubscribeUrl = buildUnsubscribeUrl({
          req,
          token: createUnsubscribeToken({
            email,
            secret: unsubscribeSecret
          })
        })

        try {
          await updatesSignupService.sendWelcomeEmail({
            email,
            topics,
            locale,
            unsubscribeUrl
          })
        } catch (error) {
          logger.error?.('Updates welcome email error:', error)
        }
      }

      return res.status(result.created ? 201 : 200).json({
        ok: true,
        message: SUCCESS_MESSAGE,
        subscribedTopics: result.subscribedTopics
      })
    } catch (error) {
      if (error instanceof UpdatesSignupServiceError) {
        return sendAnswer(res, error.status, error.message || GENERIC_UNAVAILABLE_MESSAGE)
      }

      logger.error?.('Updates signup error:', error)
      return sendAnswer(res, 503, GENERIC_UNAVAILABLE_MESSAGE)
    }
  }
}

export function createUpdatesUnsubscribeHandler({
  updatesSignupService,
  unsubscribeSecret = '',
  logger = console
}) {
  return async function updatesUnsubscribeHandler(req, res) {
    setNoStore(res)
    const token = String(req.query?.token || '').trim()
    const email = verifyUnsubscribeToken({
      token,
      secret: unsubscribeSecret
    })

    if (!email) {
      return respondToUnsubscribeRequest(req, res, {
        ok: false,
        status: 400,
        title: 'Unsubscribe link invalid',
        message: INVALID_UNSUBSCRIBE_MESSAGE
      })
    }

    try {
      await updatesSignupService.unsubscribeContact({ email })
      return respondToUnsubscribeRequest(req, res, {
        ok: true,
        status: 200,
        title: 'You are unsubscribed',
        message: 'You will no longer receive website update emails from Johan.'
      })
    } catch (error) {
      logger.error?.('Updates unsubscribe error:', error)
      return respondToUnsubscribeRequest(req, res, {
        ok: false,
        status: 503,
        title: 'Unsubscribe unavailable',
        message: GENERIC_UNAVAILABLE_MESSAGE
      })
    }
  }
}

function respondToUnsubscribeRequest(req, res, { ok, status, title, message }) {
  if (req.method === 'POST') {
    return res.status(202).end()
  }

  res.status(status)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.send(renderUnsubscribePage({ ok, title, message }))
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeTopics(value) {
  if (!Array.isArray(value)) {
    return {
      topics: [],
      hasInvalidTopic: false
    }
  }

  const uniqueTopics = []
  let hasInvalidTopic = false

  value.forEach((entry) => {
    const topic = String(entry || '').trim()
    if (!topic) {
      return
    }
    if (!ALLOWED_TOPICS.includes(topic)) {
      hasInvalidTopic = true
      return
    }
    if (!uniqueTopics.includes(topic)) {
      uniqueTopics.push(topic)
    }
  })

  return {
    topics: uniqueTopics,
    hasInvalidTopic
  }
}

function normalizeLocale(value) {
  return value === 'dk' ? 'dk' : 'en'
}

function normalizeSource(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return 'contact-page'
  return normalized.slice(0, 64)
}

function createUnsubscribeToken({ email, secret }) {
  const normalizedEmail = normalizeEmail(email)
  const normalizedSecret = String(secret || '').trim()
  if (!normalizedEmail || !normalizedSecret) return ''

  const payload = Buffer.from(
    JSON.stringify({
      email: normalizedEmail,
      exp: Date.now() + UNSUBSCRIBE_TOKEN_TTL_MS
    })
  ).toString('base64url')
  const signature = crypto.createHmac('sha256', normalizedSecret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function verifyUnsubscribeToken({ token, secret }) {
  const normalizedToken = String(token || '').trim()
  const normalizedSecret = String(secret || '').trim()
  if (!normalizedToken || !normalizedSecret) return ''

  const [payload, signature] = normalizedToken.split('.')
  if (!payload || !signature) return ''

  const expectedSignature = crypto.createHmac('sha256', normalizedSecret).update(payload).digest('base64url')
  if (!timingSafeMatch(signature, expectedSignature)) {
    return ''
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const normalizedEmail = normalizeEmail(parsed?.email)
    const expiresAt = Number(parsed?.exp)
    if (!normalizedEmail || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      return ''
    }
    return normalizedEmail
  } catch {
    return ''
  }
}

function timingSafeMatch(value, expectedValue) {
  const a = Buffer.from(String(value || ''))
  const b = Buffer.from(String(expectedValue || ''))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function buildUnsubscribeUrl({ req, token }) {
  const host = String(req.get('host') || '').trim()
  const protocol = String(req.protocol || 'https').trim() || 'https'
  const baseUrl = host ? `${protocol}://${host}` : 'https://johanscv.dk'
  const unsubscribeUrl = new URL('/api/updates-signup/unsubscribe', baseUrl)
  unsubscribeUrl.searchParams.set('token', token)
  return unsubscribeUrl.toString()
}

function renderUnsubscribePage({ ok, title, message }) {
  const accent = ok ? '#1f7a57' : '#9f3f3f'
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <main style="min-height:100vh;display:grid;place-items:center;padding:24px;">
          <section style="max-width:540px;background:#ffffff;border:1px solid #e5dccd;border-radius:20px;padding:28px 24px;box-shadow:0 18px 36px rgba(31,41,55,0.08);">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${accent};">johanscv.dk</p>
            <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
            <p style="margin:0;font-size:16px;line-height:1.65;color:#4b5563;">${escapeHtml(message)}</p>
          </section>
        </main>
      </body>
    </html>
  `
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
