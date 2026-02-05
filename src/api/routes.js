/**
 * API routes for palette generation
 */

import { Router } from 'express';
import { generatePalette, HARMONY_TYPES } from '../services/colorGenerator.js';

const router = Router();

/**
 * GET /api/harmonies
 * List available harmony types
 */
router.get('/harmonies', (req, res) => {
  res.json({
    harmonies: HARMONY_TYPES,
    descriptions: {
      'complementary': 'Base color + 180° opposite',
      'analogous': 'Colors adjacent on the wheel (±30°)',
      'triadic': 'Three colors 120° apart',
      'split-complementary': 'Base + two colors adjacent to complement',
      'tetradic': 'Four colors in rectangle pattern (60°/180°/240°)',
      'monochromatic': 'Same hue with varied saturation and lightness',
      'square': 'Four colors 90° apart',
      'double-complementary': 'Two complementary pairs (30° apart)',
      'custom': 'User-defined angle offsets',
      'random': 'Completely random colors'
    }
  });
});

/**
 * GET /api/palette
 * Generate a random palette
 * Query params:
 *   - count: number of colors (2-6, default: 5)
 *   - baseColor: starting hex color (optional)
 *   - harmony: harmony type (default: random)
 *   - angle: custom angle for 'custom' harmony
 */
router.get('/palette', (req, res) => {
  const { count, baseColor, harmony, angle } = req.query;

  const palette = generatePalette({
    harmony: harmony || 'random',
    count: count ? parseInt(count) : 5,
    baseColor: baseColor ? `#${baseColor.replace('#', '')}` : undefined,
    angle: angle ? parseInt(angle) : 45
  });

  res.json(palette);
});

/**
 * GET /api/palette/:harmony
 * Generate a palette with specific harmony type
 * Query params:
 *   - count: number of colors (2-6, default: 5)
 *   - baseColor: starting hex color (optional)
 *   - angle: custom angle for 'custom' harmony
 */
router.get('/palette/:harmony', (req, res) => {
  const { harmony } = req.params;
  const { count, baseColor, angle } = req.query;

  if (!HARMONY_TYPES.includes(harmony.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid harmony type',
      validTypes: HARMONY_TYPES
    });
  }

  const palette = generatePalette({
    harmony,
    count: count ? parseInt(count) : 5,
    baseColor: baseColor ? `#${baseColor.replace('#', '')}` : undefined,
    angle: angle ? parseInt(angle) : 45
  });

  res.json(palette);
});

export default router;
