import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Level = 1 | 2 | 3 | 4;
type Variant = "hero" | "section" | "project" | "title";

interface HeadingProps {
  level: Level;
  /** hero and section use the display serif; title uses Geist. */
  variant?: Variant;
  id?: string;
  className?: string;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  hero: "font-serif text-[length:var(--text-hero)] leading-[0.98] tracking-[-0.015em] font-normal",
  section:
    "font-serif text-[length:var(--text-section)] leading-[1.08] tracking-[-0.01em] font-normal",
  project:
    "font-sans text-[length:clamp(1.125rem,0.7rem+1.8vw,2.25rem)] leading-[1.15] tracking-[-0.01em] font-medium",
  title: "font-sans text-[length:var(--text-title)] leading-[1.25] tracking-[-0.005em] font-medium",
};

/** Semantic level and visual variant are independent. */
export function Heading({ level, variant = "section", id, className, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cn(styles[variant], "text-balance", className)}>
      {children}
    </Tag>
  );
}
