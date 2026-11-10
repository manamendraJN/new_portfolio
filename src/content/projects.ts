import type { Project } from "@/lib/types";

/**
 * Add a project by adding an entry here; the gallery and /projects/[slug]
 * page are generated from this list. Media stays empty until real screenshots
 * are supplied; any illustration must use kind: "illustration".
 * Source: portfolio-details.md section 5.
 */
export const projects: Project[] = [
  {
    slug: "warehouse-management-system",
    title: "Warehouse Management System",
    category: "Client web application",
    published: true,
    repo: "https://github.com/Shiranakther/Warehouse_Management_Syatem",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    description:
      "Developed for a client to streamline inventory, employee, and shipping operations.",
    features: [
      "Inventory monitoring",
      "Low-stock alerts",
      "Purchase orders",
      "Shipping",
      "Wastage tracking",
      "Supplier management",
      "Staff scheduling",
    ],
    contribution: "Secure login, staff management, and a shift scheduling algorithm.",
    reportedOutcome:
      "The project description reports a 20% reduction in operational delays (reported, not independently verified).",
    confidential: false,
    media: [],
    todo: "screenshots",
  },
  {
    slug: "issuesync",
    title: "IssueSync",
    category: "Issue-tracking web application",
    published: true,
    repo: "https://github.com/manamendraJN/issue-tracker",
    liveUrl: "https://issuesync.netlify.app/",
    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Netlify",
      "Render",
    ],
    description:
      "An issue-tracking application featuring authentication, CRUD operations, reusable navigation, toast notifications, and separate frontend and backend deployment.",
    confidential: false,
    media: [],
    todo: "screenshots",
  },
  {
    slug: "handgesturecontrol",
    title: "HandGestureControl",
    category: "Computer vision desktop application",
    published: true,
    repo: "https://github.com/manamendraJN/HandGestureControl",
    stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "Win32 API"],
    description:
      "A computer vision application for controlling the mouse through right-hand gestures captured by a webcam.",
    features: [
      "Cursor movement",
      "Adjustable speed",
      "Gesture-based clicking",
      "Calibration",
      "Real-time hand tracking",
    ],
    confidential: false,
    media: [],
    todo: "screenshots or demo video",
  },
  {
    slug: "collab-hub",
    title: "Collab Hub",
    category: "Remote-work collaboration platform",
    published: true,
    repo: "https://github.com/manamendraJN/Collab-Hub",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"],
    description:
      "A remote-work collaboration platform for task distribution, project management, and file sharing. Its Smart Workload Balancer considers workload, deadlines, and task complexity.",
    confidential: false,
    media: [],
    todo: "screenshots",
  },
  {
    slug: "skillsphere",
    title: "SkillSphere",
    category: "Learning platform",
    published: true,
    repo: "https://github.com/manamendraJN/SkillSphere",
    stack: ["React", "Spring Boot", "MySQL", "WebRTC", "OAuth 2.0"],
    description:
      "A learning platform connecting learners and instructors through learning paths, progress tracking, interactive video sessions, community forums, and gamification.",
    confidential: false,
    media: [],
    todo: "screenshots",
  },
];
