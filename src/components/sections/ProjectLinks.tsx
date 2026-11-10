import { Button } from "@/components/ui";
import type { Project } from "@/lib/types";

interface ProjectLinksProps {
  project: Project;
  /** Include the link to the case-study page. */
  caseStudy?: boolean;
}

/** Case study, live demo and source. Confidential work exposes no external links. */
export function ProjectLinks({ project, caseStudy }: ProjectLinksProps) {
  return (
    <ul className="flex flex-wrap items-center gap-x-8 gap-y-1">
      {caseStudy && (
        <li>
          <Button href={`/projects/${project.slug}`} variant="link">
            Case study
            <span className="sr-only">: {project.title}</span>
          </Button>
        </li>
      )}
      {!project.confidential && project.liveUrl && (
        <li>
          <Button href={project.liveUrl} variant="link" external>
            Live demo
            <span className="sr-only">: {project.title} (opens in a new tab)</span>
          </Button>
        </li>
      )}
      {!project.confidential && (
        <li>
          <Button href={project.repo} variant="link" external>
            Source
            <span className="sr-only">: {project.title} (opens in a new tab)</span>
          </Button>
        </li>
      )}
    </ul>
  );
}
