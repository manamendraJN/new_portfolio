import { Container, Section, SectionTitle } from "@/components/ui";
import { site } from "@/content/site";

/**
 * Empty section: anchor, theme and heading only. Each real section replaces
 * its scaffold in Phases 4-5. Number, label and theme come from site.sections.
 */
export function SectionScaffold({ id }: { id: string }) {
  const meta = site.sections.find((s) => s.id === id);
  if (!meta) return null;
  const titleId = `${id}-title`;

  return (
    <Section
      id={id}
      theme={meta.theme}
      tone={meta.tone}
      aria-labelledby={titleId}
      className="min-h-[70svh]"
    >
      <Container>
        <SectionTitle id={titleId}>{meta.label}</SectionTitle>
      </Container>
    </Section>
  );
}
