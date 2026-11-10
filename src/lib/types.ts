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

export interface HeroContent {
  scrollLabel: string;
}

export interface ContactContent {
  headline: string;
  note: string;
}

export interface SiteConfig {
  name: string;
  /** Full professional title, as displayed. */
  title: string;
  roles: string[];
  /** <title> for the site. */
  siteTitle: string;
  /** Meta description. */
  description: string;
  intro: string;
  url: string | Todo;
  email: string | Todo;
  /** Where the contact form delivers. */
  contactTo: string | Todo;
  cvUrl: string | Todo;
  portrait: string | Todo;
  social: SocialLink[];
  nav: NavItem[];
  sections: SectionMeta[];
  hero: HeroFrameConfig;
  heroContent: HeroContent;
  contactContent: ContactContent;
}

/** An image that is either a real screenshot or a clearly labelled illustration. */
export interface Media {
  /** Empty until a genuine image is supplied. */
  src: string;
  alt: string;
  kind: "screenshot" | "illustration";
  caption?: string;
  /** For original illustrations drawn in code, which drawing to render. */
  drawing?: "measurements" | "extraction" | "recommendation";
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  published: boolean;
  repo: string;
  liveUrl?: string;
  stack: string[];
  description: string;
  features?: string[];
  /** My individual contribution, where stated. */
  contribution?: string;
  /** Reported by the project description, not independently verified. */
  reportedOutcome?: string;
  /** Confidential work: anonymised copy, no internal screenshots. */
  confidential: boolean;
  /**
   * Cover image: your own image hosted on ImageKit (https://ik.imagekit.io/...).
   * Leave "" until it exists; the carousel shows a typographic panel meanwhile.
   */
  cover: string;
  /** Further ImageKit image URLs shown on the case-study page. */
  gallery: string[];
  /** Placeholder note listing what is still needed. */
  todo?: string;
}

export interface ExperienceEntry {
  id: string;
  published: boolean;
  role: string | Todo;
  org: string | Todo;
  start: string | Todo;
  end: string | Todo;
  employment?: string;
  location?: string;
  /** "broadcast-operations" roles must never be presented as software engineering. */
  domain: "software-engineering" | "broadcast-operations";
  summary: string | Todo;
  points?: Array<string | Todo>;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface Publication {
  published: boolean;
  title: string;
  venue: string;
  conferenceDate: string;
  venueLocation: string;
  doi: string;
  url: string;
  isbn: string;
  ieeeXplore: string;
  projectId: string;
  supervisor: string;
  /** My individual contribution. */
  contribution: { title: string; summary: string };
  /** Wider group project; not my individual work. */
  groupWork: string[];
  /** Original illustrations; always labelled as illustrations. */
  illustrations: Media[];
}

export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  status: "completed" | "in-progress";
  /** Shown as written, e.g. "Fourth-year undergraduate". */
  stage?: string;
  expectedGraduation?: string | Todo;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  /** Credential details when there is no link. */
  credential?: string;
  verifyUrl?: string;
  issued?: string;
  /** Configurable ImageKit URL; stays empty until a genuine image is supplied. */
  imageUrl: string;
}
