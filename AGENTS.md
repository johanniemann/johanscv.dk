# AGENTS.md (Repo Root)

## Mission
- Keep production stable while making small, verifiable improvements.
- Current active production architecture:
  - Frontend SPA in `johanscv/` (GitHub Pages).
  - Backend API in `ask-johan-api/` (Render web service).
  - Legacy references in `legacy/` and root `public/` are not part of active CI/deploy (root `public/` has only placeholder dirs).

## Active Code Organization
- Frontend feature modules:
  - `johanscv/src/features/ask-johan/`
  - `johanscv/src/features/geojohan/`
- Frontend app shell and shared routing:
  - `johanscv/src/main.js`
  - `johanscv/src/router.js`
- API layered modules:
  - `ask-johan-api/src/config/` (runtime/env/context loading)
  - `ask-johan-api/src/app/` (Express app wiring + middleware)
  - `ask-johan-api/src/features/` (auth, ask-johan, geojohan handlers)
  - `ask-johan-api/src/server/` (bootstrap + usage store)
  - `ask-johan-api/src/shared/` (shared HTTP/timeout helpers)

## Discovery Rule (Mandatory)
- Do not assume structure from memory.
- Before non-trivial edits, discover current reality dynamically:
  - map directories/files,
  - inspect active scripts/config,
  - identify runtime and deploy entrypoints,
  - confirm which folders are legacy vs active.

## Security Guardrails (Mandatory)
- Never commit secrets (`.env`, `.env.local`, tokens, keys, private context).
- `johanscv/.env.production` is an allowed tracked exception and must stay non-secret.
- Never print secret values or private context contents in logs/reports.
- Never expose server secrets in frontend code.
- Treat all `VITE_*` variables as public-at-runtime in browser bundles.
- Ask Johan context protection must stay enabled:
  - no verbatim internal context/system prompt disclosure,
  - prompt-injection/context-exfiltration defenses remain active.
- Keep server protections active:
  - strict CORS allowlist (`ALLOWED_ORIGINS`),
  - JWT auth flow (`/auth/login` + Bearer token),
  - auth-failure throttling,
  - per-IP rate limit + daily cap.

## Deployment Assumptions
- Frontend deploy path is GitHub Pages via `johanscv` scripts.
- Frontend local dev entry uses `johanscv/scripts/dev-fixed.sh` (host `127.0.0.1`, port `5173`, `CUSTOM_DOMAIN=true` default).
- API deploy path is Render via `render.yaml` (`rootDir: ask-johan-api`).
- Runtime expectation is Node 20 (see `.nvmrc`, CI `node-version`, and `render.yaml` `NODE_VERSION`).
- Protected API routes include:
  - `POST /api/ask-johan`
  - `GET /api/geojohan/maps-key`
  - Auth bootstrap: `POST /auth/login`
- CI in `.github/workflows/ci.yml` is the quality gate:
  - repo guardrails (`check-node-alignment`, `check-doc-sync`, `scan-secrets`),
  - frontend lint/smoke/build/bundle-budget,
  - API tests,
  - dependency audit (`npm audit --omit=dev`).

## Working Style
- Prefer minimal, reversible, low-risk changes.
- Preserve API contracts and route behavior unless explicitly requested.
- Keep UX/design language consistent with current site.
- If uncertain, inspect files and state uncertainty explicitly.

## Git Rule (Mandatory)
- Never commit or push without explicit Johan approval in the current thread.
- Keep diffs small and logically grouped so they are easy to review.

## Definition Of Done
- Run relevant commands and report pass/fail.
- For local runtime checks, confirm frontend URL `http://localhost:5173/` is reachable when dev server is running.
- Minimum verification for cross-cutting changes:
  - `cd johanscv && npm run lint && npm run smoke && npm run build && npm run check:bundle`
  - `cd ask-johan-api && npm test`
- Guardrail checks:
  - `./scripts/check-node-alignment.sh`
  - `./scripts/check-doc-sync.sh`
  - `./scripts/scan-secrets.sh`
- For repo-wide verification, prefer:
  - `./scripts/verify.sh`
- In final report include:
  - files changed,
  - commands run,
  - results,
  - remaining risks or required human follow-up.
