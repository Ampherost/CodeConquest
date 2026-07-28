// lib/modules.ts
export interface ChapterMeta { id: string; title: string }

// This contains all the variables defining a module
export interface Module {
  id: string
  title: string
  description: string
  level?: string
  image?: string
  chapters: ChapterMeta[]
}

// This is essentially an array of modules filled with our information
export const modules: Module[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "An intro to software engineering principles and practices",
    level: "Intermediate",
    image: "/assets/software-engineer.png",
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
    level: "Advanced",
    image: "/assets/compiler.png",
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
    level: "Intermediate",
    image: "/assets/web-dev.png",
    chapters: [
      { id: "html-basics", title: "HTML basics" },
      { id: "css-basics", title: "CSS basics" },
      { id: "javascript-basics", title: "JavaScript Basics" },
      { id: "react-intro", title: "React" },
      { id: "nextjs-intro", title: "Next.js" },
      { id: "tailwindcss-intro", title: "Tailwind CSS" }
    ],
  },
  {
    id: "intro-to-cpp",
    title: "Intro to C++",
    description: "Learn fundamental C++ concepts including syntax, memory management, pointers, and object-oriented programming.",
    level: "Beginner",
    image: "/assets/cpp.png",
    chapters: [
      { id: "cpp-basics", title: "C++ Fundamentals & Syntax" },
      { id: "pointers-memory", title: "Pointers & Memory Management" },
      { id: "oop-in-cpp", title: "Object-Oriented Programming" }
    ],
  },
  {
    id: "databases-sql",
    title: "Databases & SQL",
    description: "Master relational databases, SQL queries, indexing, and schema design.",
    level: "Intermediate",
    image: "/assets/Databases & SQL.png",
    chapters: [
      { id: "intro-relational-db", title: "Relational Databases & SQL Basics" },
      { id: "queries-joins", title: "Complex Queries & Joins" },
      { id: "indexing-transactions", title: "Indexing & Transactions (ACID)" },
    ],
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master core computer science algorithms, complexity analysis, and data structures.",
    level: "Intermediate",
    image: "/assets/Data Structures & Algorithms.png",
    chapters: [
      { id: "arrays-linked-lists", title: "Arrays & Linked Lists" },
      { id: "stacks-queues-trees", title: "Stacks, Queues & Trees" },
      { id: "sorting-searching-big-o", title: "Sorting, Searching & Big-O Notation" },
    ],
  },
]

