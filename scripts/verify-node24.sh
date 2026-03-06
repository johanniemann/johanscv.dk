#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_NODE_MAJOR=24
NODE24_BIN="${NODE24_BIN:-/opt/homebrew/opt/node@24/bin}"

use_node24_bin_from_dir() {
  local bin_dir="$1"
  PATH="${bin_dir}:$PATH"
  export PATH
}

if [[ -x "${NODE24_BIN}/node" && -x "${NODE24_BIN}/npm" ]]; then
  use_node24_bin_from_dir "${NODE24_BIN}"
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "[verify-node24] Node/npm not available in PATH." >&2
  exit 1
fi

NODE_VERSION_RAW="$(node -v 2>/dev/null || true)"
if [[ ! "$NODE_VERSION_RAW" =~ ^v${EXPECTED_NODE_MAJOR}\. ]]; then
  cat >&2 <<EOF
[verify-node24] Expected Node ${EXPECTED_NODE_MAJOR}.x, found ${NODE_VERSION_RAW:-unknown}.
[verify-node24] Install Node 24 or provide its bin path via NODE24_BIN.
[verify-node24] Example:
  NODE24_BIN=/opt/homebrew/opt/node@24/bin ./scripts/verify-node24.sh
EOF
  exit 1
fi

echo "[verify-node24] Using node $(node -v) and npm $(npm -v)"
exec "$ROOT_DIR/scripts/verify.sh"
