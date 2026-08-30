#!/usr/bin/env bash
set -Eeuo pipefail
PANEL_PATH="${PANEL_PATH:-/var/www/pterodactyl}"
[ -f "$PANEL_PATH/package.json" ] || { echo "Invalid PANEL_PATH: $PANEL_PATH" >&2; exit 1; }
cd "$PANEL_PATH"
node -e "const p=require('./package.json'); if (!p.scripts || !p.scripts['build:production']) process.exit(2)" || { echo 'This Pterodactyl checkout has no build:production script; inspect package.json and BUILDING.md.' >&2; exit 1; }
yarn
if node --version | grep -Eq '^v(1[7-9]|2[0-9])'; then export NODE_OPTIONS="${NODE_OPTIONS:-} --openssl-legacy-provider"; fi
yarn build:production
