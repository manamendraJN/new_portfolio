import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";

/** Only published projects are ever rendered or given a page. */
export function getPublishedProjects(): Project[] {
  return projects.filter((p) => p.published);
}

export function getProject(slug: string): Project | undefined {
  return getPublishedProjects().find((p) => p.slug === slug);
}

/** Neighbouring published projects, wrapping around. */
export function getAdjacentProjects(slug: string): { prev: Project; next: Project } | null {
  const list = getPublishedProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1 || list.length < 2) return null;
  return { prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
}

/** The project's ImageKit cover URL, or null. Confidential work never shows images. */
export function getCover(project: Project): string | null {
  if (project.confidential) return null;
  return project.cover.trim() || null;
}

/** ImageKit gallery URLs for the case-study page. Empty for confidential work. */
export function getGallery(project: Project): string[] {
  if (project.confidential) return [];
  return project.gallery.map((u) => u.trim()).filter(Boolean);
}

/** Two-digit position of a project in the published list, e.g. "01". */
export function projectNumber(slug: string): string {
  const i = getPublishedProjects().findIndex((p) => p.slug === slug);
  return String(i + 1).padStart(2, "0");
}
