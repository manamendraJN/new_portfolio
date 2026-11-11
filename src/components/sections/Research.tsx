import { Reveal } from "@/components/motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container, Heading, Label, Section, SectionTitle } from "@/components/ui";
import { research } from "@/content/research";
import { site } from "@/content/site";

/**
 * Research: one publication plate styled like a journal citation. My individual
 * contribution is kept visibly separate from the wider group project. I am not
 * described as the conference presenter.
 */
export function Research() {
  const meta = site.sections.find((s) => s.id === "research");
  if (!meta || !research.published) return null;
  const r = research;

  const facts: Array<{ term: string; value: ReactNode }> = [
    {
      term: "DOI",
      value: (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
        >
          {r.doi}
          <ArrowUpRight aria-hidden="true" size={14} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    { term: "ISBN", value: r.isbn },
    { term: "IEEE Xplore", value: r.ieeeXplore },
    { term: "Project ID", value: r.projectId },
    { term: "Supervisor", value: r.supervisor },
  ];

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="research-title">
      <Container grid className="gap-y-8 md:gap-y-10">
        <Reveal as="header" className="col-span-12 lg:col-span-4">
          <SectionTitle id="research-title">{meta.label}</SectionTitle>
        </Reveal>

        {/* The plate */}
        <Reveal
          as="article"
          aria-labelledby="publication-title"
          className="col-span-12 lg:col-span-8 lg:pt-16"
        >
          <div className="space-y-4 md:space-y-5">
            <Heading level={3} variant="project" id="publication-title" className="max-w-[26em]">
              {r.title}
            </Heading>
            <p className="max-w-[var(--measure)] text-muted italic">{r.venue}</p>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 md:mt-6 md:flex md:flex-wrap md:gap-x-14">
            {facts.map((f) => (
              <div
                key={f.term}
                className={`flex min-w-0 flex-col gap-0.5 py-2.5 md:gap-1 md:py-3 ${f.term === "DOI" || f.term === "Supervisor" ? "col-span-2 md:col-span-1" : ""}`}
              >
                <dt>
                  <Label>{f.term}</Label>
                </dt>
                <dd className="font-mono text-xs [overflow-wrap:anywhere] md:text-sm">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* My contribution vs. the wider group project */}
          <div className="mt-5 grid gap-y-5 md:mt-8 md:grid-cols-5 md:gap-x-10 md:gap-y-8">
            <section
              aria-labelledby="my-contribution"
              className="space-y-2 md:col-span-3 md:space-y-4"
            >
              <Label accent as="p">
                My contribution
              </Label>
              <Heading level={4} variant="title" id="my-contribution">
                {r.contribution.title}
              </Heading>
              <p className="max-w-[var(--measure)] text-muted">{r.contribution.summary}</p>
            </section>

            <section aria-labelledby="group-work" className="space-y-2 md:col-span-2 md:space-y-4">
              <h4 id="group-work" className="leading-4">
                <Label accent>Other members&rsquo; contributions</Label>
              </h4>
              <ul className="space-y-1 text-muted">
                {r.groupWork.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </section>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
