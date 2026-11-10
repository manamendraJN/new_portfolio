import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { text } from "@/lib/utils";

/** Experience: a vertical ledger. Mono date labels on the left, entry on the right. */
export function Experience() {
  const meta = site.sections.find((s) => s.id === "experience");
  if (!meta) return null;
  const entries = experience.filter((e) => e.published);

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="experience-title">
      <Container>
        <header className="mb-14 md:mb-20">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="experience-title" className="mt-4">
            {meta.label}
          </Heading>
        </header>

        <Rule accent />
        <ol>
          {entries.map((e) => (
            <li key={e.id}>
              <article
                aria-labelledby={`exp-${e.id}`}
                className="grid grid-cols-12 gap-x-6 gap-y-4 py-8 md:py-12"
              >
                <p className="col-span-12 md:col-span-3">
                  <Label as="span" accent>
                    {text(e.start)} &ndash; {text(e.end)}
                  </Label>
                </p>

                <div className="col-span-12 space-y-4 md:col-span-8 md:col-start-5">
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
                      {e.points.map((pt, i) => (
                        <li key={i}>{text(pt)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
              <Rule />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
