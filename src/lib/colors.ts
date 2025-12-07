
export const DARK_SHADES = {
  'forest-green': '#035243',
  'ground-brown': '#724b30',
  'brick-red': '#a53939',
  'night-violet': '#332873',
};

export const PASTELS = {
  'pastel-brown': '#DDD0C7',
  'pastel-violet': '#DAD7F4',
  'pastel-green': '#cff0e9',
  'pastel-orange': '#FFE2D8',
  'pastel-pink': '#FFE3EE',
  'pastel-cyan': '#D5F7F3',
  'pastel-red': '#F4D7D7',
  'pastel-yellow': '#FFF4C3',
};

export const COLOR_PALETTE = {
  ...DARK_SHADES,
  ...PASTELS
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Calculate distance between two colors
const getColorDistance = (color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }) => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2)
  );
};

export const findClosestColor = (hex: string, palette: Record<string, string> = COLOR_PALETTE): string => {
  const targetRgb = hexToRgb(hex);
  if (!targetRgb) return Object.keys(palette)[0]; // Default fallback

  let minDistance = Infinity;
  let closestColor = Object.keys(palette)[0];

  Object.entries(palette).forEach(([name, paletteHex]) => {
    const paletteRgb = hexToRgb(paletteHex);
    if (paletteRgb) {
      const distance = getColorDistance(targetRgb, paletteRgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    }
  });

  return closestColor;
};

export const isLightColor = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  // Calculate relative luminance
  // Formula from WCAG 2.0
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5;
};
