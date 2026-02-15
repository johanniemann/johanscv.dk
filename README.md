# WEBSITE Monorepo

Personal website stack for Johan with a static frontend and a separate Ask Johan API.

## What This Repo Contains

| Path | Purpose | Status |
| --- | --- | --- |
| `johanscv/` | Active frontend SPA (Vite + Vanilla JS + Tailwind), deployed to GitHub Pages | Active |
| `ask-johan-api/` | Active backend API (Node/Express/OpenAI), deployed to Render | Active |
| `legacy/root-src/` | Old prototype frontend source tree moved from repo root | Legacy (not used by CI/deploy) |
| `public/` | Old prototype public folder at repo root | Legacy (not used by CI/deploy) |
| `.github/workflows/ci.yml` | CI pipeline: frontend build + backend tests | Active |
| `render.yaml` | Render blueprint for `ask-johan-api` | Active |

Notes:
- No standalone `quizsite/` app directory is currently present in this repository.
- Legacy assets are documented in `legacy/README.md`.

## Runtime & Deployment Model

1. Frontend:
   - Folder: `johanscv/`
   - Deploy target: GitHub Pages (`gh-pages` branch)
   - Config: `johanscv/vite.config.js`, `johanscv/DEPLOYMENT.md`

2. API:
   - Folder: `ask-johan-api/`
   - Deploy target: Render web service
   - Config: `render.yaml`, `ask-johan-api/DEPLOY_RENDER.md`

## Local Development

### Frontend

```bash
cd johanscv
npm install
cp .env.local.example .env.local
npm run dev
```

Default local URL with current base path:
- `http://localhost:5173/johanscv.dk/`

### API

```bash
cd ask-johan-api
npm install
cp .env.example .env
npm run dev
```

Health check:

```bash
curl -s http://127.0.0.1:8787/health
```

## Environment Variables

Frontend (`johanscv/.env.local`):
- `VITE_ASK_JOHAN_MODE` (`mock` or `api`)
- `VITE_API_BASE_URL`
- `VITE_SITE_ACCESS_CODE`
- `VITE_GOOGLE_MAPS_API_KEY` (GeoJohan map + Street View)

API (`ask-johan-api/.env`):
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `PORT`
- `ASK_JOHAN_ACCESS_CODE`
- `JWT_SECRET`
- `ASK_JOHAN_JWT_TTL`
- `ASK_JOHAN_AUTH_COMPAT_MODE`
- `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`
- `ASK_JOHAN_AUTH_FAIL_MAX`
- `ASK_JOHAN_USAGE_STORE` (`memory` or `redis`)
- `REDIS_URL` (required only when using `redis` store)
- `ASK_JOHAN_REDIS_KEY_PREFIX` (optional)
- `MAX_QUESTION_CHARS`
- `ASK_JOHAN_DAILY_CAP`
- `ALLOWED_ORIGINS`
- `ASK_JOHAN_TIMEOUT_MS`
- `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`
- `ASK_JOHAN_RATE_LIMIT_MAX`
- One context source:
  - `JOHAN_CONTEXT_B64` (recommended)
  - `JOHAN_CONTEXT`
  - `JOHAN_CONTEXT_FILE`

## Build & Verification

Frontend:

```bash
cd johanscv
npm run lint
npm run smoke
npm run build
```

API tests:

```bash
cd ask-johan-api
npm test
```

One-command verify (repo root):

```bash
./scripts/verify.sh
```

## Secret Scan Before Push

Preferred (if installed locally):

```bash
gitleaks detect --no-git --source . --redact
```

Fallback (quick local heuristic scan):

```bash
rg -n --hidden --glob '!.git' '(?i)(api[_-]?key|secret|token|password|sk-[A-Za-z0-9]{20,}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----)'
```

## Deployment Quick Links

- Frontend deploy instructions: `johanscv/DEPLOYMENT.md`
- API deploy instructions: `ask-johan-api/DEPLOY_RENDER.md`
- Operations runbook: `docs/ask-johan-operations-runbook.md`
