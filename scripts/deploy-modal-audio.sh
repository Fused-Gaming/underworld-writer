#!/usr/bin/env sh
set -eu

SHOW="${1:-insight-corruption}"

echo "==> Building/validating repository with Docker"
docker build --target validator -t underworld-writer:validator .

echo "==> Syncing authorized repository voice references to Modal"
modal run scripts/sync-modal-voice-profiles.py --show "$SHOW"

echo "==> Deploying Modal audio application"
modal deploy modal/app.py

echo "==> Deployment complete"

