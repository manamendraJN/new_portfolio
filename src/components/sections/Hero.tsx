import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import { FrameSequence } from "@/components/motion";
import { Button, Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";

/**
 * Hero: dark, full viewport. The frame sequence pins and scrubs when motion is
 * allowed; otherwise this is a single static poster.
 */
export function Hero() {
  const meta = site.sections.find((s) => s.id === "hero");
  if (!meta) return null;
  const { ctas, scrollLabel } = site.heroContent;

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
        <Container className="relative flex h-full flex-col justify-end pt-28 pb-28 md:pb-32">
          <div data-hero-text className="max-w-[min(100%,44rem)] md:ml-auto md:text-right">
            <Label accent className="text-[0.6875rem]! tracking-[0.14em]!">
              {site.roles.join(" / ")}
            </Label>
            <Heading
              level={1}
              variant="hero"
              id="hero-title"
              className="mt-4 text-[length:clamp(2rem,1.2rem+3.4vw,3.5rem)]!"
            >
              {site.name}
            </Heading>
            <p className="mt-4 max-w-[40ch] text-sm leading-snug text-fg md:ml-auto md:text-base">
              {site.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5 md:justify-end">
              {ctas.map((cta) => (
                <Button
                  key={cta.href}
                  href={cta.href}
                  variant={cta.variant}
                  className="min-h-10! px-5! text-sm!"
                >
                  {cta.label}
                </Button>
              ))}
            </div>
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
