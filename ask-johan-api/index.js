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
const johanContext = loadJohanContext()
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

function loadJohanContext() {
  const envB64 = process.env.JOHAN_CONTEXT_B64?.trim() || ''
  if (envB64) {
    try {
      return Buffer.from(envB64, 'base64').toString('utf8')
    } catch (error) {
      console.error('Failed to decode JOHAN_CONTEXT_B64:', error)
    }
  }

  const envText = process.env.JOHAN_CONTEXT?.trim() || ''
  if (envText) return envText

  const envFilePath = process.env.JOHAN_CONTEXT_FILE?.trim() || ''
  if (envFilePath) {
    const absolutePath = path.isAbsolute(envFilePath) ? envFilePath : path.resolve(__dirname, envFilePath)
    if (fs.existsSync(absolutePath)) {
      return fs.readFileSync(absolutePath, 'utf8')
    }
  }

  const privateContextPath = path.join(__dirname, 'johan-context.private.md')
  if (fs.existsSync(privateContextPath)) {
    return fs.readFileSync(privateContextPath, 'utf8')
  }

  const defaultContextPath = path.join(__dirname, 'johan-context.md')
  if (fs.existsSync(defaultContextPath)) {
    return fs.readFileSync(defaultContextPath, 'utf8')
  }

  return ''
}
