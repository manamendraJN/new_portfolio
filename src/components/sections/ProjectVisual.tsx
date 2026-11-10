import Image from "next/image";
import { Label } from "@/components/ui";
import type { PlateMotif, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const LINE = "var(--line)";
const ACCENT = "var(--accent)";

/** Geometric motifs, one per project. Decorative; never a stand-in for a screenshot. */
function Motif({ kind }: { kind: PlateMotif }) {
  const common = { fill: "none", strokeWidth: 1.25, vectorEffect: "non-scaling-stroke" } as const;

  switch (kind) {
    case "shelves":
      return (
        <>
          {[0, 1, 2, 3].flatMap((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={36 + c * 68}
                y={36 + r * 58}
                width={56}
                height={46}
                stroke={r === 1 && c === 3 ? ACCENT : LINE}
                {...common}
              />
            )),
          )}
        </>
      );
    case "rows":
      return (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect
                x={44}
                y={48 + i * 38}
                width={14}
                height={14}
                stroke={i === 2 ? ACCENT : LINE}
                {...common}
              />
              <line
                x1={84}
                x2={356 - (i % 3) * 60}
                y1={55 + i * 38}
                y2={55 + i * 38}
                stroke={i === 2 ? ACCENT : LINE}
                {...common}
              />
            </g>
          ))}
        </>
      );
    case "fan": {
      const angles = [-78, -66, -54, -42, -30, -18, -6];
      return (
        <>
          {angles.map((a, i) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={56}
                y1={256}
                x2={(56 + 330 * Math.cos(r)).toFixed(1)}
                y2={(256 + 330 * Math.sin(r)).toFixed(1)}
                stroke={i === 3 ? ACCENT : LINE}
                {...common}
              />
            );
          })}
          {[90, 170, 250].map((rad) => (
            <path
              key={rad}
              d={`M ${56 + rad} 256 A ${rad} ${rad} 0 0 0 56 ${256 - rad}`}
              stroke={LINE}
              {...common}
            />
          ))}
        </>
      );
    }
    case "network": {
      const nodes: Array<[number, number]> = [
        [90, 80],
        [220, 56],
        [330, 120],
        [150, 170],
        [270, 220],
        [70, 244],
      ];
      const edges: Array<[number, number]> = [
        [0, 1],
        [1, 2],
        [0, 3],
        [1, 3],
        [2, 4],
        [3, 4],
        [3, 5],
      ];
      return (
        <>
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              stroke={LINE}
              {...common}
            />
          ))}
          {nodes.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 3 ? 14 : 9}
              stroke={i === 3 ? ACCENT : LINE}
              {...common}
            />
          ))}
        </>
      );
    }
    case "steps":
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={40 + i * 64}
              y={240 - (i + 1) * 40}
              width={56}
              height={(i + 1) * 40}
              stroke={i === 4 ? ACCENT : LINE}
              {...common}
            />
          ))}
        </>
      );
  }
}

interface ProjectVisualProps {
  project: Project;
  number: string;
  /** Wide aspect for the case-study header. */
  wide?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * A real screenshot when one is supplied, otherwise a typographic plate.
 * Confidential projects never show media. Illustrations are always labelled.
 */
export function ProjectVisual({ project, number, wide, priority, className }: ProjectVisualProps) {
  const shot = project.confidential ? undefined : project.media.find((m) => m.src);
  const aspect = wide ? "aspect-[16/9]" : "aspect-[4/3]";

  if (shot) {
    return (
      <figure className={className}>
        <div className={cn("relative overflow-hidden bg-surface", aspect)}>
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        {shot.kind === "illustration" && (
          <figcaption className="mt-3">
            <Label>Illustration, not a screenshot</Label>
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative border border-line bg-surface transition-colors duration-500 group-hover:border-accent",
        aspect,
        className,
      )}
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        preserveAspectRatio="xMidYMid meet"
      >
        <Motif kind={project.plate} />
      </svg>
      <Label accent className="absolute top-4 left-4">
        {number}
      </Label>
    </div>
  );
}
