# MONTE TOP

**Premium Futuristic Pterodactyl Theme**

MONTE TOP is an original dark-futuristic visual layer for the React frontend of Pterodactyl Panel. It preserves Pterodactyl routing, authentication, API, WebSocket, xterm console, Wings communication, and management screens by changing compiled frontend source rather than injecting browser-only CSS.

> This repository is a source-level theme distribution. It is not a demo, mock dashboard, fake server panel, or browser extension.

## Features

MONTE TOP adds a restrained glass UI, luxury-gold design tokens, responsive surfaces, semantic status colors, original SVG branding, mobile-friendly layout styling, reduced-motion support, and a real **Copy Last 100 Lines** console control. Console lines are collected only from the existing live Pterodactyl event stream, limited to 1000 in memory, copied through the browser Clipboard API, and never sent to an external service or persisted.

## Requirements

Use a supported Pterodactyl source checkout and inspect its `BUILDING.md` and `package.json` first. The bundled upstream checkout currently requires Node.js 22 or newer and Yarn; older Pterodactyl releases have different requirements. Root access is required on the panel host, and a complete server/database backup must exist before deployment.

## Installation

Identify the panel path, then run `PANEL_PATH=/var/www/pterodactyl sudo -E ./install.sh`. The script verifies `composer.json`, creates `/var/backups/monte-top/<timestamp>`, saves the original source files, and copies only the MONTE TOP source files. Inspect the diff, then build with `PANEL_PATH=/var/www/pterodactyl sudo -E ./build-theme.sh`. This uses the checkout's own dependency installation and `build:production` script. Clear only the cache required by the installed release, reload the panel, and test the listed flows.

Do not run deployment directly on a production node without a tested backup. Official Pterodactyl guidance confirms that React source and styles require recompilation after changes [1].

## Update

Fetch the desired repository revision, review the diff, and run `PANEL_PATH=/var/www/pterodactyl sudo -E ./update.sh`. A fresh backup is created before files are replaced. Rebuild afterward.

## Uninstall

Run `PANEL_PATH=/var/www/pterodactyl sudo -E ./uninstall.sh`. It restores the latest recorded pre-install source files and removes only MONTE TOP CSS and SVG assets. Rebuild the panel afterward. Never delete the backup directory until rollback is verified.

## Restore

Use `PANEL_PATH=/var/www/pterodactyl sudo -E ./restore.sh /var/backups/monte-top/YYYYMMDD-HHMMSS`. The command restores the selected backup's source files and assets. Rebuild afterward.

## Customization

Edit `theme/monte-top/config.json` for the central token contract, and `resources/scripts/theme/monte-top.css` for visual rules. Keep selectors scoped to existing Pterodactyl primitives. Do not add external analytics, remote log storage, or client-side API replacements.

## Compatibility and test status

The theme targets the current React/TypeScript/Tailwind/Webpack architecture in the bundled source checkout. The requested remote panel was reachable in the authenticated browser, but its SSH ProxyJump endpoint did not complete a banner exchange; therefore this task does **not** claim live deployment or live functional testing on that server. Confirm the installed version before applying the package.

Local verification includes source inspection and TypeScript/build checks where dependencies are available. A live console, power-control, Wings, and mobile acceptance test must be completed on the target installation after deployment.

## Troubleshooting

If `install.sh` rejects the path, set `PANEL_PATH` to the directory containing `composer.json` and `package.json`. If the build fails, use the Node/Yarn versions and commands documented by that checkout's `BUILDING.md`; do not force an incompatible legacy OpenSSL flag. If the copy button is disabled, the current console session has not received live output. If Clipboard access is denied, use HTTPS and permit clipboard access for the panel origin.

## Credits and license

MONTE TOP is an original theme implementation. Pterodactyl remains the underlying open-source panel and is credited at [pterodactyl.io](https://pterodactyl.io/). Theme-specific additions are MIT licensed; bundled Pterodactyl source files retain their original license and notices in `LICENSE.md`.

## References

[1]: https://pterodactyl.io/community/customization/panel.html "Pterodactyl — Building Panel Assets"
[2]: https://github.com/pterodactyl/panel/blob/1.0-develop/BUILDING.md "Pterodactyl Panel — BUILDING.md"
