#!/usr/bin/env bash
set -euo pipefail

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║       Underworld Writer — Modal Audio Generation Setup        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if modal is installed
if ! command -v modal &> /dev/null; then
    echo "❌ Modal CLI not found. Installing..."
    pip install -r modal/requirements.txt
fi

echo "✓ Modal CLI installed: $(modal --version)"
echo ""

# Check current authentication status
echo "Checking Modal authentication status..."
CONFIG=$(modal config show)

TOKEN_ID=$(echo "$CONFIG" | jq -r '.token_id // empty')
if [ -z "$TOKEN_ID" ] || [ "$TOKEN_ID" == "null" ]; then
    echo "⚠️  Modal is not authenticated yet."
    echo ""
    echo "To authenticate, run:"
    echo "    modal setup"
    echo ""
    echo "This will open a browser to authenticate with Modal."
    echo "After authentication, your credentials will be saved locally."
    echo ""
    echo "Once authenticated, you can deploy the audio generation app:"
    echo "    modal deploy modal/app.py"
    exit 1
else
    echo "✓ Modal is authenticated"
    echo ""
fi

# Verify app loads
echo "Verifying Modal app..."
python3 -m py_compile modal/app.py
echo "✓ App syntax valid"
echo ""

# Show deployment instructions
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                  Ready for Deployment                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Deploy the audio generation app:"
echo "   modal deploy modal/app.py"
echo ""
echo "2. Generate a podcast script:"
echo "   npm run editorial:generate -- --series insight-corruption --season 1 --episode 1"
echo ""
echo "3. Configure episode audio (edit this file first):"
echo "   modal/config/episodes/insight-corruption-ep01.json"
echo ""
echo "4. Run audio generation:"
echo "   modal run modal/app.py::generate_episode_audio --episode-config modal/config/episodes/insight-corruption-ep01.json"
echo ""
echo "5. Download the rendered audio:"
echo "   modal volume get underworld-episode-output insight-corruption-ep01.wav ."
echo ""
