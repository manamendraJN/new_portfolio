import type { ExperienceEntry } from "@/lib/types";

/** Source: portfolio-details.md section 6. Render only entries with published: true. */
export const experience: ExperienceEntry[] = [
  {
    id: "dialog-axiata",
    published: true,
    role: "Broadcast Ad Insertion & Playout Operator",
    org: "Dialog Axiata PLC",
    start: "May 2026",
    end: "Present",
    employment: "Contract, through a recruitment assignment with Sara Creation",
    location: "Colombo District, Sri Lanka",
    // Broadcast operations experience, not software engineering employment.
    domain: "broadcast-operations",
    summary:
      "Supported advertisement insertion, commercial playout, server operations, broadcast monitoring, and advertisement management for satellite television services.",
  },
  {
    id: "dad-intern",
    published: true,
    role: "Full Stack Engineer Intern",
    org: "Department of Agrarian Development, Sri Lanka",
    start: "August 2025",
    end: "February 2026",
    domain: "software-engineering",
    summary:
      "Gained practical experience developing web-based systems using PHP, JavaScript, SQL, HTML, CSS, and XAMPP.",
  },
  {
    // Do not publish until dates and responsibilities are confirmed.
    id: "heritage-crops",
    published: false,
    role: "Full Stack Developer",
    org: "Heritage Crops Plantations (Pvt) Ltd",
    start: { todo: "dates" },
    end: { todo: "dates" },
    domain: "software-engineering",
    summary: { todo: "responsibilities (unconfirmed)" },
  },
];
