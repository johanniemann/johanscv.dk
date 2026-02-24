# AGENTS.md (API: ask-johan-api)

## Mission
- Keep Ask Johan API stable, secure, and Render-compatible while making minimal, testable changes.

## Discovery Rule (Mandatory)
- Do not assume endpoints or env wiring from memory.
- Before edits, verify current reality dynamically:
  - server entrypoint,
  - module boundaries in `src/config`, `src/app`, `src/features`, `src/server`, `src/shared`,
  - middleware/auth/rate-limit behavior,
  - env loading order,
  - tests and deploy settings.

## Active API Facts
- Runtime: Node + Express + OpenAI Responses API.
- Runtime expectation is Node 20 (`../.nvmrc`, CI, Render `NODE_VERSION`).
- Entrypoint: `index.js` -> `src/server/start-server.js`.
- Core wiring:
  - app + middleware: `src/app/create-app.js`
  - runtime/env/context config: `src/config/runtime-config.js`
  - usage store: `src/server/usage-store.js`
- Feature handlers:
  - auth: `src/features/auth.js`
  - ask-johan: `src/features/ask-johan.js`
  - geojohan maps-key: `src/features/geojohan.js`
  - optional spotify oauth helpers: `src/features/spotify-auth.js`
  - spotify music dashboard: `src/features/music-dashboard.js`
- Public endpoints:
  - `GET /health`
  - `GET /`
  - `POST /auth/login`
  - `GET /api/geojohan/maps-key`
  - `POST /api/ask-johan`
  - `GET /api/music-dashboard/snapshot`
  - optional legacy helpers (not required by frontend dashboard UX):
    - `GET /api/spotify/login`
    - `GET /api/spotify/callback`
    - `POST /api/spotify/logout`
- Auth model:
  - primary: JWT Bearer (token from `/auth/login`),
  - optional temporary compatibility: `x-access-code` controlled by `ASK_JOHAN_AUTH_COMPAT_MODE`.

## Security Guardrails (Mandatory)
- Never commit/log secrets.
- Keep CORS strict (`ALLOWED_ORIGINS` exact allowlist + localhost dev rule).
- Keep validation/throttling active:
  - content-type + input type/length checks,
  - malformed JSON handling + request body-size limit handling,
  - request rate limiter,
  - failed-auth throttling,
  - daily cap per IP.
- Spotify dashboard security requirements:
  - Spotify owner refresh token remains server-side only,
  - Spotify tokens stored server-side only (never returned to frontend),
  - refresh-once strategy for Spotify `401`,
  - no logging of token values.
- Keep context-protection behavior active:
  - refuse system/developer/internal prompt exfiltration requests,
  - never expose raw private context text verbatim.

## Environment Variables (API)
- Source of truth: `.env.example` + runtime parsing in server code.
- Core:
  - `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
  - `JOHANSCV_ACCESS_CODE` (primary), `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
  - `JWT_SECRET`, `SESSION_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE`
  - `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
  - `GEOJOHAN_MAPS_API_KEY`
  - `ASK_JOHAN_DAILY_CAP`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
  - `ASK_JOHAN_TIMEOUT_MS`, `MAX_QUESTION_CHARS`
  - `ALLOWED_ORIGINS`
  - Usage store:
    - `ASK_JOHAN_USAGE_STORE` (`memory` or `redis`)
    - `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX` (when redis mode)
- Spotify dashboard:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_OWNER_REFRESH_TOKEN`
  - `SPOTIFY_CLIENT_SECRET` (optional, recommended)
  - optional legacy OAuth helpers:
    - `APP_BASE_URL`
    - `SPOTIFY_REDIRECT_URI`
    - `SPOTIFY_SCOPES` (default `user-read-recently-played`)
    - `SPOTIFY_SESSION_COOKIE_NAME`, `SPOTIFY_SESSION_TTL_MS`
    - `SPOTIFY_PKCE_TTL_MS`
  - `SPOTIFY_SNAPSHOT_CACHE_TTL_MS`
  - `SPOTIFY_REQUEST_TIMEOUT_MS`
  - `SPOTIFY_RATE_LIMIT_WINDOW_MS`, `SPOTIFY_RATE_LIMIT_MAX`
  - `SPOTIFY_DAILY_CAP`
- Context source priority:
  - `JOHAN_CONTEXT_B64`
  - `JOHAN_CONTEXT`
  - `JOHAN_CONTEXT_FILE`
  - local fallback files.

## Definition Of Done (API)
- Run from `ask-johan-api/`:
  - `npm test`
  - `npm audit --omit=dev`
- For runtime-sensitive changes, also run `npm run start` smoke checks for:
  - `/health`
  - `/auth/login`
  - protected `POST /api/ask-johan`
- Never commit/push without explicit Johan approval.
- Final summary must include:
  - changed files,
  - commands + pass/fail,
  - API contract or env impacts.
