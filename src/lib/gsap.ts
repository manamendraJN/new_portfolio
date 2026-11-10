/**
 * Single registration point for GSAP. Import only from client components.
 * All motion in the site goes through this file; there is no other animation library.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browser bars resize the viewport while scrolling; don't re-measure on those.
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Media query under which motion is allowed. Everything else stays static. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
