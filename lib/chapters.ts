// lib/chapters.ts
// This file will contain the static data for our Chapters

/** A single quiz question with multiple choices */
export interface QuizQuestion {
  question: string
  options: string[]
  /** The correct answer string must exactly match one of the options */
  answer: string
}

/** The full content for one chapter */
export interface ChapterContent {
  /** must match the module’s id in modules.ts */
  moduleId: string
  /** will be your filesystem slug, e.g. `[chapter]` */
  slug: string
  /** human‐readable title */
  title: string
  /** markdown or plain text guide — you can `dangerouslySetInnerHTML` or pass through a MDX renderer */
  guide: string
  /** list of quiz questions for this chapter */
  quiz: QuizQuestion[]
}

/**
 * All chapters, grouped by module id.
 * Keys here should match your modules[].id values.
 */
export const chaptersByModule: Record<string, ChapterContent[]> = {
  "software-engineering": [
    {
      moduleId: "software-engineering",
      slug: "design-principles",
      title: "Design Principles",
      guide: `
# SOLID Principles

- **S**ingle Responsibility  
- **O**pen/Closed  
- **L**iskov Substitution  
- **I**nterface Segregation  
- **D**ependency Inversion

Each principle helps keep your code maintainable, testable, and flexible.
      `.trim(),
      quiz: [
        {
          question: "What does the 'O' in SOLID stand for?",
          options: ["Open/Closed", "Object/Oriented", "Optionality"],
          answer: "Open/Closed",
        },
        {
          question: "Which SOLID principle advocates that a class should have only one reason to change?",
          options: ["Single Responsibility", "Interface Segregation", "Dependency Inversion"],
          answer: "Single Responsibility",
        },
      ],
    },
    {
      moduleId: "software-engineering",
      slug: "testing-strategies",
      title: "Testing Strategies",
      guide: `
# Testing Strategies

Unit tests, integration tests, end-to-end tests—each covers a different slice of your application.
      `.trim(),
      quiz: [
        {
          question: "What type of test covers the flow of your entire app in a browser?",
          options: ["Unit Test", "Integration Test", "End-to-End Test"],
          answer: "End-to-End Test",
        },
      ],
    },
  ],

  // 👇 Added the missing "compilers" entries
  "compilers": [
    {
      moduleId: "compilers",
      slug: "lexical-analyzers",
      title: "Lexical Analysis",
      guide: `
# Lexical Analysis

How source code is broken into tokens by the lexer.
      `.trim(),
      quiz: [
        {
          question: "Which component breaks input text into tokens?",
          options: ["Parser", "Lexer", "Optimizer"],
          answer: "Lexer",
        },
      ],
    },
    {
      moduleId: "compilers",
      slug: "parsing-segments",
      title: "Parsing Analysis",
      guide: `
# Parsing

Building parse trees and abstract syntax trees (ASTs).
      `.trim(),
      quiz: [],
    },
  ],

  "web-development": [
    {
      moduleId: "web-development",
      slug: "html-basics",
      title: "HTML Basics",
      guide: `
# HTML Basics

Learn how to structure a webpage with headings, paragraphs, links, images, and lists.
      `.trim(),
      quiz: [
        {
          question: "Which tag creates a hyperlink?",
          options: ["<link>", "<a>", "<href>"],
          answer: "<a>",
        },
      ],
    },
    {
      moduleId: "web-development",
      slug: "css-basics",
      title: "CSS Fundamentals",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
  ],
}