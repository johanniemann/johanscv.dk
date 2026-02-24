# AGENTS-CONTEXT.md

## Purpose
Single source of truth for AI agents working in this repo. Keep this file concise and current with deployed reality.

## Active Architecture

Services:
1. Frontend SPA in `johanscv/` (Vite + Vanilla JS + Tailwind tooling), deployed to GitHub Pages.
2. Backend API in `ask-johan-api/` (Node + Express + OpenAI), deployed to Render.

Legacy (not in active CI/deploy):
1. `archive/legacy-frontend-prototype/root-src/`
2. `archive/root-public-placeholders/`

## Source-Of-Truth Files

Frontend:
1. Entry: `johanscv/src/main.js`
2. Router: `johanscv/src/router.js`
3. Ask Johan feature: `johanscv/src/features/ask-johan/AskJohanWidget.js`
4. GeoJohan feature: `johanscv/src/features/geojohan/GeoJohanPage.js`
5. Spotify dashboard feature: `johanscv/src/features/spotify-dashboard/SpotifyDashboardSection.js`
6. GeoJohan config: `johanscv/src/features/geojohan/geojohanEnv.js`, `johanscv/src/features/geojohan/geojohanRounds.js`
7. Resume page: `johanscv/src/pages/Resume.js`
8. Base path behavior: `johanscv/vite.config.js`
9. Dev startup behavior: `johanscv/scripts/dev-fixed.sh`
10. GitHub Pages deep-link fallback: `johanscv/public/404.html`

API:
1. Runtime entrypoint: `ask-johan-api/index.js`
2. Bootstrap/orchestration: `ask-johan-api/src/server/start-server.js`
3. Env/context loading: `ask-johan-api/src/config/runtime-config.js`
4. App wiring + middleware: `ask-johan-api/src/app/create-app.js`
5. Origin parsing: `ask-johan-api/src/app/origins.js`
6. Feature handlers:
   - `ask-johan-api/src/features/auth.js`
   - `ask-johan-api/src/features/ask-johan.js`
   - `ask-johan-api/src/features/geojohan.js`
   - `ask-johan-api/src/features/music-dashboard.js`
7. Usage/rate-limit store: `ask-johan-api/src/server/usage-store.js`
8. Optional Spotify OAuth/session helpers: `ask-johan-api/src/features/spotify-auth.js`, `ask-johan-api/src/server/spotify-session-store.js`
9. Shared HTTP/timeout helpers:
   - `ask-johan-api/src/shared/http.js`
   - `ask-johan-api/src/shared/with-timeout.js`
10. Tests: `ask-johan-api/test/api.test.js`

Deploy/CI:
1. Render blueprint: `render.yaml`
2. CI gate: `.github/workflows/ci.yml`
3. Repo verification: `scripts/verify.sh`
4. Runtime target version: Node 20 (`.nvmrc`, CI, Render).

## Data Flow And Contracts

Auth flow:
1. Frontend gate collects access code.
2. Frontend calls `POST /auth/login` with `{ accessCode }`.
3. API returns JWT bearer token.

Protected calls:
1. `POST /api/ask-johan` with `Authorization: Bearer <token>`, body `{ question }`.
2. `GET /api/geojohan/maps-key` with `Authorization: Bearer <token>`.

Spotify Dashboard flow:
1. Frontend route `/playground` requests `GET /api/music-dashboard/snapshot`.
2. API refreshes a server-owned Spotify access token using `SPOTIFY_CLIENT_ID` + `SPOTIFY_OWNER_REFRESH_TOKEN`.
3. API returns top 4 tracks (past week), top 4 albums, and top 4 artists (past week).
4. Frontend renders the dashboard with no user Spotify connect step.

Quick contract reference:
1. `POST /auth/login`
   - request: `{ "accessCode": "..." }`
   - success: `{ "token": "...", "tokenType": "Bearer", "expiresIn": "7d", "legacyAccessCodeAccepted": boolean }`
   - error: `{ "answer": "..." }`
2. `POST /api/ask-johan`
   - request: `{ "question": "..." }`
   - success: `{ "answer": "..." }`
   - error: `{ "answer": "..." }`
   - validation: malformed JSON -> `400`; request body above `8kb` -> `413`
3. `GET /api/geojohan/maps-key`
   - success: `{ "mapsApiKey": "..." }`
   - error: `{ "answer": "..." }`
4. `GET /api/music-dashboard/snapshot`
   - success: `{ "snapshotTimestamp": "...", "weeklyWindowStartTimestamp": "...", "periodFallbackUsed": boolean, "lists": { "tracks": [...], "albums": [...], "artists": [...] } }`
   - misconfigured source account: `{ "message": "..." }` with `503`
   - sparse data: `{ "message": "..." }` with `422`

Security controls in API:
1. Strict CORS allowlist (`ALLOWED_ORIGINS`) plus localhost dev origin support.
2. Failed-auth throttling (`ASK_JOHAN_AUTH_FAIL_*`).
3. Per-IP rate limit (`ASK_JOHAN_RATE_LIMIT_*`).
4. Per-IP daily cap (`ASK_JOHAN_DAILY_CAP`).
5. Prompt/context exfiltration refusal patterns.
6. JSON/body guardrails (`application/json` checks + body-size protection).
7. Spotify dashboard safeguards:
   - server-side token refresh only (no frontend token exposure),
   - refresh-once behavior on Spotify `401`,
   - per-IP rate limit + daily soft cap on snapshot endpoint,
   - cached snapshot responses to limit external API churn.

