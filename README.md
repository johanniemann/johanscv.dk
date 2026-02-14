# WEBSITE Monorepo

Personal website stack for Johan with a static frontend and a separate Ask Johan API.

## What This Repo Contains

| Path | Purpose | Status |
| --- | --- | --- |
| `johanscv/` | Active frontend SPA (Vite + Vanilla JS + Tailwind), deployed to GitHub Pages | Active |
| `ask-johan-api/` | Active backend API (Node/Express/OpenAI), deployed to Render | Active |
| `src/` | Old prototype frontend source tree at repo root | Legacy (not used by CI/deploy) |
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

API (`ask-johan-api/.env`):
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `PORT`
- `ASK_JOHAN_ACCESS_CODE`
- `MAX_QUESTION_CHARS`
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
npm run build
```

API tests:

```bash
cd ask-johan-api
npm test
```

## Deployment Quick Links

- Frontend deploy instructions: `johanscv/DEPLOYMENT.md`
- API deploy instructions: `ask-johan-api/DEPLOY_RENDER.md`

