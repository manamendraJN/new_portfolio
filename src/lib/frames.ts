import type { HeroFrameConfig } from "./types";

export type FrameVariant = "desktop" | "mobile";

/** URL of a 1-indexed frame in the configured set. */
export function frameUrl(cfg: HeroFrameConfig, variant: FrameVariant, index: number): string {
  const set = cfg[variant];
  const n = String(index).padStart(cfg.pad, "0");
  return `${set.path}frame-${n}.${cfg.extension}`;
}

/** True once frames exist. Until then the static fallback composition is shown. */
export function hasFrames(cfg: HeroFrameConfig): boolean {
  return cfg.count > 0;
}

/**
 * Draw an image onto a canvas with object-fit: cover behaviour.
 * Canvas pixel size follows its CSS size times devicePixelRatio, capped at 2.
 */
export function drawCover(
  canvas: HTMLCanvasElement,
  img: CanvasImageSource & { width: number; height: number },
  focusX = 0.5,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) * focusX, (h - dh) / 2, dw, dh);
}
