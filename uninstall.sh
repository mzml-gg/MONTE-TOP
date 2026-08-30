#!/usr/bin/env bash
set -Eeuo pipefail
PANEL_PATH="${PANEL_PATH:-/var/www/pterodactyl}"; BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/monte-top}"; [ "$(id -u)" -eq 0 ] || { echo 'Run as root.' >&2; exit 1; }; [ -f "$PANEL_PATH/composer.json" ] || { echo "Invalid PANEL_PATH: $PANEL_PATH" >&2; exit 1; }; [ -f "$BACKUP_ROOT/latest" ] || { echo "No MONTE TOP backup found at $BACKUP_ROOT/latest" >&2; exit 1; }; BACKUP="$(cat "$BACKUP_ROOT/latest")"; [ -d "$BACKUP" ] || { echo "Backup missing: $BACKUP" >&2; exit 1; }
for f in index.tsx LoginFormContainer.tsx Console.tsx; do [ -f "$BACKUP/$f.before" ] && cp -a "$BACKUP/$f.before" "$PANEL_PATH/$(case "$f" in index.tsx) echo resources/scripts/index.tsx;; LoginFormContainer.tsx) echo resources/scripts/components/auth/LoginFormContainer.tsx;; Console.tsx) echo resources/scripts/components/server/console/Console.tsx;; esac)"; done
rm -f "$PANEL_PATH/resources/scripts/theme/monte-top.css" "$PANEL_PATH/public/assets/svgs/monte-top.svg"
printf 'MONTE TOP source changes restored from %s. Rebuild the panel to publish the rollback.\n' "$BACKUP"
