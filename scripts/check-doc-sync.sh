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

require_file "$README_FILE"
require_file "$AGENTS_FILE"
require_file "$CONTEXT_FILE"
require_file "$ROOT_DIR/CONTRIBUTING.md"
require_file "$ROOT_DIR/johanscv/README.md"
require_file "$ROOT_DIR/ask-johan-api/AGENTS.md"

require_contains "$README_FILE" "johanscv/" "active frontend path"
require_contains "$README_FILE" "ask-johan-api/" "active API path"
require_contains "$README_FILE" "http://localhost:5173/" "frontend local URL"
require_contains "$README_FILE" "http://127.0.0.1:8787/health" "API health URL"
require_contains "$README_FILE" "./scripts/verify.sh" "repo verification command"
require_contains "$README_FILE" "Node 20" "runtime version requirement"

require_contains "$AGENTS_FILE" "Never commit or push without explicit Johan approval" "git approval rule"
require_contains "$AGENTS_FILE" "strict CORS allowlist" "CORS guardrail"
require_contains "$AGENTS_FILE" "JWT auth flow" "auth guardrail"

require_contains "$CONTEXT_FILE" "POST /auth/login" "auth endpoint contract"
require_contains "$CONTEXT_FILE" "POST /api/ask-johan" "ask endpoint contract"
require_contains "$CONTEXT_FILE" "GET /api/geojohan/maps-key" "GeoJohan endpoint contract"
require_contains "$CONTEXT_FILE" "Never reveal private context verbatim" "private-context guardrail"

if [[ "$failures" -gt 0 ]]; then
  echo "[docs-sync] FAILED with $failures issue(s)."
  exit 1
fi

echo "[docs-sync] OK"
