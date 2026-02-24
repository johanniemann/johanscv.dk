# Deploy Ask Johan API on Render (Free) - No Docker

This deploys `ask-johan-api` as a free Render Web Service using the repo's `render.yaml`.

## What I already prepared

- Added `render.yaml` at repo root.
- Service config points to:
  - `rootDir`: `ask-johan-api`
  - `buildCommand`: `npm ci`
  - `startCommand`: `npm run start`
  - `healthCheckPath`: `/health`

## What you need to do (Render login required)

1. Push latest repo changes to GitHub.

2. In Render dashboard:
   - `New` -> `Blueprint`
   - Select this GitHub repository
   - Render will detect `render.yaml`

3. In the new service, set secret env vars:
   - `OPENAI_API_KEY` = your OpenAI key
   - `JOHANSCV_ACCESS_CODE` = your private site access code
   - `ASK_JOHAN_ACCESS_CODE` = deprecated fallback (optional during migration)
   - `JWT_SECRET` = a long random secret for signing JWTs (required when `NODE_ENV=production`)
   - `SESSION_SECRET` = optional legacy Spotify OAuth session signing secret
   - `GEOJOHAN_MAPS_API_KEY` = Google Maps browser key used by GeoJohan (served via authenticated API route)
   - `SPOTIFY_CLIENT_ID` = Spotify app client ID
   - `SPOTIFY_OWNER_REFRESH_TOKEN` = refresh token for Johan's Spotify account used for server-side dashboard updates
   - `SPOTIFY_CLIENT_SECRET` = Spotify app client secret (backend-only; recommended for artist/genre lookups)
   - `SPOTIFY_REDIRECT_URI` = optional legacy API callback URL, e.g. `https://<your-render-service>.onrender.com/api/spotify/callback`
   - `APP_BASE_URL` = frontend base URL, e.g. `https://johanscv.dk`
   - `JOHAN_CONTEXT_B64` = Base64-encoded private Ask Johan context (recommended so context is not in GitHub)
   - Optional safety vars:
     - `ALLOWED_ORIGINS` (comma-separated exact origins)
       - recommended: `https://johanniemann.github.io,https://johanscv.dk,https://www.johanscv.dk`
       - localhost dev origins are allowed automatically by backend localhost checks
     - `ASK_JOHAN_AUTH_COMPAT_MODE` (default `false`; set `true` only for temporary rollout compatibility)
     - `ASK_JOHAN_JWT_TTL` (default `7d`)
     - `ASK_JOHAN_AUTH_FAIL_WINDOW_MS` (default `600000`)
     - `ASK_JOHAN_AUTH_FAIL_MAX` (default `10`)
     - `ASK_JOHAN_USAGE_STORE` (`memory` default; set `redis` for shared counters across instances)
     - `REDIS_URL` (required only when `ASK_JOHAN_USAGE_STORE=redis`)
     - `ASK_JOHAN_REDIS_KEY_PREFIX` (optional, default `ask-johan`)
     - `ASK_JOHAN_DAILY_CAP` (default `100`)
     - `ASK_JOHAN_TIMEOUT_MS` (default `15000`)
     - `ASK_JOHAN_RATE_LIMIT_WINDOW_MS` (default `60000`)
     - `ASK_JOHAN_RATE_LIMIT_MAX` (default `30`)
     - Spotify dashboard tuning:
       - `SPOTIFY_SCOPES` (default `user-read-recently-played`)
       - `SPOTIFY_SNAPSHOT_CACHE_TTL_MS` (default `600000`)
       - `SPOTIFY_REQUEST_TIMEOUT_MS` (default `12000`)
       - `SPOTIFY_RATE_LIMIT_WINDOW_MS` (default `60000`)
       - `SPOTIFY_RATE_LIMIT_MAX` (default `20`)
       - `SPOTIFY_DAILY_CAP` (default `100`)
       - optional legacy OAuth settings:
         - `SPOTIFY_SESSION_COOKIE_NAME` (default `johanscv_spotify_sid`)
         - `SPOTIFY_SESSION_TTL_MS` (default `604800000`)
         - `SPOTIFY_PKCE_TTL_MS` (default `600000`)

## GeoJohan Maps key policy (recommended)

Use separate Google Maps keys for production and local development:

- `PROD Maps API key`
  - Put this value in Render env var: `GEOJOHAN_MAPS_API_KEY`
  - Website restrictions:
    - `https://johanscv.dk/*`
    - `https://www.johanscv.dk/*`
  - API restrictions: `Maps JavaScript API` only
  - Do not include localhost referrers on this key

- `DEV Maps API key`
  - Put this value in local `ask-johan-api/.env`: `GEOJOHAN_MAPS_API_KEY`
  - Website restrictions:
    - `http://localhost:5173/*`
    - `http://127.0.0.1:5173/*`
  - API restrictions: `Maps JavaScript API` only
  - Never place this value in Render production env

