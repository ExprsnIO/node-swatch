/**
 * Color palette generator using color theory harmonies
 */

import {
  hexToHsl,
  hslToHex,
  randomHsl,
  normalizeHue
} from '../utils/colorUtils.js';

/**
 * Available harmony types
 */
export const HARMONY_TYPES = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'tetradic',
  'monochromatic',
  'square',
  'double-complementary',
  'custom',
  'random'
];

/**
 * Generate a complementary palette (base + 180° opposite)
 */
function generateComplementary(baseHsl, count) {
  const colors = [baseHsl];
  const complement = { ...baseHsl, h: normalizeHue(baseHsl.h + 180) };
  colors.push(complement);

  // Add variations if more colors needed
  while (colors.length < count) {
    const variation = colors.length % 2 === 0 ? baseHsl : complement;
    colors.push({
      h: variation.h,
      s: Math.max(20, variation.s - (colors.length * 10)),
      l: Math.min(80, variation.l + (colors.length * 8))
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate an analogous palette (colors adjacent on wheel, ±30°)
 */
function generateAnalogous(baseHsl, count) {
  const colors = [baseHsl];
  const angleStep = 30;

  for (let i = 1; i < count; i++) {
    const direction = i % 2 === 1 ? 1 : -1;
    const steps = Math.ceil(i / 2);
    colors.push({
      ...baseHsl,
      h: normalizeHue(baseHsl.h + (angleStep * steps * direction)),
      s: Math.max(30, baseHsl.s - (i * 5)),
      l: Math.max(25, Math.min(75, baseHsl.l + ((i % 3 - 1) * 10)))
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a triadic palette (three colors 120° apart)
 */
function generateTriadic(baseHsl, count) {
  const colors = [
    baseHsl,
    { ...baseHsl, h: normalizeHue(baseHsl.h + 120) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 240) }
  ];

  // Add variations if more colors needed
  while (colors.length < count) {
    const baseIndex = colors.length % 3;
    const base = colors[baseIndex];
    colors.push({
      h: base.h,
      s: Math.max(30, base.s - 15),
      l: Math.min(75, base.l + 15)
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a split-complementary palette (base + two colors adjacent to complement)
 */
function generateSplitComplementary(baseHsl, count) {
  const colors = [
    baseHsl,
    { ...baseHsl, h: normalizeHue(baseHsl.h + 150) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 210) }
  ];

  // Add variations if more colors needed
  while (colors.length < count) {
    const baseIndex = colors.length % 3;
    const base = colors[baseIndex];
    colors.push({
      h: base.h,
      s: Math.max(30, base.s - 20),
      l: Math.min(80, base.l + 10)
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a tetradic/rectangular palette (four colors in rectangle pattern)
 */
function generateTetradic(baseHsl, count) {
  const colors = [
    baseHsl,
    { ...baseHsl, h: normalizeHue(baseHsl.h + 60) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 180) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 240) }
  ];

  // Add variations if more colors needed
  while (colors.length < count) {
    const baseIndex = colors.length % 4;
    const base = colors[baseIndex];
    colors.push({
      h: base.h,
      s: Math.max(30, base.s - 15),
      l: Math.min(75, base.l + 12)
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a monochromatic palette (same hue, varied saturation/lightness)
 */
function generateMonochromatic(baseHsl, count) {
  const colors = [baseHsl];

  for (let i = 1; i < count; i++) {
    const lightnessStep = 60 / count;
    const saturationVariation = (i % 2 === 0 ? -10 : 10) * Math.ceil(i / 2);

    colors.push({
      h: baseHsl.h,
      s: Math.max(20, Math.min(90, baseHsl.s + saturationVariation)),
      l: Math.max(20, Math.min(80, 20 + (i * lightnessStep)))
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a square palette (four colors 90° apart)
 */
function generateSquare(baseHsl, count) {
  const colors = [
    baseHsl,
    { ...baseHsl, h: normalizeHue(baseHsl.h + 90) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 180) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 270) }
  ];

  // Add variations if more colors needed
  while (colors.length < count) {
    const baseIndex = colors.length % 4;
    const base = colors[baseIndex];
    colors.push({
      h: base.h,
      s: Math.max(30, base.s - 20),
      l: Math.min(75, base.l + 15)
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a double-complementary palette (two complementary pairs)
 */
function generateDoubleComplementary(baseHsl, count) {
  const colors = [
    baseHsl,
    { ...baseHsl, h: normalizeHue(baseHsl.h + 30) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 180) },
    { ...baseHsl, h: normalizeHue(baseHsl.h + 210) }
  ];

  // Add variations if more colors needed
  while (colors.length < count) {
    const baseIndex = colors.length % 4;
    const base = colors[baseIndex];
    colors.push({
      h: base.h,
      s: Math.max(30, base.s - 15),
      l: Math.min(80, base.l + 10)
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a custom palette with user-defined angle offset
 */
function generateCustom(baseHsl, count, angle = 45) {
  const colors = [baseHsl];

  for (let i = 1; i < count; i++) {
    colors.push({
      ...baseHsl,
      h: normalizeHue(baseHsl.h + (angle * i)),
      s: Math.max(30, baseHsl.s - (i * 5)),
      l: Math.max(25, Math.min(75, baseHsl.l + ((i % 3 - 1) * 8)))
    });
  }

  return colors.slice(0, count);
}

/**
 * Generate a random palette
 */
function generateRandom(baseHsl, count) {
  const colors = [baseHsl];

  for (let i = 1; i < count; i++) {
    colors.push(randomHsl());
  }

  return colors;
}

/**
 * Generate a color palette based on harmony type
 * @param {Object} options
 * @param {string} options.harmony - Harmony type
 * @param {number} options.count - Number of colors (2-6)
 * @param {string} [options.baseColor] - Base color in hex (optional)
 * @param {number} [options.angle] - Custom angle for 'custom' harmony
 * @returns {Object} Palette with colors array and metadata
 */
export function generatePalette(options) {
  const {
    harmony = 'random',
    count = 5,
    baseColor,
    angle = 45
  } = options;

  // Validate count
  const colorCount = Math.max(2, Math.min(6, parseInt(count) || 5));

  // Get or generate base color in HSL
  const baseHsl = baseColor ? hexToHsl(baseColor) : randomHsl();

  // Generate colors based on harmony type
  let hslColors;

  switch (harmony.toLowerCase()) {
    case 'complementary':
      hslColors = generateComplementary(baseHsl, colorCount);
      break;
    case 'analogous':
      hslColors = generateAnalogous(baseHsl, colorCount);
      break;
    case 'triadic':
      hslColors = generateTriadic(baseHsl, colorCount);
      break;
    case 'split-complementary':
      hslColors = generateSplitComplementary(baseHsl, colorCount);
      break;
    case 'tetradic':
      hslColors = generateTetradic(baseHsl, colorCount);
      break;
    case 'monochromatic':
      hslColors = generateMonochromatic(baseHsl, colorCount);
      break;
    case 'square':
      hslColors = generateSquare(baseHsl, colorCount);
      break;
    case 'double-complementary':
      hslColors = generateDoubleComplementary(baseHsl, colorCount);
      break;
    case 'custom':
      hslColors = generateCustom(baseHsl, colorCount, angle);
      break;
    case 'random':
    default:
      hslColors = generateRandom(baseHsl, colorCount);
      break;
  }

  // Convert to hex and build response
  const colors = hslColors.map((hsl, index) => ({
    hex: hslToHex(hsl.h, hsl.s, hsl.l),
    hsl: hsl,
    role: index === 0 ? 'primary' : `accent-${index}`
  }));

  return {
    harmony: harmony.toLowerCase(),
    count: colorCount,
    baseColor: colors[0].hex,
    colors
  };
}
