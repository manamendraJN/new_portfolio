"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./hooks";

interface CoverParallaxProps {
  /** id of the section that slides up over this one. */
  coveredBy: string;
  children: ReactNode;
}

/**
 * Curtain. The section holding this is held in place (sticky, bottom edge at the bottom of the
 * screen) while the next section rises over it, and a dark veil deepens over the held section
 * as it is covered. Scroll-driven and reversible; with reduced motion nothing is applied and
 * the sections simply stack.
 */
export function CoverParallax({ coveredBy, children }: CoverParallaxProps) {
  const shadeRef = useRef<HTMLDivElement>(null);

  useMotion(shadeRef, ({ gsap }, shade) => {
    const section = shade.parentElement as HTMLElement | null;
    const cover = document.getElementById(coveredBy);
    if (!section || !cover) return;

    // Stick with the section's bottom edge at the bottom of the screen. It can be taller than
    // the screen, so the sticky offset is negative and the tail stays in view.
    const stick = () => {
      section.style.top = `${Math.min(0, window.innerHeight - section.offsetHeight)}px`;
    };
    section.style.position = "sticky";
    stick();
    const ro = new ResizeObserver(stick);
    ro.observe(section);
    window.addEventListener("resize", stick);

    const tween = gsap.fromTo(
      shade,
      { opacity: 0 },
      {
        opacity: 0.45,
        ease: "none",
        scrollTrigger: {
          trigger: cover,
          start: "top bottom",
          end: "bottom bottom", // until Contact has fully risen (the end of the page)
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      ro.disconnect();
      window.removeEventListener("resize", stick);
      section.style.position = "";
      section.style.top = "";
    };
  });

  return (
    <>
      {children}
      {/* Dark veil, in the dark theme's colour, fading in as the cover rises. */}
      <div
        ref={shadeRef}
        aria-hidden="true"
        data-theme="dark"
        className="pointer-events-none absolute inset-0 bg-bg opacity-0"
      />
    </>
  );
}
