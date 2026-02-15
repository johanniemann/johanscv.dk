# AGENTS.md (Repo Root)

## Purpose
- This repository contains Johan's portfolio frontend and Ask Johan API.
- Optimize for safe, incremental changes that keep current production deploys working:
  - Frontend: GitHub Pages via `johanscv/`
  - API: Render via `ask-johan-api/`

## Ground Rules
- Do not break existing deploy paths or runtime behavior.
- Prefer small, reviewable changes.
- Verify changes with real commands before claiming success.
- If uncertain, inspect repository files and state uncertainty explicitly.
- In explanations, cite concrete file paths.

## Repo Map and Boundaries
- `johanscv/`: active frontend app.
- `ask-johan-api/`: active backend API.
- `.github/workflows/ci.yml`: CI runs frontend build and API tests.
- `render.yaml`: Render blueprint for API deployment.
- `legacy/root-src/` and `public/` at repo root: legacy prototype assets; not used by active build/deploy pipelines.
- `legacy/README.md`: notes on legacy status.

## Standard Workflow
- Frontend:
  - `cd johanscv`
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run deploy`
- API:
  - `cd ask-johan-api`
  - `npm install`
  - `npm run dev` (watch mode) or `npm run start`
  - `npm test`

## Environment Variables
- Frontend (`johanscv/.env.local`, see `johanscv/.env.local.example`):
  - `VITE_ASK_JOHAN_MODE`
  - `VITE_API_BASE_URL`
  - `VITE_SITE_ACCESS_CODE`
- Frontend build-time toggle (shell env in command):
  - `CUSTOM_DOMAIN` (used by `johanscv/vite.config.js`)
- API (`ask-johan-api/.env`, see `ask-johan-api/.env.example`):
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `PORT`
  - `ASK_JOHAN_ACCESS_CODE`
  - `JWT_SECRET`
  - `ASK_JOHAN_JWT_TTL`
  - `ASK_JOHAN_AUTH_COMPAT_MODE`
  - `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`
  - `ASK_JOHAN_AUTH_FAIL_MAX`
  - `ASK_JOHAN_USAGE_STORE`
  - `REDIS_URL`
  - `ASK_JOHAN_REDIS_KEY_PREFIX`
  - `MAX_QUESTION_CHARS`
  - `ASK_JOHAN_DAILY_CAP`
  - `ALLOWED_ORIGINS`
  - `ASK_JOHAN_TIMEOUT_MS`
  - `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`
  - `ASK_JOHAN_RATE_LIMIT_MAX`
  - Context sources:
    - `JOHAN_CONTEXT_B64`
    - `JOHAN_CONTEXT`
    - `JOHAN_CONTEXT_FILE`

## Known Gotchas
- Legacy frontend code now lives in `legacy/root-src/`; active frontend code is under `johanscv/src/`.
- Frontend base path defaults to `/johanscv.dk/`; local dev URL usually includes that path unless `CUSTOM_DOMAIN=true`.
- Render free plan can cold start after inactivity; first API call may be slower.
- API CORS allowlist is controlled by `ALLOWED_ORIGINS`; keep it aligned with deployed frontend origins.

## Output Conventions for Future Tasks
- Report:
  - Files changed
  - Commands run
  - Pass/fail status for each command
  - Any unresolved items requiring human input
- Do not claim success without running the relevant command(s).
