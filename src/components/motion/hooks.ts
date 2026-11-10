"use client";

import { useEffect, type RefObject } from "react";
import { getGsap, MOTION_OK } from "@/lib/gsap";

type Gsap = ReturnType<typeof getGsap>;

/**
 * Run GSAP setup only while the visitor allows motion. Everything created in
 * `setup` is reverted automatically on unmount or when the preference changes
 * to "reduce", leaving the plain static page.
 */
export function useMotion(
  scope: RefObject<Element | null>,
  setup: (g: Gsap, scope: Element) => void,
) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const g = getGsap();
    const mm = g.gsap.matchMedia(el);
    mm.add(MOTION_OK, () => {
      setup(g, el);
    });
    return () => mm.revert();
    // `setup` is intentionally captured once; callers pass stable setup logic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** True when the connection is metered or slow, so heavy media should be skipped. */
export function isSlowConnection(): boolean {
  const c = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  return !!c && (c.saveData === true || c.effectiveType === "slow-2g" || c.effectiveType === "2g");
}
