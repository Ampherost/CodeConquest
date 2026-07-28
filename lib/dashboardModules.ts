// Centralized module list for dashboard cards.
// Used by DashboardCurrent and DashboardLearning.
// Edit this file to add/remove modules from the dashboard.

export interface DashboardModule {
  title: string;
  level: string;
  chapters: number;
  quizzes: number;
  image: string;
  slug: string;
}

export const dashboardModules: DashboardModule[] = [
  {
    title: "Software Engineering",
    level: "Intermediate",
    chapters: 6,
    quizzes: 6,
    image: "/assets/software-engineer.png",
    slug: "software-engineering",
  },
  {
    title: "Compilers",
    level: "Advanced",
    chapters: 4,
    quizzes: 3,
    image: "/assets/compiler.png",
    slug: "compilers",
  },
  {
    title: "Web Development",
    level: "Intermediate",
    chapters: 6,
    quizzes: 5,
    image: "/assets/web-dev.png",
    slug: "web-development",
  },
  {
    title: "Intro to C++",
    level: "Beginner",
    chapters: 3,
    quizzes: 3,
    image: "/assets/cpp.png",
    slug: "intro-to-cpp",
  },
  {
    title: "Databases & SQL",
    level: "W.I.P.",
    chapters: 0,
    quizzes: 0,
    image: "/assets/Databases & SQL.png",
    slug: "DNE",
  },
  {
    title: "Data Structures & Algorithms",
    level: "W.I.P.",
    chapters: 0,
    quizzes: 0,
    image: "/assets/Data Structures & Algorithms.png",
    slug: "DNE",
  },
];

// Subset used on the "Current" dashboard tab (only released modules)
export const currentModules = dashboardModules.filter(
  (m) => m.level !== "W.I.P."
);
