# Deploy Ask Johan API on Azure App Service

This deploys `johanscv.dk-api` to Azure App Service.

## Current Production Target

- Subscription type: Azure for Students
- Resource group: `johanscv-rg-no`
- Web App: `johanscv-api-johu0002-no`
- Plan: `ASP-johanscvrgno-b13f` (`Basic B1`)
- Region: `Norway East`
- Runtime: `Node 24 LTS`
- Health URL: `https://johanscv-api-johu0002-no.azurewebsites.net/health`

## Required Azure App Service Settings

App Service configuration that must stay enabled:
- `Always On` = `On`
- `Health check path` = `/health`
- Runtime stack = `NODE|24-lts`
- Startup command = empty (`appCommandLine` should be blank)

Required application settings:
- `NODE_ENV=production`
- `SCM_DO_BUILD_DURING_DEPLOYMENT=false`
- `OPENAI_MODEL=gpt-4.1-mini`
- `MAX_QUESTION_CHARS=800`
- `ALLOWED_ORIGINS=https://johanniemann.github.io,https://johanscv.dk,https://www.johanscv.dk`
- `ASK_JOHAN_DAILY_CAP=100`
- `ASK_JOHAN_TIMEOUT_MS=15000`
- `ASK_JOHAN_RATE_LIMIT_WINDOW_MS=60000`
- `ASK_JOHAN_RATE_LIMIT_MAX=30`
- `UPDATES_SIGNUP_RATE_LIMIT_WINDOW_MS=60000`
- `UPDATES_SIGNUP_RATE_LIMIT_MAX=8`
- `UPDATES_SIGNUP_DAILY_CAP=20`
- `APP_BASE_URL=https://johanscv.dk`
- `SPOTIFY_SCOPES=user-read-recently-played`
- `SPOTIFY_SESSION_COOKIE_NAME=johanscv_spotify_sid`
- `SPOTIFY_SESSION_TTL_MS=604800000`
- `SPOTIFY_PKCE_TTL_MS=600000`
- `SPOTIFY_SNAPSHOT_CACHE_TTL_MS=600000`
- `SPOTIFY_REQUEST_TIMEOUT_MS=12000`
- `SPOTIFY_RATE_LIMIT_WINDOW_MS=60000`
- `SPOTIFY_RATE_LIMIT_MAX=20`
- `SPOTIFY_DAILY_CAP=100`
- `ASK_JOHAN_AUTH_FAIL_WINDOW_MS=600000`
- `ASK_JOHAN_AUTH_FAIL_MAX=10`
- `ASK_JOHAN_USAGE_STORE=memory`
- `ASK_JOHAN_AUTH_COMPAT_MODE=false`
- `ASK_JOHAN_JWT_TTL=7d`
- `UPDATES_AUTOMATION_TOKEN=<shared-secret-for-deploy-triggers>`

