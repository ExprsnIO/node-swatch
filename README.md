# Node Swatch

A color palette generator built with Node.js and Express that creates harmonious color schemes using color theory principles. Preview your palettes instantly with Bootstrap 5 components.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **9 Color Harmony Types**: Complementary, Analogous, Triadic, Split-complementary, Tetradic, Monochromatic, Square, Double-complementary, and Custom angle
- **2-6 Color Palettes**: Generate swatches with your preferred number of colors
- **Optional Base Color**: Start from a specific color or let it randomize
- **Live Bootstrap Preview**: See your palette applied to buttons, alerts, progress bars, cards, navigation, badges, and more
- **Export Options**: CSS variables, SCSS, JSON, or Tailwind config
- **Click to Copy**: Quickly copy hex codes to clipboard

## Installation

```bash
git clone https://github.com/ExprsnIO/node-swatch.git
cd node-swatch
npm install
```

## Usage

Start the server:

```bash
npm start
```

Open http://localhost:3000 in your browser.

**Keyboard Shortcut**: Press `Space` to generate a new palette.

## API

### List Harmony Types

```
GET /api/harmonies
```

### Generate Palette

```
GET /api/palette
GET /api/palette/:harmony
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | number | 5 | Number of colors (2-6) |
| `baseColor` | string | random | Starting hex color (without #) |
| `harmony` | string | random | Harmony type |
| `angle` | number | 45 | Angle offset for custom harmony |

**Example:**

```bash
curl "http://localhost:3000/api/palette/triadic?count=4&baseColor=3498db"
```

**Response:**

```json
{
  "harmony": "triadic",
  "count": 4,
  "baseColor": "#3498db",
  "colors": [
    { "hex": "#3498db", "hsl": { "h": 204, "s": 70, "l": 53 }, "role": "primary" },
    { "hex": "#db3434", "hsl": { "h": 324, "s": 70, "l": 53 }, "role": "accent-1" },
    { "hex": "#34db98", "hsl": { "h": 84, "s": 70, "l": 53 }, "role": "accent-2" },
    { "hex": "#c76a6a", "hsl": { "h": 324, "s": 55, "l": 68 }, "role": "accent-3" }
  ]
}
```

## Color Harmonies

| Harmony | Description |
|---------|-------------|
| **Complementary** | Base color + 180° opposite |
| **Analogous** | Adjacent colors on the wheel (±30°) |
| **Triadic** | Three colors 120° apart |
| **Split-complementary** | Base + two colors adjacent to complement |
| **Tetradic** | Four colors in rectangle pattern |
| **Monochromatic** | Same hue, varied saturation/lightness |
| **Square** | Four colors 90° apart |
| **Double-complementary** | Two complementary pairs |
| **Custom** | User-defined angle offsets |

## Project Structure

```
node-swatch/
├── server.js                 # Express server
├── src/
│   ├── api/routes.js         # API endpoints
│   ├── services/colorGenerator.js  # Harmony algorithms
│   └── utils/colorUtils.js   # Color conversions
└── public/
    ├── index.html            # Browser UI
    ├── css/styles.css
    └── js/app.js
```

## License

MIT
