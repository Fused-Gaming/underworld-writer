#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="${ROOT_DIR}/.tools"
MCP_DIR="${TOOLS_DIR}/modal-mcp-server"
REPO_URL="https://github.com/smehmood/modal-mcp-server.git"

command -v git >/dev/null 2>&1 || { echo "git is required" >&2; exit 1; }
command -v uv >/dev/null 2>&1 || { echo "uv is required: https://docs.astral.sh/uv/" >&2; exit 1; }
command -v modal >/dev/null 2>&1 || { echo "Modal CLI is required. Install/configure Modal first." >&2; exit 1; }

mkdir -p "${TOOLS_DIR}"

if [[ -d "${MCP_DIR}/.git" ]]; then
  echo "Updating existing Modal MCP checkout..."
  git -C "${MCP_DIR}" pull --ff-only
else
  echo "Cloning Modal MCP server..."
  git clone "${REPO_URL}" "${MCP_DIR}"
fi

uv --directory "${MCP_DIR}" sync

SERVER_PATH="${MCP_DIR}/src/modal_mcp/server.py"

cat <<EOF

Modal MCP server installed.

Server path:
  ${SERVER_PATH}

Generic MCP configuration:
{
  "mcpServers": {
    "modal": {
      "command": "uv",
      "args": [
        "--project",
        "${MCP_DIR}",
        "run",
        "${SERVER_PATH}"
      ]
    }
  }
}

The MCP server uses your already-configured Modal CLI credentials.
Keep .tools/ local; it is intentionally ignored by git.
EOF
