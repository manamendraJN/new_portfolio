import type { Theme } from "./types";

/**
 * Mirror of src/styles/tokens.css, used only by the styleguide to compute
 * WCAG contrast. Keep in sync with the CSS variables.
 */
export const palette: Record<Theme, Record<string, string>> = {
  dark: {
    bg: "#1C1B19",
    surface: "#262522",
    raised: "#302E2A",
    fg: "#F0ECE3",
    muted: "#A8A49B",
    line: "#3A3833",
    accent: "#C9B37E",
    "accent-text": "#C9B37E",
    link: "#8FA3C8",
  },
  light: {
    bg: "#F4F1EA",
    surface: "#EAE5DA",
    raised: "#FFFFFF",
    fg: "#1A1917",
    muted: "#625E57",
    line: "#D9D3C6",
    accent: "#8C6D3F",
    "accent-text": "#765A30",
    link: "#3D5A8A",
  },
};

function luminance(hex: string): number {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
