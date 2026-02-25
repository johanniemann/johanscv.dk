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
