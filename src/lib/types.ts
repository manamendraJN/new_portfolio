export type Theme = "dark" | "light";

/** A value that has not been supplied yet. Rendered visibly as a placeholder. */
export type Todo = { todo: string };

export interface NavItem {
  label: string;
  href: string;
}

export interface SectionMeta {
  id: string;
  number: string;
  label: string;
  theme: Theme;
  /** Surface variant within the theme (sand sections use the surface colour). */
  tone?: "base" | "surface";
}

export interface SocialLink {
  label: string;
  href: string | Todo;
}

export interface HeroFrameConfig {
  /** Frame count per set. 0 means no frames yet: show the static fallback. */
  count: number;
  desktop: { path: string; width: number; height: number };
  mobile: { path: string; width: number; height: number };
  /** Printf-style: path + filename pattern, 1-indexed, zero padded to `pad`. */
  pad: number;
  extension: "webp";
  /** Scroll distance of the pin, in viewport heights. */
  pinViewportHeights: number;
}

export interface SiteConfig {
  name: string;
  title: string;
  roles: string[];
  description: string;
  intro: string | Todo;
  url: string | Todo;
  email: string | Todo;
  location: string | Todo;
  social: SocialLink[];
  nav: NavItem[];
  sections: SectionMeta[];
  hero: HeroFrameConfig;
}

export type Provenance = "built" | "maintained" | "supported";

export interface Project {
  slug: string;
  title: string;
  year: string | Todo;
  summary: string | Todo;
  role: string | Todo;
  provenance: Provenance;
  /** Confidential work: anonymised copy, no internal screenshots. */
  confidential: boolean;
  stack: string[];
  problem: string | Todo;
  approach: string | Todo;
  outcome: string | Todo;
  links: { label: string; href: string }[];
  images: { src: string; alt: string }[];
}

export interface ExperienceEntry {
  id: string;
  role: string | Todo;
  org: string | Todo;
  start: string | Todo;
  end: string | Todo;
  provenance: Provenance;
  summary: string | Todo;
  points: Array<string | Todo>;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: Array<{ name: string; note?: string }>;
}

export interface Publication {
  title: string | Todo;
  authors: string[] | Todo;
  venue: string | Todo;
  year: string | Todo;
  doi: string | Todo;
  /** Describes my actual role in the work. */
  myRole: string | Todo;
  abstract?: string | Todo;
}

export interface EducationEntry {
  id: string;
  qualification: string | Todo;
  institution: string | Todo;
  start: string | Todo;
  end: string | Todo;
  status: "completed" | "in-progress";
  note?: string;
}

export interface Certification {
  name: string | Todo;
  issuer: string | Todo;
  year: string | Todo;
}
