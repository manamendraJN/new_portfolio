import { Reveal } from "@/components/motion";
import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * Expertise: a compact typographic index. Two columns on wide screens, tight rows
 * between hairline rules, no cards, no icons, no proficiency levels or durations.
 */
export function Expertise() {
  const meta = site.sections.find((s) => s.id === "expertise");
  if (!meta) return null;

  return (
    <Section
      id={meta.id}
      theme={meta.theme}
      tone={meta.tone}
      aria-labelledby="expertise-title"
      className="py-[calc(var(--section-y)*0.6)]!"
    >
      <Container>
        <Reveal as="header" className="mb-8 md:mb-12">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="expertise-title" className="mt-4">
            {meta.label}
          </Heading>
        </Reveal>

        <Rule />
        {/* Groups read down the left column (01-05), then the right (06-10). */}
        <Reveal as="dl" stagger className="grid md:grid-flow-col md:grid-rows-5 md:gap-x-16">
          {skills.map((group, i) => (
            <div key={group.id}>
              <div className="space-y-1.5 py-4">
                <dt className="flex items-baseline gap-3">
                  <Label accent>{String(i + 1).padStart(2, "0")}</Label>
                  <Label>{group.label}</Label>
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-base leading-snug">
                    {group.items.map((item, j) => (
                      <li key={item} className="flex items-baseline gap-2">
                        {item}
                        {j < group.items.length - 1 && (
                          <span aria-hidden="true" className="text-accent-text">
                            /
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <Rule />
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
