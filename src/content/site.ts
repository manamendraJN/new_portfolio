import type { SiteConfig } from "@/lib/types";

export const site: SiteConfig = {
  name: "Navodya Manamendra",
  title: "Full-Stack Developer, Software Engineer, AI Enthusiast",
  roles: ["Full-Stack Developer", "Software Engineer", "AI Enthusiast"],
  description:
    "Portfolio of Navodya Manamendra: full-stack developer, software engineer and AI enthusiast.",
  intro: { todo: "one-line intro for the hero (from specification)" },
  url: { todo: "production domain" },
  email: { todo: "public contact email" },
  location: { todo: "location, if to be shown" },
  social: [
    { label: "GitHub", href: "https://github.com/manamendraJN" },
    { label: "LinkedIn", href: { todo: "LinkedIn URL" } },
  ],
  nav: [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Research", href: "#research" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],
  sections: [
    { id: "hero", number: "00", label: "Introduction", theme: "dark" },
    { id: "about", number: "01", label: "About", theme: "light", tone: "base" },
    { id: "expertise", number: "02", label: "Expertise", theme: "light", tone: "surface" },
    { id: "projects", number: "03", label: "Projects", theme: "light", tone: "base" },
    { id: "experience", number: "04", label: "Experience", theme: "light", tone: "surface" },
    { id: "research", number: "05", label: "Research", theme: "dark", tone: "surface" },
    { id: "education", number: "06", label: "Education", theme: "light", tone: "base" },
    { id: "contact", number: "07", label: "Contact", theme: "dark", tone: "base" },
  ],
  /**
   * Hero frame sequence. To swap the video: replace the frames in
   * public/media/hero/{desktop,mobile}/ and update `count` (and sizes).
   * count: 0 keeps the static fallback composition.
   */
  hero: {
    count: 0,
    desktop: { path: "/media/hero/desktop/", width: 1920, height: 1080 },
    mobile: { path: "/media/hero/mobile/", width: 960, height: 540 },
    pad: 4,
    extension: "webp",
    pinViewportHeights: 2.5,
  },
};
