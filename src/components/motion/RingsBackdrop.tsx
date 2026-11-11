"use client";

import { useRef } from "react";
import { useMotion } from "./hooks";

const RINGS = [90, 150, 215, 285, 360, 440];

/**
 * Decorative hairline rings that slowly breathe, one after another. Sits behind a section's
 * content, plays only while the section is on screen, and is static with reduced motion.
 */
export function RingsBackdrop() {
  const ref = useRef<SVGSVGElement>(null);

  useMotion(ref, ({ gsap, ScrollTrigger }, svg) => {
    const rings = svg.querySelectorAll("circle");
    const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    tl.to(rings, {
      scale: 1.07,
      transformOrigin: "50% 50%",
      duration: 4.5,
      ease: "sine.inOut",
      stagger: { each: 0.5, from: "start" },
    });
    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    return () => {
      st.kill();
      tl.kill();
    };
  });

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="-460 -460 920 920"
      className="pointer-events-none absolute -bottom-72 -left-72 h-[640px] w-[640px] md:h-[820px] md:w-[820px]"
    >
      {RINGS.map((r, i) => (
        <circle
          key={r}
          r={r}
          fill="none"
          stroke={i === 2 ? "var(--accent)" : "var(--line)"}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={i === 2 ? 0.55 : 1}
        />
      ))}
    </svg>
  );
}
