"use client";

import { Briefcase, Code, Mail, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { useMotion } from "@/components/motion/hooks";
import { Label } from "@/components/ui";

const W = 380;
const H = 253;
const HUB = { x: 281, y: 126 };
const SATELLITES = [
  { label: "Email", Icon: Mail, x: 54, y: 40 },
  { label: "GitHub", Icon: Code, x: 30, y: 130 },
  { label: "LinkedIn", Icon: Briefcase, x: 78, y: 208 },
];

/**
 * A small hub-and-spoke picture for "get in touch": Email, GitHub and LinkedIn linked to a
 * message node, with signals travelling in along each link. Decorative; still with reduced
 * motion; plays only while on screen.
 */
export function ContactConnect() {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap, ScrollTrigger }, root) => {
    const timelines: gsap.core.Timeline[] = [];
    root.querySelectorAll<SVGCircleElement>("[data-signal]").forEach((dot, i) => {
      const s = SATELLITES[i];
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: i * 0.9, paused: true });
      tl.set(dot, { attr: { cx: s.x, cy: s.y } })
        .to(dot, { opacity: 1, duration: 0.25 })
        .to(dot, { attr: { cx: HUB.x, cy: HUB.y }, duration: 2, ease: "sine.inOut" }, 0)
        .to(dot, { opacity: 0, duration: 0.3 }, 1.8);
      timelines.push(tl);
    });
    const pulse = root.querySelector<SVGCircleElement>("[data-pulse]");
    if (pulse) {
      const tl = gsap.timeline({ repeat: -1, paused: true });
      tl.fromTo(
        pulse,
        { attr: { r: 26 }, opacity: 0.6 },
        { attr: { r: 52 }, opacity: 0, duration: 2.6, ease: "power1.out" },
      );
      timelines.push(tl);
    }
    const st = ScrollTrigger.create({
      trigger: root,
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
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mt-4 aspect-[380/253] w-full max-w-[380px]"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        {SATELLITES.map((s) => (
          <line
            key={s.label}
            x1={s.x}
            y1={s.y}
            x2={HUB.x}
            y2={HUB.y}
            stroke="var(--line)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle
          data-pulse
          cx={HUB.x}
          cy={HUB.y}
          r={26}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1}
          opacity={0}
          vectorEffect="non-scaling-stroke"
        />
        {SATELLITES.map((s) => (
          <circle
            key={`sig-${s.label}`}
            data-signal
            r={3.5}
            fill="var(--accent)"
            opacity={0}
            cx={s.x}
            cy={s.y}
          />
        ))}
      </svg>

      {/* Hub */}
      <div
        className="absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-bg text-accent"
        style={{ left: `${(HUB.x / W) * 100}%`, top: `${(HUB.y / H) * 100}%` }}
      >
        <MessageCircle size={22} />
      </div>

      {/* Satellites */}
      {SATELLITES.map(({ label, Icon, x, y }) => (
        <div
          key={label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
          style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
        >
          <span className="flex size-11 items-center justify-center rounded-full border border-line bg-bg">
            <Icon size={18} />
          </span>
          <Label>{label}</Label>
        </div>
      ))}
    </div>
  );
}
