# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start the Express server on port 3000
npm install        # Install dependencies
```

No test framework is configured.

## Architecture

Node Swatch is a color palette generator with an Express.js API backend and a Bootstrap 5 frontend.

### Backend Flow

```
server.js → src/api/routes.js → src/services/colorGenerator.js → src/utils/colorUtils.js
```

- **server.js**: Express app entry point, serves static files from `public/` and mounts API routes at `/api`
- **src/api/routes.js**: REST endpoints for palette generation
- **src/services/colorGenerator.js**: Implements 10 color harmony algorithms (complementary, analogous, triadic, split-complementary, tetradic, monochromatic, square, double-complementary, custom, random)
- **src/utils/colorUtils.js**: Color space conversions (HSL ↔ RGB ↔ Hex) and utility functions

### API Endpoints

- `GET /api/harmonies` - List available harmony types with descriptions
- `GET /api/palette` - Generate palette with query params: `count` (2-6), `baseColor` (hex), `harmony`, `angle`
- `GET /api/palette/:harmony` - Generate palette for specific harmony type

### Frontend

- **public/index.html**: Bootstrap 5 UI with component previews (buttons, alerts, progress bars, cards, etc.)
- **public/js/app.js**: Handles API calls, updates CSS variables (`--palette-1` through `--palette-6`), and manages export functionality
- **public/css/styles.css**: Custom styles and CSS variable definitions

### Color Generation

All harmony algorithms work in HSL color space. The `generatePalette()` function in `colorGenerator.js` is the main entry point - it accepts options and returns an object with `harmony`, `count`, `baseColor`, and `colors` array (each color has `hex`, `hsl`, and `role` properties).

The project uses ES modules (`"type": "module"` in package.json).
