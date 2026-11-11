"use client";

import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
const easeInOut = (t: number) => t * t * (3 - 2 * t);

// Entrance, pulse and easing constants.
const ENTRANCE_S = 1.6;
const STAGGER_S = 0.045;
const PULSE_S = 2.6;
const POINTER_R = 200;
const POINTER_PUSH = 22;
const FEATHER = 28;

/** Small deterministic generator so the field looks the same on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Calm animated background for the Contact section: thin gold lines, each a few layered sine
 * waves, drifting slowly like silk threads. One 2D canvas behind the content. Draws only
 * while the section is on screen and the tab is visible; allocates nothing per frame and
 * never touches React state while animating.
 *
 * Reacts to: entrance (draws in left to right, once), scroll (settles toward flat by the
 * footer), the pointer on desktop (lines bend gently away), form focus (nearby lines
 * brighten) and a successful send (one soft pulse travels along the lines).
 *
 * Reduced motion: a single still frame, no loop.
 */
export function ContactField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.parentElement ?? null;
    const ctx = canvas?.getContext("2d") ?? null;
    if (!canvas || !section || !ctx) return;

    const color = getComputedStyle(canvas).getPropertyValue("--accent").trim() || "#c9b37e";
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const mqMobile = window.matchMedia("(max-width: 767px)");

    // ---- geometry and per-line wave data (rebuilt on resize only) --------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    let nLines = 0;
    let nPts = 0;
    let mobile = false;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let baseY = new Float32Array(0);
    let alphaBase = new Float32Array(0);
    let kArr = new Float32Array(0); // 2π / wavelength
    let ampArr = new Float32Array(0);
    let omArr = new Float32Array(0); // 2π / period (20-30 s)
    let phArr = new Float32Array(0);
    let mask: HTMLCanvasElement | null = null;
    // Text regions (section-relative): headline and form.
    let formCy = 0;
    let formHalf = 0;

    // ---- animation state ---------------------------------------------------------------------
    let clock = 0; // seconds of animation time
    let enterT0 = -1; // clock value when the entrance began (-1: not yet)
    let ampNow = 1;
    let ampTarget = 1;
    let focusNow = 0;
    let focusTarget = 0;
    let pointerOn = 0;
    let pointerTarget = 0;
    let tx = -9999;
    let ty = -9999;
    let px = -9999;
    let py = -9999;
    let pulseT0 = -1;
    let hadStatus = false;
    let visible = false;
    let raf = 0;
    let last = 0;
    let reduced = mqReduce.matches;

    const pointerAllowed = () => !reduced && !mobile && mqFine.matches;

    function buildLines() {
      mobile = mqMobile.matches;
      nLines = mobile ? 9 : 16;
      nPts = mobile ? 60 : 76;
      xs = new Float32Array(nPts);
      ys = new Float32Array(nPts);
      for (let j = 0; j < nPts; j++) xs[j] = (j / (nPts - 1)) * W;
      baseY = new Float32Array(nLines);
      alphaBase = new Float32Array(nLines);
      kArr = new Float32Array(nLines * 3);
      ampArr = new Float32Array(nLines * 3);
      omArr = new Float32Array(nLines * 3);
      phArr = new Float32Array(nLines * 3);
      const r = rng(20251);
      const accentIdx = new Set<number>();
      const strong = mobile ? 3 : 4;
      for (let s = 0; s < strong; s++)
        accentIdx.add(Math.round(((s + 0.5) / strong) * (nLines - 1)));
      const wScale = Math.min(1.3, Math.max(0.55, W / 1280));
      const ampScale = mobile ? 0.55 : 1;
      const wavelengths = [420, 760, 1300];
      const amps = [16, 11, 7];
      for (let i = 0; i < nLines; i++) {
        baseY[i] = H * (0.07 + 0.86 * (i / (nLines - 1)));
        alphaBase[i] = accentIdx.has(i) ? 0.2 + r() * 0.06 : 0.08 + r() * 0.06;
        for (let k = 0; k < 3; k++) {
          const idx = i * 3 + k;
          kArr[idx] = TAU / (wavelengths[k] * wScale * (0.8 + r() * 0.5));
          ampArr[idx] = amps[k] * ampScale * (0.7 + r() * 0.6);
          const period = 20 + r() * 10;
          omArr[idx] = (TAU / period) * (r() < 0.5 ? -1 : 1);
          phArr[idx] = r() * TAU;
        }
      }
    }

    /** Static mask: soft vignette at the edges plus ~60% fade behind the headline and form. */
    function buildMask() {
      if (!mask) mask = document.createElement("canvas");
      mask.width = canvas!.width;
      mask.height = canvas!.height;
      const m = mask.getContext("2d");
      if (!m) return;
      m.setTransform(dpr, 0, 0, dpr, 0, 0);
      m.clearRect(0, 0, W, H);

      // Vignette: lines fade out toward the edges. No glow, only removal.
      const ex = Math.min(W * 0.16, 220);
      const ey = Math.min(H * 0.12, 120);
      const edge = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        rx: number,
        ry: number,
        rw: number,
        rh: number,
      ) => {
        const g = m.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        m.fillStyle = g;
        m.fillRect(rx, ry, rw, rh);
      };
      edge(0, 0, ex, 0, 0, 0, ex, H);
      edge(W, 0, W - ex, 0, W - ex, 0, ex, H);
      edge(0, 0, 0, ey, 0, 0, W, ey);
      edge(0, H, 0, H - ey, 0, H - ey, W, ey);

      // Text regions: feathered rectangles that reduce the lines to ~40% behind them.
      const sr = section!.getBoundingClientRect();
      const regions: Array<Element | null> = [
        section!.querySelector("h2"),
        section!.querySelector("form") ?? section!.querySelector('[role="status"]'),
      ];
      const steps = 7;
      const stepAlpha = 1 - Math.pow(1 - 0.6, 1 / steps);
      m.fillStyle = `rgba(0,0,0,${stepAlpha})`;
      for (const el of regions) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const x = r.left - sr.left;
        const y = r.top - sr.top;
        for (let s = 0; s < steps; s++) {
          const grow = FEATHER * (1 - s / steps);
          m.fillRect(x - grow, y - grow, r.width + grow * 2, r.height + grow * 2);
        }
      }
      const form = regions[1];
      if (form) {
        const r = form.getBoundingClientRect();
        formCy = r.top - sr.top + r.height / 2;
        formHalf = r.height / 2;
      }
    }

    function resize() {
      const w = section!.clientWidth;
      const h = section!.clientHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = w;
      H = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      buildLines();
      buildMask();
      updateScroll();
      draw();
    }

    function updateScroll() {
      const r = section!.getBoundingClientRect();
      const settle = clamp01((window.innerHeight - r.top) / Math.max(1, r.height));
      const t = easeInOut(clamp01((settle - 0.25) / 0.75));
      ampTarget = 1 - 0.94 * t; // most active at the top, nearly flat by the footer
      if (reduced) ampNow = 0.5;
    }

    // ---- drawing ------------------------------------------------------------------------------
    function draw() {
      if (W === 0 || nLines === 0) return;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, W, H);
      if (!reduced && enterT0 < 0) return; // waiting for the entrance

      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      ctx!.lineJoin = "round";
      const t = reduced ? 0 : clock;
      const usePtr = pointerOn > 0.002;
      const pulseOn = pulseT0 >= 0;
      let pulseX = 0;
      let pulseFade = 0;
      if (pulseOn) {
        const pp = clamp01((clock - pulseT0) / PULSE_S);
        pulseX = -160 + (W + 320) * easeInOut(pp);
        pulseFade = Math.sin(pp * Math.PI);
      }

      for (let i = 0; i < nLines; i++) {
        let p = 1;
        if (!reduced) p = easeOutCubic(clamp01((clock - enterT0 - i * STAGGER_S) / ENTRANCE_S));
        if (p <= 0) continue;
        const nDraw = Math.max(2, Math.ceil(p * (nPts - 1)) + 1);
        const b = baseY[i];
        for (let j = 0; j < nDraw && j < nPts; j++) {
          const x = xs[j];
          let y = b;
          for (let k = 0; k < 3; k++) {
            const idx = i * 3 + k;
            y += ampArr[idx] * ampNow * Math.sin(kArr[idx] * x + phArr[idx] + omArr[idx] * t);
          }
          if (usePtr) {
            const dx = x - px;
            const dy = y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < POINTER_R * POINTER_R) {
              const f = 1 - Math.sqrt(d2) / POINTER_R;
              y += (dy >= 0 ? 1 : -1) * f * f * POINTER_PUSH * pointerOn;
            }
          }
          ys[j] = y;
        }
        // Lines nearest the form brighten slightly while a field has focus.
        const near = clamp01(1 - Math.max(0, Math.abs(b - formCy) - formHalf) / 120);
        const alpha = alphaBase[i] * (1 + 0.9 * focusNow * near);
        ctx!.globalAlpha = alpha;
        ctx!.beginPath();
        ctx!.moveTo(xs[0], ys[0]);
        for (let j = 1; j < nDraw && j < nPts; j++) ctx!.lineTo(xs[j], ys[j]);
        ctx!.stroke();

        if (pulseOn && pulseFade > 0.01) {
          // Soft travelling highlight: a wide faint band and a narrow brighter core.
          for (let pass = 0; pass < 2; pass++) {
            const half = pass === 0 ? 150 : 70;
            ctx!.globalAlpha = Math.min(1, alpha + (pass === 0 ? 0.08 : 0.12) * pulseFade);
            ctx!.beginPath();
            let started = false;
            for (let j = 0; j < nDraw && j < nPts; j++) {
              if (Math.abs(xs[j] - pulseX) > half) continue;
              if (!started) {
                ctx!.moveTo(xs[j], ys[j]);
                started = true;
              } else ctx!.lineTo(xs[j], ys[j]);
            }
            if (started) ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;

      if (mask) {
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
        ctx!.globalCompositeOperation = "destination-out";
        ctx!.drawImage(mask, 0, 0);
        ctx!.globalCompositeOperation = "source-over";
      }
    }

    function frame(now: number) {
      raf = 0;
      const dt = Math.min(50, now - last);
      last = now;
      clock += dt / 1000;
      // Ease everything toward its target so nothing ever jumps.
      ampNow += (ampTarget - ampNow) * 0.06;
      focusNow += (focusTarget - focusNow) * 0.08;
      pointerOn += (pointerTarget - pointerOn) * 0.08;
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      if (pulseT0 >= 0 && clock - pulseT0 > PULSE_S) pulseT0 = -1;
      draw();
      kick();
    }

    function shouldRun() {
      return visible && !reduced && document.visibilityState === "visible";
    }
    function kick() {
      if (raf === 0 && shouldRun()) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    // ---- inputs -------------------------------------------------------------------------------
    const onScroll = () => updateScroll();
    const onMove = (e: PointerEvent) => {
      if (!pointerAllowed() || e.pointerType !== "mouse") return;
      const r = section.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (pointerTarget === 0) {
        px = tx;
        py = ty;
      }
      pointerTarget = 1;
    };
    const onLeave = () => {
      pointerTarget = 0;
    };
    const inForm = (el: EventTarget | null) => el instanceof Element && el.closest("form") !== null;
    const onFocusIn = (e: FocusEvent) => {
      if (inForm(e.target)) focusTarget = 1;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!inForm(e.relatedTarget)) focusTarget = 0;
    };
    const onVisibility = () => (shouldRun() ? kick() : stop());
    const onReduceChange = () => {
      reduced = mqReduce.matches;
      stop();
      if (reduced) {
        ampNow = 0.5;
        pointerTarget = 0;
        focusTarget = 0;
        pulseT0 = -1;
        draw();
      } else {
        ampNow = ampTarget;
        draw();
        kick();
      }
    };

    // A successful send replaces the form with a status message; watch for it, rather than
    // touching the form's own code, and send one soft pulse along the lines.
    const mo = new MutationObserver(() => {
      const has = section.querySelector('[role="status"]') !== null;
      if (has && !hadStatus && !reduced) pulseT0 = clock;
      hadStatus = has;
      buildMask();
      if (reduced) draw();
    });
    mo.observe(section, { childList: true, subtree: true });

    const ro = new ResizeObserver(() => resize());
    ro.observe(section);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (enterT0 < 0) enterT0 = clock;
          updateScroll();
          kick();
        } else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", onVisibility);
    mqReduce.addEventListener("change", onReduceChange);

    // Initial state.
    ampNow = ampTarget;
    resize();
    void document.fonts?.ready.then(() => {
      buildMask();
      if (reduced) draw();
    });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduce.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
