/**
 * Theme Generator
 *
 * Maps Notion brand configuration (colors, style) to Carbon Design System
 * theme token overrides. Generates a CSS file that overrides Carbon's
 * default tokens with brand-specific values.
 */

// ─── Carbon Base Themes ────────────────────────────────────────────

const BASE_THEMES = {
  White: {
    background: '#ffffff',
    'background-hover': '#e8e8e8',
    'layer-01': '#f4f4f4',
    'layer-02': '#ffffff',
    'layer-03': '#f4f4f4',
    'text-primary': '#161616',
    'text-secondary': '#525252',
    'text-placeholder': '#a8a8a8',
    'text-on-color': '#ffffff',
    'link-primary': '#0f62fe',
    'link-secondary': '#0043ce',
    'icon-primary': '#161616',
    'icon-secondary': '#525252',
    'border-subtle-00': '#e0e0e0',
    'border-subtle-01': '#c6c6c6',
    'border-strong-01': '#8d8d8d',
    'button-primary': '#0f62fe',
    'button-primary-hover': '#0353e9',
    'button-secondary': '#393939',
    'button-tertiary': '#0f62fe',
    'support-error': '#da1e28',
    'support-success': '#198038',
    'support-warning': '#f1c21b',
    'support-info': '#0043ce',
    'focus': '#0f62fe',
    'interactive': '#0f62fe',
    'highlight': '#d0e2ff',
  },
  G10: {
    background: '#f4f4f4',
    'background-hover': '#e8e8e8',
    'layer-01': '#ffffff',
    'layer-02': '#f4f4f4',
    'layer-03': '#ffffff',
    'text-primary': '#161616',
    'text-secondary': '#525252',
    'text-placeholder': '#a8a8a8',
    'text-on-color': '#ffffff',
    'link-primary': '#0f62fe',
    'link-secondary': '#0043ce',
    'icon-primary': '#161616',
    'icon-secondary': '#525252',
    'border-subtle-00': '#e0e0e0',
    'border-subtle-01': '#c6c6c6',
    'border-strong-01': '#8d8d8d',
    'button-primary': '#0f62fe',
    'button-primary-hover': '#0353e9',
    'button-secondary': '#393939',
    'button-tertiary': '#0f62fe',
    'support-error': '#da1e28',
    'support-success': '#198038',
    'support-warning': '#f1c21b',
    'support-info': '#0043ce',
    'focus': '#0f62fe',
    'interactive': '#0f62fe',
    'highlight': '#d0e2ff',
  },
  G90: {
    background: '#262626',
    'background-hover': '#353535',
    'layer-01': '#393939',
    'layer-02': '#525252',
    'layer-03': '#393939',
    'text-primary': '#f4f4f4',
    'text-secondary': '#c6c6c6',
    'text-placeholder': '#6f6f6f',
    'text-on-color': '#ffffff',
    'link-primary': '#78a9ff',
    'link-secondary': '#a6c8ff',
    'icon-primary': '#f4f4f4',
    'icon-secondary': '#c6c6c6',
    'border-subtle-00': '#393939',
    'border-subtle-01': '#525252',
    'border-strong-01': '#8d8d8d',
    'button-primary': '#0f62fe',
    'button-primary-hover': '#0353e9',
    'button-secondary': '#6f6f6f',
    'button-tertiary': '#ffffff',
    'support-error': '#ff8389',
    'support-success': '#42be65',
    'support-warning': '#f1c21b',
    'support-info': '#4589ff',
    'focus': '#ffffff',
    'interactive': '#4589ff',
    'highlight': '#002d9c',
  },
  G100: {
    background: '#161616',
    'background-hover': '#262626',
    'layer-01': '#262626',
    'layer-02': '#393939',
    'layer-03': '#262626',
    'text-primary': '#f4f4f4',
    'text-secondary': '#c6c6c6',
    'text-placeholder': '#6f6f6f',
    'text-on-color': '#ffffff',
    'link-primary': '#78a9ff',
    'link-secondary': '#a6c8ff',
    'icon-primary': '#f4f4f4',
    'icon-secondary': '#c6c6c6',
    'border-subtle-00': '#262626',
    'border-subtle-01': '#393939',
    'border-strong-01': '#6f6f6f',
    'button-primary': '#0f62fe',
    'button-primary-hover': '#0353e9',
    'button-secondary': '#6f6f6f',
    'button-tertiary': '#ffffff',
    'support-error': '#ff8389',
    'support-success': '#42be65',
    'support-warning': '#f1c21b',
    'support-info': '#4589ff',
    'focus': '#ffffff',
    'interactive': '#4589ff',
    'highlight': '#002d9c',
  },
};

// ─── Theme Generation ──────────────────────────────────────────────

/**
 * Generate a Carbon theme CSS override file from Notion site config.
 *
 * @param {Object} params
 * @param {string} params.baseTheme - 'White', 'G10', 'G90', 'G100'
 * @param {string} params.primaryColor - Hex color code (e.g., '#6366f1')
 * @param {string} [params.brandName] - Site name for CSS comments
 * @returns {string} CSS content
 */
export function generateThemeCss({ baseTheme = 'G100', primaryColor, brandName = '' }) {
  const base = BASE_THEMES[baseTheme] || BASE_THEMES.G100;
  const isDark = baseTheme === 'G90' || baseTheme === 'G100';

  // Derive brand colors from primary
  const primary = primaryColor || base.interactive;
  const primaryHover = adjustBrightness(primary, isDark ? 15 : -15);
  const primaryLight = adjustBrightness(primary, isDark ? -60 : 60);
  const primarySubtle = isDark
    ? adjustBrightness(primary, -80)
    : adjustBrightness(primary, 80);

  // Override interactive tokens with brand color
  const overrides = {
    ...base,
    interactive: primary,
    'link-primary': isDark ? adjustBrightness(primary, 30) : primary,
    'link-secondary': isDark ? adjustBrightness(primary, 50) : adjustBrightness(primary, -20),
    'button-primary': primary,
    'button-primary-hover': primaryHover,
    'button-tertiary': isDark ? '#ffffff' : primary,
    focus: isDark ? '#ffffff' : primary,
    highlight: primarySubtle,
  };

  const cssVars = Object.entries(overrides)
    .map(([key, value]) => `  --cds-${key}: ${value};`)
    .join('\n');

  return `/**
 * Carbon Theme Override
 * Generated for: ${brandName || 'intelligentoperations.ai'}
 * Base theme: ${baseTheme}
 * Brand color: ${primary}
 *
 * This file overrides Carbon Design System tokens with brand-specific values.
 * Apply to :root or a data-carbon-theme attribute.
 */

:root,
[data-carbon-theme="${baseTheme.toLowerCase()}"] {
${cssVars}
}

/* Brand-specific utility classes */
.brand-accent { color: ${primary}; }
.brand-accent-bg { background-color: ${primary}; }
.brand-accent-border { border-color: ${primary}; }
.brand-accent-subtle { background-color: ${primarySubtle}; }
.brand-gradient {
  background: linear-gradient(135deg, ${primary} 0%, ${primaryLight} 100%);
}
`;
}

// ─── Color Utilities ───────────────────────────────────────────────

function adjustBrightness(hex, amount) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Convert hex to HSL for better color manipulation.
 */
export function hexToHsl(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