Secret application settings that must remain configured in Azure only:
- `OPENAI_API_KEY`
- `JOHANSCV_ACCESS_CODE`
- `JWT_SECRET`
- `SESSION_SECRET`
- `GEOJOHAN_MAPS_API_KEY`
- `JOHAN_CONTEXT_B64`
- `RESEND_API_KEY`
- `RESEND_UPDATES_FROM_EMAIL`
- optional: `RESEND_UPDATES_REPLY_TO_EMAIL`
- `RESEND_UPDATES_SEGMENT_ID`
- `RESEND_TOPIC_PROJECTS_ID`
- `RESEND_TOPIC_RESUME_ID`
- `RESEND_TOPIC_INTERACTIVE_SERVICES_ID`
- optional but recommended for shared broadcast state/logging: `REDIS_URL`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_OWNER_REFRESH_TOKEN`
- optional: `SPOTIFY_REDIRECT_URI`, `REDIS_URL`

Resend setup required for updates signup:
- create the three Topics in Resend as `opt_out`
- create one Segment for all website-update subscribers and store its ID in `RESEND_UPDATES_SEGMENT_ID`
- wire the matching topic IDs into the Azure application settings above
- configure `RESEND_UPDATES_FROM_EMAIL` with a verified sender address/domain
- verify the sender domain in Resend before sending broadcasts from production
- keep `UPDATES_AUTOMATION_TOKEN` identical across Azure App Service and the GitHub repo secret of the same name

Mail behavior:
- first-time signup sends a welcome email automatically from the API
- protected deploy/workflow triggers call `POST /api/updates-signup/auto-broadcast` on the API
- the API centrally generates the update mail from commit/diff metadata, dedupes by commit/topic, logs the result, and sends via Resend
- frontend deploys via `cd johanscv && npm run deploy` automatically try to notify that endpoint from the latest commit/diff
- API deploys via `cd johanscv.dk-api && npm run deploy:azure` deploy and then notify that same endpoint
- manual fallback still exists with `npm run updates:broadcast -- ...` from `johanscv.dk-api/`

Do not set `PORT` in Azure App Service.

## Deploy Workflow

1. Authenticate to Azure:

```bash
az login
az account set --subscription e974d793-d379-49ea-ac29-0c067ba6bd37
```

2. Install API dependencies locally:

```bash
cd johanscv.dk-api
npm ci
```

3. Build a self-contained deployment zip from `johanscv.dk-api/`.
   This repo uses pure-JS dependencies, so shipping `node_modules/` is the most predictable App Service deploy path here.

```bash
cd /Users/johanniemannhusbjerg/Desktop/johanscv.dk/WEBSITE/johanscv.dk-api
rm -f /tmp/ask-johan-api-with-modules.zip
zip -r /tmp/ask-johan-api-with-modules.zip . \
  -x ".git/*" ".env" "johan-context.private.md"
```

4. Deploy the zip to Azure App Service:

```bash
az webapp deploy \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no \
  --src-path /tmp/ask-johan-api-with-modules.zip \
  --type zip
```

5. Restart the app if needed:

```bash
az webapp restart \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no
```

## Verify After Deploy

```bash
curl -i https://johanscv-api-johu0002-no.azurewebsites.net/health
curl -i https://johanscv-api-johu0002-no.azurewebsites.net/
```

Expected:
- `/health` returns `200` with `{"ok":true}`
- `/` returns the endpoint listing JSON
- `POST /api/updates-signup/auto-broadcast` is available when `UPDATES_AUTOMATION_TOKEN` is configured

For live App Service logs:

```bash
az webapp log tail \
  --resource-group johanscv-rg-no \
  --name johanscv-api-johu0002-no
```

## Frontend Alignment

The frontend production build must point to the Azure backend:

```bash
# johanscv/.env.production
VITE_ASK_JOHAN_MODE=api
VITE_API_BASE_URL=https://johanscv-api-johu0002-no.azurewebsites.net
```

Redeploy frontend after API changes:

```bash
cd /Users/johanniemannhusbjerg/Desktop/johanscv.dk/WEBSITE/johanscv
CUSTOM_DOMAIN=true npm run deploy
```

## Local One-Command Deploy Helper

For the existing local Azure CLI path, use:

```bash
cd /Users/johanniemannhusbjerg/Desktop/johanscv.dk/WEBSITE/johanscv.dk-api
npm run deploy:azure
```

It will:
1. run `npm ci`
2. build the deployment zip
3. deploy Azure App Service
4. notify the central updates mail endpoint

Optional local env overrides:
- `AZURE_RESOURCE_GROUP`
- `AZURE_WEBAPP_NAME`
- `AZURE_DEPLOY_ZIP_PATH`
- `UPDATES_AUTO_BROADCAST=false` to skip mail notification

## GitHub Actions Deploy

The repo now also contains `.github/workflows/deploy-api.yml`.

Required GitHub secrets:
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `UPDATES_AUTOMATION_TOKEN`

Behavior:
1. Push to `main`
2. Workflow packages `johanscv.dk-api/`
3. Workflow deploys Azure App Service
4. Workflow notifies the same central updates mail endpoint
