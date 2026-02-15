import 'dotenv/config'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenAI from 'openai'
import { createApp, parseAllowedOrigins } from './app.js'

const port = process.env.PORT || 8787
const maxQuestionChars = parsePositiveInt(process.env.MAX_QUESTION_CHARS, 800)
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
const requestTimeoutMs = parsePositiveInt(process.env.ASK_JOHAN_TIMEOUT_MS, 15000)
const rateLimitWindowMs = parsePositiveInt(process.env.ASK_JOHAN_RATE_LIMIT_WINDOW_MS, 60000)
const rateLimitMax = parsePositiveInt(process.env.ASK_JOHAN_RATE_LIMIT_MAX, 30)
const dailyCapMax = parsePositiveInt(process.env.ASK_JOHAN_DAILY_CAP, 100)
const authFailureWindowMs = parsePositiveInt(process.env.ASK_JOHAN_AUTH_FAIL_WINDOW_MS, 600000)
const authFailureMax = parsePositiveInt(process.env.ASK_JOHAN_AUTH_FAIL_MAX, 10)
const authCompatMode = parseBoolean(process.env.ASK_JOHAN_AUTH_COMPAT_MODE, true)
const jwtTtl = (process.env.ASK_JOHAN_JWT_TTL || '7d').trim() || '7d'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const johanContext = loadJohanContext()
const accessCode = process.env.ASK_JOHAN_ACCESS_CODE || ''
const { jwtSecret, jwtSecretSource } = resolveJwtSecret(process.env.JWT_SECRET, accessCode)
const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS || 'https://johanniemann.github.io,https://johanscv.dk')
const apiKey = process.env.OPENAI_API_KEY
const client = apiKey ? new OpenAI({ apiKey }) : null
const app = createApp({
  accessCode,
  allowedOrigins,
  authCompatMode,
  authFailureMax,
  authFailureWindowMs,
  client,
  dailyCapMax,
  johanContext,
  jwtSecret,
  jwtTtl,
  maxQuestionChars,
  model,
  rateLimitMax,
  rateLimitWindowMs,
  requestTimeoutMs
})

app.listen(port, () => {
  if (jwtSecretSource !== 'JWT_SECRET') {
    console.warn(
      `JWT_SECRET is not set. Using ${jwtSecretSource} as temporary JWT signing secret. Set JWT_SECRET in production.`
    )
  }

  console.log(`Ask Johan API running on http://127.0.0.1:${port}`)
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`)
  console.log(`Ask Johan timeout: ${requestTimeoutMs}ms`)
  console.log(`Ask Johan rate limit: ${rateLimitMax} requests / ${rateLimitWindowMs}ms`)
  console.log(`Ask Johan daily cap: ${dailyCapMax} requests/day/IP`)
  console.log(`Ask Johan failed-auth limit: ${authFailureMax} failures / ${authFailureWindowMs}ms`)
  console.log(`Ask Johan auth compatibility mode: ${authCompatMode ? 'enabled' : 'disabled'}`)
  console.log(`Ask Johan JWT TTL: ${jwtTtl}`)
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

function parsePositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

function parseBoolean(value, fallback) {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) return fallback
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false
  return fallback
}

function resolveJwtSecret(rawJwtSecret, accessCode) {
  const jwtFromEnv = String(rawJwtSecret || '').trim()
  if (jwtFromEnv) {
    return {
      jwtSecret: jwtFromEnv,
      jwtSecretSource: 'JWT_SECRET'
    }
  }

  const normalizedAccessCode = String(accessCode || '').trim()
  if (normalizedAccessCode) {
    return {
      jwtSecret: normalizedAccessCode,
      jwtSecretSource: 'ASK_JOHAN_ACCESS_CODE fallback'
    }
  }

  return {
    jwtSecret: crypto.randomBytes(32).toString('hex'),
    jwtSecretSource: 'ephemeral random fallback'
  }
}
