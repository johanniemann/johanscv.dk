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
