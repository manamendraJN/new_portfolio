import { ArrowDown } from "lucide-react";
import { Button, Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";
import { HeroMedia } from "./HeroMedia";

/** Hero: dark, full viewport. Static in Phase 3; the frame scrub is added in Phase 6. */
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
      className="min-h-svh overflow-hidden"
    >
      <HeroMedia />

      <Container className="relative flex min-h-svh flex-col justify-end pt-28 pb-28 md:pb-32">
        <div className="max-w-[min(100%,56rem)]">
          <Label accent>{site.roles.join(" / ")}</Label>
          <Heading level={1} variant="hero" id="hero-title" className="mt-5">
            {site.name}
          </Heading>
          <p className="mt-6 max-w-[38ch] text-lg leading-snug text-fg md:text-xl">{site.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Button key={cta.href} href={cta.href} variant={cta.variant}>
                {cta.label}
              </Button>
            ))}
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 left-[var(--gutter)] inline-flex min-h-11 items-center gap-3 text-fg transition-colors hover:text-link"
        >
          <ArrowDown aria-hidden="true" size={16} />
          <Label inherit>{scrollLabel}</Label>
          <span className="sr-only">to the About section</span>
        </a>
      </Container>
    </Section>
  );
}
