import type { Metadata } from "next";
import { Button, Container, Heading, Label, Rule, Section } from "@/components/ui";
import { contrast, palette } from "@/lib/contrast";
import type { Theme } from "@/lib/types";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  "bg",
  "surface",
  "raised",
  "fg",
  "muted",
  "line",
  "accent",
  "accent-text",
  "link",
] as const;

/** [foreground token, background token, usage, minimum ratio] */
const pairs: Array<[string, string, string, number]> = [
  ["fg", "bg", "Body text on background", 4.5],
  ["fg", "surface", "Body text on surface", 4.5],
  ["fg", "raised", "Body text on raised", 4.5],
  ["muted", "bg", "Secondary text on background", 4.5],
  ["muted", "surface", "Secondary text on surface", 4.5],
  ["accent-text", "bg", "Accent, small text, on background", 4.5],
  ["accent-text", "surface", "Accent, small text, on surface", 4.5],
  ["accent", "bg", "Accent, rules and large text only", 3],
  ["link", "bg", "Interactive on background", 4.5],
  ["link", "surface", "Interactive on surface", 4.5],
];

function Panel({ theme, tone }: { theme: Theme; tone: "base" | "surface" }) {
  const p = palette[theme];
  return (
    <Section theme={theme} tone={tone} id={`${theme}-${tone}`} aria-label={`${theme} theme`}>
      <Container className="space-y-16">
        <header className="space-y-3">
          <Label accent>{theme} theme</Label>
          <Heading level={2}>
            {theme === "dark" ? "Charcoal" : "Ivory"} <em>{tone === "surface" ? "(sand)" : ""}</em>
          </Heading>
        </header>

        <div className="space-y-4">
          <Label>Colour tokens</Label>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {swatches.map((s) => (
              <li key={s} className="space-y-2">
                <div
                  className="h-16 border border-line"
                  style={{ background: `var(--${s})` }}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs break-all">{s}</p>
                <p className="font-mono text-xs text-muted">{p[s]}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <Label>Typography</Label>
          <p className="font-serif text-[length:var(--text-hero)] leading-none">Navodya</p>
          <Heading level={3} variant="section">
            Section heading, 28 to 44 pixels
          </Heading>
          <Heading level={4} variant="title">
            Title in Geist, medium weight
          </Heading>
          <p className="max-w-[var(--measure)]">
            Body text at 16 to 17 pixels with a line height of about 1.6 and a measure capped near
            68 characters, so long paragraphs stay comfortable to read on any screen width without
            the eye losing its place.
          </p>
          <p className="max-w-[var(--measure)] text-muted">
            Secondary text, used for supporting detail and metadata that should recede.
          </p>
          <Label>Geist Mono label, 2024 to present</Label>
        </div>

        <div className="space-y-6">
          <Label>Primitives</Label>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="#main">Primary</Button>
            <Button href="#main" variant="secondary">
              Secondary
            </Button>
            <Button href="#main" variant="link">
              Text link
            </Button>
            <Button>Native button</Button>
          </div>
          <Rule />
          <Rule accent />
        </div>

        <div className="space-y-4">
          <Label>Contrast (WCAG AA)</Label>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <caption className="sr-only">Contrast ratios for the {theme} theme</caption>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-4 font-normal">Pair</th>
                  <th className="py-2 pr-4 font-normal">Ratio</th>
                  <th className="py-2 font-normal">Result</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(([fg, bg, usage, min]) => {
                  const r = contrast(p[fg], p[bg]);
                  return (
                    <tr key={`${fg}-${bg}`} className="border-b border-line">
                      <td className="py-2 pr-4">{usage}</td>
                      <td className="py-2 pr-4 font-mono">{r.toFixed(2)}:1</td>
                      <td className="py-2 font-mono">
                        {r >= min ? "Pass" : "Fail"} (min {min})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main">
      <Panel theme="dark" tone="base" />
      <Panel theme="light" tone="base" />
      <Panel theme="light" tone="surface" />
      <Panel theme="dark" tone="surface" />
    </main>
  );
}
