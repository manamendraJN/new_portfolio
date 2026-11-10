import type { Certificate, EducationEntry } from "@/lib/types";

/** Source: portfolio-details.md sections 8 and 9. No invented results or awards. */
export const education: EducationEntry[] = [
  {
    id: "sliit-bsc",
    qualification: "BSc (Hons) in Information Technology",
    institution: "Sri Lanka Institute of Information Technology (SLIIT)",
    status: "in-progress",
    stage: "Fourth-year undergraduate",
    expectedGraduation: { todo: "confirmed graduation date" },
  },
];

/**
 * Certificate gallery. imageUrl takes a configurable ImageKit URL and stays
 * empty until a genuine image is supplied. Never fabricate certificates or links.
 */
export const certificates: Certificate[] = [
  {
    id: "sliit-aiml",
    title: "AI/ML Engineer",
    issuer: "SLIIT",
    verifyUrl: "https://code.sliit.org/certificates/muy9c4mfjv",
    imageUrl: "",
  },
  {
    id: "sololearn-python",
    title: "Python (Basic)",
    issuer: "SoloLearn",
    verifyUrl: "https://www.sololearn.com/en/certificates/CC-S7UZM0GN",
    imageUrl: "",
  },
  {
    id: "hackerrank-javascript",
    title: "JavaScript (Basic)",
    issuer: "HackerRank",
    verifyUrl: "https://www.hackerrank.com/certificates/ef62b645d0bd",
    imageUrl: "",
  },
  {
    id: "hackerrank-react",
    title: "React (Basic)",
    issuer: "HackerRank",
    verifyUrl: "https://www.hackerrank.com/certificates/206119c6659f",
    imageUrl: "",
  },
  {
    id: "hackerrank-sql",
    title: "SQL (Basic)",
    issuer: "HackerRank",
    verifyUrl: "https://hackerrank.com/certificates/12e449396716",
    imageUrl: "",
  },
  {
    id: "hackerrank-java",
    title: "Java (Basic)",
    issuer: "HackerRank",
    verifyUrl: "https://www.hackerrank.com/certificates/768a9f87f70c",
    imageUrl: "",
  },
  {
    id: "aws-academy-cwab",
    title: "AWS Academy Graduate: Cloud Web Application Builder",
    issuer: "AWS Academy",
    verifyUrl: "https://www.credly.com/badges/230d6cf1-20b6-4433-b23c-0159a704e218",
    imageUrl: "",
  },
  {
    id: "aws-simulearn",
    title: "AWS SimuLearn: Computing Solutions",
    issuer: "AWS",
    credential: "Credential ID: dd070d49-7895-4e47-8c11-841964fdb44e",
    issued: "August 2025",
    imageUrl: "",
  },
  {
    id: "ieee-author",
    title: "Author Certificate",
    issuer: "IEEE SCSE 2026",
    imageUrl: "",
  },
];
