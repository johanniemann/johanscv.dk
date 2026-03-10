import assert from 'node:assert/strict'
import test from 'node:test'
import { readRuntimeConfig } from '../src/config/runtime-config.js'

function buildEnv(overrides = {}) {
  return {
    PORT: '8787',
    OPENAI_MODEL: 'gpt-4.1-mini',
    MAX_QUESTION_CHARS: '800',
    ASK_JOHAN_TIMEOUT_MS: '15000',
    ASK_JOHAN_RATE_LIMIT_WINDOW_MS: '60000',
    ASK_JOHAN_RATE_LIMIT_MAX: '30',
    ASK_JOHAN_DAILY_CAP: '100',
    ASK_JOHAN_AUTH_FAIL_WINDOW_MS: '600000',
    ASK_JOHAN_AUTH_FAIL_MAX: '10',
    ASK_JOHAN_AUTH_COMPAT_MODE: 'false',
    ASK_JOHAN_JWT_TTL: '7d',
    ASK_JOHAN_USAGE_STORE: 'memory',
    ALLOWED_ORIGINS: 'https://johanniemann.github.io,https://johanscv.dk,https://www.johanscv.dk',
    JOHAN_CONTEXT_B64: '',
    OPENAI_API_KEY: '',
    NODE_ENV: 'test',
    ...overrides
  }
}

test('readRuntimeConfig prefers GEOJOHAN_MAPS_API_KEY when configured', () => {
  const config = readRuntimeConfig(
    buildEnv({
      GEOJOHAN_MAPS_API_KEY: 'primary-key',
      GOOGLE_MAPS_API_KEY: 'legacy-google-key',
      ASK_JOHAN_MAPS_API_KEY: 'legacy-ask-key'
    })
  )

  assert.equal(config.geoJohanMapsApiKey, 'primary-key')
  assert.equal(config.geoJohanMapsApiKeySource, 'GEOJOHAN_MAPS_API_KEY')
})

test('readRuntimeConfig falls back to GOOGLE_MAPS_API_KEY', () => {
  const config = readRuntimeConfig(
    buildEnv({
      GEOJOHAN_MAPS_API_KEY: '',
      GOOGLE_MAPS_API_KEY: 'legacy-google-key'
    })
  )

  assert.equal(config.geoJohanMapsApiKey, 'legacy-google-key')
  assert.equal(config.geoJohanMapsApiKeySource, 'GOOGLE_MAPS_API_KEY')
})

test('readRuntimeConfig falls back to ASK_JOHAN_MAPS_API_KEY', () => {
  const config = readRuntimeConfig(
    buildEnv({
      GEOJOHAN_MAPS_API_KEY: '',
      GOOGLE_MAPS_API_KEY: '',
      ASK_JOHAN_MAPS_API_KEY: 'legacy-ask-key'
    })
  )

  assert.equal(config.geoJohanMapsApiKey, 'legacy-ask-key')
  assert.equal(config.geoJohanMapsApiKeySource, 'ASK_JOHAN_MAPS_API_KEY')
})

test('readRuntimeConfig reports none when no maps key env is configured', () => {
  const config = readRuntimeConfig(
    buildEnv({
      GEOJOHAN_MAPS_API_KEY: '',
      GOOGLE_MAPS_API_KEY: '',
      ASK_JOHAN_MAPS_API_KEY: ''
    })
  )

  assert.equal(config.geoJohanMapsApiKey, '')
  assert.equal(config.geoJohanMapsApiKeySource, 'none')
})

test('readRuntimeConfig parses spotify settings and marks integration configured', () => {
  const config = readRuntimeConfig(
    buildEnv({
      APP_BASE_URL: 'http://localhost:5173',
      SPOTIFY_CLIENT_ID: 'spotify-client-id',
      SPOTIFY_CLIENT_SECRET: 'spotify-client-secret',
      SPOTIFY_OWNER_REFRESH_TOKEN: 'owner-refresh-token',
      SPOTIFY_REDIRECT_URI: 'http://127.0.0.1:8787/api/spotify/callback',
      SPOTIFY_SCOPES: 'user-read-recently-played, user-read-email',
      SESSION_SECRET: 'session-secret'
    })
  )

  assert.equal(config.spotify.isConfigured, true)
  assert.equal(config.spotify.dashboardEnabled, true)
  assert.equal(config.spotify.clientId, 'spotify-client-id')
  assert.equal(config.spotify.clientSecret, 'spotify-client-secret')
  assert.equal(config.spotify.ownerRefreshToken, 'owner-refresh-token')
  assert.equal(config.spotify.redirectUri, 'http://127.0.0.1:8787/api/spotify/callback')
  assert.equal(config.spotify.scopes, 'user-read-recently-played user-read-email')
  assert.equal(config.sessionSecretSource, 'SESSION_SECRET')
})

