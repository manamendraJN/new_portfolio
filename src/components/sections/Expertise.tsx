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
        <Reveal as="dl" stagger className="grid md:grid-cols-2 md:gap-x-16">
          {skills.map((group, i) => (
            <div key={group.id}>
              <div className="grid grid-cols-12 gap-x-4 gap-y-1 py-4 md:py-5">
                <dt className="col-span-12 flex items-baseline gap-3 sm:col-span-5">
                  <Label>{String(i + 1).padStart(2, "0")}</Label>
                  <span className="text-[0.9375rem] leading-snug font-medium">{group.label}</span>
                </dt>
                <dd className="col-span-12 sm:col-span-7">
                  <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[0.9375rem] leading-snug">
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
