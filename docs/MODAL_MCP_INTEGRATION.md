# Modal MCP Integration

The Modal MCP server is a developer/agent control plane for Modal operations. It is not part of the podcast content model and is not required at runtime.

## Why this boundary exists

Underworld Writer's stable interface is the `underworld-audio` CLI and canonical project configuration. MCP clients may use the Modal MCP server to deploy applications and manage volumes, but show/episode files never depend on MCP.

This keeps projects portable if we later replace Modal, replace the MCP server, or run renders from CI.

## Install

```bash
bash scripts/setup-modal-mcp.sh
```

The script clones `smehmood/modal-mcp-server` into `.tools/modal-mcp-server`, runs `uv sync`, and prints an MCP client configuration using absolute paths.

`.tools/` is git-ignored intentionally.

Prerequisites:

- Git
- Python 3.11+
- `uv`
- Modal CLI installed and authenticated

## Print configuration later

```bash
python modal/cli.py mcp-config
```

Use the emitted `mcpServers.modal` object in a compatible MCP client such as Cursor, Claude, or another local agent host.

## Useful MCP operations

The selected server exposes Modal volume and deployment operations, including:

- list volumes
- list files in a volume
- upload/download volume files
- copy/remove files inside volumes
- deploy a Modal application

For Underworld Writer that maps naturally to:

```text
voice/reference intake -> Modal volume upload
render/deployment       -> Modal deploy
render outputs          -> Modal volume inspect/download
```

## Security

The server uses the local Modal CLI credentials. Do not commit Modal credentials, voice reference audio, or generated private assets to this repository.

Voice reference material remains governed by the voice profile consent record regardless of whether it is uploaded manually, through the CLI, or through MCP.

## Agent workflow

A capable agent can follow this sequence:

1. validate the show/episode package with `python modal/cli.py validate ...`
2. inspect voice-profile consent metadata
3. upload approved reference clips to the configured Modal volume
4. deploy/update the Modal app
5. trigger a preview or production render through the Underworld CLI
6. inspect/download render artifacts
7. record benchmark/render metadata in the render manifest

MCP is an operational helper; the canonical render state lives in project configuration and render manifests.
