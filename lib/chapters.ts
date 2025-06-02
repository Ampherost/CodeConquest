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
    title: "Architecture, Tools, and Testing",
    guide: `
# Architecture, Tools, and Testing

- **Software Architecture**:
  - **Styles**: Monolithic, Layered, Client–Server, Microservices, Event-Driven.
  - **Tradeoffs**: Scalability vs. complexity, coupling vs. cohesion, latency vs. maintainability.
  - **Documentation**: Use diagrams (UML component, sequence) to communicate structure.
- **Development Tools**:
  - **Version Control**: Git workflows (feature branches, pull requests).
  - **CI/CD Pipelines**: Automate builds, tests, and deployments (e.g., Jenkins, GitHub Actions).
  - **Collaboration**: Issue tracking (Jira), code reviews, shared wikis.
- **Testing Fundamentals**:
  - **Unit Testing**: Verify individual components (mocking, stubs).
  - **Integration Testing**: Test combined modules and data flow.
  - **End-to-End (E2E) Testing**: Simulate user workflows in a real environment.
  - **Test Automation**: Use frameworks (JUnit, PyTest, Selenium) to automate test suites.
- **Quality Metrics**:
  - Code coverage, cyclomatic complexity, static analysis (linter, SonarQube).
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "software-engineering",  // Chapter Three
    slug: "design-notations-patterns",
    title: "Notations & Patterns",
    guide: `
# Notations & Patterns

- **Design Notations**:
  - **UML Diagrams**:  
    - **Class Diagram**: Classes, attributes, methods, relationships.  
    - **Sequence Diagram**: Object interactions over time.  
    - **Use Case Diagram**: Actor–system interactions.
  - **ER Diagrams**: Entity–relationship for database design.
  - **Flowcharts and State Diagrams**: Control and state transitions.
- **Design Patterns**:
  - **Creational**: Singleton, Factory Method, Abstract Factory, Builder, Prototype.
  - **Structural**: Adapter, Decorator, Composite, Facade, Proxy.
  - **Behavioral**: Observer, Strategy, Command, Iterator, State.
  - **Anti-Patterns**: God Object, Spaghetti Code, Golden Hammer.
- **Applying Patterns**:
  - Identify recurring problems (e.g., object creation, coupling reduction).
  - Choose pattern by intent: flexibility, reuse, separation of concerns.
  - Document pattern use with UML and code examples.
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "software-engineering", // Chapter Four
    slug: "testing-fundamentals",
    title: "Testing & Quality Assurance",
    guide: `
# Testing & Quality Assurance

- **Testing Levels**:
  - **Unit Tests**: Fast, isolated, developer-written tests for functions/classes.
  - **Integration Tests**: Verify interactions between components or services.
  - **System Tests**: End-to-end scenarios in production-like environment.
  - **Acceptance Tests**: Validate requirements; often automated (Cucumber, FitNesse).
- **QA Practices**:
  - **Test-Driven Development (TDD)**: Write tests before production code; ensures coverage.
  - **Behavior-Driven Development (BDD)**: Express tests in business-readable language.
  - **Continuous Testing**: Integrate tests into CI pipeline; fail fast on regressions.
- **Test Automation Tools**:
  - **Unit**: JUnit, NUnit, pytest.  
  - **Integration/E2E**: Selenium, Cypress, Playwright.  
  - **API**: Postman, REST-assured.
- **Quality Metrics & Reporting**:
  - Code coverage (line, branch), defect density, test pass/fail rates.
  - Static analysis: linters, security scanners (OWASP, SAST).
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "software-engineering",  // Chapter Five
    slug: "testability-debugging",
    title: "Testability & Debugging",
    guide: `
# Testability & Debugging

- **Testability Principles**:
  - **Modular Design**: Low coupling, high cohesion → simpler unit tests.
  - **Dependency Injection**: Pass dependencies to enable mocking and isolation.
  - **Interface Contracts**: Define clear preconditions/postconditions for easier assertions.
  - **Logging & Monitoring**: Instrument code to capture execution paths and metrics.
- **Debugging Techniques**:
  - **Breakpoints & Step Debugging**: Inspect state in IDE (VS Code, IntelliJ, GDB).
  - **Logging Strategies**: Use log levels (INFO, WARN, ERROR) and structured logs.
  - **Profiling & Tracing**: Identify performance bottlenecks (CPU, memory, I/O).
  - **Heap Dumps & Memory Analysis**: Diagnose leaks, excessive allocations.
