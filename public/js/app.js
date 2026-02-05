/**
 * Node Swatch - Frontend Application
 */

// State
let currentPalette = null;

// DOM Elements
const colorCountSelect = document.getElementById('colorCount');
const harmonyTypeSelect = document.getElementById('harmonyType');
const customAngleGroup = document.getElementById('customAngleGroup');
const customAngleInput = document.getElementById('customAngle');
const baseColorPicker = document.getElementById('baseColorPicker');
const baseColorInput = document.getElementById('baseColor');
const useBaseColorCheckbox = document.getElementById('useBaseColor');
const clearBaseColorBtn = document.getElementById('clearBaseColor');
const generateBtn = document.getElementById('generateBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const swatchContainer = document.getElementById('swatchContainer');
const harmonyBadge = document.getElementById('harmony-badge');
const harmonyDescription = document.getElementById('harmonyDescription');
const copyToast = document.getElementById('copyToast');
const copyToastBody = document.getElementById('copyToastBody');

// Harmony descriptions
const harmonyDescriptions = {
  'random': 'Completely random colors with no specific relationship.',
  'complementary': 'Colors opposite each other on the color wheel (180° apart). Creates high contrast and vibrant combinations.',
  'analogous': 'Colors adjacent to each other on the wheel (±30°). Creates harmonious, serene combinations.',
  'triadic': 'Three colors equally spaced on the wheel (120° apart). Offers vibrant variety while maintaining balance.',
  'split-complementary': 'Base color plus two colors adjacent to its complement. Less tension than complementary.',
  'tetradic': 'Four colors in a rectangular pattern. Rich color scheme with plenty of possibilities.',
  'monochromatic': 'Single hue with varying saturation and lightness. Clean, elegant, and cohesive.',
  'square': 'Four colors evenly spaced (90° apart). Bold and dynamic with equal visual weight.',
  'double-complementary': 'Two complementary pairs (30° apart). Complex but rich color scheme.',
  'custom': 'User-defined angle offset between colors. Full control over the color relationships.'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  generatePalette(); // Generate initial palette
});

function setupEventListeners() {
  // Generate button
  generateBtn.addEventListener('click', generatePalette);

  // Randomize button (ignores base color)
  randomizeBtn.addEventListener('click', () => {
    useBaseColorCheckbox.checked = false;
    harmonyTypeSelect.value = 'random';
    customAngleGroup.style.display = 'none';
    generatePalette();
  });

  // Harmony type change
  harmonyTypeSelect.addEventListener('change', () => {
    customAngleGroup.style.display =
      harmonyTypeSelect.value === 'custom' ? 'block' : 'none';
    updateHarmonyDescription();
  });

  // Color picker sync
  baseColorPicker.addEventListener('input', () => {
    baseColorInput.value = baseColorPicker.value;
    useBaseColorCheckbox.checked = true;
  });

  baseColorInput.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(baseColorInput.value)) {
      baseColorPicker.value = baseColorInput.value;
    }
  });

  // Clear base color
  clearBaseColorBtn.addEventListener('click', () => {
    baseColorInput.value = '';
    useBaseColorCheckbox.checked = false;
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
      e.preventDefault();
      generatePalette();
    }
  });
}

async function generatePalette() {
  const count = colorCountSelect.value;
  const harmony = harmonyTypeSelect.value;
  const angle = customAngleInput.value;
  const useBase = useBaseColorCheckbox.checked;
  const baseColor = useBase && baseColorInput.value ?
    baseColorInput.value.replace('#', '') : '';

  // Build URL
  let url = `/api/palette/${harmony}?count=${count}`;
  if (baseColor) url += `&baseColor=${baseColor}`;
  if (harmony === 'custom') url += `&angle=${angle}`;

  // Set loading state
  generateBtn.classList.add('loading');

  try {
    const response = await fetch(url);
    const palette = await response.json();

    if (palette.error) {
      console.error('API Error:', palette.error);
      return;
    }

    currentPalette = palette;
    updateUI(palette);
  } catch (error) {
    console.error('Failed to generate palette:', error);
  } finally {
    generateBtn.classList.remove('loading');
  }
}

function updateUI(palette) {
  // Update CSS variables
  updateCSSVariables(palette.colors);

  // Update swatches
  renderSwatches(palette.colors);

  // Update harmony badge
  harmonyBadge.textContent = palette.harmony;

  // Update description
  updateHarmonyDescription();
}

