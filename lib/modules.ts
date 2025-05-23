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
    description: "An intro to software engineering ptinciples and practices",
    chapters: [
      { id: "design-principles", title: "Design Principles" },
      { id: "testing-strategies", title: "Testing Strategies" },
    ],
  },
  {
    id: "compilers",
    title: "Compilers",
    description: "Dive into the world of compilers and language processing",
    chapters: [
      { id: "lexical-analyzers", title: "Lexical Analysis" },
      { id: "parsing-segments", title: "Parsing Analysis" },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Learn the fundamentals of modern web-development",
    chapters: [
      { id: "html-basics", title: "HTML basics" },
      { id: "css-basics", title: "CSS basics" },
    ],
  },
]

