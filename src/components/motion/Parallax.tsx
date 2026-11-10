"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./hooks";

interface ParallaxProps {
  /** Travel in px, either side of centre. Keep small: this is a hint of depth. */
  amount?: number;
  className?: string;
  children: ReactNode;
}

/** Drifts its content vertically as it crosses the viewport, tied to scroll. */
export function Parallax({ amount = 16, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap }, el) => {
    gsap.fromTo(
      el,
      { y: -amount },
      {
        y: amount,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
