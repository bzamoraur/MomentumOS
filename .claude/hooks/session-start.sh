#!/usr/bin/env bash
# SessionStart hook: make a fresh web/mobile session immediately able to run the
# quality gate (typecheck + test + build) without manual setup. Must never abort
# the session — all failures are reported but non-fatal.
set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT" 2>/dev/null || exit 0

if [ ! -d node_modules ]; then
  echo "[session-start] node_modules missing — installing dependencies..."
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install --prefer-offline >/tmp/momentum-install.log 2>&1 \
      && echo "[session-start] dependencies installed." \
      || echo "[session-start] pnpm install reported errors (see /tmp/momentum-install.log) — non-fatal."
  else
    echo "[session-start] pnpm not found; run 'npm install' manually if needed."
  fi
else
  echo "[session-start] dependencies present."
fi

echo "[session-start] Momentum OS ready."
echo "[session-start] Quality gate before any commit:  pnpm run check   (typecheck + test + build)"
echo "[session-start] Read CLAUDE.md for behavior rules, evidence protocol, and scope discipline."
exit 0
