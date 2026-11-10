import type { Project } from "@/lib/types";

/**
 * Add a project by adding an entry here; the gallery and /projects/[slug]
 * page are generated from this list. Confidential work must stay anonymised
 * and carry no internal screenshots.
 */
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project title (TODO)",
    year: { todo: "year" },
    summary: { todo: "two-sentence summary from specification" },
    role: { todo: "my role" },
    provenance: "built",
    confidential: false,
    stack: [],
    problem: { todo: "problem" },
    approach: { todo: "approach" },
    outcome: { todo: "outcome (no invented statistics)" },
    links: [],
    images: [],
  },
];
