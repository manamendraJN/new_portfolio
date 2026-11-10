import { Reveal } from "@/components/motion";
import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * Expertise: a typographic index. Hairline rules, no cards, no icons,
 * and no proficiency levels or durations.
 */
export function Expertise() {
  const meta = site.sections.find((s) => s.id === "expertise");
  if (!meta) return null;

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="expertise-title">
      <Container>
        <Reveal as="header" className="mb-14 md:mb-20">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="expertise-title" className="mt-4">
            {meta.label}
          </Heading>
        </Reveal>

        <Rule />
        <Reveal as="dl" stagger>
          {skills.map((group, i) => (
            <div key={group.id}>
              <div className="grid grid-cols-12 gap-x-4 gap-y-3 py-6 md:gap-x-6 md:py-8">
                <dt className="col-span-12 flex items-baseline gap-4 md:col-span-4">
                  <Label>{String(i + 1).padStart(2, "0")}</Label>
                  <span className="text-[length:var(--text-title)] font-medium">{group.label}</span>
                </dt>
                <dd className="col-span-12 md:col-span-8">
                  <ul className="flex flex-wrap gap-x-2 gap-y-1 text-[length:clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] leading-snug">
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
