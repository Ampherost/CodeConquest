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
  "software-engineering": [ // Software engineering module
    {
      moduleId: "software-engineering",  // Chapter One
      slug: "intro-principles-process",
      title: "Design Principles",
      guide: `
# Introduction to Software Engineering

## Major Themes
- **Evolving code over time**  
  Software lives for years or decades; design for maintainability.  
- **Scaling development**  
  Large codebases and teams require processes, tooling, and communication.  
- **Shipping high-quality software**  
  Catch issues early through reviews, testing, and good engineering practices.

## What Is Software Engineering?
> “Application of a systematic, disciplined, quantifiable approach to the development, operation, and maintenance of software.”  
> — IEEE 1990 Standard

- Software is **intangible**, **malleable**, and **human-intensive**.  
- Unlike physical products, it’s easy to modify but hard to describe and evaluate.  
- Engineering practices—processes, formality, and tools—are critical to success.

---

# Key Software Engineering Principles

1. ## Rigor & Formality  
   - Systematic practice complements creativity.  
   - Use mathematical laws and specifications (TLA⁺, Alloy) especially in safety-critical domains.

2. ## Separation of Concerns  
   - Divide a system into distinct features (e.g., UI vs. business logic).  
   - Enables independent reasoning, development, and testing.

3. ## Modularity  
   - Break a system into cohesive, loosely-coupled modules.  
   - Supports maintainability: you can understand and change one piece without ripple effects.

4. ## Abstraction  
   - Expose only what’s necessary; hide internal details.  
   - APIs, interfaces, and layered designs manage complexity.

5. ## Anticipation of Change  
   - Design for likely future modifications (e.g., swapping algorithms).  
   - Maintenance (corrective, adaptive, perfective) often dominates total cost.

6. ## Generality  
   - Solve the general problem when appropriate—but avoid over-engineering.  
   - Follow the “rule of three”: generalize once you see three similar cases.

7. ## Incrementality  
   - Develop and deliver in small steps.  
   - Get feedback early, reduce risk, and adapt requirements as you go.

---

# Software Production Process

## What Is a Software Process?
A **process** defines the activities, their order, and roles needed to produce software.  
We use models to capture what’s worked in the past and guide new projects.

## Why We Need Process Models
- Manage risk of scope creep, delays, and poor quality  
- Coordinate large teams and complex codebases  
- Provide predictability for clients and stakeholders

---

## Process Models

### 1. Waterfall Model
A linear, document-driven approach with well-defined stages:

1. **Feasibility Study**  
   – Financial & technical viability report  
2. **Requirements Analysis**  
   – Gather and specify what the system must do  
3. **Design**  
   – High- and low-level designs (SDD, SSDD, DBDD, etc.)  
4. **Coding & Module Testing**  
   – Implement modules and verify unit behavior  
5. **Integration & System Testing**  
   – Combine modules; test end-to-end functionality  
6. **Delivery, Deployment & Maintenance**  
   – Deploy to users; perform corrective, adaptive, and perfective maintenance

**Pros:** disciplined, well-documented, predictable for large/critical systems  
**Cons:** rigid, slow feedback loop, poor flexibility for change

---

### 2. Agile Methods

#### The Agile Manifesto (2001)
- Individuals & interactions over processes & tools  
- Working software over comprehensive documentation  
- Customer collaboration over contract negotiation  
- Responding to change over following a plan

#### Extreme Programming (XP)
- **Iterative development** in 1–3 week cycles  
- **Test-first**: write tests before code (unit, regression)  
- **Pair programming**: two developers share a workstation  
- **Continuous integration**: merge and test frequently  
- **Refactoring**: continuously improve code structure  
- **Collective ownership** & **sustainable pace**

#### Scrum
- **Roles**: Product Owner, Scrum Master, Team Members  
- **Artifacts**: Product Backlog, Sprint Backlog, Increment  
- **Ceremonies**: Sprint Planning, Daily Scrum, Sprint Review & Retrospective  
- Work proceeds in fixed-length **sprints** delivering a “potentially shippable” increment.  
- **Story points** & **velocity** guide planning and forecasting.

---

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
      moduleId: "software-engineering",  // Chapter Two
      slug: "architecture-tools-testing",
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
     {
      moduleId: "software-engineering",  // Chapter Three
      slug: "design-notations-patterns",
      title: "Notations & Patterns",
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
     {
      moduleId: "software-engineering", // Chapter Four
      slug: "testing-fundamentals",
      title: "Testing & Quality Assurance",
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
     {
      moduleId: "software-engineering",  // Chapter Five
      slug: "testability-debugging",
      title: "Testing & Debugging",
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
     {
      moduleId: "software-engineering",  // Chapter Six
      slug: "design-management",
      title: "Design Fundamentals & Management",
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




  // Compilers Module
  "compilers": [
    {
      moduleId: "compilers",  // Chapter One
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
      moduleId: "compilers",  // Chapter Two
      slug: "parsing-segments",
      title: "Parsing Analysis",
      guide: `
# Parsing

Building parse trees and abstract syntax trees (ASTs).
      `.trim(),
      quiz: [],
    },
      {
      moduleId: "compilers",  // Chapter Three
      slug: "code-generation",
      title: "Cool Code Generation",
      guide: `
# Parsing

Building parse trees and abstract syntax trees (ASTs).
      `.trim(),
      quiz: [],
    },
      {
      moduleId: "compilers",  // Chapter Four
      slug: "code-optimization",
      title: "Cool Code Optimization",
      guide: `
# Parsing

Building parse trees and abstract syntax trees (ASTs).
      `.trim(),
      quiz: [],
    },
  ],



  // Web dev module
  "web-development": [
    {
      moduleId: "web-development",  // Chapter One
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
      moduleId: "web-development",  // Chapter Two
      slug: "css-basics",
      title: "CSS Fundamentals",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
     {
      moduleId: "web-development",  // Chapter Three
      slug: "javascript-basics",
      title: "Javascript Basics",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
     {
      moduleId: "web-development",  // Chapter Four
      slug: "react-intro",
      title: "React",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
     {
      moduleId: "web-development",  // Chapter Five
      slug: "nextjs-intro",
      title: "Next.js",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
     {
      moduleId: "web-development",  // Chapter Six
      slug: "tailwindcss-intro",
      title: "Tailwind CSS",
      guide: `
# CSS Fundamentals

Selectors, properties, values, the box model, and how to lay out elements with Flexbox and Grid.
      `.trim(),
      quiz: [],
    },
  ],
}