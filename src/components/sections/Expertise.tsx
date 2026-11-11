import { Reveal } from "@/components/motion";
import { Container, Section, SectionTitle } from "@/components/ui";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * Expertise: the title sits beside the skills rather than above them, and the groups flow
 * into packed columns (no empty grid cells), so little space is wasted. No cards, icons,
 * proficiency levels or durations.
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
      className="py-[calc(var(--section-y)*0.7)]!"
    >
      <Container grid className="gap-y-10">
        <Reveal as="header" className="col-span-12 lg:col-span-4">
          <SectionTitle id="expertise-title">{meta.label}</SectionTitle>
        </Reveal>

        {/* Groups flow down each column and pack by height, so there are no gaps or orphans. */}
        <Reveal as="dl" stagger className="col-span-12 sm:columns-2 sm:gap-x-12 lg:col-span-8">
          {skills.map((group) => (
            <div key={group.id} className="mb-6 break-inside-avoid space-y-1.5">
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
