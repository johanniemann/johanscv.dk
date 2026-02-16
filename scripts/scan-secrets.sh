#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

tracked_files=()
while IFS= read -r -d '' file_path; do
  tracked_files+=("$file_path")
done < <(git -C "$ROOT_DIR" ls-files -z)

if [[ ${#tracked_files[@]} -eq 0 ]]; then
  echo "[secret-scan] No tracked files found. Skipping."
  exit 0
fi

rg_args=(
  --files-with-matches
  --no-messages
  --hidden
  --glob '!.git'
  -e '(^|[^A-Za-z0-9_])sk-(proj-)?[A-Za-z0-9_-]{20,}([^A-Za-z0-9_]|$)'
  -e 'AIza[0-9A-Za-z_-]{20,}'
  -e 'gh[pousr]_[A-Za-z0-9]{20,}'
  -e 'xox[baprs]-[A-Za-z0-9-]{10,}'
  -e '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  -e 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
)

matches="$(
  cd "$ROOT_DIR"
  rg "${rg_args[@]}" -- "${tracked_files[@]}" || true
)"

if [[ -n "$matches" ]]; then
  echo "[secret-scan] Potential secret-like values found in tracked files:"
  echo "$matches"
  echo "[secret-scan] Review files above and rotate credentials if any real key was committed."
  exit 1
fi

echo "[secret-scan] OK"
