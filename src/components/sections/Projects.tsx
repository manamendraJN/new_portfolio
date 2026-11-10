import { Container, Heading, Label, Rule, Section } from "@/components/ui";
import { site } from "@/content/site";
import { getCover, getPublishedProjects } from "@/lib/content";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVisual } from "./ProjectVisual";
import { ProjectsCarousel } from "./ProjectsCarousel";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Projects: a 3D elliptical carousel, generated from content. With reduced motion,
 * or without JavaScript, the same projects appear as a plain vertical list.
 */
export function Projects() {
  const meta = site.sections.find((s) => s.id === "projects");
  if (!meta) return null;
  const list = getPublishedProjects();

  /** The same heading for the carousel (pinned with it) and for the plain list. */
  const header = (id: string) => (
    <header className="mb-10 md:mb-12">
      <Label accent>{meta.number}</Label>
      <Heading level={2} id={id} className="mt-4">
        {meta.label}
      </Heading>
    </header>
  );

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="projects-title">
      {/* Without JavaScript the carousel cannot run, so show the list instead. */}
      <noscript>
        <style>{`.projects-carousel{display:none!important}.projects-list{display:block!important}`}</style>
      </noscript>

      <Container>
        <ProjectsCarousel projects={list} header={header("projects-title")} />

        <div className="projects-list">
          {header("projects-list-title")}
          <ol>
            {list.map((p, i) => {
              const cover = getCover(p);
              return (
                <li key={p.slug}>
                  <Rule />
                  <article
                    aria-labelledby={`project-list-${p.slug}`}
                    className="grid grid-cols-12 gap-x-6 gap-y-6 py-10"
                  >
                    {cover && (
                      <div className="col-span-12 md:col-span-6">
                        <ProjectVisual project={p} sizes="(min-width: 768px) 50vw, 100vw" />
                      </div>
                    )}
                    <div
                      className={
                        cover ? "col-span-12 space-y-5 md:col-span-6" : "col-span-12 space-y-5"
                      }
                    >
                      <Label accent>
                        {pad(i + 1)} / {pad(list.length)}
                      </Label>
                      <Heading level={3} variant="project" id={`project-list-${p.slug}`}>
                        {p.title}
                      </Heading>
                      <Label as="p">{p.category}</Label>
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
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
