#!/usr/bin/env bash
set -euo pipefail

resolve_port() {
  if [[ -n "${PORT:-}" ]]; then
    printf '%s' "${PORT}"
    return
  fi

  if [[ -f ".env" ]]; then
    local env_port
    env_port="$(awk -F= '
      /^[[:space:]]*#/ { next }
      /^[[:space:]]*$/ { next }
      $1 ~ /^[[:space:]]*PORT[[:space:]]*$/ {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2)
        print $2
        exit
      }
    ' .env)"
    if [[ -n "${env_port}" ]]; then
      printf '%s' "${env_port}"
      return
    fi
  fi

  printf '8787'
}

PORT_TO_USE="$(resolve_port)"

pids="$(lsof -ti "tcp:${PORT_TO_USE}" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "${pids}" ]]; then
  echo "[dev] Port ${PORT_TO_USE} is busy. Stopping existing listener(s): ${pids}"
  for pid in ${pids}; do
    kill "${pid}" 2>/dev/null || true
  done
  sleep 0.35
fi

remaining="$(lsof -ti "tcp:${PORT_TO_USE}" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "${remaining}" ]]; then
  echo "[dev] Port ${PORT_TO_USE} is still busy (PID ${remaining}). Stop it manually and run npm run dev again."
  exit 1
fi

echo "[dev] Starting API on port ${PORT_TO_USE}"
exec node --watch index.js
