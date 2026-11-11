import type { CSSProperties, ReactNode } from "react";
import { ThemeEdge } from "@/components/motion/ThemeEdge";
import type { Theme } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  theme: Theme;
  /** "surface" uses the sand/secondary surface colour. */
  tone?: "base" | "surface";
  /** Remove default vertical padding (e.g. the hero). */
  flush?: boolean;
  /** Draw a hairline along the top where the page changes between dark and light. */
  edge?: boolean;
  className?: string;
  style?: CSSProperties;
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
  edge,
  className,
  style,
  children,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      data-tone={tone}
      className={cn(
        "relative text-fg",
        !flush && "section-glow isolate",
        tone === "surface" ? "bg-surface" : "bg-bg",
        !flush && "py-[var(--section-y)]",
        className,
      )}
      style={style}
      {...aria}
    >
      {edge && <ThemeEdge />}
      {children}
    </section>
  );
}
