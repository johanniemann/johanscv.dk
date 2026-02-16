import rateLimit from 'express-rate-limit'
import {
  AUTH_REQUIRED_MESSAGE,
  LEGACY_HEADER_DEPRECATION,
  getBearerToken,
  safeEqual,
  verifyJwtToken
} from './auth.js'
import { sendAnswer, setNoStore, getRequestIp } from '../shared/http.js'
import { withTimeout } from '../shared/with-timeout.js'

const CONTEXT_EXFILTRATION_PATTERNS = [
  /\bsystem\s+prompt\b/i,
  /\bdeveloper\s+(prompt|message|instructions?)\b/i,
  /\binternal\s+instructions?\b/i,
  /\bjohan-context\.private\b/i,
  /\b(raw|full|exact|verbatim)\b.{0,40}\b(context|instructions?|prompt)\b/i,
  /\b(show|reveal|dump|print|display|expose)\b.{0,60}\b(context|prompt|instructions?)\b/i
]

export function createAskJohanRateLimiter({ rateLimitWindowMs, rateLimitMax }) {
  return rateLimit({
    windowMs: rateLimitWindowMs,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      return sendAnswer(res, 429, 'Too many requests. Please try again shortly.')
    }
  })
}

export function createAskJohanHandler({
  authCompatMode,
  hasAccessCode,
  requiresAuth,
  normalizedAccessCode,
  jwtSecret,
  client,
  model,
  requestTimeoutMs,
  assistantInstructions,
  maxQuestionChars,
  dailyCapMax,
  authSecurity,
  takeDailyQuotaOrFail,
  logger
}) {
  return async function askJohanHandler(req, res) {
    setNoStore(res)
    const requestIp = getRequestIp(req)

    if (requiresAuth) {
      if (await authSecurity.isLimited('ask auth check', requestIp, res)) {
        return
      }

      const bearerToken = getBearerToken(req)
      if (bearerToken) {
        const tokenPayload = verifyJwtToken(bearerToken, jwtSecret)
        if (!tokenPayload) {
          await authSecurity.recordFailure('ask bearer failure record', requestIp)
          return sendAnswer(res, 401, 'Access denied. Invalid or expired token.')
        }
        if (!(await authSecurity.clearFailures('ask bearer clear', requestIp, res))) {
          return
        }
      } else if (authCompatMode && hasAccessCode) {
        const providedCode = req.header('x-access-code')?.trim() || ''
        if (!providedCode || !safeEqual(providedCode, normalizedAccessCode)) {
          await authSecurity.recordFailure('ask legacy failure record', requestIp)
          return sendAnswer(res, 401, providedCode ? 'Access denied. Invalid access code.' : AUTH_REQUIRED_MESSAGE)
        }
        if (!(await authSecurity.clearFailures('ask legacy clear', requestIp, res))) {
          return
        }
        res.setHeader('Warning', LEGACY_HEADER_DEPRECATION)
        res.setHeader('X-Ask-Johan-Auth-Deprecated', 'x-access-code')
      } else {
        await authSecurity.recordFailure('ask auth-required record', requestIp)
        return sendAnswer(res, 401, AUTH_REQUIRED_MESSAGE)
      }
    }

    if (!client) {
      return sendAnswer(res, 500, 'Server is missing OPENAI_API_KEY.')
    }

    if (!req.is('application/json')) {
      return sendAnswer(res, 415, 'Unsupported content type.')
    }

    if (typeof req.body?.question !== 'string') {
      return sendAnswer(res, 400, 'Question must be a string.')
    }

    const question = sanitizeQuestion(req.body.question)
    if (!question) {
      return sendAnswer(res, 400, 'Please write a question first.')
    }
    if (question.length > maxQuestionChars) {
      return sendAnswer(res, 400, `Question is too long. Max ${maxQuestionChars} characters.`)
    }
    if (isSensitiveContextRequest(question)) {
      return res.json({
        answer:
          "I can't share internal instructions or raw context text. I can still provide a concise summary of relevant profile details."
      })
    }

    const dailyQuota = await takeDailyQuotaOrFail(requestIp, res)
    if (!dailyQuota) {
      return
    }

    if (!dailyQuota.allowed) {
      return sendAnswer(res, 429, `Daily Ask Johan limit reached (${dailyCapMax}/day per IP). Please try again tomorrow.`)
    }
    if (dailyQuota.remaining >= 0) {
      res.setHeader('X-Ask-Johan-Daily-Remaining', String(dailyQuota.remaining))
    }

    try {
      const response = await withTimeout(
        client.responses.create({
          model,
          instructions: assistantInstructions,
          input: question
        }),
        requestTimeoutMs
      )

      const answer = (response.output_text || '').trim()
      return res.json({ answer: answer || 'No answer generated.' })
    } catch (error) {
      if (error?.name === 'TimeoutError') {
        return sendAnswer(res, 504, 'Request timed out while generating an answer.')
      }

      logger.error?.('OpenAI error:', error)
      return sendAnswer(res, 500, 'Something went wrong while generating an answer.')
    }
  }
}

function sanitizeQuestion(input) {
  return input.replace(/\s+/g, ' ').replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

function isSensitiveContextRequest(question) {
  return CONTEXT_EXFILTRATION_PATTERNS.some((pattern) => pattern.test(question))
}
