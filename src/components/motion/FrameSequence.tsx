"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { drawCover, frameUrl, hasFrames } from "@/lib/frames";
import { getGsap, MOTION_OK } from "@/lib/gsap";
import { isSlowConnection } from "./hooks";

type Status = "loading" | "ready" | "fallback";

const LAYERS = [0, 1, 2, 3, 4, 5];
const PRELOAD_CONCURRENCY = 6;

/** Static fallback: receding frames drawn with hairlines and CSS perspective only. */
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
 * The hero stage. Draws the first frame as a poster on a cover-sized canvas.
 * When motion is allowed it also pins the stage and scrubs through the frames
 * as the visitor scrolls (forward and back), fades the hero text out around
 * 40% progress and darkens the last frames into the next section.
 *
 * With reduced motion, on a slow or metered connection, or if the poster fails,
 * there is no pin and no scrub: just the poster (or the static fallback).
 *
 * Expects children to mark the text group with [data-hero-text] and the scroll
 * cue with [data-hero-cue].
 */
export function FrameSequence({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>(hasFrames(site.hero) ? "loading" : "fallback");

  useEffect(() => {
    const cfg = site.hero;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || !hasFrames(cfg)) return;

    const { gsap, ScrollTrigger } = getGsap();
    const variant = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    const frames: Array<HTMLImageElement | undefined> = new Array(cfg.count);
    let target = 0;
    let stopped = false;

    /** Draw the requested frame, or the nearest one that has loaded. */
    const render = (index: number) => {
      for (let d = 0; d < cfg.count; d++) {
        const hit = frames[index - d] ? index - d : frames[index + d] ? index + d : -1;
        if (hit >= 0) {
          drawCover(canvas, frames[hit]!, cfg[variant]);
          canvas.dataset.target = String(index + 1);
          canvas.dataset.drawn = String(hit + 1);
          return;
        }
      }
    };

    const loadFrame = (i: number) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[i] = img;
          if (!stopped && i === target) render(target);
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = frameUrl(cfg, variant, i + 1);
      });

    const mm = gsap.matchMedia(stage);
    const slow = isSlowConnection();
    const section = stage.closest("section");
    // Not pinning: give back the scroll distance the CSS reserved.
    if (slow) section?.setAttribute("data-pin", "off");

    // Pin and scrub: only when motion is allowed and the connection is not slow.
    if (!slow) {
      mm.add(MOTION_OK, () => {
        const text = stage.querySelector("[data-hero-text]");
        const cue = stage.querySelector("[data-hero-cue]");
        const dim = stage.querySelector("[data-hero-dim]");
        const progress = { frame: 0 };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${cfg.pinViewportHeights * 100}%`,
            pin: true,
            pinSpacing: false, // the section already reserves the distance in CSS
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(
          progress,
          {
            frame: cfg.count - 1,
            duration: 1,
            onUpdate: () => {
              const i = Math.round(progress.frame);
              if (i !== target) {
                target = i;
                render(i);
              }
            },
          },
          0,
        );
        if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.08 }, 0.02);
        if (text) tl.to(text, { autoAlpha: 0, y: -48, duration: 0.15 }, 0.25);
        if (dim) tl.to(dim, { opacity: 1, duration: 0.2 }, 0.8);

        const onRefresh = () => render(target);
        ScrollTrigger.addEventListener("refresh", onRefresh);

        // Fetch the remaining frames after the page has loaded, a few at a time.
        const preload = async () => {
          if (document.readyState !== "complete") {
            await new Promise((r) => window.addEventListener("load", r, { once: true }));
          }
          let next = 1;
          const worker = async () => {
            while (!stopped && next < cfg.count) await loadFrame(next++);
          };
          await Promise.all(Array.from({ length: PRELOAD_CONCURRENCY }, worker));
        };
        void preload();

        // Fonts can change the layout after the first measure.
        void document.fonts?.ready.then(() => !stopped && ScrollTrigger.refresh());

        return () => {
          ScrollTrigger.removeEventListener("refresh", onRefresh);
        };
      });
    }

    // The poster is the first frame; it is always loaded, scrubbing or not.
    void loadFrame(0).then((ok) => {
      if (stopped) return;
      if (ok) {
        render(0);
        setStatus("ready");
      } else {
        // No poster: drop the pin and show the static composition.
        mm.revert();
        section?.setAttribute("data-pin", "off");
        setStatus("fallback");
      }
    });

    return () => {
      stopped = true;
      mm.revert();
    };
  }, []);

  const m = site.hero.mobile;
  const mobileAnchorY = m.anchorY ?? 0.5;
  const pictureVw = ((m.height / m.width) * 100) / (m.visibleX ?? 1);

  return (
    <div ref={stageRef} className="relative h-svh overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        {status !== "ready" && <FallbackComposition />}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        />
        {/* Flat scrim keeps text readable over any frame. Not a gradient. */}
        {status === "ready" && <div className="absolute inset-0 bg-bg/35 md:bg-bg/70" />}
      </div>
      {/* Phones: a dark panel across the bottom holds the text. Its top edge fades out over the
          video instead of ending in a straight line. */}
      <div
        aria-hidden="true"
        // The picture is `ph` vw tall (frame aspect / zoom), starting `anchorY` of the free height
        // down. The panel fades in over its last 47vw, so it is fully opaque exactly where the
        // video ends, whatever the zoom.
        style={{
          top: `calc(${mobileAnchorY} * (100svh - ${pictureVw}vw) + ${pictureVw - 47}vw)`,
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_bottom,transparent,var(--bg)_47vw)] md:hidden"
      />
      {/* Fades in over the last frames, handing off to the next section. */}
      <div
        data-hero-dim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-bg opacity-0"
      />
      {children}
    </div>
  );
}