- **Error Handling Best Practices**:
  - **Exceptions vs. Return Codes**: Use exceptions for unexpected failures.
  - **Graceful Degradation**: Fallback behaviors to maintain availability.
  - **Fail-Fast Principle**: Detect and report errors early in execution.
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "software-engineering",  // Chapter Six
    slug: "design-management",
    title: "Design Fundamentals & Management",
    guide: `
# Design Fundamentals & Management

- **Software Process & Project Management**:
  - **Process Models**: Waterfall vs. Agile (Scrum, Kanban); choose based on project needs.
  - **Requirements Engineering**: Elicit, analyze, and document functional/non-functional requirements.
  - **Estimation Techniques**:  
    - **Planning Poker & Story Points**: Relative sizing in Agile.  
    - **COCOMO Model**: Algorithmic cost estimation for large systems.
- **Risk Management**:
  - Identify risks (technical, schedule, budget); assess probability and impact.
  - Mitigation plans: prototypes, spike solutions, schedule buffers.
- **Configuration & Release Management**:
  - **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH).
  - **Release Pipelines**: Build, test, and deploy automation; blue/green or canary deployments.
- **Team Roles & Communication**:
  - **Roles**: Product Owner, Scrum Master, Developers, QA, DevOps.
  - **Ceremonies**: Stand-ups, sprint planning, retrospectives, demos.
  - **Documentation**: Lightweight artifacts—user stories, acceptance criteria, design docs.
    `.trim(),
    quiz: [
      {
        question: "Which estimation method uses relative sizing cards in Agile?",
        options: ["COCOMO", "Planning Poker", "PERT"],
        answer: "Planning Poker",
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

- **Tokens & Lexemes**: Convert source characters into tokens (IDENTIFIER, NUMBER, KEYWORD, etc.) using patterns.
- **Regular Expressions → DFA**: Define token patterns with regex, build DFA for efficient scanning (“maximal munch”).
- **Symbol Table Check**: After matching an identifier, check if it’s a keyword or user-defined symbol.
- **Skip Whitespace/Comments**: Discard spaces, tabs, newlines, and comments; track line numbers for errors.
- **Error Handling**: Report unrecognized sequences and attempt to recover by skipping to the next valid token.
- **Example**:  
  Input: \`while (count < 10) { count = count + 1; }\`  
  Tokens: KEYWORD(while), LPAREN, IDENTIFIER(count), LESS_THAN, INT(10), RPAREN, LBRACE, IDENTIFIER(count), ASSIGN, IDENTIFIER(count), PLUS, INT(1), SEMICOLON, RBRACE
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
# Parsing Analysis

- **Grammar & CFG**: Use a context-free grammar (CFG) to define valid program structure (nonterminals, terminals, productions).
- **Parse Trees vs. ASTs**: Build a full parse tree or directly create a simpler AST that omits unnecessary nodes.
- **Top-Down Parsing (LL)**:  
  • Recursive descent or predictive parsing with FIRST/FOLLOW tables for LL(1) grammars.  
  • Requires eliminating left recursion and left-factoring.
- **Bottom-Up Parsing (LR)**:  
  • Shift-reduce parsers build states (SLR(1), LALR(1), or canonical LR(1)).  
  • Use parsing tables to decide shifts/reductions and construct the AST.
- **Error Recovery**: Panic mode (skip to sync tokens like “;” or “}”), phrase-level, or error productions.
- **Example**:  
  Tokens: \`while ( count < 10 ) { count = count + 1 ; }\` → AST for a while-loop with relational and assignment nodes.
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "compilers",  // Chapter Three
    slug: "code-generation",
    title: "Cool Code Generation",
    guide: `
# Code Generation

- **Intermediate Representation (IR)**:  
  • Three-Address Code (TAC): Instructions like \`t1 = t2 + t3\`.  
  • Control Flow Graph (CFG): Basic blocks linked by jumps/branches.  
  • SSA Form: Each variable assigned once; insert φ-functions at joins.
- **Emit TAC from AST**: Perform a post-order traversal to generate instructions for expressions and statements.
- **Basic Blocks & CFG Construction**: Identify blocks (single entry/exit) and connect them based on control flow.
- **Instruction Selection**:  
  • Use tree-pattern matching or BURM to map IR to machine-specific instructions.  
  • Respect calling conventions (prologue/epilogue, register usage).
- **Register Allocation**:  
  • Build an interference graph of temporaries.  
  • Apply graph coloring or linear scan; spill to memory if needed.
- **Example** (\`int add(int a,int b){return a+b;}\`):  
  TAC: \`t1 = a + b\`, \`return t1\` → x86-64: \`movl %edi, %eax; addl %esi, %eax; ret\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "compilers",  // Chapter Four
    slug: "code-optimization",
    title: "Cool Code Optimization",
    guide: `
# Code Optimization

- **Levels of Optimization**:  
  • Local (peephole): Simplify instruction sequences within a block (e.g., eliminate \`add x,0\`).  
  • Global (intra-procedural): Perform data-flow analyses on CFG (constant propagation, CSE, dead code elimination).  
  • Interprocedural: Across function boundaries (inlining, interprocedural constant propagation).
- **Data-Flow Analysis**:  
  • Compute IN/OUT sets for each basic block (live variables, reaching definitions, available expressions).  
  • Iterate to a fixed point for global optimizations.
- **Common Techniques**:  
  • Constant Folding/Propagation: Evaluate and propagate constants at compile time.  
  • Dead Code Elimination: Remove code whose results are unused.  
  • Strength Reduction: Replace \`x*2\` with \`x<<1\`.  
  • Loop-Invariant Code Motion: Hoist loop-invariant computations outside loops.  
  • Loop Unrolling: Duplicate loop body to reduce branch overhead.
- **Control-Flow Optimizations**: Reorder basic blocks, insert branch hints to reduce mispredictions.
- **Example**:  
  Original:  
  \`\`\`
  for(i=0;i<100;i++){
    x = a*2 + 0;
    y = b + 3;
  }
  \`\`\`
  After strength reduction and hoisting:  
  \`\`\`
  temp = b + 3;
  for(i=0;i<100;i++){
    y = temp;
  }
  \`\`\`
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

- **Purpose**: Structure webpage content using semantic tags.
- **Basic Elements**:
  - **Headings**: \`<h1>\`–\`<h6>\`
  - **Paragraphs**: \`<p>\`
  - **Links**: \`<a href="URL">text</a>\`
  - **Images**: \`<img src="path" alt="description">\`
  - **Lists**: \`<ul>\` (unordered), \`<ol>\` (ordered), with \`<li>\` items
- **Semantic Sections**: \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<footer>\`
- **Attributes**: \`id\`, \`class\`, \`src\`, \`alt\`, \`href\`
- **Document Skeleton**:
  \`\`\`html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>My Page</title>
    </head>
    <body>
      <header><h1>Welcome</h1></header>
      <nav><ul><li><a href="#home">Home</a></li></ul></nav>
      <main>
        <p>Hello, world!</p>
        <img src="image.jpg" alt="Example">
      </main>
      <footer><p>&copy; 2025</p></footer>
    </body>
  </html>
  \`\`\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "web-development",  // Chapter Two
    slug: "css-basics",
    title: "CSS Fundamentals",
    guide: `
# CSS Fundamentals

- **Role**: Style HTML elements (colors, layout, typography).
- **Syntax**:  
  \`\`\`css
  selector {
    property: value;
  }
  \`\`\`
- **Selectors**:
  - Element: \`p { ... }\`
  - Class: \`.btn { ... }\`
  - ID: \`#header { ... }\`
  - Descendant: \`nav ul li { ... }\`
- **Box Model**:  
  - **Content** → **Padding** → **Border** → **Margin**
  - Use \`box-sizing: border-box;\` to include padding/border in width.
- **Display & Positioning**:
  - \`display\`: block, inline, inline-block
  - \`position\`: static, relative, absolute, fixed
- **Flexbox Layout**:
  - Container: \`display: flex;\`
  - Alignment: \`justify-content\`, \`align-items\`
  - Example:
    \`\`\`css
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    \`\`\`
- **Grid Layout**:
  - Container: \`display: grid;\`
  - Define tracks: \`grid-template-columns\`, \`grid-template-rows\`
  - Place items: \`grid-column\`, \`grid-row\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "web-development",  // Chapter Three
    slug: "javascript-basics",
    title: "Javascript Basics",
    guide: `
# Javascript Basics

- **Purpose**: Add interactivity to webpages (DOM manipulation, events).
- **Variables & Types**:
  - Declarations: \`let\`, \`const\`, (avoid \`var\`)
  - Primitives: string, number, boolean, null, undefined, symbol
  - Compound: object, array, function
- **Functions**:
  - Declaration: \`function greet(name) { ... }\`
  - Arrow: \`const add = (a, b) => a + b;\`
- **DOM Manipulation**:
  - Select: \`document.querySelector(".class")\`
  - Modify: \`element.textContent = "New";\`
  - Create: \`document.createElement("div")\`
- **Events**:
  - \`element.addEventListener("click", handler)\`
  - Common events: click, input, submit
- **Example**: Change text on button click
  \`\`\`html
  <button id="btn">Click me</button>
  <p id="msg">Hello</p>
  <script>
    document.getElementById("btn").addEventListener("click", () => {
      document.getElementById("msg").textContent = "Clicked!";
    });
  </script>
  \`\`\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "web-development",  // Chapter Four
    slug: "react-intro",
    title: "React",
    guide: `
# React

- **Library**: Build UIs with composable components and a virtual DOM.
- **JSX**: Write HTML-like code in JS files:
  \`\`\`jsx
  const Welcome = () => <h1>Hello, React!</h1>;
  \`\`\`
- **Components**:
  - Functional: \`function Component(props) { return <div />; }\`
  - Props: Read-only inputs passed from parent
  - State: Manage local data with \`useState\` hook
- **Hooks**:
  - \`useState\`: \`const [count, setCount] = useState(0);\`
  - \`useEffect\`: Run side effects (fetch data, subscriptions)
- **Virtual DOM**: React diffs JSX to update the real DOM efficiently.
- **Example**: Counter component
  \`\`\`jsx
  import { useState } from "react";
  const Counter = () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <p>{count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  };
  \`\`\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "web-development",  // Chapter Five
    slug: "nextjs-intro",
    title: "Next.js",
    guide: `
# Next.js

- **Framework**: React-based with built-in routing and SSR/SSG.
- **File-Based Routing**:
  - Pages live in \`/pages\`; filename → route (e.g., \`pages/about.js\` → \`/about\`).
- **Data Fetching**:
  - **Static Generation**: \`export async function getStaticProps() { ... }\`
  - **Server-Side Rendering**: \`export async function getServerSideProps() { ... }\`
- **API Routes**:
  - Create backend endpoints in \`/pages/api/hello.js\`
  - Example:
    \`\`\`js
    export default function handler(req, res) {
      res.status(200).json({ message: "Hello from API" });
    }
    \`\`\`
- **Built-In Features**:
  - Image optimization: \`next/image\`
  - CSS/SASS support: Import CSS modules directly
  - Automatic code splitting and fast refresh
- **Example**: Simple page component
  \`\`\`jsx
  export default function Home() {
    return <h1>Welcome to Next.js!</h1>;
  }
  \`\`\`
    `.trim(),
    quiz: [],
  },
  {
    moduleId: "web-development",  // Chapter Six
    slug: "tailwindcss-intro",
    title: "Tailwind CSS",
    guide: `
# Tailwind CSS

- **Utility-First**: Compose styles using predefined classes (no custom CSS by default).
- **Installation**: Add via npm and configure \`tailwind.config.js\`.
- **Core Concepts**:
  - **Classes**: \`p-4\` (padding), \`m-2\` (margin), \`bg-blue-500\`, \`text-center\`
  - **Responsive Prefixes**: \`sm:\`, \`md:\`, \`lg:\` (e.g., \`md:text-lg\`)
  - **State Variants**: \`hover:\`, \`focus:\` (e.g., \`hover:bg-red-600\`)
- **Customization**:
  - Extend theme: colors, spacing, fonts in \`tailwind.config.js\`
  - Add plugins: forms, typography, aspect-ratio
- **Example**: Button with Tailwind classes
  \`\`\`html
  <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
    Click Me
  </button>
  \`\`\`
    `.trim(),
    quiz: [],
  },
],

}