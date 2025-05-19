// lib/modules.ts
export interface Module {
  id: string
  title: string
  description: string
}

export const modules: Module[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "An intro to software engineering",
  },
  {
    id: "compilers",
    title: "Compilers",
    description: "An intro to compilers",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "An intro to web development",
  },
]

