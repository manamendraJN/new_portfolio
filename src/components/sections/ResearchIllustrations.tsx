import type { ReactNode } from "react";
import type { Media } from "@/lib/types";

/**
 * Original schematic illustrations of the measurement module. They show the
 * idea only: no values, accuracy figures or results appear in any drawing.
 */

const LINE = "var(--muted)";
const ACCENT = "var(--accent)";
const S = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const LABEL = {
  fill: "var(--muted)",
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 13,
  letterSpacing: "0.14em",
} as const;

/** Horizontal dimension line with end ticks. */
function Dim({ x1, x2, y, color = ACCENT }: { x1: number; x2: number; y: number; color?: string }) {
  return (
    <g stroke={color} {...S}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
    </g>
  );
}

/** Front view of a simplified figure centred on x. */
function FrontFigure({ x }: { x: number }) {
  return (
    <g stroke={LINE} {...S}>
      <circle cx={x} cy={52} r={16} />
      <path d={`M ${x - 34} 86 L ${x + 34} 86 L ${x + 26} 190 L ${x - 26} 190 Z`} />
      <path
        d={`M ${x - 26} 190 L ${x - 28} 290 M ${x + 26} 190 L ${x + 28} 290 M ${x} 190 L ${x} 290`}
      />
      <path d={`M ${x - 34} 86 L ${x - 52} 170 M ${x + 34} 86 L ${x + 52} 170`} />
    </g>
  );
}

/** Side view, narrower, centred on x. */
function SideFigure({ x }: { x: number }) {
  return (
    <g stroke={LINE} {...S}>
      <circle cx={x + 2} cy={52} r={16} />
      <path d={`M ${x - 18} 86 L ${x + 18} 86 L ${x + 14} 190 L ${x - 14} 190 Z`} />
      <path d={`M ${x - 12} 190 L ${x - 14} 290 M ${x + 12} 190 L ${x + 14} 290`} />
      <path d={`M ${x} 90 L ${x + 18} 170`} />
    </g>
  );
}

function Measurements() {
  return (
    <>
      <FrontFigure x={150} />
      <SideFigure x={350} />
      {/* front: chest, waist, hip widths */}
      <Dim x1={112} x2={188} y={104} />
      <Dim x1={118} x2={182} y={140} />
      <Dim x1={116} x2={184} y={184} />
      {/* side: depth at the same levels */}
      <Dim x1={330} x2={370} y={104} />
      <Dim x1={332} x2={368} y={140} />
      <Dim x1={332} x2={368} y={184} />
      {/* height */}
      <g stroke={ACCENT} {...S}>
        <line x1={44} y1={36} x2={44} y2={290} />
        <line x1={38} y1={36} x2={50} y2={36} />
        <line x1={38} y1={290} x2={50} y2={290} />
      </g>
      <text x={150} y={316} textAnchor="middle" {...LABEL}>
        FRONT
      </text>
      <text x={350} y={316} textAnchor="middle" {...LABEL}>
        SIDE
      </text>
    </>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke={LINE} {...S}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <path d={`M ${x2 - 7} ${y - 6} L ${x2} ${y} L ${x2 - 7} ${y + 6}`} />
    </g>
  );
}

