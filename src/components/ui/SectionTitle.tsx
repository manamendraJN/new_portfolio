import type { ReactNode } from "react";
import { Heading } from "./Heading";

interface SectionTitleProps {
  id: string;
  children: ReactNode;
}

/**
 * The opener of every section: a short gold bar over a larger serif title. This treatment is
 * used only here, so a section title is recognisable at a glance and clearly different from
 * the headings inside a section (project names, group labels, and so on).
 */
export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <div>
      <span aria-hidden="true" className="mb-3 block h-0.5 w-12 bg-accent md:mb-5" />
      <Heading
        level={2}
        id={id}
        className="text-[length:clamp(1.75rem,0.9rem+3.6vw,3.5rem)]! leading-[1.02]!"
      >
        {children}
      </Heading>
    </div>
  );
}
