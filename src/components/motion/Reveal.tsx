"use client";

import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { useMotion } from "./hooks";

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: ElementType;
  /** Start offset in px. */
  y?: number;
  delay?: number;
  /** Reveal the direct children one after another instead of the wrapper. */
  stagger?: boolean;
  children: ReactNode;
}

/**
 * Fade and rise into view, once. Content is fully visible without JavaScript
 * or with reduced motion, and anything already on screen at load is left alone,
 * so nothing flashes and nothing shifts.
 */
export function Reveal({
  as: Tag = "div",
  y = 24,
  delay = 0,
  stagger = false,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ gsap }, el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    const targets = stagger ? Array.from(el.children) : el;
    gsap.from(targets, {
      opacity: 0,
      y,
      delay,
      duration: 0.9,
      ease: "power2.out",
      stagger: stagger ? 0.08 : 0,
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
