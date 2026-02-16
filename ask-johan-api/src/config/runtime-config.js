import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseAllowedOrigins } from '../app/origins.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const API_ROOT_DIR = path.resolve(__dirname, '..', '..')

export function readRuntimeConfig(env = process.env) {
  const maxQuestionChars = parsePositiveInt(env.MAX_QUESTION_CHARS, 800)
  const model = env.OPENAI_MODEL || 'gpt-4.1-mini'
  const requestTimeoutMs = parsePositiveInt(env.ASK_JOHAN_TIMEOUT_MS, 15000)
  const rateLimitWindowMs = parsePositiveInt(env.ASK_JOHAN_RATE_LIMIT_WINDOW_MS, 60000)
  const rateLimitMax = parsePositiveInt(env.ASK_JOHAN_RATE_LIMIT_MAX, 30)
  const dailyCapMax = parsePositiveInt(env.ASK_JOHAN_DAILY_CAP, 100)
  const authFailureWindowMs = parsePositiveInt(env.ASK_JOHAN_AUTH_FAIL_WINDOW_MS, 600000)
  const authFailureMax = parsePositiveInt(env.ASK_JOHAN_AUTH_FAIL_MAX, 10)
  const authCompatMode = parseBoolean(env.ASK_JOHAN_AUTH_COMPAT_MODE, true)
  const jwtTtl = (env.ASK_JOHAN_JWT_TTL || '7d').trim() || '7d'
  const geoJohanMapsApiKey = String(env.GEOJOHAN_MAPS_API_KEY || '').trim()
  const usageStoreMode = String(env.ASK_JOHAN_USAGE_STORE || 'memory').trim().toLowerCase()
  const redisUrl = String(env.REDIS_URL || '').trim()
  const redisKeyPrefix = String(env.ASK_JOHAN_REDIS_KEY_PREFIX || 'ask-johan').trim() || 'ask-johan'
  const isProduction = String(env.NODE_ENV || '').trim().toLowerCase() === 'production'
  const johanContext = loadJohanContext(env)
  const { accessCode, accessCodeSource } = resolveAccessCode(env.JOHANSCV_ACCESS_CODE, env.ASK_JOHAN_ACCESS_CODE)
  const { jwtSecret, jwtSecretSource } = resolveJwtSecret(env.JWT_SECRET, accessCode, accessCodeSource, {
    allowFallback: !isProduction
  })
  const allowedOrigins = parseAllowedOrigins(
    env.ALLOWED_ORIGINS || 'https://johanniemann.github.io,https://johanscv.dk,https://www.johanscv.dk'
  )
  const apiKey = env.OPENAI_API_KEY

  return {
    port: env.PORT || 8787,
    maxQuestionChars,
    model,
    requestTimeoutMs,
    rateLimitWindowMs,
    rateLimitMax,
    dailyCapMax,
    authFailureWindowMs,
    authFailureMax,
    authCompatMode,
    jwtTtl,
    geoJohanMapsApiKey,
    usageStoreMode,
    redisUrl,
    redisKeyPrefix,
    johanContext,
    accessCode,
    accessCodeSource,
    jwtSecret,
    jwtSecretSource,
    allowedOrigins,
    apiKey
  }
}

function loadJohanContext(env = process.env) {
  const envB64 = env.JOHAN_CONTEXT_B64?.trim() || ''
  if (envB64) {
    try {
      return decodeContextFromBase64(envB64)
    } catch (error) {
      console.error('Failed to decode JOHAN_CONTEXT_B64:', error)
    }
  }

  const envText = env.JOHAN_CONTEXT?.trim() || ''
  if (envText) return envText

  const envFilePath = env.JOHAN_CONTEXT_FILE?.trim() || ''
  if (envFilePath) {
    const absolutePath = path.isAbsolute(envFilePath) ? envFilePath : path.resolve(API_ROOT_DIR, envFilePath)
    if (fs.existsSync(absolutePath)) {
      return fs.readFileSync(absolutePath, 'utf8')
    }
  }

  const privateContextPath = path.join(API_ROOT_DIR, 'johan-context.private.md')
  if (fs.existsSync(privateContextPath)) {
    return fs.readFileSync(privateContextPath, 'utf8')
  }

  const defaultContextPath = path.join(API_ROOT_DIR, 'johan-context.md')
  if (fs.existsSync(defaultContextPath)) {
    return fs.readFileSync(defaultContextPath, 'utf8')
  }

  return ''
}

function decodeContextFromBase64(rawValue) {
  let normalized = String(rawValue || '').trim()
  if (!normalized) return ''

  if (normalized.startsWith('JOHAN_CONTEXT_B64=')) {
    normalized = normalized.slice('JOHAN_CONTEXT_B64='.length).trim()
  }

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim()
  }

  normalized = normalized.replace(/\s+/g, '')
  if (!normalized) return ''

  let b64 = normalized.replace(/-/g, '+').replace(/_/g, '/')
  const remainder = b64.length % 4
  if (remainder) {
    b64 = `${b64}${'='.repeat(4 - remainder)}`
  }

  return Buffer.from(b64, 'base64').toString('utf8')
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

function resolveAccessCode(rawJohanScvAccessCode, rawLegacyAccessCode) {
  const johanScvAccessCode = String(rawJohanScvAccessCode || '').trim()
  if (johanScvAccessCode) {
    return {
      accessCode: johanScvAccessCode,
      accessCodeSource: 'JOHANSCV_ACCESS_CODE'
    }
  }

  const legacyAccessCode = String(rawLegacyAccessCode || '').trim()
  if (legacyAccessCode) {
    return {
      accessCode: legacyAccessCode,
      accessCodeSource: 'ASK_JOHAN_ACCESS_CODE'
    }
  }

  return {
    accessCode: '',
    accessCodeSource: 'none'
  }
}

function resolveJwtSecret(rawJwtSecret, accessCode, accessCodeSource, { allowFallback = true } = {}) {
  const jwtFromEnv = String(rawJwtSecret || '').trim()
  if (jwtFromEnv) {
    return {
      jwtSecret: jwtFromEnv,
      jwtSecretSource: 'JWT_SECRET'
    }
  }

  if (!allowFallback) {
    throw new Error('JWT_SECRET is required when NODE_ENV=production.')
  }

  const normalizedAccessCode = String(accessCode || '').trim()
  if (normalizedAccessCode) {
    return {
      jwtSecret: normalizedAccessCode,
      jwtSecretSource: `${accessCodeSource} fallback`
    }
  }

  return {
    jwtSecret: crypto.randomBytes(32).toString('hex'),
    jwtSecretSource: 'ephemeral random fallback'
  }
}