function Extraction() {
  const bars = [46, 92, 64, 120, 80, 104, 58];
  return (
    <>
      {/* two input photographs */}
      {[0, 1].map((i) => (
        <g key={i} stroke={LINE} {...S}>
          <rect x={30} y={62 + i * 110} width={78} height={96} />
          <circle cx={69 + (i ? 3 : 0)} cy={92 + i * 110} r={9} />
          <path
            d={
              i ? "M 60 106 L 78 106 L 76 148 L 62 148 Z" : "M 52 106 L 86 106 L 82 148 L 56 148 Z"
            }
          />
        </g>
      ))}
      <text x={69} y={50} textAnchor="middle" {...LABEL}>
        FRONT
      </text>
      <text x={69} y={290} textAnchor="middle" {...LABEL}>
        SIDE
      </text>
      <Arrow x1={118} x2={172} y={160} />

      {/* backbone */}
      <g stroke={ACCENT} {...S}>
        <rect x={180} y={110} width={96} height={100} rx={4} />
        <line x1={196} y1={140} x2={260} y2={140} />
        <line x1={196} y1={160} x2={260} y2={160} />
        <line x1={196} y1={180} x2={246} y2={180} />
      </g>
      <text x={228} y={238} textAnchor="middle" {...LABEL}>
        BACKBONE
      </text>
      <Arrow x1={286} x2={330} y={160} />

      {/* feature vector */}
      <g stroke={LINE} {...S}>
        {bars.map((h, i) => (
          <rect key={i} x={340 + i * 16} y={224 - h} width={10} height={h} />
        ))}
      </g>
      <text x={394} y={254} textAnchor="middle" {...LABEL}>
        FEATURES
      </text>
    </>
  );
}

function Recommendation() {
  const sizes = ["S", "M", "L", "XL"];
  return (
    <>
      {/* extracted measurements */}
      <g>
        <Dim x1={30} x2={110} y={90} />
        <Dim x1={30} x2={100} y={140} />
        <Dim x1={30} x2={106} y={190} />
        <text x={70} y={240} textAnchor="middle" {...LABEL}>
          MEASURED
        </text>
      </g>
      <Arrow x1={126} x2={176} y={140} />

      {/* size ladder, one size highlighted as the best fit */}
      <g>
        {sizes.map((s, i) => (
          <g key={s}>
            <rect
              x={186}
              y={64 + i * 48}
              width={110}
              height={36}
              stroke={i === 1 ? ACCENT : LINE}
              {...S}
            />
            <text
              x={204}
              y={87 + i * 48}
              fill={i === 1 ? ACCENT : "var(--muted)"}
              fontSize={15}
              fontFamily="var(--font-geist-mono), monospace"
            >
              {s}
            </text>
          </g>
        ))}
        <text x={241} y={270} textAnchor="middle" {...LABEL}>
          SIZES
        </text>
      </g>
      <Arrow x1={306} x2={344} y={142} />

      {/* confidence scale and fit advice (schematic, no values) */}
      <g stroke={LINE} {...S}>
        <line x1={354} y1={100} x2={450} y2={100} />
        <line x1={354} y1={94} x2={354} y2={106} />
        <line x1={450} y1={94} x2={450} y2={106} />
        <line x1={402} y1={94} x2={402} y2={106} />
        <line x1={354} y1={150} x2={440} y2={150} />
        <line x1={354} y1={170} x2={450} y2={170} />
        <line x1={354} y1={190} x2={424} y2={190} />
      </g>
      <circle cx={426} cy={100} r={6} fill={ACCENT} />
      <text x={402} y={240} textAnchor="middle" {...LABEL}>
        CONFIDENCE
      </text>
    </>
  );
}

const drawings: Record<NonNullable<Media["drawing"]>, () => ReactNode> = {
  measurements: Measurements,
  extraction: Extraction,
  recommendation: Recommendation,
};

/** One labelled illustration. Always captioned as an illustration, never as a result. */
export function ResearchIllustration({ item }: { item: Media }) {
  const Drawing = item.drawing ? drawings[item.drawing] : null;
  if (!Drawing) return null;

  return (
    <figure className="space-y-4">
      <div className="border border-line">
        <svg viewBox="0 0 480 330" role="img" aria-label={item.alt} className="block h-auto w-full">
          <Drawing />
        </svg>
      </div>
      <figcaption className="space-y-1">
        <p className="font-medium">{item.caption}</p>
        <p className="font-mono text-[length:var(--text-label)] tracking-[0.16em] text-muted uppercase">
          Illustration
        </p>
      </figcaption>
    </figure>
  );
}
