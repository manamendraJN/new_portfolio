import { Parallax, Reveal } from "@/components/motion";
import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { site } from "@/content/site";
import { getPublishedProjects, projectNumber } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVisual } from "./ProjectVisual";

/** Projects: large case-study panels that alternate sides. Generated from content. */
export function Projects() {
  const meta = site.sections.find((s) => s.id === "projects");
  if (!meta) return null;
  const list = getPublishedProjects();

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="projects-title">
      <Container>
        <Reveal as="header" className="mb-14 md:mb-20">
          <Label accent>{meta.number}</Label>
          <Heading level={2} id="projects-title" className="mt-4">
            {meta.label}
          </Heading>
        </Reveal>

        <ol>
          {list.map((p, i) => {
            const flip = i % 2 === 1;
            const number = projectNumber(p.slug);
            return (
              <li key={p.slug}>
                <Rule />
                <Reveal
                  as="article"
                  aria-labelledby={`project-${p.slug}`}
                  className="group grid grid-cols-12 items-center gap-x-6 gap-y-8 py-12 md:py-16 lg:gap-x-10 lg:py-24"
                >
                  <div className={cn("col-span-12 lg:col-span-7", flip && "lg:order-2")}>
                    <Parallax amount={14}>
                      <ProjectVisual project={p} number={number} />
                    </Parallax>
                  </div>

                  <div
                    className={cn(
                      "col-span-12 space-y-6 lg:col-span-5",
                      flip && "lg:order-1 lg:pr-6",
                      !flip && "lg:pl-6",
                    )}
                  >
                    <div className="space-y-3">
                      <Label accent>{number}</Label>
                      <Label as="p">{p.category}</Label>
                    </div>
                    <Heading level={3} variant="project" id={`project-${p.slug}`}>
                      {p.title}
                    </Heading>
                    <p className="max-w-[var(--measure)] text-muted">{p.description}</p>

                    <ul aria-label="Technologies" className="flex flex-wrap gap-x-4 gap-y-1">
                      {p.stack.map((t) => (
                        <li key={t}>
                          <Label>{t}</Label>
                        </li>
                      ))}
                    </ul>

                    <ProjectLinks project={p} caseStudy />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <Rule />
      </Container>
    </Section>
  );
}
