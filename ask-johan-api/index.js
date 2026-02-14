import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenAI from 'openai'
import { createApp, parseAllowedOrigins } from './app.js'

const port = process.env.PORT || 8787
const parsedMaxQuestionChars = Number(process.env.MAX_QUESTION_CHARS || 800)
const maxQuestionChars = Number.isFinite(parsedMaxQuestionChars) && parsedMaxQuestionChars > 0 ? parsedMaxQuestionChars : 800
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
const parsedTimeoutMs = Number(process.env.ASK_JOHAN_TIMEOUT_MS || 15000)
const requestTimeoutMs = Number.isFinite(parsedTimeoutMs) && parsedTimeoutMs > 0 ? parsedTimeoutMs : 15000
const parsedRateLimitWindowMs = Number(process.env.ASK_JOHAN_RATE_LIMIT_WINDOW_MS || 60000)
const rateLimitWindowMs =
  Number.isFinite(parsedRateLimitWindowMs) && parsedRateLimitWindowMs > 0 ? parsedRateLimitWindowMs : 60000
const parsedRateLimitMax = Number(process.env.ASK_JOHAN_RATE_LIMIT_MAX || 30)
const rateLimitMax = Number.isFinite(parsedRateLimitMax) && parsedRateLimitMax > 0 ? parsedRateLimitMax : 30
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const contextPath = path.join(__dirname, 'johan-context.md')
const johanContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : ''
const accessCode = process.env.ASK_JOHAN_ACCESS_CODE || ''
const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS || 'https://johanniemann.github.io')
const apiKey = process.env.OPENAI_API_KEY
const client = apiKey ? new OpenAI({ apiKey }) : null
const app = createApp({
  accessCode,
  allowedOrigins,
  client,
  johanContext,
  maxQuestionChars,
  model,
  rateLimitMax,
  rateLimitWindowMs,
  requestTimeoutMs
})

app.listen(port, () => {
  console.log(`Ask Johan API running on http://127.0.0.1:${port}`)
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`)
  console.log(`Ask Johan timeout: ${requestTimeoutMs}ms`)
  console.log(`Ask Johan rate limit: ${rateLimitMax} requests / ${rateLimitWindowMs}ms`)
})
