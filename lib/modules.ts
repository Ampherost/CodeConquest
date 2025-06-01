// lib/modules.ts
export interface ChapterMeta { id: string; title: string }

// This contains all the variables defining a module
export interface Module {
  id: string
  title: string
  description: string
  chapters: ChapterMeta[]
}

// This is essentially an array of modules filled with our information
export const modules: Module[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "An intro to software engineering principles and practices",
    chapters: [
   { id: "intro-principles-process", title: "Introduction, Principles & Process" },
   { id: "architecture-tools-testing", title: "Architecture, Tools & Testing" },
   { id: "design-notations-patterns", title: "Notations & Patterns" },
   { id: "testing-fundamentals", title: "Testing & Quality Assurance" },
   { id: "testability-debugging", title: "Testability & Debugging" },
   { id: "design-management", title: "Design Fundamentals & Management" },
]
  },
  {
    id: "compilers",
    title: "Compilers",
    description: "Dive into the world of compilers and language processing",
    chapters: [
      { id: "lexical-analyzers", title: "Lexical Analysis" },
      { id: "parsing-segments", title: "Parsing Analysis" },
      { id: "code-generation", title: "Code Generation" },
      { id: "code-optimization", title: "Code Optimization" },

    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Learn the fundamentals of modern web-development",
    chapters: [
      { id: "html-basics", title: "HTML basics" },
      { id: "css-basics", title: "CSS basics" },
      { id: "javascript-basics", title: "JavaScript Basics" },
      { id: "react-intro", title: "React" },
      { id: "nextjs-intro", title: "Next.js" },
      { id: "tailwindcss-intro", title: "Tailwind CSS" }
    ],
  },
]

