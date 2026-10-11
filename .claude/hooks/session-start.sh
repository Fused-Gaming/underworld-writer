#!/bin/bash
# SessionStart hook for Claude Code cloud sessions.
# Installs project dependencies so tests and linters work, then checks that the
# hosts the build and release pipeline needs are reachable. Idempotent and
# non-interactive. Runs only in remote (cloud) sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Resolve the project root from this script's location so npm never runs in
# whatever directory the session happens to start in (for example $HOME).
cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

echo "[session-start] installing npm dependencies"
npm install --no-audit --no-fund

# Hosts required by the CI test job, the Docker validator build, and the
# release scripts. Reachability is reported; the hook does not fail the session
# when a host is blocked, because network policy is set per environment.
HOSTS=(
  "https://registry.npmjs.org/"
  "https://github.com/"
  "https://registry-1.docker.io/v2/"
  "https://auth.docker.io/token"
)

echo "[session-start] checking required hosts"
blocked=0
for url in "${HOSTS[@]}"; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || echo "000")
  case "$code" in
    000) echo "[session-start] BLOCKED  $url"; blocked=$((blocked + 1)) ;;
    *)   echo "[session-start] ok ($code) $url" ;;
  esac
done

if [ "$blocked" -gt 0 ]; then
  echo "[session-start] $blocked required host(s) unreachable. Add them under the environment's Allowed domains (see the cloud environment network settings)."
fi
