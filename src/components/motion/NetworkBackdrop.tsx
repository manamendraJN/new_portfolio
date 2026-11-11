"use client";

import { useRef } from "react";
import { useMotion } from "./hooks";

/** Fixed layout (so server and client render identically). Coordinates in a 1200 x 700 box. */
const NODES: Array<[number, number]> = [
  [60, 560],
  [190, 430],
  [140, 650],
  [320, 520],
  [260, 330],
  [430, 610],
  [470, 420],
  [360, 200],
  [600, 520],
  [640, 330],
  [800, 600],
  [850, 410],
  [960, 250],
  [1060, 470],
  [1130, 330],
  [720, 150],
  [1140, 620],
  [560, 120],
];
const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [3, 5],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 6],
  [5, 8],
  [6, 9],
  [7, 17],
  [9, 15],
  [8, 9],
  [8, 10],
  [9, 11],
  [10, 11],
  [11, 12],
  [11, 13],
  [12, 14],
  [13, 14],
  [13, 16],
  [10, 16],
  [15, 12],
  [6, 8],
  [17, 9],
];
/** Edges that carry a travelling signal. */
const SIGNALS = [2, 5, 10, 13, 17, 21, 24, 8];

/**
 * A quiet network of nodes joined by hairlines, with a few gold signals travelling along the
 * links: the idea of getting in touch. Sits behind a section's content, plays only while the
 * section is on screen, and is a still network with reduced motion.
 */
export function NetworkBackdrop() {
  const ref = useRef<SVGSVGElement>(null);

  useMotion(ref, ({ gsap, ScrollTrigger }, svg) => {
    const timelines = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-signal]")).map(
      (dot, i) => {
        const [a, b] = EDGES[SIGNALS[i]];
        const from = NODES[i % 2 ? b : a];
        const to = NODES[i % 2 ? a : b];
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.2 + (i % 3) * 0.7,
          delay: i * 0.8,
          paused: true,
        });
        tl.set(dot, { attr: { cx: from[0], cy: from[1] } })
          .to(dot, { opacity: 1, duration: 0.3 })
          .to(dot, { attr: { cx: to[0], cy: to[1] }, duration: 2.2, ease: "sine.inOut" }, 0)
          .to(dot, { opacity: 0, duration: 0.35 }, 1.9);
        return tl;
      },
    );
    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => timelines.forEach((tl) => (self.isActive ? tl.play() : tl.pause())),
    });
    return () => {
      st.kill();
      timelines.forEach((tl) => tl.kill());
    };
  });

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    >
      {EDGES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="var(--line)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 5 === 0 ? 5 : 3}
          fill="var(--bg)"
          stroke={i % 5 === 0 ? "var(--accent)" : "var(--line)"}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {SIGNALS.map((e) => (
        <circle key={`s-${e}`} data-signal r={3} fill="var(--accent)" opacity={0} cx={0} cy={0} />
      ))}
    </svg>
  );
}
