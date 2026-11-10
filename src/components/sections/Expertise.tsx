import { Reveal } from "@/components/motion";
import { Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * Expertise: a calm typographic index. Each group is a clear label over a quiet line of
 * items, laid out in columns with plenty of space. No cards, icons, rules per row,
 * proficiency levels or durations.
 */
export function Expertise() {
  const meta = site.sections.find((s) => s.id === "expertise");
  if (!meta) return null;

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="expertise-title">
      <Container>
        <Reveal as="header" className="mb-12 md:mb-16">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="expertise-title" className="mt-4">
            {meta.label}
          </Heading>
        </Reveal>

        <Reveal
          as="dl"
          stagger
          className="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12"
        >
          {skills.map((group) => (
            <div key={group.id} className="space-y-2">
              <dt className="text-base font-medium">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[0.9375rem] leading-relaxed text-muted">
                  {group.items.map((item, j) => (
                    <li key={item}>
                      {item}
                      {j < group.items.length - 1 && ","}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
