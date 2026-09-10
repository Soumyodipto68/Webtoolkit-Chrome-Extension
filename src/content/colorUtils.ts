export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export function hexToRgb(hex: string): RGB | null {
  const cleanHex = hex.replace("#", "").trim();

  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (value: number) =>
    Math.round(value).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);

  const min = Math.min(red, green, blue);

  let h = 0;
  let s = 0;

  const l = (max + min) / 2;

  if (max !== min) {
    const difference = max - min;

    s = l > 0.5 ? difference / (2 - max - min) : difference / (max + min);

    switch (max) {
      case red:
        h = (green - blue) / difference + (green < blue ? 6 : 0);
        break;

      case green:
        h = (blue - red) / difference + 2;
        break;

      case blue:
        h = (red - green) / difference + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = h / 360;
  const saturation = s / 100;
  const lightness = l / 100;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);

    return {
      r: value,
      g: value,
      b: value,
    };
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    let adjustedT = t;

    if (adjustedT < 0) {
      adjustedT += 1;
    }

    if (adjustedT > 1) {
      adjustedT -= 1;
    }

    if (adjustedT < 1 / 6) {
      return p + (q - p) * 6 * adjustedT;
    }

    if (adjustedT < 1 / 2) {
      return q;
    }

    if (adjustedT < 2 / 3) {
      return p + (q - p) * (2 / 3 - adjustedT) * 6;
    }

    return p;
  };

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;

  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}
