#!/usr/bin/env bash
set -Eeuo pipefail
PANEL_PATH="${PANEL_PATH:-$(cd "$(dirname "$0")/../../../" && pwd)}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/monte-top}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$BACKUP_ROOT/$STAMP"
require_root() { [ "$(id -u)" -eq 0 ] || { echo 'Run as root.' >&2; exit 1; }; }
require_root
[ -f "$PANEL_PATH/composer.json" ] || { echo "Invalid Pterodactyl path: $PANEL_PATH" >&2; exit 1; }
mkdir -p "$BACKUP"
cp -a "$PANEL_PATH/resources/scripts/index.tsx" "$BACKUP/index.tsx"
cp -a "$PANEL_PATH/resources/scripts/components/auth/LoginFormContainer.tsx" "$BACKUP/LoginFormContainer.tsx"
cp -a "$PANEL_PATH/resources/scripts/components/server/console/Console.tsx" "$BACKUP/Console.tsx"
cp -a "$PANEL_PATH/resources/scripts/theme/monte-top.css" "$BACKUP/monte-top.css" 2>/dev/null || true
cp -a "$PANEL_PATH/public/assets/svgs/monte-top.svg" "$BACKUP/monte-top.svg" 2>/dev/null || true
printf 'Backup created at %s\n' "$BACKUP"
printf 'This distribution is intended to be applied from a source checkout. Copy the repository files into the matching panel path, then run theme/scripts/build.sh.\n'
printf 'No production files were deleted.\n'
