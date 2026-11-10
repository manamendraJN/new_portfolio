import Image from "next/image";
import { getCover } from "@/lib/content";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectVisualProps {
  project: Project;
  /** Fill the parent (which must be positioned and sized) instead of using an aspect ratio. */
  fill?: boolean;
  /** Wide aspect for the case-study header. */
  wide?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * The project's own cover image from ImageKit, or, until one is supplied, a plain
 * typographic panel carrying the project name. No illustrations or mock-ups.
 * Confidential projects never show an image.
 */
export function ProjectVisual({
  project,
  fill,
  wide,
  priority,
  sizes = "(min-width: 1024px) 480px, 80vw",
  className,
}: ProjectVisualProps) {
  const cover = getCover(project);
  const frame = cn(
    "relative overflow-hidden border border-line bg-surface",
    fill ? "h-full w-full" : wide ? "aspect-[16/9]" : "aspect-[4/3]",
    className,
  );

  if (cover) {
    return (
      <div className={frame}>
        <Image
          src={cover}
          alt={`${project.title} cover`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn(frame, "flex items-center justify-center p-6 text-center")}>
      <span className="text-[length:var(--text-title)] leading-snug font-medium text-balance">
        {project.title}
      </span>
    </div>
  );
}