function updateCSSVariables(colors) {
  const root = document.documentElement;

  colors.forEach((color, index) => {
    const num = index + 1;
    root.style.setProperty(`--palette-${num}`, color.hex);
    root.style.setProperty(`--palette-${num}-contrast`, getContrastColor(color.hex));
  });

  // Clear unused variables (for when count decreases)
  for (let i = colors.length + 1; i <= 6; i++) {
    root.style.setProperty(`--palette-${i}`, '#cccccc');
    root.style.setProperty(`--palette-${i}-contrast`, '#000000');
  }
}

function renderSwatches(colors) {
  const colClass = getColumnClass(colors.length);

  swatchContainer.innerHTML = colors.map((color, index) => `
    <div class="${colClass}">
      <div class="swatch"
           style="background-color: ${color.hex}; color: ${getContrastColor(color.hex)};"
           onclick="copyColor('${color.hex}')"
           title="Click to copy">
        <i class="bi bi-clipboard swatch-copy-icon"></i>
        <span class="swatch-hex">${color.hex.toUpperCase()}</span>
        <span class="swatch-role">${color.role}</span>
        <span class="swatch-hsl">H:${color.hsl.h}° S:${color.hsl.s}% L:${color.hsl.l}%</span>
      </div>
    </div>
  `).join('');
}

function getColumnClass(count) {
  switch (count) {
    case 2: return 'col-6';
    case 3: return 'col-4';
    case 4: return 'col-3';
    case 5: return 'col';
    case 6: return 'col-2';
    default: return 'col';
  }
}

function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function copyColor(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    copyToastBody.textContent = `${hex.toUpperCase()} copied to clipboard!`;
    const toast = new bootstrap.Toast(copyToast);
    toast.show();
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function updateHarmonyDescription() {
  const harmony = harmonyTypeSelect.value;
  harmonyDescription.textContent = harmonyDescriptions[harmony] || '';
}

// Export functions
function exportPalette(format) {
  if (!currentPalette) return;

  const exportCode = document.getElementById('exportCode');
  let code = '';

  switch (format) {
    case 'css':
      code = generateCSSExport();
      break;
    case 'scss':
      code = generateSCSSExport();
      break;
    case 'json':
      code = generateJSONExport();
      break;
    case 'tailwind':
      code = generateTailwindExport();
      break;
  }

  exportCode.textContent = code;
  const modal = new bootstrap.Modal(document.getElementById('exportModal'));
  modal.show();
}

function generateCSSExport() {
  const lines = [':root {'];
  currentPalette.colors.forEach((color, i) => {
    lines.push(`  --color-${color.role}: ${color.hex};`);
  });
  lines.push('}');
  return lines.join('\n');
}

function generateSCSSExport() {
  const lines = ['// Color Palette Variables'];
  currentPalette.colors.forEach((color, i) => {
    lines.push(`$color-${color.role}: ${color.hex};`);
  });
  lines.push('');
  lines.push('// Color Map');
  lines.push('$palette: (');
  currentPalette.colors.forEach((color, i) => {
    const comma = i < currentPalette.colors.length - 1 ? ',' : '';
    lines.push(`  "${color.role}": ${color.hex}${comma}`);
  });
  lines.push(');');
  return lines.join('\n');
}

function generateJSONExport() {
  return JSON.stringify({
    harmony: currentPalette.harmony,
    colors: currentPalette.colors.map(c => ({
      hex: c.hex,
      hsl: c.hsl,
      role: c.role
    }))
  }, null, 2);
}

function generateTailwindExport() {
  const lines = [
    '// tailwind.config.js',
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {'
  ];

  currentPalette.colors.forEach((color, i) => {
    const name = color.role.replace('-', '');
    const comma = i < currentPalette.colors.length - 1 ? ',' : '';
    lines.push(`        '${name}': '${color.hex}'${comma}`);
  });

  lines.push('      }');
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  return lines.join('\n');
}

function copyExportCode() {
  const code = document.getElementById('exportCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    copyToastBody.textContent = 'Code copied to clipboard!';
    const toast = new bootstrap.Toast(copyToast);
    toast.show();
  });
}

// Make functions available globally for onclick handlers
window.exportPalette = exportPalette;
window.copyExportCode = copyExportCode;
window.copyColor = copyColor;
