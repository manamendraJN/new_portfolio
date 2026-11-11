"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./hooks";

/**
 * Timeline spine. A faint track joins the first and last node (`[data-node]`) and a gold line
 * draws down it as the list scrolls through the viewport; each node lights up (`data-active`)
 * when the line reaches it. Reversible. With reduced motion or no JS the line simply shows in
 * full and the nodes keep their static look.
 */
export function TimelineLine({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);

  useMotion(listRef, ({ gsap }, list) => {
    const track = trackRef.current;
    const fill = fillRef.current;
    const head = headRef.current;
    if (!track || !fill || !head) return;
    const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-node]"));
    if (nodes.length < 2) return;

    let centres: number[] = [];
    const place = () => {
      // Nodes sit inside each <li>, so measure against the list, not offsetTop.
      const base = list.getBoundingClientRect().top;
      centres = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - base + r.height / 2;
      });
      const top = centres[0];
      const height = centres[centres.length - 1] - top;
      track.style.top = `${top}px`;
      track.style.height = `${height}px`;
      centres = centres.map((c) => c - top);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);

    const tween = gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
          onUpdate: (self) => {
            head.style.top = `${self.progress * 100}%`;
            head.style.opacity = self.progress > 0 && self.progress < 1 ? "1" : "0";
            const reached = self.progress * (centres[centres.length - 1] || 1);
            nodes.forEach((n, i) => {
              n.dataset.active = centres[i] <= reached + 1 ? "true" : "false";
            });
          },
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      ro.disconnect();
      nodes.forEach((n) => delete n.dataset.active);
      head.style.top = "";
      head.style.opacity = "";
    };
  });

  return (
    <ol ref={listRef} className="relative ml-1.5 md:ml-2">
      <span
        ref={trackRef}
        aria-hidden="true"
        className="absolute top-3 bottom-0 left-0 w-px -translate-x-1/2 bg-accent/25"
      >
        <span
          ref={fillRef}
          className="absolute inset-0 origin-top bg-accent will-change-transform"
        />
        {/* Glowing head that travels with the tip of the line. */}
        <span
          ref={headRef}
          className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-[0_0_10px_2px_var(--accent)]"
        />
      </span>
      {children}
    </ol>
  );
}
