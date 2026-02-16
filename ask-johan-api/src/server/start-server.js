import OpenAI from 'openai'
import { createApp } from '../app/create-app.js'
import { readRuntimeConfig } from '../config/runtime-config.js'
import { createUsageStore } from './usage-store.js'

export function startServer(env = process.env) {
  const config = readRuntimeConfig(env)
  const client = config.apiKey ? new OpenAI({ apiKey: config.apiKey }) : null
  const usageStore = createUsageStore({
    mode: config.usageStoreMode,
    redisUrl: config.redisUrl,
    redisKeyPrefix: config.redisKeyPrefix,
    logger: console
  })

  const app = createApp({
    accessCode: config.accessCode,
    allowedOrigins: config.allowedOrigins,
    authCompatMode: config.authCompatMode,
    authFailureMax: config.authFailureMax,
    authFailureWindowMs: config.authFailureWindowMs,
    client,
    dailyCapMax: config.dailyCapMax,
    geoJohanMapsApiKey: config.geoJohanMapsApiKey,
    johanContext: config.johanContext,
    jwtSecret: config.jwtSecret,
    jwtTtl: config.jwtTtl,
    maxQuestionChars: config.maxQuestionChars,
    model: config.model,
    rateLimitMax: config.rateLimitMax,
    rateLimitWindowMs: config.rateLimitWindowMs,
    requestTimeoutMs: config.requestTimeoutMs,
    usageStore
  })

  const port = config.port
  app.listen(port, () => {
    if (config.jwtSecretSource !== 'JWT_SECRET') {
      console.warn(
        `JWT_SECRET is not set. Using ${config.jwtSecretSource} as temporary JWT signing secret. Set JWT_SECRET in production.`
      )
    }
    if (config.accessCodeSource === 'ASK_JOHAN_ACCESS_CODE') {
      console.warn('ASK_JOHAN_ACCESS_CODE is deprecated. Rename it to JOHANSCV_ACCESS_CODE.')
    }

    console.log(`Ask Johan API running on http://127.0.0.1:${port}`)
    console.log(`Allowed CORS origins: ${config.allowedOrigins.join(', ')}`)
    console.log(`Ask Johan timeout: ${config.requestTimeoutMs}ms`)
    console.log(`Ask Johan rate limit: ${config.rateLimitMax} requests / ${config.rateLimitWindowMs}ms`)
    console.log(`Ask Johan daily cap: ${config.dailyCapMax} requests/day/IP`)
    console.log(`Ask Johan failed-auth limit: ${config.authFailureMax} failures / ${config.authFailureWindowMs}ms`)
    console.log(`Ask Johan usage store: ${usageStore.mode}`)
    console.log(`Ask Johan auth compatibility mode: ${config.authCompatMode ? 'enabled' : 'disabled'}`)
    console.log(`Ask Johan JWT TTL: ${config.jwtTtl}`)
    console.log(`GeoJohan maps key: ${config.geoJohanMapsApiKey ? 'configured' : 'not configured'}`)
  })
}
