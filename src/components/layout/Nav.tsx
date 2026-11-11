"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import type { Theme } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const MENU_ID = "mobile-menu";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface NavState {
  active: string;
  theme: Theme;
}

/** Finds the section under a given viewport y. */
function sectionAt(y: number) {
  // Where sections overlap (About over the hero tail), the later one is on top.
  for (const s of [...site.sections].reverse()) {
    const el = document.getElementById(s.id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) return s;
  }
  return null;
}

/**
 * Fixed header. Transparent over the hero, solid after it. Takes the theme of
 * the section behind it and marks the active section.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [state, setState] = useState<NavState>(
    isHome ? { active: "hero", theme: "dark" } : { active: "", theme: "light" },
  );
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null);

  // Track the section under the bar: it sets the active link and the bar theme.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // Pages without the home sections (case studies): solid bar in the page theme.
      // Route by pathname: the previous page's DOM can stay mounted but hidden.
      if (!isHome) {
        const visible = [...document.querySelectorAll<HTMLElement>("main[data-theme]")].filter(
          (m) => m.getClientRects().length > 0,
        );
        const pageTheme = visible[visible.length - 1]?.getAttribute("data-theme");
        const next: NavState = { active: "", theme: pageTheme === "dark" ? "dark" : "light" };
        setState((prev) =>
          prev.active === next.active && prev.theme === next.theme ? prev : next,
        );
        return;
      }
      const h = headerRef.current?.offsetHeight ?? 64;
      // The section just below the bar sets the bar theme and, normally, the active link.
      const under = sectionAt(h + 1);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      // A short last section can never reach the top, so the page end counts as it.
      const current = atBottom ? site.sections[site.sections.length - 1] : under;
      const next: NavState = { active: current?.id ?? "hero", theme: under?.theme ?? "dark" };
      setState((prev) => (prev.active === next.active && prev.theme === next.theme ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  // Slide the highlight pill under the active link.
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const link = list?.querySelector<HTMLElement>('a[aria-current="true"]');
      if (!list || !link) {
        setInd(null);
        return;
      }
      const l = link.getBoundingClientRect();
      const r = list.getBoundingClientRect();
      setInd({ left: l.left - r.left, width: l.width });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [state.active]);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // While open: lock scroll, close on Escape, trap Tab, close when widened to desktop.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(true);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = [
        ...(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
        ...document.querySelectorAll<HTMLElement>(`#${MENU_ID} a[href]`),
      ].filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && close();

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    // Move focus into the menu.
    document.querySelector<HTMLElement>(`#${MENU_ID} a[href]`)?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const overHero = state.active === "hero" && !open;
  const theme: Theme = open ? "dark" : state.theme;

  return (
    <>
      <header
        ref={headerRef}
        data-theme={theme}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-16 text-fg"
      >
        <div className="mx-auto w-full max-w-[calc(var(--content-max)+2*var(--gutter))] px-3 pt-2 md:px-[var(--gutter)]">
          <div
            className={cn(
              "pointer-events-auto flex h-12 items-center justify-between rounded-full border pr-1.5 pl-5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
              // A floating glass pill. Clear over the hero video, a tint of the section colour after it.
              overHero
                ? "border-white/15 bg-black/25 shadow-none"
                : "border-line/60 bg-bg/65 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)]",
            )}
          >
            <Link
              href="/#hero"
              onClick={() => close()}
              className="text-[0.9375rem] font-medium tracking-tight transition-colors hover:text-link"
            >
              {site.name}
            </Link>

            <nav aria-label="Primary" className="hidden md:block">
              <ul ref={listRef} className="relative flex items-center gap-1">
                {ind && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 left-0 rounded-full bg-fg/10 ring-1 ring-fg/10 transition-[transform,width] duration-300 ease-out"
                    style={{ width: ind.width, transform: `translateX(${ind.left}px)` }}
                  />
                )}
                {site.nav.map((item) => {
                  const isActive = `#${state.active}` === item.href;
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={`/${item.href}`}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "inline-flex h-9 items-center rounded-full px-3.5 text-sm transition-colors hover:text-link",
                          isActive ? "font-medium" : "text-fg/80",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-fg/10 hover:text-link md:hidden"
            >
              {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <MobileMenu
          id={MENU_ID}
          items={site.nav}
          sections={site.sections}
          activeId={state.active}
          onNavigate={() => close()}
        />
      )}
    </>
  );
}
