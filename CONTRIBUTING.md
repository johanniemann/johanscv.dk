# Contributing

## Development Workflow

1. Make focused changes in the relevant app folder (`johanscv/` or `ask-johan-api/`).
2. Align local runtime to Node 20 before release verification:
   - `nvm use 20`
   - or run `./scripts/verify-node20.sh` (uses Node 20 when available and then runs full verify)
3. Verify locally before opening a PR:
   - Fast path: `./scripts/verify.sh`
   - Manual split:
     - Frontend: `cd johanscv && npm run lint && npm run smoke && npm run build && npm run check:bundle`
     - API: `cd ask-johan-api && npm test`
   - Guardrails:
     - `./scripts/check-node-alignment.sh`
     - `./scripts/check-doc-sync.sh`
     - `./scripts/scan-secrets.sh`
4. Keep secrets out of Git:
   - Use `.env` files locally
   - Use Render/GitHub secret settings for hosted values
   - Exception: `johanscv/.env.production` is tracked and must contain only non-secret public frontend values

## Commit Scope

- Prefer small, reviewable commits.
- Do not mix unrelated frontend/backend changes in one commit unless required.

## Legacy Code

- `archive/legacy-frontend-prototype/root-src/` and `archive/root-public-placeholders/` are legacy references.
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

- Default:
  - `./scripts/scan-secrets.sh`
- Optional stronger local scan (if gitleaks is installed):
  - `gitleaks detect --no-git --source . --redact`
