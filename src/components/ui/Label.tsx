import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabelProps {
  as?: ElementType;
  /** Use the accent colour (numerals, one highlight per section). */
  accent?: boolean;
  /** Take the colour from the parent instead of the muted default. */
  inherit?: boolean;
  className?: string;
  children: ReactNode;
}

/** Technical label: Geist Mono, small, uppercase, wide tracking. */
export function Label({ as: Tag = "span", accent, inherit, className, children }: LabelProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-[length:var(--text-label)] leading-4 font-normal tracking-[0.16em] uppercase",
        inherit ? "" : accent ? "text-accent-text" : "text-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
