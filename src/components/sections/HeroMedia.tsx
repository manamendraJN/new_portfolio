"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { drawCover, frameUrl, hasFrames } from "@/lib/frames";

/** Static fallback: receding frames drawn with hairlines and CSS perspective only. */
const LAYERS = [0, 1, 2, 3, 4, 5];

function FallbackComposition() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden [perspective:1400px] lg:items-start lg:justify-end lg:pt-28 lg:pr-[5%]"
    >
      <div
        className="relative h-[58%] w-[88%] max-w-[920px] [transform-style:preserve-3d] lg:h-[46%] lg:w-[44%]"
        style={{ transform: "rotateY(-22deg) rotateX(7deg)" }}
      >
        {LAYERS.map((i) => (
          <div
            key={i}
            className="absolute inset-0 border"
            style={{
              transform: `translateZ(${-i * 110}px)`,
              borderColor: i === 0 ? "var(--accent)" : "var(--line)",
              background: i === LAYERS.length - 1 ? "var(--surface)" : "transparent",
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Hero backdrop. The canvas is in place and draws the first frame as the
 * poster when frames exist (site.hero.count > 0). It does not scrub yet:
 * the scroll-driven sequence arrives in Phase 6. Until a poster has drawn,
 * the static fallback composition is shown.
 */
export function HeroMedia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cfg = site.hero;
    const canvas = canvasRef.current;
    if (!canvas || !hasFrames(cfg)) return;

    const variant = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    const img = new Image();
    img.decoding = "async";
    let cancelled = false;

    const draw = () => drawCover(canvas, img);
    img.onload = () => {
      if (cancelled) return;
      draw();
      setReady(true);
    };
    // On failure the fallback composition simply stays visible.
    img.src = frameUrl(cfg, variant, 1);

    const onResize = () => img.complete && img.naturalWidth > 0 && draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {!ready && <FallbackComposition />}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {/* Flat scrim keeps text readable over any frame. Not a gradient. */}
      {ready && <div className="absolute inset-0 bg-bg/70" />}
    </div>
  );
}
