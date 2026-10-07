#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Project dependencies (npm install is cache-friendly; peer deps need --legacy-peer-deps)
npm install --no-audit --no-fund --legacy-peer-deps

# graphify CLI (required by CLAUDE.md for codebase queries and graph updates)
if ! command -v graphify >/dev/null 2>&1; then
  pip install -q graphifyy
fi
graphify install >/dev/null 2>&1 || true
