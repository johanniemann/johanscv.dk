#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

failures=0

require_file() {
  local file_path="$1"
  if [[ ! -f "$file_path" ]]; then
    echo "[docs-sync] Missing required file: ${file_path#$ROOT_DIR/}"
    failures=$((failures + 1))
  fi
}

require_contains() {
  local file_path="$1"
  local snippet="$2"
  local label="$3"
  if ! grep -Fq "$snippet" "$file_path"; then
    echo "[docs-sync] Missing snippet in ${file_path#$ROOT_DIR/}: $label"
    failures=$((failures + 1))
  fi
}

README_FILE="$ROOT_DIR/README.md"
AGENTS_FILE="$ROOT_DIR/AGENTS.md"
CONTEXT_FILE="$ROOT_DIR/AGENTS-CONTEXT.md"
API_AGENTS_FILE="$ROOT_DIR/johanscv.dk-api/AGENTS.md"
PUBLIC_CONTEXT_FILE="$ROOT_DIR/johanscv.dk-api/johan-context.md"
PRIVATE_CONTEXT_TEMPLATE_FILE="$ROOT_DIR/johanscv.dk-api/johan-context.private.example.md"
AZURE_DEPLOY_DOC="$ROOT_DIR/johanscv.dk-api/DEPLOY_AZURE.md"

require_file "$README_FILE"
require_file "$AGENTS_FILE"
require_file "$CONTEXT_FILE"
require_file "$ROOT_DIR/CONTRIBUTING.md"
require_file "$ROOT_DIR/johanscv/README.md"
require_file "$API_AGENTS_FILE"
require_file "$PUBLIC_CONTEXT_FILE"
require_file "$PRIVATE_CONTEXT_TEMPLATE_FILE"
require_file "$ROOT_DIR/scripts/verify-node24.sh"
require_file "$AZURE_DEPLOY_DOC"

require_contains "$README_FILE" "johanscv/" "active frontend path"
require_contains "$README_FILE" "johanscv.dk-api/" "active API path"
require_contains "$README_FILE" "http://localhost:5173/" "frontend local URL"
require_contains "$README_FILE" "http://127.0.0.1:8787/health" "API health URL"
require_contains "$README_FILE" "./scripts/verify.sh" "repo verification command"
require_contains "$README_FILE" "./scripts/verify-node24.sh" "node24 wrapper verification command"
require_contains "$README_FILE" "Node 24" "runtime version requirement"
require_contains "$README_FILE" "Azure App Service" "active backend hosting reference"
require_contains "$README_FILE" 'malformed JSON -> `400`' "API malformed JSON contract"
require_contains "$README_FILE" 'oversized JSON body (> `8kb`) -> `413`' "API body size contract"
require_contains "$README_FILE" "archive/legacy-frontend-prototype/" "legacy archive path"

require_contains "$AGENTS_FILE" "Never commit or push without explicit Johan approval" "git approval rule"
require_contains "$AGENTS_FILE" "strict CORS allowlist" "CORS guardrail"
require_contains "$AGENTS_FILE" "JWT auth flow" "auth guardrail"
require_contains "$AGENTS_FILE" "request body guardrails" "request body guardrail"
require_contains "$AGENTS_FILE" "./scripts/verify-node24.sh" "node24 wrapper mention"
require_contains "$AGENTS_FILE" "Azure App Service" "Azure hosting reference"
require_contains "$AGENTS_FILE" "archive/legacy-frontend-prototype/" "legacy archive path"

require_contains "$CONTEXT_FILE" "POST /auth/login" "auth endpoint contract"
require_contains "$CONTEXT_FILE" "POST /api/ask-johan" "ask endpoint contract"
require_contains "$CONTEXT_FILE" "GET /api/geojohan/maps-key" "GeoJohan endpoint contract"
require_contains "$CONTEXT_FILE" "Never reveal private context verbatim" "private-context guardrail"
require_contains "$CONTEXT_FILE" 'malformed JSON -> `400`; request body above `8kb` -> `413`' "ask endpoint validation contract"
require_contains "$CONTEXT_FILE" "./scripts/verify-node24.sh" "node24 wrapper mention"
require_contains "$CONTEXT_FILE" "Azure App Service" "Azure hosting reference"
require_contains "$CONTEXT_FILE" "archive/legacy-frontend-prototype/root-src/" "legacy archive path"

require_contains "$API_AGENTS_FILE" "malformed JSON handling + request body-size limit handling" "API request-body guardrail"
require_contains "$PUBLIC_CONTEXT_FILE" 'Active frontend: `johanscv/`' "public context active frontend path"
require_contains "$PUBLIC_CONTEXT_FILE" 'Active API: `johanscv.dk-api/`' "public context active API path"
require_contains "$PUBLIC_CONTEXT_FILE" "Azure App Service" "public context Azure hosting reference"
require_contains "$PRIVATE_CONTEXT_TEMPLATE_FILE" "Do not put API keys, tokens, access codes, JWT secrets" "private template secret warning"
require_contains "$AZURE_DEPLOY_DOC" "Azure App Service" "Azure deployment guide title"

if [[ "$failures" -gt 0 ]]; then
  echo "[docs-sync] FAILED with $failures issue(s)."
  exit 1
fi

echo "[docs-sync] OK"
