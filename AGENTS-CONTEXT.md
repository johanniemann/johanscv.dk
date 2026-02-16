# AGENTS-CONTEXT.md

## Purpose
Single source of truth for AI agents working in this repo. Keep this file concise and current with deployed reality.

## Active Architecture

Services:
1. Frontend SPA in `johanscv/` (Vite + Vanilla JS + Tailwind tooling), deployed to GitHub Pages.
2. Backend API in `ask-johan-api/` (Node + Express + OpenAI), deployed to Render.

Legacy (not in active CI/deploy):
1. `legacy/root-src/`
2. root `public/`

## Source-Of-Truth Files

Frontend:
1. Entry: `johanscv/src/main.js`
2. Router: `johanscv/src/router.js`
3. Ask Johan feature: `johanscv/src/features/ask-johan/AskJohanWidget.js`
4. GeoJohan feature: `johanscv/src/features/geojohan/GeoJohanPage.js`
5. GeoJohan config: `johanscv/src/features/geojohan/geojohanEnv.js`, `johanscv/src/features/geojohan/geojohanRounds.js`
6. Resume page: `johanscv/src/pages/Resume.js`
7. Base path behavior: `johanscv/vite.config.js`
8. Dev startup behavior: `johanscv/scripts/dev-fixed.sh`

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
7. Usage/rate-limit store: `ask-johan-api/src/server/usage-store.js`
8. Shared HTTP/timeout helpers:
   - `ask-johan-api/src/shared/http.js`
   - `ask-johan-api/src/shared/with-timeout.js`
9. Tests: `ask-johan-api/test/api.test.js`

Deploy/CI:
1. Render blueprint: `render.yaml`
2. CI gate: `.github/workflows/ci.yml`
3. Repo verification: `scripts/verify.sh`

## Data Flow And Contracts

Auth flow:
1. Frontend gate collects access code.
2. Frontend calls `POST /auth/login` with `{ accessCode }`.
3. API returns JWT bearer token.

Protected calls:
1. `POST /api/ask-johan` with `Authorization: Bearer <token>`, body `{ question }`.
2. `GET /api/geojohan/maps-key` with `Authorization: Bearer <token>`.

Quick contract reference:
1. `POST /auth/login`
   - request: `{ "accessCode": "..." }`
   - success: `{ "token": "...", "tokenType": "Bearer", "expiresIn": "7d", "legacyAccessCodeAccepted": boolean }`
   - error: `{ "answer": "..." }`
2. `POST /api/ask-johan`
   - request: `{ "question": "..." }`
   - success: `{ "answer": "..." }`
   - error: `{ "answer": "..." }`
3. `GET /api/geojohan/maps-key`
   - success: `{ "mapsApiKey": "..." }`
   - error: `{ "answer": "..." }`

Security controls in API:
1. Strict CORS allowlist (`ALLOWED_ORIGINS`) plus localhost dev origin support.
2. Failed-auth throttling (`ASK_JOHAN_AUTH_FAIL_*`).
3. Per-IP rate limit (`ASK_JOHAN_RATE_LIMIT_*`).
4. Per-IP daily cap (`ASK_JOHAN_DAILY_CAP`).
5. Prompt/context exfiltration refusal patterns.

## Environment Variables (Names Only)

Frontend (`johanscv/.env.local`):
1. `VITE_ASK_JOHAN_MODE`
2. `VITE_API_BASE_URL`
3. Optional `VITE_GEOJOHAN_ROUND{N}_*` and `VITE_GEOJOHAN_ROUND{N}_SUMMARY_*`

Backend (`ask-johan-api/.env` or Render env):
1. `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
2. `JOHANSCV_ACCESS_CODE` (primary), `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
3. `JWT_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE`
4. `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
5. `GEOJOHAN_MAPS_API_KEY`
6. `ASK_JOHAN_DAILY_CAP`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
7. `ASK_JOHAN_TIMEOUT_MS`, `MAX_QUESTION_CHARS`
8. `ALLOWED_ORIGINS`
9. `ASK_JOHAN_USAGE_STORE`, `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX`
10. Context source priority:
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

3. GitHub Pages base-path emulation local:
   - `cd johanscv && CUSTOM_DOMAIN=false npm run dev`
   - open `http://localhost:5173/johanscv.dk/`

## Verification Checklist

1. Frontend:
   - `cd johanscv && npm run lint`
   - `cd johanscv && npm run smoke`
   - `cd johanscv && npm run build`

2. API:
   - `cd ask-johan-api && npm test`

3. Repo gate:
   - `./scripts/verify.sh`

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
   - do not treat `legacy/` or root `public/` as active runtime code.
