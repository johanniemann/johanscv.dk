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
   - `JWT_SECRET` = a long random secret for signing JWTs
   - `JOHAN_CONTEXT_B64` = Base64-encoded private Ask Johan context (recommended so context is not in GitHub)
   - Optional safety vars:
     - `ALLOWED_ORIGINS` (comma-separated exact origins)
       - recommended: `https://johanniemann.github.io,https://johanscv.dk,https://www.johanscv.dk`
       - localhost dev origins are allowed automatically by backend localhost checks
     - `ASK_JOHAN_AUTH_COMPAT_MODE` (default `false`; set `true` only for temporary rollout compatibility)
     - `ASK_JOHAN_JWT_TTL` (default `7d`)
     - `ASK_JOHAN_AUTH_FAIL_WINDOW_MS` (default `600000`)
     - `ASK_JOHAN_AUTH_FAIL_MAX` (default `10`)
     - `ASK_JOHAN_DAILY_CAP` (default `100`)
     - `ASK_JOHAN_TIMEOUT_MS` (default `15000`)
     - `ASK_JOHAN_RATE_LIMIT_WINDOW_MS` (default `60000`)
     - `ASK_JOHAN_RATE_LIMIT_MAX` (default `30`)

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

Frontend flow in API mode:
- `VITE_SITE_ACCESS_CODE` unlocks the site and is sent to `POST /auth/login`
- API returns JWT
- Ask requests use `Authorization: Bearer <token>`

Then redeploy frontend:

```bash
cd /Users/johanniemannhusbjerg/Desktop/WEBSITE/johanscv
npm run deploy
```

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
