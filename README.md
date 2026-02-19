# WEBSITE Monorepo

Personal website stack with two active production services:
- frontend SPA in `johanscv/` (GitHub Pages),
- backend API in `ask-johan-api/` (Render).

## Repository Structure

| Path | Purpose | Status |
| --- | --- | --- |
| `johanscv/` | Frontend SPA (Vite + Vanilla JS + Tailwind tooling) | Active |
| `ask-johan-api/` | Ask Johan + GeoJohan API (Node/Express/OpenAI) | Active |
| `.github/workflows/ci.yml` | CI quality gate (repo guardrails + frontend lint/smoke/build/budget + API tests + dependency audit) | Active |
| `render.yaml` | Render blueprint (`rootDir: ask-johan-api`) | Active |
| `legacy/root-src/` | Previous frontend prototype source | Legacy |
| `public/` | Previous root-level static assets (legacy reference folder with placeholder dirs only) | Legacy |
| `docs/` | Operational docs/runbooks | Active |
| `scripts/verify.sh` | Repo-level verify script | Active |

`legacy/` and root `public/` are not in active deploy paths. (Root `public/` has no active files.)

## Internal Module Layout

Frontend (`johanscv/src/`):
1. `main.js`, `router.js`, `state.js` for app shell and route state.
2. `features/ask-johan/AskJohanWidget.js` for Ask Johan client/auth interactions.
3. `features/geojohan/GeoJohanPage.js` + `features/geojohan/geojohan*.js` for GeoJohan gameplay/config.
4. `pages/` for route-level page composition (`Resume.js`, `Home.js`, etc.).
5. `components/` for shared presentational components.

API (`ask-johan-api/src/`):
1. `config/runtime-config.js` for env parsing + context loading.
2. `app/create-app.js` + `app/origins.js` for Express wiring and CORS origin rules.
3. `features/auth.js`, `features/ask-johan.js`, `features/geojohan.js` for endpoint behavior.
4. `server/start-server.js` + `server/usage-store.js` for startup and quota storage.
5. `shared/http.js` + `shared/with-timeout.js` for cross-feature helpers.

## Active vs Legacy

Active production architecture:
1. `johanscv/` deploys to GitHub Pages.
2. `ask-johan-api/` deploys to Render.

Legacy references:
1. `legacy/root-src/`
2. root `public/` (currently empty)

## Runtime Model

Browser flow in API mode:
1. User enters site access code in frontend Welcome gate.
2. Frontend calls `POST /auth/login`.
3. API returns JWT token.
4. Frontend calls:
   - `POST /api/ask-johan` with `Authorization: Bearer <token>`
   - `GET /api/geojohan/maps-key` with `Authorization: Bearer <token>`

## API Contract Snapshot

1. `POST /auth/login`
   - request: `{ "accessCode": "..." }`
   - success: `{ "token": "...", "tokenType": "Bearer", "expiresIn": "...", "legacyAccessCodeAccepted": boolean }`
   - error: `{ "answer": "..." }`
2. `POST /api/ask-johan`
   - request: `{ "question": "..." }`
   - success: `{ "answer": "..." }`
   - error: `{ "answer": "..." }`
3. `GET /api/geojohan/maps-key`
   - success: `{ "mapsApiKey": "..." }`
   - error: `{ "answer": "..." }`

## Local Development

Expected Node version: `20.x` (CI + Render use Node 20).

If your local machine is on a different major version, switch before verification:

```bash
nvm use 20
```

### Frontend (`johanscv/`)

```bash
cd johanscv
npm ci
cp .env.local.example .env.local   # only if missing
npm run dev
```

Default local URL:
- `http://localhost:5173/`
- `npm run dev` uses `johanscv/scripts/dev-fixed.sh` (binds `127.0.0.1:5173`, `--strictPort`, and clears stale port listeners).

GitHub Pages base-path emulation locally:

```bash
cd johanscv
CUSTOM_DOMAIN=false npm run dev
```

Emulated URL:
- `http://localhost:5173/johanscv.dk/`

### API (`ask-johan-api/`)

```bash
cd ask-johan-api
npm ci
cp .env.example .env   # only if missing
npm run dev
```