## Environment Variables (Names Only)

Frontend (`johanscv/.env.local`):
1. `VITE_ASK_JOHAN_MODE`
2. `VITE_API_BASE_URL`
3. Optional local dev convenience: `VITE_DEV_AUTO_LOGIN`, `VITE_DEV_ACCESS_CODE`
4. Optional `VITE_GEOJOHAN_ROUND{N}_*` and `VITE_GEOJOHAN_ROUND{N}_SUMMARY_*`
5. Production build env file: `johanscv/.env.production` (`VITE_ASK_JOHAN_MODE`, `VITE_API_BASE_URL`) and this file is intentionally tracked (non-secret only).

Backend (`ask-johan-api/.env` or Render env):
1. `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
2. `JOHANSCV_ACCESS_CODE` (primary), `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
3. `JWT_SECRET`, `SESSION_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE` (default/recommended `false`)
4. `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
5. `GEOJOHAN_MAPS_API_KEY` (canonical; runtime accepts legacy fallbacks `GOOGLE_MAPS_API_KEY` and `ASK_JOHAN_MAPS_API_KEY`)
6. `ASK_JOHAN_DAILY_CAP`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
7. `ASK_JOHAN_TIMEOUT_MS`, `MAX_QUESTION_CHARS`
8. `ALLOWED_ORIGINS`
9. `ASK_JOHAN_USAGE_STORE`, `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX`
10. Spotify dashboard:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_OWNER_REFRESH_TOKEN`
   - `SPOTIFY_CLIENT_SECRET` (optional, recommended for artist image fallback lookups)
   - optional legacy OAuth settings: `APP_BASE_URL`, `SPOTIFY_REDIRECT_URI`, `SPOTIFY_SCOPES`, `SPOTIFY_SESSION_COOKIE_NAME`, `SPOTIFY_SESSION_TTL_MS`, `SPOTIFY_PKCE_TTL_MS`
   - `SPOTIFY_SNAPSHOT_CACHE_TTL_MS`
   - `SPOTIFY_REQUEST_TIMEOUT_MS`
   - `SPOTIFY_RATE_LIMIT_WINDOW_MS`, `SPOTIFY_RATE_LIMIT_MAX`
   - `SPOTIFY_DAILY_CAP`
11. Context source priority:
   - `JOHAN_CONTEXT_B64`
   - `JOHAN_CONTEXT`
   - `JOHAN_CONTEXT_FILE`
   - local `johan-context.private.md`
   - fallback `johan-context.md`

## Non-Negotiable Safety Rules

1. Never reveal private context verbatim (especially `johan-context.private.md`).
2. Never leak secrets/tokens/access codes in outputs/logs/docs.
3. Never move server secrets into frontend code.
4. Treat all `VITE_*` values as public at runtime.
5. Keep CORS/auth/throttling/rate-limit/context-protection enabled.
6. Never expose Spotify access/refresh tokens to frontend payloads, URLs, or logs.

Operational docs:
1. Deploy/API setup: `ask-johan-api/DEPLOY_RENDER.md`
2. Incident/runbook/key rotation/rate-limit tuning: `docs/ask-johan-operations-runbook.md`

## Local Run Checklist

1. API:
   - `cd ask-johan-api`
   - `cp .env.example .env` (only if missing)
   - `npm ci`
   - `npm run dev`
   - health: `curl -s http://127.0.0.1:8787/health`

2. Frontend (root URL local):
   - `cd johanscv`
   - `cp .env.local.example .env.local` (only if missing)
   - `npm ci`
   - `npm run dev`
   - open `http://localhost:5173/`
   - note: `npm run dev` binds to `127.0.0.1:5173` via `scripts/dev-fixed.sh`; `localhost:5173` works in browser.

3. GitHub Pages base-path emulation local:
   - `cd johanscv && CUSTOM_DOMAIN=false npm run dev`
   - open `http://localhost:5173/johanscv.dk/`

## Verification Checklist

1. Frontend:
   - `cd johanscv && npm run lint`
   - `cd johanscv && npm run smoke`
   - `cd johanscv && npm run build`
   - `cd johanscv && npm run check:bundle`

2. API:
   - `cd ask-johan-api && npm test`
   - `cd ask-johan-api && npm audit --omit=dev`

3. Frontend dependency audit:
   - `cd johanscv && npm audit --omit=dev`

4. Repo guardrails:
   - `./scripts/check-node-alignment.sh`
   - `./scripts/check-doc-sync.sh`
   - `./scripts/scan-secrets.sh`

5. Repo gate:
   - `./scripts/verify.sh`
   - `./scripts/verify-node20.sh` (convenience wrapper for Node 20 local verification)

## Common Pitfalls

1. Base path mismatch:
   - Production GitHub Pages uses `/johanscv.dk/`.
   - Local default should be `/` via `npm run dev`.
2. CORS mismatch:
   - `ALLOWED_ORIGINS` must include exact production origins.
3. Env precedence confusion:
   - API context uses `JOHAN_CONTEXT_B64` first; file fallback is last.
4. Security assumption error:
   - site access code in frontend storage is not a secure secret by itself; real enforcement is server-side login + JWT.
5. Legacy confusion:
   - do not treat `archive/` contents as active runtime code.
6. Node version drift:
   - local Node major should match `20` before running release verification.
7. Mode confusion:
   - `johanscv/.env.example` defaults Ask Johan to `mock`.
   - `johanscv/.env.local.example` and `johanscv/.env.production` use `api`.
