import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import { FrameSequence } from "@/components/motion";
import { Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";

/**
 * Hero: dark, full viewport. The frame sequence pins and scrubs when motion is
 * allowed; otherwise this is a single static poster.
 */
export function Hero() {
  const meta = site.sections.find((s) => s.id === "hero");
  if (!meta) return null;
  const { scrollLabel } = site.heroContent;

  return (
    <Section
      id={meta.id}
      theme={meta.theme}
      flush
      aria-labelledby="hero-title"
      className="hero-pin"
      style={{ "--hero-pin-vh": site.hero.pinViewportHeights } as CSSProperties}
    >
      <FrameSequence>
        <Container className="relative flex h-full flex-col justify-end pt-28 pb-28 md:pb-16">
          <div data-hero-text className="max-w-[min(100%,44rem)] text-center md:ml-auto md:w-fit">
            <Label accent className="text-[0.6875rem]! tracking-[0.14em]!">
              {site.roles.join(" / ")}
            </Label>
            {/* The name is in the nav; keep the page h1 for assistive tech and search. */}
            <Heading level={1} variant="hero" id="hero-title" className="sr-only">
              {site.name}
            </Heading>
            <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-snug text-fg md:text-base">
              {site.intro}
            </p>
          </div>

          <a
            data-hero-cue
            href="#about"
            className="absolute bottom-8 left-[var(--gutter)] inline-flex min-h-11 items-center gap-3 text-fg transition-colors hover:text-link"
          >
            <ArrowDown aria-hidden="true" size={16} />
            <Label inherit>{scrollLabel}</Label>
            <span className="sr-only">to the About section</span>
          </a>
        </Container>
      </FrameSequence>
    </Section>
  );
}
