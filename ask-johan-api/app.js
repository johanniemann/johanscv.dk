import cors from 'cors'
import crypto from 'node:crypto'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const LOCAL_ORIGIN_RE = /^https?:\/\/(127\.0\.0\.1|localhost):\d+$/

export function createApp({
  accessCode = '',
  allowedOrigins = ['https://johanniemann.github.io'],
  client = null,
  johanContext = '',
  logger = console,
  maxQuestionChars = 800,
  model = 'gpt-4.1-mini',
  rateLimitMax = 30,
  rateLimitWindowMs = 60_000,
  requestTimeoutMs = 15_000
} = {}) {
  const app = express()
  const allowedOriginSet = new Set(allowedOrigins.filter(Boolean))
  const assistantInstructions = buildAssistantInstructions(johanContext)

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  app.use(express.json({ limit: '8kb' }))
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOriginSet.has(origin) || LOCAL_ORIGIN_RE.test(origin)) {
          return callback(null, true)
        }
        return callback(new Error('CORS origin not allowed'))
      }
    })
  )

  app.use((req, res, next) => {
    const startedAt = Date.now()
    res.on('finish', () => {
      logger.info?.(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`
      )
    })
    next()
  })

  app.use((error, _req, res, next) => {
    if (!error) return next()
    if (error.message === 'CORS origin not allowed') {
      return sendAnswer(res, 403, 'Origin is not allowed.')
    }
    logger.error?.('Unexpected middleware error:', error)
    return sendAnswer(res, 500, 'Unexpected server middleware error.')
  })

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      service: 'ask-johan-api',
      endpoints: ['/health', '/api/ask-johan']
    })
  })

  const askLimiter = rateLimit({
    windowMs: rateLimitWindowMs,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      return sendAnswer(res, 429, 'Too many requests. Please try again shortly.')
    }
  })

  app.post('/api/ask-johan', askLimiter, async (req, res) => {
    if (accessCode) {
      const providedCode = req.header('x-access-code')?.trim() || ''
      if (!safeEqual(providedCode, accessCode)) {
        return sendAnswer(res, 401, 'Access denied. Invalid access code.')
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
  })

  return app
}

export function parseAllowedOrigins(rawOrigins) {
  if (!rawOrigins || !rawOrigins.trim()) {
    return ['https://johanniemann.github.io']
  }
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function buildAssistantInstructions(johanContext) {
  return [
    "You are Johan's website assistant.",
    'Be concise, accurate, and professional.',
    'Keep answers practical and easy to read.',
    'Use only facts from the context below when answering profile questions.',
    "If the answer exists in the context, answer directly and do not claim it's missing.",
    "If the answer is not in the context, say that clearly and suggest what Johan can answer instead.",
    '',
    'Context:',
    johanContext
  ].join('\n')
}

function sanitizeQuestion(input) {
  return input.replace(/\s+/g, ' ').replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

function safeEqual(a, b) {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

function sendAnswer(res, status, answer) {
  return res.status(status).json({ answer })
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId = null
  try {
    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        const timeoutError = new Error('Request timed out')
        timeoutError.name = 'TimeoutError'
        reject(timeoutError)
      }, timeoutMs)
    })
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
