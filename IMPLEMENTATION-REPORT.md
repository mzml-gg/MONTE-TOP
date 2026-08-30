# MONTE TOP — Implementation Report

## 1. Pterodactyl version

The current official source checkout was cloned and recorded at commit `113ea43`. The remote installation itself was not inspected because `ssh -J serveo.net root@samoo` timed out during banner exchange. The target panel URL was reachable in the authenticated browser and displayed a live Pterodactyl dashboard.

## 2. Node and build toolchain

The checked-out source declares Node.js `>=22` in `package.json`. Yarn `1.22.22` was used locally. The production build completed with `NODE_OPTIONS=--openssl-legacy-provider`.

## 3. Files modified

`resources/scripts/index.tsx` imports the compiled MONTE TOP stylesheet. `resources/scripts/components/auth/LoginFormContainer.tsx` uses the original MONTE TOP SVG and visible branding. `resources/scripts/components/server/console/Console.tsx` adds a live-output-backed Copy Last 100 Lines button without changing WebSocket messages or server APIs. `README.md` and `CHANGELOG.md` document the distribution.

## 4. Files added

The additions are `resources/scripts/theme/monte-top.css`, `public/assets/svgs/monte-top.svg`, `public/assets/svgs/monte-top-favicon.svg`, `theme/monte-top/config.json`, the duplicated theme assets, `install.sh`, `update.sh`, `uninstall.sh`, `restore.sh`, `build-theme.sh`, and the helper scripts under `theme/monte-top/scripts/`.

## 5. Build result

`yarn tsc` passed. `NODE_OPTIONS=--openssl-legacy-provider yarn build:production` passed and emitted the production Webpack bundle and manifest. The build produced non-blocking upstream warnings about peer dependencies, Browserslist data age, and the Tailwind line-clamp plugin.

## 6. Test result

The existing Jest suite passed: **4 suites, 46 tests, 0 failures**. `git diff --check` passed. Live acceptance testing against the requested server was not performed and is not claimed; the SSH jump endpoint timed out before a shell was available.

## 7. Installation method

Run `PANEL_PATH=/var/www/pterodactyl sudo -E ./install.sh`, inspect the diff, then run `PANEL_PATH=/var/www/pterodactyl sudo -E ./build-theme.sh`. The installer creates a timestamped backup before copying the known source and branding files.

## 8. Uninstall method

Run `PANEL_PATH=/var/www/pterodactyl sudo -E ./uninstall.sh`, then rebuild. The script restores the latest recorded pre-install source files and removes only MONTE TOP assets.

## 9. Restore method

Run `PANEL_PATH=/var/www/pterodactyl sudo -E ./restore.sh /var/backups/monte-top/YYYYMMDD-HHMMSS`, then rebuild. No credentials, cookies, sessions, API tokens, or SSH passwords are included in the repository.

## 10. GitHub repository status

The requested private repository is live at [github.com/mzml-gg/MONTE-TOP](https://github.com/mzml-gg/MONTE-TOP). The default branch is `main`, the pushed commit is `fe5a1d4`, `git status` is clean, and `origin` points to `https://github.com/mzml-gg/MONTE-TOP.git`.
