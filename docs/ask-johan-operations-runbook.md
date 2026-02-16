# Ask Johan Operations Runbook

Use this when Ask Johan fails in production (`johanscv.dk` + Render API).

## 1) User sees "Access code is required to use Ask Johan."

Checks:
- Confirm frontend and backend access codes match:
  - Frontend build-time: `VITE_SITE_ACCESS_CODE`
  - API runtime: `ASK_JOHAN_ACCESS_CODE`
- Confirm latest frontend is deployed to GitHub Pages.
- Confirm browser local storage is refreshed:
  - remove `johanscv.askJohanAccessCode`
  - remove `johanscv.siteAccessGranted`
  - hard refresh page

## 2) Repeated `401` in Render logs

Checks:
- Confirm `JWT_SECRET` exists in Render Environment Variables.
- Confirm frontend is using `/auth/login` and `Authorization: Bearer <token>`.
- If you recently changed access code, expect users with stale local storage to fail until re-login.

## 3) Repeated `429` in Render logs

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

## 5) Quick local verification before deploy

From repo root:

```bash
./scripts/verify.sh
```

This runs frontend build, API tests, and an API smoke flow (`/health` + `/auth/login` + protected ask).

## 6) Secret rotation playbook (high level)

Use this whenever a key/code may have leaked.

1. Rotate secrets in providers first:
- OpenAI API key (OpenAI dashboard).
- Google Maps browser key (Google Cloud Console).
- Render env vars: `ASK_JOHAN_ACCESS_CODE`, `JWT_SECRET`, and any context/env secrets.

2. Update runtime config:
- Render: set new values in Environment Variables and redeploy.
- Local dev: update `.env` / `.env.local` (never commit these files).

3. Invalidate stale sessions:
- Rotating `JWT_SECRET` forces re-login (old JWTs become invalid).
- Rotating `ASK_JOHAN_ACCESS_CODE` requires frontend `VITE_SITE_ACCESS_CODE` to match.

4. Verify:
- Run `./scripts/verify.sh`.
- Confirm `/auth/login` works and protected ask endpoint returns `200`.
