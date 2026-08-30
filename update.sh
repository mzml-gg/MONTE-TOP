#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"; PANEL_PATH="${PANEL_PATH:-/var/www/pterodactyl}"; [ "$(id -u)" -eq 0 ] || { echo 'Run as root.' >&2; exit 1; }; [ -f "$PANEL_PATH/composer.json" ] || { echo "Invalid PANEL_PATH: $PANEL_PATH" >&2; exit 1; }; exec "$ROOT/install.sh"