test('readRuntimeConfig disables spotify dashboard when owner refresh token is missing', () => {
  const config = readRuntimeConfig(
    buildEnv({
      APP_BASE_URL: 'http://localhost:5173',
      SPOTIFY_CLIENT_ID: 'spotify-client-id',
      SPOTIFY_REDIRECT_URI: 'http://127.0.0.1:8787/api/spotify/callback'
    })
  )

  assert.equal(config.spotify.isConfigured, true)
  assert.equal(config.spotify.dashboardEnabled, false)
})

test('readRuntimeConfig parses updates signup config', () => {
  const config = readRuntimeConfig(
    buildEnv({
      APP_BASE_URL: 'https://johanscv.dk',
      REDIS_URL: 'redis://localhost:6379',
      SESSION_SECRET: 'session-secret',
      RESEND_API_KEY: 'resend-api-key',
      RESEND_UPDATES_FROM_EMAIL: 'Johan <updates@johanscv.dk>',
      RESEND_UPDATES_REPLY_TO_EMAIL: 'johan.niemann.husbjerg@gmail.com',
      RESEND_UPDATES_SEGMENT_ID: 'segment-website-updates',
      RESEND_TOPIC_PROJECTS_ID: 'topic-projects',
      RESEND_TOPIC_RESUME_ID: 'topic-resume',
      RESEND_TOPIC_INTERACTIVE_SERVICES_ID: 'topic-interactive',
      UPDATES_AUTOMATION_TOKEN: 'updates-automation-secret',
      UPDATES_BROADCAST_LOCALE: 'en',
      UPDATES_BROADCAST_SITE_BASE_URL: 'https://www.johanscv.dk',
      UPDATES_BROADCAST_LOG_LIMIT: '25',
      UPDATES_SIGNUP_RATE_LIMIT_WINDOW_MS: '45000',
      UPDATES_SIGNUP_RATE_LIMIT_MAX: '5',
      UPDATES_SIGNUP_DAILY_CAP: '12'
    })
  )

  assert.equal(config.updatesSignup.isConfigured, true)
  assert.equal(config.updatesSignup.apiKey, 'resend-api-key')
  assert.equal(config.updatesSignup.fromEmail, 'Johan <updates@johanscv.dk>')
  assert.equal(config.updatesSignup.replyToEmail, 'johan.niemann.husbjerg@gmail.com')
  assert.equal(config.updatesSignup.segmentId, 'segment-website-updates')
  assert.equal(config.updatesSignup.siteBaseUrl, 'https://johanscv.dk')
  assert.equal(config.updatesSignup.unsubscribeSecret, 'session-secret')
  assert.equal(config.updatesSignup.welcomeEmailEnabled, true)
  assert.equal(config.updatesSignup.broadcastEnabled, true)
  assert.equal(config.updatesSignup.topicIds.projects, 'topic-projects')
  assert.equal(config.updatesSignup.topicIds.resume, 'topic-resume')
  assert.equal(config.updatesSignup.topicIds.interactive_services, 'topic-interactive')
  assert.equal(config.updatesSignup.rateLimitWindowMs, 45000)
  assert.equal(config.updatesSignup.rateLimitMax, 5)
  assert.equal(config.updatesSignup.dailyCapMax, 12)
  assert.equal(config.updatesBroadcast.automationEnabled, true)
  assert.equal(config.updatesBroadcast.automationToken, 'updates-automation-secret')
  assert.equal(config.updatesBroadcast.locale, 'en')
  assert.equal(config.updatesBroadcast.siteBaseUrl, 'https://www.johanscv.dk')
  assert.equal(config.updatesBroadcast.storeMode, 'redis')
  assert.match(config.updatesBroadcast.stateFile, /\.updates-broadcast-state\.json$/)
  assert.equal(config.updatesBroadcast.logLimit, 25)
})

test('readRuntimeConfig marks updates signup unconfigured when topic ids are incomplete', () => {
  const config = readRuntimeConfig(
    buildEnv({
      RESEND_API_KEY: 'resend-api-key',
      RESEND_UPDATES_FROM_EMAIL: 'Johan <updates@johanscv.dk>',
      RESEND_TOPIC_PROJECTS_ID: 'topic-projects',
      RESEND_TOPIC_RESUME_ID: '',
      RESEND_TOPIC_INTERACTIVE_SERVICES_ID: 'topic-interactive'
    })
  )

  assert.equal(config.updatesSignup.isConfigured, false)
  assert.equal(config.updatesSignup.welcomeEmailEnabled, false)
  assert.equal(config.updatesSignup.broadcastEnabled, false)
  assert.equal(config.updatesBroadcast.storeMode, 'file')
  assert.equal(config.updatesBroadcast.automationEnabled, false)
})
