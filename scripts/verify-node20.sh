#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_NODE_MAJOR=20
NODE20_BIN="${NODE20_BIN:-/opt/homebrew/opt/node@20/bin}"

use_node20_bin_from_dir() {
  local bin_dir="$1"
  PATH="${bin_dir}:$PATH"
  export PATH
}

if [[ -x "${NODE20_BIN}/node" && -x "${NODE20_BIN}/npm" ]]; then
  use_node20_bin_from_dir "${NODE20_BIN}"
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "[verify-node20] Node/npm not available in PATH." >&2
  exit 1
fi

NODE_VERSION_RAW="$(node -v 2>/dev/null || true)"
if [[ ! "$NODE_VERSION_RAW" =~ ^v${EXPECTED_NODE_MAJOR}\. ]]; then
  cat >&2 <<EOF
[verify-node20] Expected Node ${EXPECTED_NODE_MAJOR}.x, found ${NODE_VERSION_RAW:-unknown}.
[verify-node20] Install Node 20 or provide its bin path via NODE20_BIN.
[verify-node20] Example:
  NODE20_BIN=/opt/homebrew/opt/node@20/bin ./scripts/verify-node20.sh
EOF
  exit 1
fi

echo "[verify-node20] Using node $(node -v) and npm $(npm -v)"
exec "$ROOT_DIR/scripts/verify.sh"
