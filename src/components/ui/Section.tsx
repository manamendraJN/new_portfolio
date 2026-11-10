import type { ReactNode } from "react";
import type { Theme } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  theme: Theme;
  /** "surface" uses the sand/secondary surface colour. */
  tone?: "base" | "surface";
  /** Remove default vertical padding (e.g. the hero). */
  flush?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
}

/** Sets the theme for everything inside it via data-theme. */
export function Section({
  id,
  theme,
  tone = "base",
  flush,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={cn(
        "relative text-fg",
        tone === "surface" ? "bg-surface" : "bg-bg",
        !flush && "py-[var(--section-y)]",
        className,
      )}
      {...aria}
    >
      {children}
    </section>
  );
}
