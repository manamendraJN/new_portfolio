"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Heading, Label } from "@/components/ui";
import { getGsap, MOTION_OK } from "@/lib/gsap";
import type { Project } from "@/lib/types";
import "@/styles/projects.css";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVisual } from "./ProjectVisual";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Place panel `i` on the ellipse for a rotation of `r` projects.
 * x = radiusX · sin θ and z = radiusZ · cos θ (the radii live in CSS).
 */
function panelState(i: number, r: number, n: number) {
  let d = (((i - r) % n) + n) % n;
  if (d > n / 2) d -= n;
  const theta = (d * 2 * Math.PI) / n;
  const sx = Math.sin(theta);
  const cz = Math.cos(theta);
  return {
    sx: sx.toFixed(4),
    cz: cz.toFixed(4),
    d: ((1 + cz) / 2).toFixed(4),
    // Fully shown at the front and sides, fading out as a panel swings round the back.
    vis: smooth(-0.35, 0.25, cz).toFixed(4),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectsCarouselProps {
  projects: Project[];
  /** Section heading, pinned together with the carousel. */
  header: ReactNode;
}

/**
 * 3D elliptical carousel. One rotation value drives everything; buttons, arrow
 * keys, drag/swipe and (when pinned) page scroll all move it through `moveTo`.
 *
 * - Pinned (tablet/desktop, motion allowed, viewport tall enough): page scroll IS
 *   the rotation. Every other input moves the scroll position, so they can never
 *   disagree. The pin distance is reserved in CSS, so layout never shifts.
 * - Not pinned (mobile): a GSAP tween drives the rotation, and the ring turns
 *   once into place as it enters the viewport.
 * - Reduced motion / no JS: CSS hides this and shows the plain list instead.
 */
export function ProjectsCarousel({ projects, header }: ProjectsCarouselProps) {
  const n = projects.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0);
  const activeRef = useRef(0);
  const draggedRef = useRef(false);
  const introRef = useRef<"idle" | "armed" | "done">("idle");
  const api = useRef<{ moveTo: (i: number) => void; step: (d: number) => void }>({
    moveTo: () => {},
    step: () => {},
  });
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const wrap = wrapRef.current;
    const block = blockRef.current;
    const stage = stageRef.current;
    if (!wrap || !block || !stage || n < 2) return;

    const { gsap, ScrollTrigger } = getGsap();
    const panels = Array.from(stage.querySelectorAll<HTMLElement>("[data-pj-panel]"));
    const section = document.getElementById("projects");

    /** Write the rotation to the DOM. Four numbers per panel; the rest is CSS. */
    const render = (r: number) => {
      rotRef.current = r;
      panels.forEach((el, i) => {
        const s = panelState(i, r, n);
        el.style.setProperty("--sx", s.sx);
        el.style.setProperty("--cz", s.cz);
        el.style.setProperty("--d", s.d);
        el.style.setProperty("--vis", s.vis);
        el.dataset.hidden = String(Number(s.vis) < 0.02);
      });
      const a = clamp(Math.round(r), 0, n - 1);
      if (a !== activeRef.current) {
        activeRef.current = a;
        setActive(a);
        setAnnounce(`Project ${a + 1} of ${n}: ${projects[a].title}, ${projects[a].category}`);
      }
    };

    const mm = gsap.matchMedia(wrap);
    mm.add({ pin: "(min-width: 768px) and (min-height: 700px)", ok: MOTION_OK }, (ctx) => {
      const { pin, ok } = ctx.conditions as { pin: boolean; ok: boolean };
      if (!ok) return; // reduced motion: the list is shown instead

      let st: ScrollTrigger | undefined;
      let tween: gsap.core.Tween | undefined;
      let dragging = false;
      let target: number | null = null;
      const spin = { r: rotRef.current };

      // Pin only if the whole block fits in view when the section's top sits under the nav
      // (that is exactly where an anchor link lands); otherwise hand back the reserved space.
      const NAV = 64;
      const pinned = pin && NAV + wrap.offsetTop + block.offsetHeight + 24 <= window.innerHeight;
      if (pinned) wrap.removeAttribute("data-pin");
      else wrap.setAttribute("data-pin", "off");

      if (pinned) {
        const dist = parseFloat(getComputedStyle(wrap).paddingBottom) || 1;
        st = ScrollTrigger.create({
          trigger: block,
          // Pinned where the block already sits when the section's top meets the nav, so
          // the pin starts exactly where an anchor link lands and nothing jumps.
          start: () => `top ${NAV + wrap.offsetTop}px`,
          end: `+=${dist}`,
          pin: true,
          pinSpacing: false, // the wrapper already reserves the distance in CSS
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress * (n - 1)),
          // One project per step. Not while dragging, so a held drag is never fought.
          snap: {
            snapTo: (value, self) => {
              // Stand down while we are driving: a held drag, or one of our own moves in flight.
              if (dragging || target !== null) return value;
              const raw = value * (n - 1);
              const dir = self?.direction ?? 1;
              // A nudge must travel past 15% of a step to move on, so landing a few pixels
              // inside the range (an anchor link, a stop mid-scroll) never skips a project.
              const t = dir > 0 ? Math.ceil(raw - 0.15) : Math.floor(raw + 0.15);
              return clamp(t, 0, n - 1) / (n - 1);
            },
            duration: { min: 0.25, max: 0.7 },
            ease: "power2.inOut",
            delay: 0.08,
          },
        });
        render(st.progress * (n - 1));
      } else if (
        introRef.current !== "done" &&
        wrap.getBoundingClientRect().top > window.innerHeight * 0.8
      ) {
        // Mobile: turn once into place as the section enters the viewport.
        introRef.current = "armed";
        spin.r = -1.8;
        render(-1.8);
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 80%",
          once: true,
          onEnter: () => {
            tween = gsap.to(spin, {
              r: 0,
              duration: 1.3,
              ease: "power3.out",
              onUpdate: () => render(spin.r),
              onComplete: () => (introRef.current = "done"),
            });
          },
        });
      }

      const scrollPos = (r: number) => st!.start + (r / (n - 1)) * (st!.end - st!.start);

      /** The one way every input turns the carousel to a project. */
      const moveTo = (i: number) => {
        const t = clamp(Math.round(i), 0, n - 1);
        target = t;
        if (pinned && st) {
          gsap.to(window, {
            scrollTo: { y: scrollPos(t), autoKill: true },
            duration: 0.85,
            ease: "power3.inOut",
            overwrite: true,
            onComplete: () => (target = null),
            onInterrupt: () => (target = null),
          });
        } else {
          tween?.kill();
          spin.r = rotRef.current;
          tween = gsap.to(spin, {
            r: t,
            duration: 0.75,
            ease: "power3.inOut",
            onUpdate: () => render(spin.r),
            onComplete: () => (target = null),
          });
        }
      };
      const step = (d: number) => moveTo((target ?? Math.round(rotRef.current)) + d);
      api.current = { moveTo, step };

      // ---- drag / swipe, with momentum, snapping on release -------------------
      let drag: {
        id: number;
        x0: number;
        r0: number;
        moved: boolean;
        samples: { x: number; t: number }[];
      } | null = null;
      const perStep = () => Math.max(120, stage.clientWidth * 0.3);
      const bound = (r: number) =>
        pinned
          ? clamp(r, 0, n - 1)
          : r < 0
            ? r * 0.35
            : r > n - 1
              ? n - 1 + (r - (n - 1)) * 0.35
              : r;
      const apply = (r: number) => {
        if (pinned && st)
          window.scrollTo(0, scrollPos(r)); // onUpdate renders
        else render(r);
      };

      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        tween?.kill();
        gsap.killTweensOf(window);
        target = null;
        draggedRef.current = false;
        drag = {
          id: e.pointerId,
          x0: e.clientX,
          r0: rotRef.current,
          moved: false,
          samples: [{ x: e.clientX, t: e.timeStamp }],
        };
      };
      const onMove = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x0;
        if (!drag.moved) {
          if (Math.abs(dx) < 6) return;
          drag.moved = true;
          dragging = true;
          draggedRef.current = true;
          stage.classList.add("is-dragging");
          try {
            stage.setPointerCapture(e.pointerId);
          } catch {
            /* pointer already gone */
          }
        }
        drag.samples.push({ x: e.clientX, t: e.timeStamp });
        if (drag.samples.length > 6) drag.samples.shift();
        apply(bound(drag.r0 - dx / perStep()));
      };
      const onUp = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag;
        drag = null;
        if (!d.moved) return;
        dragging = false;
        stage.classList.remove("is-dragging");
        // Momentum only for a real flick: judge speed from the last 100ms, so a drag
        // that is held still before release simply snaps to the nearest project.
        const recent = d.samples.filter((smp) => e.timeStamp - smp.t <= 100);
        let velocity = 0; // projects per second
        if (recent.length >= 2) {
          const first = recent[0];
          const last = recent[recent.length - 1];
          velocity = (-(last.x - first.x) / Math.max(16, last.t - first.t)) * (1000 / perStep());
        }
        const momentum = Math.abs(velocity) > 2.5 ? clamp(velocity * 0.07, -0.35, 0.35) : 0;
        moveTo(Math.round(rotRef.current + momentum));
        window.setTimeout(() => (draggedRef.current = false), 80);
      };
      const noNativeDrag = (e: Event) => e.preventDefault();

      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
      stage.addEventListener("dragstart", noNativeDrag);

      // ---- arrow keys, one project at a time, while the section is on screen ----
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
        const el = e.target as HTMLElement | null;
        if (el?.closest("input, textarea, select, [contenteditable='true'], [role='textbox']"))
          return;
        const rect = (section ?? wrap).getBoundingClientRect();
        const vh = window.innerHeight;
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible < Math.min(rect.height, vh) * 0.35) return;
        e.preventDefault();
        step(e.key === "ArrowRight" ? 1 : -1);
      };
      document.addEventListener("keydown", onKey);

      return () => {
        // Torn down before the intro played: put the ring back so it is never left mid-turn.
        if (introRef.current === "armed") {
          introRef.current = "idle";
          render(0);
        }
        tween?.kill();
        gsap.killTweensOf(window);
        st?.kill();
        stage.classList.remove("is-dragging");
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", onUp);
        stage.removeEventListener("pointercancel", onUp);
        stage.removeEventListener("dragstart", noNativeDrag);
        document.removeEventListener("keydown", onKey);
        api.current = { moveTo: () => {}, step: () => {} };
      };
    });

    return () => mm.revert();
  }, [n, projects]);

  const initial = (i: number) => {
    const s = panelState(i, 0, n);
    return { "--sx": s.sx, "--cz": s.cz, "--d": s.d, "--vis": s.vis } as CSSProperties;
  };

  return (
    <div
      ref={wrapRef}
      className="projects-carousel projects-pin"
      style={{ "--projects-n": n } as CSSProperties}
    >
      <div ref={blockRef}>
        {header}
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Projects"
          className="grid grid-cols-12 items-center gap-y-8 lg:gap-x-10"
        >
          <div className="col-span-12 lg:col-span-7">
            <div
              ref={stageRef}
              className="pj-stage"
              onClickCapture={(e) => {
                // A drag must never count as a click on a panel or link.
                if (draggedRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="pj-ring">
                <div className="pj-track">
                  {projects.map((p, i) => {
                    const front = i === active;
                    const s = panelState(i, 0, n);
                    return (
                      <div
                        key={p.slug}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} of ${n}`}
                        aria-hidden={!front}
                        data-pj-panel
                        data-front={front}
                        data-hidden={Number(s.vis) < 0.02}
                        style={initial(i)}
                        className="pj-panel"
                        onClick={() => {
                          if (!draggedRef.current && i !== activeRef.current) api.current.moveTo(i);
                        }}
                      >
                        <ProjectVisual
                          project={p}
                          fill
                          priority={i === 0}
                          sizes="(min-width: 1024px) 420px, 64vw"
                        />
                        {/* Only the front panel is a link (and so focusable). */}
                        {front && (
                          <Link
                            href={`/projects/${p.slug}`}
                            aria-label={`Open case study: ${p.title}`}
                            className="absolute inset-0 z-10"
                            draggable={false}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
              <button
                type="button"
                aria-label="Previous project"
                aria-disabled={active === 0}
                onClick={() => api.current.step(-1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-fg/40 transition-[border-color,background-color,opacity] duration-200 hover:border-fg hover:bg-fg/5 aria-disabled:cursor-default aria-disabled:opacity-35 aria-disabled:hover:border-fg/40 aria-disabled:hover:bg-transparent"
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <button
                type="button"
                aria-label="Next project"
                aria-disabled={active === n - 1}
                onClick={() => api.current.step(1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-fg/40 transition-[border-color,background-color,opacity] duration-200 hover:border-fg hover:bg-fg/5 aria-disabled:cursor-default aria-disabled:opacity-35 aria-disabled:hover:border-fg/40 aria-disabled:hover:bg-transparent"
              >
                <ChevronRight aria-hidden="true" size={20} />
              </button>
              <Label>
                {pad(active + 1)} / {pad(n)}
              </Label>
            </div>
          </div>

          {/* Details: all stacked in one cell so the height is constant; they cross-fade. */}
          <div className="col-span-12 grid min-w-0 grid-cols-[minmax(0,1fr)] lg:col-span-5">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                aria-hidden={i !== active}
                inert={i !== active}
                data-active={i === active}
                className="pj-detail col-start-1 row-start-1 space-y-5"
              >
                <Label accent>
                  {pad(i + 1)} / {pad(n)}
                </Label>
                <Heading level={3} variant="project">
                  {p.title}
                </Heading>
                <Label as="p">{p.category}</Label>
                <p className="max-w-[var(--measure)] text-muted">{p.description}</p>
                <ul aria-label="Technologies" className="flex flex-wrap gap-x-4 gap-y-1">
                  {p.stack.map((t) => (
                    <li key={t}>
                      <Label>{t}</Label>
                    </li>
                  ))}
                </ul>
                <ProjectLinks project={p} caseStudy />
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
    </div>
  );
}
