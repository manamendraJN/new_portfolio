import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Heading, Label, Section } from "@/components/ui";
import { ProjectLinks } from "@/components/sections/ProjectLinks";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { site } from "@/content/site";
import {
  getAdjacentProjects,
  getCover,
  getGallery,
  getProject,
  getPublishedProjects,
  projectNumber,
} from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** One static page per published project. Adding a project only needs a content edit. */
export function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | ${site.name}`,
    description: project.description,
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10">
        <h2 className="col-span-12 md:col-span-4">
          <Label>{title}</Label>
        </h2>
        <div className="col-span-12 md:col-span-8">{children}</div>
      </div>
    </>
  );
}

/**
 * Real slugs are all prerendered by generateStaticParams. Opting out of the
 * instant-shell check lets params be read here so unknown slugs return a true 404
 * (dynamicParams is unavailable with Cache Components).
 */
export const instant = false;

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const number = projectNumber(project.slug);
  const adjacent = getAdjacentProjects(project.slug);
  const gallery = getGallery(project);

  return (
    <main id="main" tabIndex={-1} data-theme="light" className="bg-bg text-fg outline-none">
      <Section
        theme="light"
        aria-labelledby="project-title"
        className="pt-[calc(var(--section-y)*0.6+4rem)]"
      >
        <Container className="space-y-12 md:space-y-16">
          <header className="space-y-6">
            <Link
              href="/#projects"
              className="inline-flex min-h-11 items-center gap-2 text-sm hover:text-link"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              All projects
            </Link>
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Label accent>{number}</Label>
                <Label>{project.category}</Label>
              </div>
              <Heading level={1} id="project-title">
                {project.title}
              </Heading>
              <p className="max-w-[34em] text-[length:clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-[1.45] text-balance">
                {project.description}
              </p>
            </div>
          </header>

          {getCover(project) && <ProjectVisual project={project} wide priority sizes="100vw" />}

          {gallery.length > 0 && (
            <ul aria-label="Project images" className="grid gap-6 sm:grid-cols-2">
              {gallery.map((src, i) => (
                <li
                  key={src}
                  className="relative aspect-[16/10] overflow-hidden border border-line"
                >
                  <Image
                    src={src}
                    alt={`${project.title}, image ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}

          <div>
            {project.features && project.features.length > 0 && (
              <Block title="Features">
                <ul className="grid max-w-[var(--measure)] gap-x-8 gap-y-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Block>
            )}
            {project.contribution && (
              <Block title="My contribution">
                <p className="max-w-[var(--measure)]">{project.contribution}</p>
              </Block>
            )}
            {project.reportedOutcome && (
              <Block title="Reported outcome">
                <p className="max-w-[var(--measure)]">{project.reportedOutcome}</p>
              </Block>
            )}
            <Block title="Technologies">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {project.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Block>
            {project.confidential ? (
              <Block title="Note">
                <p className="max-w-[var(--measure)] text-muted">
                  This work is confidential, so the description is anonymised and no internal
                  screenshots or links are shown.
                </p>
              </Block>
            ) : (
              <Block title="Links">
                <ProjectLinks project={project} />
              </Block>
            )}
          </div>

          {adjacent && (
            <nav aria-label="More projects" className="flex flex-wrap justify-between gap-6">
              <Link
                href={`/projects/${adjacent.prev.slug}`}
                className="group space-y-1 hover:text-link"
              >
                <Label>Previous</Label>
                <span className="block text-[length:var(--text-title)] font-medium">
                  {adjacent.prev.title}
                </span>
              </Link>
              <Link
                href={`/projects/${adjacent.next.slug}`}
                className="group space-y-1 hover:text-link sm:text-right"
              >
                <Label>Next</Label>
                <span className="block text-[length:var(--text-title)] font-medium">
                  {adjacent.next.title}
                </span>
              </Link>
            </nav>
          )}
        </Container>
      </Section>
    </main>
  );
}
