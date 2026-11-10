"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./hooks";

interface CoverParallaxProps {
  /** id of the section that slides up over this one. */
  coveredBy: string;
  children: ReactNode;
}

/**
 * The section that holds this slides under the next one (see the overlap rule in
 * globals.css). As the next section rises, this content sinks slowly and dims, so the
 * cover reads as depth. Scroll-driven, reversible, and off with reduced motion.
 */
export function CoverParallax({ coveredBy, children }: CoverParallaxProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useMotion(contentRef, ({ gsap }, content) => {
    const cover = document.getElementById(coveredBy);
    if (!cover) return;
    const scrollTrigger = {
      trigger: cover,
      start: "top bottom",
      end: "top top",
      scrub: true,
    };
    gsap.fromTo(
      content,
      { y: 0 },
      {
        y: () => window.innerHeight * 0.16,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, invalidateOnRefresh: true },
      },
    );
    if (shadeRef.current) {
      gsap.fromTo(shadeRef.current, { opacity: 0 }, { opacity: 0.45, ease: "none", scrollTrigger });
    }
  });

  return (
    <>
      <div ref={contentRef}>{children}</div>
      {/* Dark veil, drawn with the dark theme's colour, fades in as the cover rises. */}
      <div
        ref={shadeRef}
        aria-hidden="true"
        data-theme="dark"
        className="pointer-events-none absolute inset-0 bg-bg opacity-0"
      />
    </>
  );
}
