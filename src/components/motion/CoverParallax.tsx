"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./hooks";

interface CoverParallaxProps {
  /** id of the section that slides up over this one. */
  coveredBy: string;
  children: ReactNode;
}

/**
 * Curtain reveal. The section holding this stays put (sticky, with its bottom edge at the
 * bottom of the screen) while the next section, at least a screen tall, slides up over it.
 * A dark veil deepens over it as it is covered. Scroll-driven and reversible; with reduced
 * motion nothing is applied and the two sections simply stack.
 */
export function CoverParallax({ coveredBy, children }: CoverParallaxProps) {
  const shadeRef = useRef<HTMLDivElement>(null);

  useMotion(shadeRef, ({ gsap }, shade) => {
    const section = shade.parentElement as HTMLElement | null;
    const cover = document.getElementById(coveredBy);
    if (!section || !cover) return;

    // Stick with the section's bottom edge at the bottom of the screen. Its content may be
    // taller than the screen, so the sticky offset is negative: the tail stays in view.
    const stick = () => {
      section.style.top = `${window.innerHeight - section.offsetHeight}px`;
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
        opacity: 0.6,
        ease: "none",
        scrollTrigger: { trigger: cover, start: "top bottom", end: "top top", scrub: true },
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
