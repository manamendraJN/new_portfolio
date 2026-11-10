import type { SiteConfig } from "@/lib/types";

/** Source of truth: portfolio-details.md. Values marked todo are not yet supplied. */
export const site: SiteConfig = {
  name: "Navodya Manamendra",
  title: "Full-Stack Developer | Software Engineer | AI Enthusiast",
  roles: ["Full-Stack Developer", "Software Engineer", "AI Enthusiast"],
  siteTitle: "Navodya Manamendra | Full-Stack Developer",
  // Site description is TODO in the details file; the hero introduction is used until supplied.
  description:
    "Engineering digital experiences through software, technology, and intelligent solutions.",
  intro: "Engineering digital experiences through software, technology, and intelligent solutions.",
  url: { todo: "domain name" },
  email: { todo: "email address" },
  contactTo: { todo: "address the contact form delivers to" },
  cvUrl: { todo: "résumé (CV) URL" },
  portrait: { todo: "portrait photo file name, or none" },
  social: [
    { label: "GitHub", href: "https://github.com/manamendraJN" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/navodya-manamendra-35a309248/",
    },
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
   * count: 0 shows the static fallback composition.
   */
  hero: {
    count: 120,
    desktop: { path: "/media/hero/desktop/", width: 1920, height: 1080 },
    // Phones: zoom out so ~62% of the frame's width shows (coffee cup and person), picture
    // in the upper part of the hero, text beneath it.
    mobile: {
      path: "/media/hero/mobile/",
      width: 960,
      height: 540,
      visibleX: 0.62,
      focusX: 0.37,
      anchorY: 0.3,
    },
    pad: 4,
    extension: "webp",
    pinViewportHeights: 2.5,
  },
  heroContent: {
    scrollLabel: "Scroll",
  },
  contactContent: {
    headline: "Get in touch",
    note: "Use the form, or find me on GitHub and LinkedIn.",
  },
};

/** About copy, as written in the details file. One string per paragraph. */
export const about: string[] = [
  "I'm a Software Engineer and Full-Stack Developer pursuing a BSc (Hons) in Information Technology at SLIIT. I enjoy turning complex problems into practical, well-designed software that improves real-world workflows.",
  "My experience spans web application development, business-oriented systems, computer vision, and AI research. I'm particularly interested in reliable software architecture, thoughtful user experiences, and intelligent applications that solve meaningful problems.",
  "I'm working toward becoming a well-rounded Software Engineer and AI Developer who can design, build, and deploy scalable, reliable, and intelligent software.",
];
