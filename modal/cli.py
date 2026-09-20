#!/usr/bin/env python3
"""Underworld Writer podcast production CLI.

This CLI is intentionally show-agnostic. It manages project scaffolding,
configuration validation, Modal deployment, and developer MCP setup details.
Rendering commands will consume the canonical show/season/episode model as the
Chatterbox backend is wired into modal/app.py.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = ROOT / "projects"
TEMPLATE = PROJECTS / "_template"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text())
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def require_keys(value: dict, keys: list[str], path: Path) -> list[str]:
    return [f"{path}: missing '{key}'" for key in keys if key not in value]


def cmd_scaffold_show(args: argparse.Namespace) -> int:
    show_id = slugify(args.show_id)
    if not show_id:
        raise SystemExit("show id must contain at least one letter or number")

    destination = PROJECTS / show_id
    if destination.exists() and any(destination.iterdir()) and not args.force:
        raise SystemExit(
            f"{destination} already exists and is not empty; pass --force to merge template files"
        )

    if not TEMPLATE.exists():
        raise SystemExit(f"Template directory not found: {TEMPLATE}")

    shutil.copytree(TEMPLATE, destination, dirs_exist_ok=True)

    show_path = destination / "show.json"
    show = read_json(show_path)
    show["showId"] = show_id
    show["title"] = args.title or args.show_id.replace("-", " ").title()
    show["description"] = args.description or show.get("description", "")
    write_json(show_path, show)

    brand_path = destination / "brand" / "brand.json"
    brand = read_json(brand_path)
    brand["brandId"] = f"{show_id}-default"
    brand["displayName"] = show["title"]
    write_json(brand_path, brand)

    print(destination.relative_to(ROOT))
    return 0


def validate_show(show_path: Path) -> list[str]:
    errors: list[str] = []
    show = read_json(show_path)
    errors.extend(
        require_keys(
            show,
            ["schemaVersion", "showId", "title", "language", "brandRef"],
            show_path,
        )
    )

    brand_ref = show.get("brandRef")
    if brand_ref and not (show_path.parent / brand_ref).exists():
        errors.append(f"{show_path}: brandRef does not exist: {brand_ref}")

    return errors


def validate_episode(path: Path) -> list[str]:
    episode = read_json(path)
    errors = require_keys(
        episode,
        ["schemaVersion", "episodeId", "identity", "content", "cast", "timeline", "production", "publishing"],
        path,
    )
    if "timeline" in episode and not isinstance(episode["timeline"], list):
        errors.append(f"{path}: timeline must be an array")
    return errors


def cmd_validate(args: argparse.Namespace) -> int:
    target = (ROOT / args.target).resolve() if not Path(args.target).is_absolute() else Path(args.target)
    errors: list[str] = []

    if target.is_file():
        if target.name == "show.json":
            errors.extend(validate_show(target))
        elif target.name == "episode.json":
            errors.extend(validate_episode(target))
        else:
            read_json(target)
    elif target.is_dir():
        show_path = target / "show.json"
        if show_path.exists():
            errors.extend(validate_show(show_path))
        else:
            errors.append(f"{target}: missing show.json")
        for episode_path in target.glob("episodes/*/episode.json"):
            errors.extend(validate_episode(episode_path))
    else:
        errors.append(f"Target does not exist: {target}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"OK: {target}")
    return 0


def cmd_deploy(_: argparse.Namespace) -> int:
    command = ["modal", "deploy", str(ROOT / "modal" / "app.py")]
    print("+", " ".join(command))
    return subprocess.call(command, cwd=ROOT)


def cmd_mcp_config(_: argparse.Namespace) -> int:
    mcp_dir = ROOT / ".tools" / "modal-mcp-server"
    server = mcp_dir / "src" / "modal_mcp" / "server.py"
    if not server.exists():
        print(
            "Modal MCP server is not installed. Run: bash scripts/setup-modal-mcp.sh",
            file=sys.stderr,
        )
        return 1

    config = {
        "mcpServers": {
            "modal": {
                "command": "uv",
                "args": ["--project", str(mcp_dir), "run", str(server)],
            }
        }
    }
    print(json.dumps(config, indent=2))
    return 0


def cmd_render(args: argparse.Namespace) -> int:
    episode = PROJECTS / args.show_id / "episodes" / args.episode_id / "episode.json"
    if not episode.exists():
        raise SystemExit(f"Episode package not found: {episode}")

    # The canonical render CLI is established now, but the generic resolver ->
    # Modal payload compiler lands with the Chatterbox backend adapter. Refuse
    # rather than silently falling back to the legacy show-specific config.
    print(
        "Episode package validated. Generic render compilation is pending the "
        "Chatterbox backend/resolver implementation; no render was started."
    )
    errors = validate_episode(episode)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"show={args.show_id} episode={args.episode_id} profile={args.profile or 'show-default'}")
    return 2


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="underworld-audio")
    sub = parser.add_subparsers(dest="command", required=True)

    scaffold = sub.add_parser("scaffold", help="create reusable podcast project scaffolding")
    scaffold_sub = scaffold.add_subparsers(dest="kind", required=True)
    show = scaffold_sub.add_parser("show", help="create a new show from projects/_template")
    show.add_argument("show_id")
    show.add_argument("--title")
    show.add_argument("--description")
    show.add_argument("--force", action="store_true")
    show.set_defaults(func=cmd_scaffold_show)

    validate = sub.add_parser("validate", help="validate a show, episode, or JSON config")
    validate.add_argument("target")
    validate.set_defaults(func=cmd_validate)

    deploy = sub.add_parser("deploy", help="deploy modal/app.py using the Modal CLI")
    deploy.set_defaults(func=cmd_deploy)

    mcp = sub.add_parser("mcp-config", help="print MCP client configuration for the local Modal MCP checkout")
    mcp.set_defaults(func=cmd_mcp_config)

    render = sub.add_parser("render", help="render a canonical episode package")
    render.add_argument("show_id")
    render.add_argument("episode_id")
    render.add_argument("--profile")
    render.set_defaults(func=cmd_render)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
