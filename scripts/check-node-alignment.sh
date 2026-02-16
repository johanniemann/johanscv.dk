#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CI_FILE="$ROOT_DIR/.github/workflows/ci.yml"
RENDER_FILE="$ROOT_DIR/render.yaml"

failures=0

expected_raw="$(tr -d '[:space:]' < "$ROOT_DIR/.nvmrc" 2>/dev/null || true)"
if [[ -z "$expected_raw" ]]; then
  echo "[node-alignment] Missing or empty .nvmrc"
  exit 1
fi
expected_major="${expected_raw%%.*}"

echo "[node-alignment] Expected Node major: $expected_major (from .nvmrc)"

ci_versions=()
while IFS= read -r value; do
  ci_versions+=("$value")
done < <(sed -nE 's/.*node-version:[[:space:]]*"?([0-9][0-9]*).*/\1/p' "$CI_FILE")
if [[ ${#ci_versions[@]} -eq 0 ]]; then
  echo "[node-alignment] Could not find node-version entries in $CI_FILE"
  failures=$((failures + 1))
else
  for value in "${ci_versions[@]}"; do
    if [[ "$value" != "$expected_major" ]]; then
      echo "[node-alignment] CI node-version mismatch: found $value, expected $expected_major"
      failures=$((failures + 1))
    fi
  done
fi

render_node_version="$(
  sed -n '/key:[[:space:]]*NODE_VERSION/{n;s/.*value:[[:space:]]*//;s/"//g;p;q;}' "$RENDER_FILE"
)"
if [[ -z "$render_node_version" ]]; then
  echo "[node-alignment] Could not find NODE_VERSION value in $RENDER_FILE"
  failures=$((failures + 1))
elif [[ "$render_node_version" != "$expected_major" ]]; then
  echo "[node-alignment] Render NODE_VERSION mismatch: found $render_node_version, expected $expected_major"
  failures=$((failures + 1))
fi

for package_file in "$ROOT_DIR/johanscv/package.json" "$ROOT_DIR/ask-johan-api/package.json"; do
  engines_node="$(
    node -e '
      const fs = require("fs");
      const packagePath = process.argv[1];
      const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
      process.stdout.write((pkg.engines && pkg.engines.node) || "");
    ' "$package_file"
  )"

  if [[ -z "$engines_node" ]]; then
    echo "[node-alignment] Missing engines.node in ${package_file#$ROOT_DIR/}"
    failures=$((failures + 1))
    continue
  fi

  if [[ "$engines_node" != *"$expected_major"* ]]; then
    echo "[node-alignment] engines.node mismatch in ${package_file#$ROOT_DIR/}: $engines_node (expected major $expected_major)"
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -gt 0 ]]; then
  echo "[node-alignment] FAILED with $failures mismatch(es)."
  exit 1
fi

echo "[node-alignment] OK"
