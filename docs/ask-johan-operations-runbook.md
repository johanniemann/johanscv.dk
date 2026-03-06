# Ask Johan Operations Runbook

Use this when Ask Johan fails in production (`johanscv.dk` + Azure App Service API).

Current production backend:
- Resource group: `johanscv-rg-no`
- Web App: `johanscv-api-johu0002-no`
- Health URL: `https://johanscv-api-johu0002-no.azurewebsites.net/health`

Current API structure (for navigation during incidents):
- Entrypoint: `johanscv.dk-api/index.js` -> `johanscv.dk-api/src/server/start-server.js`
- App wiring: `johanscv.dk-api/src/app/create-app.js`
- Feature handlers: `johanscv.dk-api/src/features/auth.js`, `johanscv.dk-api/src/features/ask-johan.js`, `johanscv.dk-api/src/features/geojohan.js`
- Runtime/env/context parsing: `johanscv.dk-api/src/config/runtime-config.js`
- Usage store: `johanscv.dk-api/src/server/usage-store.js`

## 1) User sees "Access code is required to use Ask Johan."

Checks:
- Confirm API runtime access code is set:
  - `JOHANSCV_ACCESS_CODE` (primary)
  - `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
- If access code is missing, `/auth/login` fails closed with a server configuration error.
- In API mode, site access is validated server-side via `POST /auth/login`.
- Confirm latest frontend is deployed to GitHub Pages.
- Confirm browser local storage is refreshed:
  - remove `johanscv.askJohanAccessCode`
  - remove `johanscv.siteAccessGranted`
  - hard refresh page

GeoJohan note:
- GeoJohan maps key comes from authenticated API endpoint `GET /api/geojohan/maps-key`.
- Confirm `GEOJOHAN_MAPS_API_KEY` is set in Azure App Service application settings.
- Legacy fallback env names are supported for recovery (`GOOGLE_MAPS_API_KEY`, `ASK_JOHAN_MAPS_API_KEY`), but migrate back to `GEOJOHAN_MAPS_API_KEY`.

## 2) Repeated `401` in Azure logs

Checks:
- Confirm `JWT_SECRET` exists in Azure App Service application settings.
- Confirm frontend is using `/auth/login` and `Authorization: Bearer <token>`.
- If you recently changed access code, expect users with stale local storage to fail until re-login.

Azure views to use:
- Portal: `Web App -> Monitoring -> Log stream`
- CLI:

```bash
az webapp log tail \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no
```

## 3) Repeated `429` in Azure logs

Checks:
- Request rate cap: `ASK_JOHAN_RATE_LIMIT_MAX` / `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`
- Daily cap: `ASK_JOHAN_DAILY_CAP` (default `100` per IP/day)
- Failed auth cap: `ASK_JOHAN_AUTH_FAIL_MAX` / `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`

Action:
- If legitimate traffic is blocked, raise caps gradually and monitor logs.

## 4) Browser CORS errors

Checks:
- `ALLOWED_ORIGINS` must list exact production origins (comma-separated).
- Keep localhost dev origins only for local testing.
- Do not use wildcard `*`.

Expected production origins:
- `https://johanniemann.github.io`
- `https://johanscv.dk`
- `https://www.johanscv.dk`

## 5) Azure App Service startup problems

Checks:
- `Always On` must be `On`.
- `Health check path` must be `/health`.
- Runtime must be `NODE|24-lts`.
- `appCommandLine` / startup command should be blank.
- `SCM_DO_BUILD_DURING_DEPLOYMENT` should stay `false` for the current self-contained zip deploy flow.

Useful commands:

```bash
az webapp show \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no \
  --query '{state:state, hostNames:hostNames}'

az webapp restart \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no
```

## 6) Quick local verification before deploy

From repo root:

```bash
./scripts/verify.sh
```

This runs frontend build, API tests, and an API smoke flow (`/health` + `/auth/login` + protected ask).

## 7) Secret rotation playbook (high level)

Use this whenever a key/code may have leaked.

1. Rotate secrets in providers first:
- OpenAI API key (OpenAI dashboard).
- Google Maps browser key (Google Cloud Console).
- Azure App Service application settings: `JOHANSCV_ACCESS_CODE` (and remove `ASK_JOHAN_ACCESS_CODE` after migration), `JWT_SECRET`, and any context/env secrets.

2. Update runtime config:
- Azure App Service: set new values in Application Settings and restart or redeploy.
- Local dev: update `.env` / `.env.local` (never commit these files).

3. Invalidate stale sessions:
- Rotating `JWT_SECRET` forces re-login (old JWTs become invalid).
- Rotating `JOHANSCV_ACCESS_CODE` invalidates previously saved access codes until users log in again.

4. Verify:
- Run `./scripts/verify.sh`.
- Confirm `/auth/login` works and protected ask endpoint returns `200`.
