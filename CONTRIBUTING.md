# Contributing

## Development Workflow

1. Make focused changes in the relevant app folder (`johanscv/` or `ask-johan-api/`).
2. Verify locally before opening a PR:
   - Fast path: `./scripts/verify.sh`
   - Manual split:
     - Frontend: `cd johanscv && npm run lint && npm run smoke && npm run build`
     - API: `cd ask-johan-api && npm test`
3. Keep secrets out of Git:
   - Use `.env` files locally
   - Use Render/GitHub secret settings for hosted values

## Commit Scope

- Prefer small, reviewable commits.
- Do not mix unrelated frontend/backend changes in one commit unless required.

## Legacy Code

- `legacy/root-src/` and root-level `public/` are legacy references.
- Active production code lives in `johanscv/` and `ask-johan-api/`.

## Architecture Notes

- Frontend feature modules:
  - `johanscv/src/features/ask-johan/`
  - `johanscv/src/features/geojohan/`
- API layered modules:
  - `ask-johan-api/src/config/`
  - `ask-johan-api/src/app/`
  - `ask-johan-api/src/features/`
  - `ask-johan-api/src/server/`
  - `ask-johan-api/src/shared/`

## Secret Scanning (Local)

- Preferred:
  - `gitleaks detect --no-git --source . --redact`
- Fallback:
  - `rg -n --hidden --glob '!.git' '(?i)(api[_-]?key|secret|token|password|sk-[A-Za-z0-9]{20,}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----)'`
