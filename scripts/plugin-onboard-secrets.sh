#!/usr/bin/env sh
# Claude Code plugin SessionStart hook.
#
# Receives userConfig secrets (.claude-plugin/plugin.json's "userConfig")
# as positional args, in the exec-form order declared by the SessionStart
# hook entry: $1=modal_token_id, $2=modal_token_secret, $3=uw_npm_token.
# Never logs the values themselves.
#
# Modal: writes credentials into ~/.modal.toml via the real `modal` CLI
# (modal token set), which is the file Modal's own SDK/CLI reads on every
# invocation — this is a genuine, persistent fix, not an env var that only
# lives for this hook process.
#
# UW_NPM_TOKEN: intentionally NOT auto-exported or written into a dotfile
# here. A hook's environment does not propagate to later Bash tool calls
# in the session, and silently editing the user's shell profile to smuggle
# a persistent export in is more surprising than helpful. Print the one
# command the user needs instead.

MODAL_TOKEN_ID="${1:-}"
MODAL_TOKEN_SECRET="${2:-}"
UW_NPM_TOKEN_VALUE="${3:-}"

if [ -n "$MODAL_TOKEN_ID" ] && [ -n "$MODAL_TOKEN_SECRET" ]; then
  if command -v modal >/dev/null 2>&1; then
    if modal token set --token-id "$MODAL_TOKEN_ID" --token-secret "$MODAL_TOKEN_SECRET" >/dev/null 2>&1; then
      echo "underworld-writer: Modal credentials written to ~/.modal.toml."
    else
      echo "underworld-writer: 'modal token set' failed. Run it yourself: modal token set --token-id <id> --token-secret <secret>" >&2
    fi
  else
    echo "underworld-writer: Modal token configured in the plugin, but the 'modal' CLI isn't installed (pip install modal), so it wasn't written anywhere yet." >&2
  fi
fi

if [ -n "$UW_NPM_TOKEN_VALUE" ]; then
  echo "underworld-writer: an npm publish token is configured. It is not auto-exported into your shell (see docs/ops/PUBLISHING.md) — run 'export UW_NPM_TOKEN=<your token>' before 'npm run publish:npm' if you're cutting a release this session."
fi

exit 0
