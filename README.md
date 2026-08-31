# MONTE TOP

**Premium Futuristic Cloud Infrastructure Theme for Pterodactyl Panel**

MONTE TOP is a complete visual redesign for Pterodactyl Panel built on a **Dark Crimson × Deep Black × Metallic Gold** aesthetic. It transforms the standard Pterodactyl interface into a high-end cloud management suite with a full-height glass sidebar, Lucide SVG icons, responsive topbar, custom button system, interactive real-time resource graphs, cloud file manager layout, and enhanced terminal console.

---

## Visual & Design Features

- **Luxury Theme Tokens**: Deep Black (`#070303`), Dark Crimson (`#210606`, `#3A0A0A`), and Metallic Gold (`#D4AF37`, `#F2D675`, `#B88A20`).
- **Full Screen Architecture**: 100% viewport width and height utilization without excessive margins or empty dark space.
- **Glass Vertical Sidebar**: Integrated brand mark, active gold indicator states, Lucide SVG navigation icons, and mobile collapsible drawer (`<768px`).
- **Power Control Toolbar**: Dedicated SVG power action buttons:
  - `Start`: Play icon with green/gold accent.
  - `Restart`: Refresh/Rotate icon with amber/gold accent.
  - `Stop`: Square icon with red accent.
  - `Kill`: Power/Zap icon with dark crimson alert state.
- **Resource Dashboard Graphs**:
  - `RAM`: Smooth line/area graph with dark crimson fill and metallic gold trend line.
  - `CPU`: Smooth area chart with gold accent and live peak/average tracking.
  - `Disk`: Compact usage gauge display.
  - `Network`: Dual-stream inbound and outbound bandwidth graph.
- **Cloud File Manager**: Clean list layout with file-type SVG icon mappings (.js, .ts, .py, .php, .json, .sh, .yaml, images, archives, databases).
- **Enhanced Console**: JetBrains Mono monospace typography, gold terminal accents, custom scrollbars, and **Copy Last 100 Lines** clipboard integration with instant toast notifications.
- **Admin Panel Alignment**: Refreshed blade layout (`resources/views/layouts/admin.blade.php`) matching the MONTE TOP visual identity.

---

## Compatibility

- **Pterodactyl Panel**: 1.x / Latest Release
- **Node.js**: >= 22.0.0
- **Package Manager**: Yarn
- **Build System**: Webpack 5 / Tailwind CSS v3

---

## Deployment & Management Scripts

### Installation
```bash
PANEL_PATH=/var/www/pterodactyl sudo -E ./install.sh
```
`install.sh` creates a timestamped backup in `/var/backups/monte-top/<timestamp>`, copies MONTE TOP source files, and verifies file permissions.

### Build Theme Assets
```bash
PANEL_PATH=/var/www/pterodactyl sudo -E ./build-theme.sh
```
Compiles production frontend bundles via `yarn build:production`.

### Update Theme
```bash
PANEL_PATH=/var/www/pterodactyl sudo -E ./update.sh
```
Creates a fresh backup and updates theme assets.

### Uninstall & Revert
```bash
PANEL_PATH=/var/www/pterodactyl sudo -E ./uninstall.sh
```
Restores original pre-install Pterodactyl frontend files while keeping server databases and Wings configurations completely intact.

### Manual Restore
```bash
PANEL_PATH=/var/www/pterodactyl sudo -E ./restore.sh /var/backups/monte-top/<timestamp>
```

---

## Security & Principles

- **Zero Data Modification**: MONTE TOP only touches frontend presentation layers. It does not store user credentials, modify API endpoints, or break WebSocket / Wings communications.
- **No External Analytics**: All clipboard and console operations run locally inside the user's browser context.

---

## License

MIT License. Pterodactyl remains open-source software under its original license.
