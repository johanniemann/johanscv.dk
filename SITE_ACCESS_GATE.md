# Site Access Gate

## Current Intent
- The production site is intentionally in temporary public mode.
- Do not remove the underlying auth flow.
- The goal is to be able to restore the password gate quickly with two small toggle changes.

## Re-Enable The Password Gate
1. Frontend: in `johanscv/.env.production`, set `VITE_SITE_GATE_BYPASS=false` or remove that line.
2. API: in `johanscv.dk-api/src/server/start-server.js`, set `const publicSiteAccessEnabled = false`.
3. Deploy both frontend and API together.

## Disable The Password Gate Again
1. Frontend: in `johanscv/.env.production`, set `VITE_SITE_GATE_BYPASS=true`.
2. API: in `johanscv.dk-api/src/server/start-server.js`, set `const publicSiteAccessEnabled = true`.
3. Deploy both frontend and API together.

## Why Both Sides Must Change
- Frontend controls whether the welcome/password screen is shown.
- API controls whether `/auth/login` still requires the real access code before issuing the JWT used by Ask Johan, GeoJohan, and Spotify dashboard requests.
- Changing only one side creates a partial or broken state.

## Search Terms For Future Sessions
- `VITE_SITE_GATE_BYPASS`
- `publicSiteAccessEnabled`
- `SITE_ACCESS_GATE.md`

## Minimum Verification After Toggling
- `./scripts/verify-node24.sh`
- `cd johanscv && npm audit --omit=dev`
- `cd johanscv.dk-api && npm audit --omit=dev`
- Local runtime smoke:
  - frontend `http://localhost:5173/`
  - API `POST /auth/login`
  - API `POST /api/ask-johan`
  - API `GET /api/geojohan/maps-key`
  - API `GET /api/music-dashboard/snapshot`
