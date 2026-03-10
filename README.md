# WEBSITE Monorepo

Personal website stack with two active production services:
- frontend SPA in `johanscv/` (GitHub Pages),
- backend API in `johanscv.dk-api/` (Azure App Service).

## Repository Structure

| Path | Purpose | Status |
| --- | --- | --- |
| `johanscv/` | Frontend SPA (Vite + Vanilla JS + Tailwind tooling) | Active |
| `johanscv.dk-api/` | Ask Johan + GeoJohan API (Node/Express/OpenAI) | Active |
| `johanscv.dk-api/DEPLOY_AZURE.md` | Azure App Service deployment guide for the API | Active |
| `.github/workflows/ci.yml` | CI quality gate (repo guardrails + frontend lint/smoke/build/budget + API tests + dependency audit) | Active |
| `docs/` | Operational docs and incident runbooks | Active |
| `scripts/verify.sh` | Repo-level verification | Active |
| `archive/legacy-frontend-prototype/` | Previous frontend prototype source | Archived legacy |
| `archive/root-public-placeholders/` | Previous root-level static placeholder folders | Archived legacy |

`archive/` is not in active deploy paths; it only stores legacy reference material.

## Internal Module Layout

Frontend (`johanscv/src/`):
1. `main.js`, `router.js`, `state.js` for app shell and route state.
2. `features/ask-johan/AskJohanWidget.js` for Ask Johan client/auth interactions.
3. `features/geojohan/GeoJohanPage.js` + `features/geojohan/geojohan*.js` for GeoJohan gameplay/config.
4. `features/spotify-dashboard/SpotifyDashboardSection.js` for Spotify dashboard UX states.
5. `features/updates-signup/UpdatesSignupSection.js` for email update signup UX on the contact page.
5. `pages/` for route-level page composition (`Resume.js`, `Home.js`, etc.).
6. `components/` for shared presentational components.

API (`johanscv.dk-api/src/`):
1. `config/runtime-config.js` for env parsing + context loading.
2. `app/create-app.js` + `app/origins.js` for Express wiring and CORS origin rules.
3. `features/auth.js`, `features/ask-johan.js`, `features/geojohan.js`, `features/spotify-auth.js`, `features/music-dashboard.js`, `features/updates-signup.js`, `features/resend-client.js` for endpoint and Resend behavior.
4. `server/start-server.js` + `server/usage-store.js` + `server/spotify-session-store.js` for startup and quota/session storage.
5. `shared/http.js` + `shared/with-timeout.js` + `shared/cookies.js` for cross-feature helpers.

## Active vs Legacy

Active production architecture:
1. `johanscv/` deploys to GitHub Pages.
2. `johanscv.dk-api/` deploys to Azure App Service.

Legacy references:
1. `archive/legacy-frontend-prototype/`
2. `archive/root-public-placeholders/`

## Runtime Model

Browser flow in API mode:
1. User enters site access code in frontend Welcome gate.
2. Frontend calls `POST /auth/login`.
3. API returns JWT token.
4. Frontend calls:
   - `POST /api/ask-johan` with `Authorization: Bearer <token>`
   - `GET /api/geojohan/maps-key` with `Authorization: Bearer <token>`
5. Temporary legacy compatibility mode exists server-side (`x-access-code`) but should remain disabled unless explicitly needed (`ASK_JOHAN_AUTH_COMPAT_MODE=false` by default).

Spotify dashboard flow:
1. Frontend route `/playground` requests `GET /api/music-dashboard/snapshot`.
2. API uses server-owned Spotify credentials (`SPOTIFY_CLIENT_ID` + `SPOTIFY_OWNER_REFRESH_TOKEN`) to refresh an access token.
3. API builds top-4 tracks (past week), top-4 artists (past week), and top-4 albums from recent listens.
4. Frontend renders the cards directly; no user Spotify connect step is required.

Updates signup flow:
1. Frontend contact page posts `POST /api/updates-signup` with `{ email, topics, locale, source }`.
2. API syncs the contact and topic preferences in Resend.
3. First-time signups receive a welcome email.
4. Protected deploy/workflow triggers post commit/diff metadata to `POST /api/updates-signup/auto-broadcast`.
5. The API centrally generates topic-specific mails, dedupes per commit/topic, logs the result, and sends via Resend.
6. Frontend deploys (`cd johanscv && npm run deploy`), API deploys (`cd johanscv.dk-api && npm run deploy:azure`), and GitHub deploy workflows all reuse that same central broadcast flow.
7. Manual override still exists via `npm run updates:broadcast -- ...` from `johanscv.dk-api/`.

## API Contract Snapshot

1. `POST /auth/login`
   - request: `{ "accessCode": "..." }`
   - success: `{ "token": "...", "tokenType": "Bearer", "expiresIn": "...", "legacyAccessCodeAccepted": boolean }`
   - error: `{ "answer": "..." }`
2. `POST /api/ask-johan`
   - request: `{ "question": "..." }`
   - success: `{ "answer": "..." }`
   - error: `{ "answer": "..." }`
   - validation behavior:
     - malformed JSON -> `400`
     - oversized JSON body (> `8kb`) -> `413`
3. `GET /api/geojohan/maps-key`
   - success: `{ "mapsApiKey": "..." }`
   - error: `{ "answer": "..." }`