Health:

```bash
curl -s http://127.0.0.1:8787/health
```

### Run Both Services (Two Terminals)

Terminal 1 (API):

```bash
cd ask-johan-api
npm ci
npm run dev
```

Terminal 2 (frontend):

```bash
cd johanscv
npm ci
npm run dev
```

Open:
- `http://localhost:5173/`

## Environment Variables (Names Only)

Frontend (`johanscv/.env.local`):
- `VITE_ASK_JOHAN_MODE`
- `VITE_API_BASE_URL`
- optional local dev convenience:
  - `VITE_DEV_AUTO_LOGIN`
  - `VITE_DEV_ACCESS_CODE`
- optional GeoJohan round/summary vars:
  - `VITE_GEOJOHAN_ROUND{N}_TITLE`
  - `VITE_GEOJOHAN_ROUND{N}_PANO_LAT`, `VITE_GEOJOHAN_ROUND{N}_PANO_LNG`, `VITE_GEOJOHAN_ROUND{N}_PANO_ID`
  - `VITE_GEOJOHAN_ROUND{N}_POV_HEADING`, `VITE_GEOJOHAN_ROUND{N}_POV_PITCH`
  - `VITE_GEOJOHAN_ROUND{N}_ANSWER_LAT`, `VITE_GEOJOHAN_ROUND{N}_ANSWER_LNG`
  - `VITE_GEOJOHAN_ROUND{N}_SUMMARY_ADDRESS`
  - `VITE_GEOJOHAN_ROUND{N}_SUMMARY_CONTEXT_DK`, `VITE_GEOJOHAN_ROUND{N}_SUMMARY_CONTEXT_EN`
- defaults:
  - `johanscv/.env.example` uses `VITE_ASK_JOHAN_MODE=mock`
  - `johanscv/.env.local.example` and `johanscv/.env.production` use `VITE_ASK_JOHAN_MODE=api`

API (`ask-johan-api/.env`):
- `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
- `JOHANSCV_ACCESS_CODE` (primary), `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
- `JWT_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE` (recommended/default: `false`)
- `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
- `GEOJOHAN_MAPS_API_KEY`
- `ASK_JOHAN_USAGE_STORE`, `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX`
- `MAX_QUESTION_CHARS`, `ASK_JOHAN_DAILY_CAP`
- `ALLOWED_ORIGINS`
- `ASK_JOHAN_TIMEOUT_MS`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
- context sources: `JOHAN_CONTEXT_B64`, `JOHAN_CONTEXT`, `JOHAN_CONTEXT_FILE`

Frontend production build config (`johanscv/.env.production`):
- `VITE_ASK_JOHAN_MODE`
- `VITE_API_BASE_URL`

## Security Notes

- Never commit secret env files (`.env`, `.env.local`, API private context files), tokens, access codes, JWT secrets, or OpenAI keys.
- `johanscv/.env.production` is intentionally tracked and must only contain non-secret public frontend build values.
- Never print `.env`/`.env.local` values or private context contents in logs/reports.
- Never print private context verbatim.
- Treat all `VITE_*` variables as public in browser bundles.

## Verification

Frontend:

```bash
cd johanscv
npm run lint
npm run smoke
npm run build
npm run check:bundle
```

API:

```bash
cd ask-johan-api
npm test
```

Repo-level:

```bash
./scripts/check-node-alignment.sh
./scripts/check-doc-sync.sh
./scripts/scan-secrets.sh
./scripts/verify.sh
```

## Secret Scan Before Push

Preferred:

```bash
gitleaks detect --no-git --source . --redact
```

Note:
- local `.env` files can appear as findings when scanning the whole working tree.
- do not commit `.env` files; scan staged files before push when in doubt.

Fallback:

```bash
rg --hidden --glob '!.git' --files-with-matches '(?i)(api[_-]?key|secret|token|password|sk-[A-Za-z0-9]{20,}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----)' .
```

## Deployment Docs

- Frontend: `johanscv/DEPLOYMENT.md`
- API: `ask-johan-api/DEPLOY_RENDER.md`
- Operations runbook: `docs/ask-johan-operations-runbook.md`
