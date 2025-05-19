// lib/modules.ts

export interface Chapter {
  slug: string
  title: string
}

export interface Module {
  title: string
  description: string
  chapters: Chapter[]
}

// A record keyed by module‐slug → Module
export const modules: Record<string, Module> = {
  "software-engineering": {
    title: "Software Engineering",
    description: "Learn software design, architecture, testing, and more.",
    chapters: [
      { slug: "design-principles", title: "Design Principles" },
      { slug: "testing-strategies", title: "Testing Strategies" },
    ],
  },
  "web-development": {
    title: "Web Development",
    description: "Build websites using HTML, CSS, JavaScript, and frameworks.",
    chapters: [
      { slug: "html-basics", title: "HTML Basics" },
      { slug: "css-fundamentals", title: "CSS Fundamentals" },
    ],
  },
}
