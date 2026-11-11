import { Reveal, TimelineLine } from "@/components/motion";
import { Container, Heading, Label, Section, SectionTitle } from "@/components/ui";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { text } from "@/lib/utils";

/**
 * Experience: a vertical timeline. A hairline runs down the left with a node per role, newest
 * first, so the order reads at a glance. The current role's node is filled gold.
 */
export function Experience() {
  const meta = site.sections.find((s) => s.id === "experience");
  if (!meta) return null;
  const entries = experience.filter((e) => e.published);

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="experience-title">
      <Container>
        <Reveal as="header" className="mb-6 md:mb-16">
          <SectionTitle id="experience-title">{meta.label}</SectionTitle>
        </Reveal>

        <TimelineLine>
          {entries.map((e, i) => {
            const current = text(e.end).toLowerCase() === "present";
            const last = i === entries.length - 1;
            return (
              <li key={e.id} className="relative pl-7 md:pl-14">
                {/* Node */}
                <span
                  aria-hidden="true"
                  data-node
                  className={`absolute top-[0.35rem] left-0 size-3 -translate-x-1/2 rounded-full border border-accent md:top-[0.55rem] md:size-3.5 ${
                    current ? "bg-accent" : "bg-bg data-[active=true]:bg-accent"
                  }`}
                />

                <Reveal
                  as="article"
                  aria-labelledby={`exp-${e.id}`}
                  className={`space-y-2 md:space-y-3 ${last ? "pb-0" : "pb-8 md:pb-14"}`}
                >
                  <p>
                    <Label as="span" accent>
                      {text(e.start)} &ndash; {text(e.end)}
                    </Label>
                  </p>

                  <div className="space-y-1">
                    <Heading level={3} variant="title" id={`exp-${e.id}`}>
                      {text(e.role)}
                    </Heading>
                    <p>{text(e.org)}</p>
                  </div>

                  {(e.employment || e.location || e.domain === "broadcast-operations") && (
                    <ul className="flex flex-wrap gap-x-5 gap-y-1">
                      {e.domain === "broadcast-operations" && (
                        <li>
                          <Label>Broadcast operations</Label>
                        </li>
                      )}
                      {e.employment && (
                        <li>
                          <Label>{e.employment}</Label>
                        </li>
                      )}
                      {e.location && (
                        <li>
                          <Label>{e.location}</Label>
                        </li>
                      )}
                    </ul>
                  )}

                  <p className="max-w-[var(--measure)] text-muted">{text(e.summary)}</p>

                  {e.points && e.points.length > 0 && (
                    <ul className="max-w-[var(--measure)] list-disc space-y-1 pl-5 text-muted">
                      {e.points.map((pt, j) => (
                        <li key={j}>{text(pt)}</li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </li>
            );
          })}
        </TimelineLine>
      </Container>
    </Section>
  );
}
