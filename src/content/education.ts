import type { Certification, EducationEntry } from "@/lib/types";

export const education: EducationEntry[] = [
  {
    id: "degree",
    qualification: { todo: "degree title" },
    institution: { todo: "institution" },
    start: { todo: "start year" },
    end: "Expected",
    status: "in-progress", // the degree is shown as in progress
    note: "In progress",
  },
  {
    id: "prior",
    qualification: { todo: "earlier qualification" },
    institution: { todo: "institution" },
    start: { todo: "start year" },
    end: { todo: "end year" },
    status: "completed",
  },
];

export const certifications: Certification[] = [];
