"use client";

import { useRef } from "react";
import { useMotion } from "./hooks";

/**
 * A hairline along the top of a section where the page changes between dark
 * and light. It draws across as the boundary enters the viewport. With reduced
 * motion it simply stays a full-width rule.
 */
export function ThemeEdge() {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap }, el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 100%", end: "top 55%", scrub: true },
      },
    );
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px origin-left bg-accent"
    />
  );
}