4. `GET /api/music-dashboard/snapshot`
   - success: `{ "snapshotTimestamp": "...", "weeklyWindowStartTimestamp": "...", "periodFallbackUsed": boolean, "lists": { "tracks": [...], "albums": [...], "artists": [...] } }`
   - misconfigured source account: `{ "message": "..." }` with `503`
   - empty data: `{ "message": "..." }` with `422`
5. `POST /api/updates-signup`
   - request: `{ "email": "...", "topics": ["projects" | "resume" | "interactive_services"], "locale": "en" | "dk", "source": "contact-page" }`
   - success: `{ "ok": true, "message": "...", "subscribedTopics": [...] }`
6. `GET /api/updates-signup/unsubscribe`
   - request: signed `token` query parameter from welcome email
   - success: HTML confirmation page
7. Internal deploy automation endpoints:
   - `POST /api/updates-signup/auto-broadcast` with automation token header + commit/diff metadata
   - `GET /api/updates-signup/broadcast-log` with automation token header

## Local Development

Expected Node version: `24.x` (CI + Azure App Service target use Node 24).

If your local machine is on a different major version, switch before verification:

```bash
nvm use 24
```

Or run the Node-24 wrapper verification directly:

```bash
./scripts/verify-node24.sh
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

### API (`johanscv.dk-api/`)

```bash
cd johanscv.dk-api
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
cd johanscv.dk-api
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

API (`johanscv.dk-api/.env` or Azure App Service app settings):
- `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
- `JOHANSCV_ACCESS_CODE` (primary), `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
- `JWT_SECRET`, `SESSION_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE` (recommended/default: `false`)
- `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
- `GEOJOHAN_MAPS_API_KEY` (canonical; runtime also accepts legacy fallbacks `GOOGLE_MAPS_API_KEY` and `ASK_JOHAN_MAPS_API_KEY`)
- `ASK_JOHAN_USAGE_STORE`, `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX`
- `MAX_QUESTION_CHARS`, `ASK_JOHAN_DAILY_CAP`
- `ALLOWED_ORIGINS`
- `ASK_JOHAN_TIMEOUT_MS`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
- updates signup / Resend:
  - `RESEND_API_KEY`
  - `RESEND_UPDATES_FROM_EMAIL`
  - optional `RESEND_UPDATES_REPLY_TO_EMAIL`
  - `RESEND_UPDATES_SEGMENT_ID`
  - `RESEND_TOPIC_PROJECTS_ID`
  - `RESEND_TOPIC_RESUME_ID`
  - `RESEND_TOPIC_INTERACTIVE_SERVICES_ID`
  - `UPDATES_SIGNUP_RATE_LIMIT_WINDOW_MS`, `UPDATES_SIGNUP_RATE_LIMIT_MAX`, `UPDATES_SIGNUP_DAILY_CAP`
  - deploy/broadcast automation:
    - `UPDATES_AUTOMATION_TOKEN`
    - optional `UPDATES_AUTOMATION_ENDPOINT` for local deploy wrappers
    - optional `UPDATES_BROADCAST_LOCALE`, `UPDATES_BROADCAST_SITE_BASE_URL`
    - optional `UPDATES_BROADCAST_STORE`, `UPDATES_BROADCAST_STATE_FILE`, `UPDATES_BROADCAST_LOG_LIMIT`
- Spotify dashboard:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_OWNER_REFRESH_TOKEN`
  - `SPOTIFY_CLIENT_SECRET`
  - `APP_BASE_URL`
  - `SPOTIFY_REDIRECT_URI`
  - `SPOTIFY_SCOPES`
  - `SPOTIFY_SNAPSHOT_CACHE_TTL_MS`
  - `SPOTIFY_REQUEST_TIMEOUT_MS`
  - `SPOTIFY_RATE_LIMIT_WINDOW_MS`, `SPOTIFY_RATE_LIMIT_MAX`
  - `SPOTIFY_DAILY_CAP`
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
- Keep API controls enabled: strict CORS allowlist, `/auth/login` + Bearer auth, failed-auth throttling, request rate limit, daily cap, and context-exfiltration refusal.
- Keep Spotify dashboard protections enabled: server-side token handling, per-IP rate limits, and snapshot caching.

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
cd johanscv.dk-api
npm test
npm audit --omit=dev
```

Frontend dependency audit:

```bash
cd johanscv
npm audit --omit=dev
```

Repo-level:

```bash
./scripts/check-node-alignment.sh
./scripts/check-doc-sync.sh
./scripts/scan-secrets.sh
./scripts/verify.sh
./scripts/verify-node24.sh
```

## Deploy Automation

Frontend deploy automation:
1. `.github/workflows/deploy-frontend.yml` builds `johanscv/`, publishes `gh-pages`, and then notifies the API broadcast endpoint.
2. It only needs one repo secret for notifications: `UPDATES_AUTOMATION_TOKEN`.

API deploy automation:
1. `.github/workflows/deploy-api.yml` packages `johanscv.dk-api/`, deploys Azure App Service, and then notifies the same API broadcast endpoint.
2. It needs:
   - GitHub secret `AZURE_WEBAPP_PUBLISH_PROFILE`
   - GitHub secret `UPDATES_AUTOMATION_TOKEN`

Local deploy helpers:
1. Frontend: `cd johanscv && npm run deploy`
2. API: `cd johanscv.dk-api && npm run deploy:azure`
