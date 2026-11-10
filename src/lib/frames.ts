import type { FrameSet, HeroFrameConfig } from "./types";

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
 * Draw an image onto a canvas. By default it covers the canvas (object-fit: cover);
 * `visibleX` < 1 zooms out so the picture is smaller than the canvas, leaving the
 * rest empty (the page's charcoal shows through). Canvas pixel size follows its
 * CSS size times devicePixelRatio, capped at 2.
 */
export function drawCover(
  canvas: HTMLCanvasElement,
  img: CanvasImageSource & { width: number; height: number },
  frame: Pick<FrameSet, "visibleX" | "focusX" | "anchorY"> = {},
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { visibleX = 1, focusX = 0.5, anchorY = 0.5 } = frame;
  // Full cover by default; with visibleX < 1, show exactly that fraction of the frame's width.
  const coverW = Math.max(w / img.width, h / img.height) * img.width;
  const dw = visibleX < 1 ? w / Math.max(0.1, visibleX) : coverW;
  const dh = (dw * img.height) / img.width;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) * focusX, (h - dh) * anchorY, dw, dh);
}
