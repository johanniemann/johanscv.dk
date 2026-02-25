import OpenAI from 'openai'
import { createApp } from '../app/create-app.js'
import { readRuntimeConfig } from '../config/runtime-config.js'
import { createUsageStore } from './usage-store.js'
import { createSpotifySessionStore } from './spotify-session-store.js'

export function startServer(env = process.env) {
  const config = readRuntimeConfig(env)
  const client = config.apiKey ? new OpenAI({ apiKey: config.apiKey }) : null
  const usageStore = createUsageStore({
    mode: config.usageStoreMode,
    redisUrl: config.redisUrl,
    redisKeyPrefix: config.redisKeyPrefix,
    logger: console
  })
  const spotifySessionStore = createSpotifySessionStore({
    sessionTtlMs: config.spotify.sessionTtlMs
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
    usageStore,
    spotify: config.spotify,
    sessionSecret: config.sessionSecret,
    spotifySessionStore
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
    if (config.geoJohanMapsApiKey && config.geoJohanMapsApiKeySource !== 'GEOJOHAN_MAPS_API_KEY') {
      console.warn(
        `${config.geoJohanMapsApiKeySource} is deprecated for GeoJohan maps. Rename it to GEOJOHAN_MAPS_API_KEY.`
      )
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
    if (config.geoJohanMapsApiKey) {
      console.log(`GeoJohan maps key source: ${config.geoJohanMapsApiKeySource}`)
    }
    if (config.sessionSecretSource !== 'SESSION_SECRET') {
      console.warn(
        `SESSION_SECRET is not set. Using ${config.sessionSecretSource} as temporary session signing secret. Set SESSION_SECRET in production.`
      )
    }
    console.log(`Spotify OAuth: ${config.spotify.isConfigured ? 'configured' : 'not configured'}`)
    console.log(`Spotify dashboard source account: ${config.spotify.dashboardEnabled ? 'configured' : 'not configured'}`)
    if (config.spotify.isConfigured) {
      console.log(`Spotify scopes: ${config.spotify.scopes}`)
      console.log(`Spotify client secret: ${config.spotify.clientSecret ? 'configured' : 'not configured'}`)
      console.log(`Spotify session store: ${spotifySessionStore.mode}`)
    }
    if (config.spotify.dashboardEnabled) {
      console.log(`Spotify dashboard cache TTL: ${config.spotify.snapshotCacheTtlMs}ms`)
      console.log(`Spotify rate limit: ${config.spotify.rateLimitMax} requests / ${config.spotify.rateLimitWindowMs}ms`)
      console.log(`Spotify daily cap: ${config.spotify.dailyCapMax} requests/day/IP`)
    }
  })
}
