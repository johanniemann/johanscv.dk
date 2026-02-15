# AGENTS.md (API: ask-johan-api)

## Purpose
- This folder is the active Ask Johan backend API (Node + Express + OpenAI).
- Optimize for safe request validation, predictable JSON responses, and Render compatibility.

## Ground Rules
- Keep endpoint contracts stable unless explicitly requested.
- Do not expose secrets in code or docs.
- Validate behavior by running tests and at least one runtime smoke command.
- If uncertain, inspect code/config first and state uncertainty explicitly.

## Truth Sources / Boundaries
- Scripts/deps: `ask-johan-api/package.json`
- Server entry and env wiring: `ask-johan-api/index.js`
- Route/middleware logic: `ask-johan-api/app.js`
- Tests: `ask-johan-api/test/api.test.js`
- Deploy config: `render.yaml`
- Deploy docs: `ask-johan-api/DEPLOY_RENDER.md`

## Standard Workflow
- Install:
  - `npm install`
- Dev (watch):
  - `npm run dev`
- Start:
  - `npm run start`
- Tests:
  - `npm test`

Run all commands from:
- `cd /Users/johanniemannhusbjerg/Desktop/WEBSITE/ask-johan-api`

## Environment Variables
- Local file: `ask-johan-api/.env` (template: `ask-johan-api/.env.example`)
- Core vars:
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
- Context vars (loaded in priority order in `index.js`):
  - `JOHAN_CONTEXT_B64`
  - `JOHAN_CONTEXT`
  - `JOHAN_CONTEXT_FILE`
  - fallback files: `johan-context.private.md` then `johan-context.md`

## Known Gotchas
- API returns responses as `{ answer: string }` for both success and handled errors.
- JWT auth is now primary (`POST /auth/login` then `Authorization: Bearer <token>` on ask route).
- `x-access-code` is compatibility-only and controlled by `ASK_JOHAN_AUTH_COMPAT_MODE`.
- CORS allowlist is strict; ensure `ALLOWED_ORIGINS` includes actual frontend origins.
- Render blueprint defaults `ALLOWED_ORIGINS` to `https://johanniemann.github.io,https://johanscv.dk`; adjust if your served origins change.
- Free Render instances may cold start after inactivity.

## Output Conventions for API Tasks
- Report changed files and why.
- Report commands run and pass/fail:
  - at minimum `npm test`
  - plus `npm run start` or `npm run dev` smoke status.
- Include endpoint used for smoke checks (e.g., `/health`) when relevant.
- Do not claim runtime success without command evidence.
