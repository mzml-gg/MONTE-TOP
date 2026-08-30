#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"; PANEL_PATH="${PANEL_PATH:-/var/www/pterodactyl}"; BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/monte-top}"; STAMP="$(date +%Y%m%d-%H%M%S)"; BACKUP="$BACKUP_ROOT/$STAMP"
[ "$(id -u)" -eq 0 ] || { echo 'Run as root.' >&2; exit 1; }; [ -f "$PANEL_PATH/composer.json" ] || { echo "Pterodactyl path not found: $PANEL_PATH (set PANEL_PATH=...)" >&2; exit 1; }
mkdir -p "$BACKUP" "$PANEL_PATH/resources/scripts/theme" "$PANEL_PATH/public/assets/svgs"
for f in resources/scripts/index.tsx resources/scripts/components/auth/LoginFormContainer.tsx resources/scripts/components/server/console/Console.tsx; do cp -a "$PANEL_PATH/$f" "$BACKUP/$(basename "$f").before"; cp -a "$ROOT/$f" "$PANEL_PATH/$f"; done
cp -a "$ROOT/resources/scripts/theme/monte-top.css" "$PANEL_PATH/resources/scripts/theme/monte-top.css"; cp -a "$ROOT/public/assets/svgs/monte-top.svg" "$PANEL_PATH/public/assets/svgs/monte-top.svg"
printf '%s\n' "$PANEL_PATH" > "$BACKUP/panel-path"; printf '%s\n' "$BACKUP" > "$BACKUP_ROOT/latest"
printf 'MONTE TOP files installed. Backup: %s\n' "$BACKUP"; printf 'Build next: cd %s && yarn && NODE_OPTIONS=--openssl-legacy-provider yarn build:production\n' "$PANEL_PATH"
