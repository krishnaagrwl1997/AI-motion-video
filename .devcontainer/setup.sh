#!/usr/bin/env bash
# Runs once when the Codespace / dev container is created.
set -euo pipefail

# 1. Shared libraries for Remotion's headless Chrome
#    (https://www.remotion.dev/docs/miscellaneous/linux-dependencies)
sudo apt-get update
sudo apt-get install -y libnss3 libdbus-1-3 libatk1.0-0 libasound2 libxrandr2 libxkbcommon-dev \
  libxfixes3 libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0

# 2. uv / uvx, which runs the AI-generation MCP servers in .mcp.json
curl -LsSf https://astral.sh/uv/install.sh | sudo env UV_UNMANAGED_INSTALL=/usr/local/bin sh

# 3. Project dependencies
npm i

# 4. Pre-download the MCP servers so the first use is fast (failures here are not fatal)
uvx minimax-mcp --help >/dev/null 2>&1 || true
uvx elevenlabs-mcp --help >/dev/null 2>&1 || true
