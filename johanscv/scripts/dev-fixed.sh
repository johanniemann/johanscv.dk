#!/usr/bin/env bash
set -euo pipefail

PORT=5173
# Auto-select host for best localhost compatibility:
# - Prefer dual-stack (::) so both localhost and 127.0.0.1 work.
# - Fallback to 127.0.0.1 if IPv6 bind is unavailable.
# Override manually with DEV_HOST if needed.
HOST="${DEV_HOST:-}"
# Keep local dev at root URL by default (http://localhost:5173/).
# Override with CUSTOM_DOMAIN=false to emulate GitHub Pages base path locally.
export CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-true}"

if [[ -z "${HOST}" ]]; then
  if node -e '
    const net = require("net");
    const server = net.createServer();
    server.once("error", () => process.exit(1));
    server.listen({ host: "::", port: 0 }, () => {
      server.close(() => process.exit(0));
    });
  ' >/dev/null 2>&1; then
    HOST="::"
  else
    HOST="127.0.0.1"
  fi
fi

pids="$(lsof -ti "tcp:${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "${pids}" ]]; then
  echo "[dev] Port ${PORT} is busy. Stopping current listener(s): ${pids}"
  for pid in ${pids}; do
    kill "${pid}" 2>/dev/null || true
  done
  sleep 0.35
fi

remaining="$(lsof -ti "tcp:${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "${remaining}" ]]; then
  echo "[dev] Port ${PORT} is still busy (PID ${remaining}). Stop it manually and run npm run dev again."
  exit 1
fi

echo "[dev] Starting Vite on host ${HOST}, port ${PORT} (CUSTOM_DOMAIN=${CUSTOM_DOMAIN})"
exec ./node_modules/.bin/vite --host "${HOST}" --port "${PORT}" --strictPort
