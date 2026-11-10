import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  /** Apply the 12-column grid. */
  grid?: boolean;
  children: ReactNode;
}

/** Max 1280px content width, fluid gutters, optional 12-column grid. */
export function Container({ as: Tag = "div", className, grid, children }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[calc(var(--content-max)+2*var(--gutter))] px-[var(--gutter)]",
        grid && "grid grid-cols-12 gap-x-4 md:gap-x-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
