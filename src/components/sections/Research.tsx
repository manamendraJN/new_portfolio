import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { research } from "@/content/research";
import { site } from "@/content/site";
import { ResearchIllustration } from "./ResearchIllustrations";

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
      <Container>
        <header className="mb-14 md:mb-20">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="research-title" className="mt-4">
            {meta.label}
          </Heading>
        </header>

        {/* The plate */}
        <article aria-labelledby="publication-title" className="border border-line">
          <div className="space-y-6 p-6 md:p-10 lg:p-14">
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              <Label accent>Published paper</Label>
              <Label>
                {r.conferenceDate} &middot; {r.venueLocation}
              </Label>
            </p>
            <Heading level={3} variant="project" id="publication-title" className="max-w-[26em]">
              {r.title}
            </Heading>
            <p className="max-w-[var(--measure)] text-muted italic">{r.venue}</p>
          </div>

          <Rule />

          <dl className="grid divide-y divide-[var(--line)] md:grid-cols-2 md:divide-y-0">
            {facts.map((f, i) => (
              <div
                key={f.term}
                className={`flex flex-col gap-1 p-6 md:px-10 lg:px-14 ${i >= 2 ? "md:border-t md:border-[var(--line)]" : ""} ${i % 2 === 0 ? "md:border-r md:border-[var(--line)]" : ""}`}
              >
                <dt>
                  <Label>{f.term}</Label>
                </dt>
                <dd className="font-mono text-sm break-words">{f.value}</dd>
              </div>
            ))}
          </dl>

          <Rule />

          {/* My contribution vs. the wider group project */}
          <div className="grid gap-y-10 p-6 md:grid-cols-12 md:gap-x-10 md:p-10 lg:p-14">
            <section aria-labelledby="my-contribution" className="space-y-4 md:col-span-7">
              <Label accent as="p">
                My contribution
              </Label>
              <Heading level={4} variant="title" id="my-contribution">
                {r.contribution.title}
              </Heading>
              <p className="max-w-[var(--measure)] text-muted">{r.contribution.summary}</p>
            </section>

            <section
              aria-labelledby="group-work"
              className="space-y-4 md:col-span-4 md:col-start-9"
            >
              <Label as="p">Wider group project</Label>
              <Heading level={4} variant="title" id="group-work">
                Not my individual work
              </Heading>
              <ul className="space-y-1 text-muted">
                {r.groupWork.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        {/* Original illustrations of my contribution */}
        <div className="mt-16 space-y-8 md:mt-24">
          <div className="space-y-2">
            <Heading level={3} variant="title">
              My contribution, illustrated
            </Heading>
            <p className="max-w-[var(--measure)] text-muted">
              Original schematic illustrations of the module. They show the idea, not results.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {r.illustrations.map((item) => (
              <ResearchIllustration key={item.caption} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
