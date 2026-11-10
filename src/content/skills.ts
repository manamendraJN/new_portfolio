import type { SkillGroup } from "@/lib/types";

/** No percentages and no experience durations. */
export const skills: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["Java", "JavaScript", "PHP", "Python", "C", "TypeScript"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["HTML5", "CSS3", "React", "Tailwind CSS", "Bootstrap"],
  },
  { id: "backend", label: "Backend", items: ["Node.js", "Express", "Spring Boot"] },
  { id: "mobile", label: "Mobile", items: ["Kotlin"] },
  { id: "databases", label: "Databases", items: ["MongoDB", "MySQL", "SQLite", "PostgreSQL"] },
  {
    id: "ai",
    label: "AI/ML and computer vision",
    items: ["OpenCV", "MediaPipe", "EfficientNet-B3"],
  },
  {
    id: "application",
    label: "Application technologies",
    items: ["MERN Stack", "JWT", "OAuth 2.0", "Socket.IO", "WebRTC"],
  },
  { id: "tools", label: "Tools", items: ["Git", "GitHub", "Postman", "GitHub Actions", "Docker"] },
  { id: "cloud", label: "Cloud", items: ["AWS-related learning and credentials"] },
  { id: "design", label: "Design", items: ["Figma", "UI/UX", "Responsive design"] },
];
