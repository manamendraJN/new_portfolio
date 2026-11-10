import { Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";

interface SectionScaffoldProps {
  id: string;
  /** Hero takes the full viewport and carries the page h1. */
  hero?: boolean;
}

/**
 * Empty section: anchor, theme and heading only. Each real section replaces
 * its scaffold in Phases 3-5. Number, label and theme come from site.sections.
 */
export function SectionScaffold({ id, hero }: SectionScaffoldProps) {
  const meta = site.sections.find((s) => s.id === id);
  if (!meta) return null;
  const titleId = `${id}-title`;

  return (
    <Section
      id={id}
      theme={meta.theme}
      tone={meta.tone}
      aria-labelledby={titleId}
      flush={hero}
      className={hero ? "flex min-h-svh items-center" : "min-h-[70svh]"}
    >
      <Container>
        <Label accent>{meta.number}</Label>
        {hero ? (
          <Heading level={1} variant="hero" id={titleId} className="mt-4">
            {site.name}
          </Heading>
        ) : (
          <Heading level={2} id={titleId} className="mt-4">
            {meta.label}
          </Heading>
        )}
      </Container>
    </Section>
  );
}
