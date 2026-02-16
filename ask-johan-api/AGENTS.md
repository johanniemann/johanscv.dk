# AGENTS.md (API: ask-johan-api)

## Mission
- Keep Ask Johan API stable, secure, and Render-compatible while making minimal, testable changes.

## Discovery Rule (Mandatory)
- Do not assume endpoints or env wiring from memory.
- Before edits, verify current reality dynamically:
  - server entrypoint,
  - middleware/auth/rate-limit behavior,
  - env loading order,
  - tests and deploy settings.

## Active API Facts
- Runtime: Node + Express + OpenAI Responses API.
- Public endpoints:
  - `GET /health`
  - `GET /`
  - `POST /auth/login`
  - `POST /api/ask-johan`
- Auth model:
  - primary: JWT Bearer (token from `/auth/login`),
  - optional temporary compatibility: `x-access-code` controlled by `ASK_JOHAN_AUTH_COMPAT_MODE`.

## Security Guardrails (Mandatory)
- Never commit/log secrets.
- Keep CORS strict (`ALLOWED_ORIGINS` exact allowlist + localhost dev rule).
- Keep validation/throttling active:
  - content-type + input type/length checks,
  - request rate limiter,
  - failed-auth throttling,
  - daily cap per IP.
- Keep context-protection behavior active:
  - refuse system/developer/internal prompt exfiltration requests,
  - never expose raw private context text verbatim.

## Environment Variables (API)
- Source of truth: `.env.example` + runtime parsing in server code.
- Core:
  - `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
  - `ASK_JOHAN_ACCESS_CODE`, `JWT_SECRET`, `ASK_JOHAN_JWT_TTL`, `ASK_JOHAN_AUTH_COMPAT_MODE`
  - `ASK_JOHAN_AUTH_FAIL_WINDOW_MS`, `ASK_JOHAN_AUTH_FAIL_MAX`
  - `ASK_JOHAN_DAILY_CAP`, `ASK_JOHAN_RATE_LIMIT_WINDOW_MS`, `ASK_JOHAN_RATE_LIMIT_MAX`
  - `ASK_JOHAN_TIMEOUT_MS`, `MAX_QUESTION_CHARS`
  - `ALLOWED_ORIGINS`
  - Usage store:
    - `ASK_JOHAN_USAGE_STORE` (`memory` or `redis`)
    - `REDIS_URL`, `ASK_JOHAN_REDIS_KEY_PREFIX` (when redis mode)
- Context source priority:
  - `JOHAN_CONTEXT_B64`
  - `JOHAN_CONTEXT`
  - `JOHAN_CONTEXT_FILE`
  - local fallback files.

## Definition Of Done (API)
- Run from `ask-johan-api/`:
  - `npm test`
- For runtime-sensitive changes, also run `npm run start` smoke checks for:
  - `/health`
  - `/auth/login`
  - protected `POST /api/ask-johan`
- Never commit/push without explicit Johan approval.
- Final summary must include:
  - changed files,
  - commands + pass/fail,
  - API contract or env impacts.
