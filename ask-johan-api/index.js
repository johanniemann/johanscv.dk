import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenAI from 'openai'

const app = express()
const port = process.env.PORT || 8787
const parsedMaxQuestionChars = Number(process.env.MAX_QUESTION_CHARS || 800)
const maxQuestionChars = Number.isFinite(parsedMaxQuestionChars) && parsedMaxQuestionChars > 0 ? parsedMaxQuestionChars : 800
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const contextPath = path.join(__dirname, 'johan-context.md')
const johanContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : ''
const accessCode = process.env.ASK_JOHAN_ACCESS_CODE || ''
const apiKey = process.env.OPENAI_API_KEY
const allowedProductionOrigins = new Set(['https://johanniemann.github.io'])
const isLocalOrigin = (origin) => /^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin)
const client = apiKey ? new OpenAI({ apiKey }) : null

app.disable('x-powered-by')
app.use(express.json({ limit: '8kb' }))
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl/postman) and same-origin server calls.
      if (!origin) return callback(null, true)
      if (allowedProductionOrigins.has(origin) || isLocalOrigin(origin)) {
        return callback(null, true)
      }
      return callback(new Error('CORS origin not allowed'))
    }
  })
)

app.use((error, _req, res, next) => {
  if (!error) return next()
  if (error.message === 'CORS origin not allowed') {
    return sendAnswer(res, 403, 'Origin is not allowed.')
  }
  return sendAnswer(res, 500, 'Unexpected server middleware error.')
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/ask-johan', async (req, res) => {
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
    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: `You are Johan's website assistant.\nBe concise, accurate, and professional.\nKeep answers practical and easy to read.\n\nContext:\n${johanContext}`
        },
        {
          role: 'user',
          content: question
        }
      ]
    })

    const answer = (response.output_text || '').trim()
    return res.json({ answer: answer || 'No answer generated.' })
  } catch (error) {
    console.error('OpenAI error:', error)
    return sendAnswer(res, 500, 'Something went wrong while generating an answer.')
  }
})

app.listen(port, () => {
  console.log(`Ask Johan API running on http://127.0.0.1:${port}`)
})

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