4. Click deploy.

5. After deploy, verify health:
   - Open: `https://<your-render-service>.onrender.com/health`
   - Expected: `{"ok":true}`

## Connect frontend to deployed API

In `johanscv/.env.local`:

```bash
VITE_ASK_JOHAN_MODE=api
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
```

Frontend flow in API mode:
- User-entered site access code is sent to `POST /auth/login`
- API returns JWT
- GeoJohan fetches maps key from `GET /api/geojohan/maps-key` with that Bearer token
- Ask requests use `Authorization: Bearer <token>`
- Spotify dashboard is always-on:
  - dashboard data: `GET /api/music-dashboard/snapshot`
  - API refreshes Spotify access with server-owned `SPOTIFY_OWNER_REFRESH_TOKEN`
  - no user Spotify connect/disconnect flow is required on frontend

Then redeploy frontend:

```bash
cd johanscv
CUSTOM_DOMAIN=true npm run deploy
```

## Production release checklist (before/after deploy)

Use this quick checklist every time you release:

### Before deploy

1. Confirm secrets are only in env vars (never committed files):
   - Render: `OPENAI_API_KEY`, `GEOJOHAN_MAPS_API_KEY` (PROD key), `JWT_SECRET`, `JOHANSCV_ACCESS_CODE`, `JOHAN_CONTEXT_B64`
   - Local `ask-johan-api/.env`: `GEOJOHAN_MAPS_API_KEY` must be DEV key only
2. Confirm Google Maps key restrictions:
   - PROD key: `https://johanscv.dk/*`, `https://www.johanscv.dk/*`
   - DEV key: `http://localhost:5173/*`, `http://127.0.0.1:5173/*`
   - API restriction: `Maps JavaScript API` only (both keys)
3. Run repo verification:

```bash
# from repo root:
./scripts/verify.sh
```

### Deploy

1. Deploy API on Render (manual deploy from latest commit).
2. Deploy frontend to GitHub Pages:

```bash
cd johanscv
CUSTOM_DOMAIN=true npm run deploy
```

### After deploy

1. API health:
   - `GET https://<your-render-service>.onrender.com/health` -> `{"ok":true}`
2. Site/domain:
   - `https://johanscv.dk` loads
   - `https://www.johanscv.dk` redirects to `https://johanscv.dk/`
   - GitHub Pages `Enforce HTTPS` is enabled
3. Access gate behavior:
   - Wrong code -> rejected
   - Correct code after cold start -> waits and logs in (no immediate cold-start error popup)
4. GeoJohan/Ask Johan behavior:
   - GeoJohan map + panorama load
   - Ask Johan returns answer

## Notes on free uptime

- Free instances may spin down after inactivity.
- First request after idle can be slow (cold start).
- For true always-on behavior, use a paid always-on plan.

## Built-in API safety now enabled

- Security headers via `helmet`
- JWT auth (`POST /auth/login`) with Bearer token protection on `POST /api/ask-johan`
- Temporary access-code compatibility mode (`ASK_JOHAN_AUTH_COMPAT_MODE`)
- IP-based rate limiting on `POST /api/ask-johan`
- Failed-auth throttling (`ASK_JOHAN_AUTH_FAIL_*`)
- Daily per-IP soft cap (`ASK_JOHAN_DAILY_CAP`)
- Configurable CORS allowlist
- Request timeout protection for model calls
- Automated API tests via GitHub Actions
- Spotify dashboard server-side token refresh with snapshot endpoint rate limiting + cache TTL
- Spotify snapshot endpoint rate limiting + cache TTL

## Safe Auth Rollout Plan

1. Deploy backend with:
   - `JWT_SECRET` set
   - `ASK_JOHAN_AUTH_COMPAT_MODE=true`
2. Deploy frontend that uses `/auth/login` + Bearer token.
3. Verify login + ask flow works for users.
4. Set `ASK_JOHAN_AUTH_COMPAT_MODE=false` to fully disable legacy `x-access-code` auth.

## Private context without storing in GitHub

The API loads context in this priority order:

1. `JOHAN_CONTEXT_B64` (preferred, Render secret env var)
2. `JOHAN_CONTEXT` (plain text env var)
3. `JOHAN_CONTEXT_FILE` (absolute or repo-relative file path)
4. `johan-context.private.md` (local file, ignored by git)
5. `johan-context.md` (tracked default file)

Generate `JOHAN_CONTEXT_B64` locally:

```bash
base64 -i /path/to/your/private-context.md | tr -d '\n'
```

Local dev alternative:

1. Copy `johan-context.private.example.md` to `johan-context.private.md`
2. Fill it with private context
3. Set `.env`:

```bash
JOHAN_CONTEXT_FILE=./johan-context.private.md
```
