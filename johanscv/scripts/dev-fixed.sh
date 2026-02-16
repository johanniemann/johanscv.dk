#!/usr/bin/env bash
set -euo pipefail

PORT=5173
HOST=127.0.0.1
# Keep local dev at root URL by default (http://localhost:5173/).
# Override with CUSTOM_DOMAIN=false to emulate GitHub Pages base path locally.
export CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-true}"

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

exec ./node_modules/.bin/vite --host "${HOST}" --port "${PORT}" --strictPort
