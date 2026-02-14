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
   - `ASK_JOHAN_ACCESS_CODE` = your private access code

4. Click deploy.

5. After deploy, verify health:
   - Open: `https://<your-render-service>.onrender.com/health`
   - Expected: `{"ok":true}`

## Connect frontend to deployed API

In `johanscv/.env.local`:

```bash
VITE_ASK_JOHAN_MODE=api
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
VITE_SITE_ACCESS_CODE=<same_as_ASK_JOHAN_ACCESS_CODE>
```

Then redeploy frontend:

```bash
cd /Users/johanniemannhusbjerg/Desktop/WEBSITE/johanscv
npm run deploy
```

## Notes on free uptime

- Free instances may spin down after inactivity.
- First request after idle can be slow (cold start).
- For true always-on behavior, use a paid always-on plan.
