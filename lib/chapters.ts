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
     
    
- **Evolving Code Over Time**

    Software lives for years or decades; design for maintainability.          
   
    
- **Scaling Development**

    Large codebases and teams require processes, tooling, and communication.     
    
    
- **Shipping High-Quality Software**

    Catch issues early through reviews, testing, and good engineering practices.    
    
    
## What Is Software Engineering?


> “Application of a systematic, disciplined, quantifiable approach to the development, operation, and maintenance of software.”  
> — IEEE 1990 Standard


- Software is **intangible**, **malleable**, and **human-intensive**.


- Modifying software is easy; describing and evaluating it is hard.


- Engineering practices—processes, formality, and tools—are critical to success.
    
    
    
    
---      
     
    
    
# Key Software Engineering Principles     
    
    
### 1. Rigor & Formality


- Systematic practice complements creativity.


- Use mathematical laws and specifications (TLA⁺, Alloy), especially in safety-critical domains.     
      
      
      
### 2. Separation of Concerns


- Divide a system into distinct features (e.g., UI vs. business logic).


- Enables independent reasoning, development, and testing.       
        
        
### 3. Modularity


- Break a system into cohesive, loosely-coupled modules.


- Supports maintainability: change one piece without ripple effects.


### 4. Abstraction


- Expose only what’s necessary; hide internal details.


- Use APIs, interfaces, and layered designs to manage complexity.


### 5. Anticipation of Change


- Design for likely future modifications (e.g., swapping algorithms).


- Maintenance (corrective, adaptive, perfective) often dominates total cost.


### 6. Generality


- Solve the general problem when appropriate—but avoid over-engineering.


- Follow the “rule of three”: generalize once you see three similar cases.


### 7. Incrementality


- Develop and deliver in small steps.


- Get feedback early, reduce risk, and adapt requirements as you go.


---


# Software Production Process


## What Is a Software Process?


A **process** defines the activities, their order, and roles needed to produce software.  

We use models to capture what’s worked in the past and guide new projects.


## Why We Need Process Models


- Manage risk of scope creep, delays, and poor quality.


- Coordinate large teams and complex codebases.


- Provide predictability for clients and stakeholders.


## Process Models


### Waterfall Model


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


**Pros:** Disciplined, well-documented, predictable for large/critical systems


**Cons:** Rigid, slow feedback loop, poor flexibility for change


### Agile Methods


#### The Agile Manifesto (2001)


- Individuals & interactions over processes & tools


- Working software over comprehensive documentation


- Customer collaboration over contract negotiation


- Responding to change over following a plan


#### Extreme Programming (XP)


- **Iterative Development:** 1–3 week cycles


- **Test-First:** Write tests before code (unit, regression)


- **Pair Programming:** Two developers share a workstation


- **Continuous Integration:** Merge and test frequently


- **Refactoring:** Continuously improve code structure


- **Collective Ownership** & **Sustainable Pace**


#### Scrum


- **Roles:** Product Owner, Scrum Master, Team Members


- **Artifacts:** Product Backlog, Sprint Backlog, Increment


- **Ceremonies:** Sprint Planning, Daily Scrum, Sprint Review, Retrospective


- Work proceeds in fixed-length **sprints** delivering a “potentially shippable” increment


- **Story Points** & **Velocity** guide planning and forecasting


---

      `.trim(),
      quiz: [],
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
    quiz: [],
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
    quiz: [],
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

  "intro-to-cpp": [
    {
      moduleId: "intro-to-cpp",
      slug: "cpp-basics",
      title: "C++ Fundamentals & Syntax",
      guide: `
# C++ Fundamentals & Syntax

## Overview
C++ is a high-performance compiled language created by Bjarne Stroustrup as an extension of the C programming language. It provides fine-grained control over system resources and memory while supporting procedural, object-oriented, and generic programming.

## Hello World in C++
\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, CodeConquest!" << std::endl;
    return 0;
}
\`\`\`

## Key Concepts
- **Strong Typing**: Variables must be declared with an explicit type (e.g. \`int\`, \`double\`, \`std::string\`, \`bool\`).
- **Compilation Pipeline**: Source Code (.cpp) → Compiler → Object File (.o) → Linker → Executable binary.
- **Control Structures**: Standard \`if/else\`, \`switch\`, \`for\` loops, and \`while\` loops.
- **Headers & Includes**: Declarations live in header files (\`.h\` / \`.hpp\`) or standard library includes (\`<iostream>\`, \`<vector>\`).
      `.trim(),
      quiz: [
        {
          question: "Which stream object is used for standard output in C++?",
          options: ["std::cin", "std::cout", "std::cerr", "printf"],
          answer: "std::cout",
        },
      ],
    },
    {
      moduleId: "intro-to-cpp",
      slug: "pointers-memory",
      title: "Pointers & Memory Management",
      guide: `
# Pointers & Memory Management in C++

## Stack vs. Heap Memory
- **Stack**: Fast, automatically managed memory for local variables and function calls.
- **Heap**: Dynamically allocated memory using \`new\` and freed using \`delete\`.

## Pointers and References
- **Address-Of Operator (\`&\`)**: Gets the memory address of a variable.
- **Dereference Operator (\`*\`)**: Accesses the value stored at a pointer's memory address.

\`\`\`cpp
int val = 42;
int* ptr = &val; // ptr stores the address of val

std::cout << *ptr << std::endl; // prints 42
\`\`\`

## Dynamic Memory Allocation
\`\`\`cpp
int* arr = new int[5]; // Allocate array on heap
arr[0] = 10;

delete[] arr; // Always free dynamically allocated memory!
arr = nullptr;
\`\`\`

## Modern C++ Smart Pointers
- \`std::unique_ptr\`: Single ownership pointer automatically deleted when out of scope.
- \`std::shared_ptr\`: Reference-counted shared ownership pointer.
      `.trim(),
      quiz: [
        {
          question: "Which operator is used to deallocate dynamic memory allocated with 'new' in C++?",
          options: ["free", "delete", "dealloc", "remove"],
          answer: "delete",
        },
      ],
    },
    {
      moduleId: "intro-to-cpp",
      slug: "oop-in-cpp",
      title: "Object-Oriented Programming",
      guide: `
# Object-Oriented Programming in C++

## Classes & Objects
Classes form the foundation of OOP in C++, encapsulating data (member variables) and behaviors (member functions).

\`\`\`cpp
#include <iostream>
#include <string>

class Developer {
private:
    std::string name;
    int experienceYears;

public:
    // Constructor
    Developer(std::string devName, int yrs) : name(devName), experienceYears(yrs) {}

    void code() {
        std::cout << name << " is writing C++ code with " << experienceYears << " years experience!" << std::endl;
    }
};

int main() {
    Developer dev("Alex", 3);
    dev.code();
    return 0;
}
\`\`\`

## Core Pillars of OOP
1. **Encapsulation**: Using access specifiers (\`private\`, \`protected\`, \`public\`) to restrict direct access to data.
2. **Inheritance**: Derived classes inherit members from base classes.
3. **Polymorphism**: Override virtual functions using the \`virtual\` keyword for dynamic dispatch.
      `.trim(),
      quiz: [
        {
          question: "Which keyword enables dynamic polymorphism and method overriding in C++ base classes?",
          options: ["override", "virtual", "dynamic", "abstract"],
          answer: "virtual",
        },
      ],
    },
  ],

  "databases-sql": [
    {
      moduleId: "databases-sql",
      slug: "intro-relational-db",
      title: "Relational Databases & SQL Basics",
      guide: `
# Relational Databases & SQL Basics

## What is a Relational Database?
A Relational Database Management System (RDBMS) organizes data into tables consisting of rows (records) and columns (attributes). Tables relate to one another via keys.

## Key Concepts
- **Primary Key (PK)**: A unique identifier for every row in a table.
- **Foreign Key (FK)**: A column or group of columns that references a Primary Key in another table to establish relationships.
- **SQL (Structured Query Language)**: The standard language used to store, manipulate, and retrieve data in databases.

## Essential Data Manipulation Language (DML)
\`\`\`sql
-- Create a new table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a record
INSERT INTO users (username, email)
VALUES ('alex_dev', 'alex@codeconquest.io');

-- Query records
SELECT id, username, email FROM users WHERE username = 'alex_dev';

-- Update a record
UPDATE users SET email = 'alex_new@codeconquest.io' WHERE id = 1;

-- Delete a record
DELETE FROM users WHERE id = 1;
\`\`\`
      `.trim(),
      quiz: [
        {
          question: "Which SQL constraint uniquely identifies each row in a database table?",
          options: ["FOREIGN KEY", "PRIMARY KEY", "UNIQUE INDEX", "DEFAULT"],
          answer: "PRIMARY KEY",
        },
      ],
    },
    {
      moduleId: "databases-sql",
      slug: "queries-joins",
      title: "Complex Queries & Joins",
      guide: `
# Complex Queries & Relational Joins

## Relational Joins Explained
Joins allow you to combine records from two or more tables based on a related column between them.

| Join Type | Description |
| :--- | :--- |
| **INNER JOIN** | Returns records that have matching values in both tables. |
| **LEFT JOIN** | Returns all records from the left table, and matched records from the right table. |
| **RIGHT JOIN** | Returns all records from the right table, and matched records from the left table. |
| **FULL JOIN** | Returns all records when there is a match in either left or right table. |

## Join Example
\`\`\`sql
SELECT 
    orders.id AS order_id, 
    users.username, 
    orders.total_amount
FROM orders
INNER JOIN users ON orders.user_id = users.id
WHERE orders.total_amount > 100.00;
\`\`\`

## Aggregations & Grouping
Use \`GROUP BY\` alongside aggregate functions like \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MAX()\`, and \`MIN()\`. Filter aggregated results using the \`HAVING\` clause:

\`\`\`sql
SELECT user_id, COUNT(*) AS total_orders
FROM orders
GROUP BY user_id
HAVING COUNT(*) >= 5;
\`\`\`
      `.trim(),
      quiz: [
        {
          question: "Which type of JOIN returns all records from the left table even if there are no matches in the right table?",
          options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
          answer: "LEFT JOIN",
        },
      ],
    },
    {
      moduleId: "databases-sql",
      slug: "indexing-transactions",
      title: "Indexing & Transactions (ACID)",
      guide: `
# Database Indexing & ACID Transactions

## Database Indexes
An Index is a data structure (typically a B-Tree) that improves the speed of data retrieval operations on a table at the cost of additional storage and slower writes ('INSERT', 'UPDATE', 'DELETE').

\`\`\`sql
-- Create an index on the email column for fast lookups
CREATE INDEX idx_users_email ON users(email);
\`\`\`

## ACID Properties of Transactions
A database transaction is a sequence of read/write operations executed as a single logical unit.

- **Atomicity**: All operations in the transaction succeed, or the entire transaction fails and rolls back.
- **Consistency**: Data stays valid according to all database rules and constraints before and after execution.
- **Isolation**: Concurrent transactions execute independently without interfering with each other.
- **Durability**: Once a transaction is committed, its changes persist permanently even during a system crash.

## Transaction Syntax
\`\`\`sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 200 WHERE account_id = 101;
UPDATE accounts SET balance = balance + 200 WHERE account_id = 202;

COMMIT;
\`\`\`
      `.trim(),
      quiz: [
        {
          question: "Which ACID property guarantees that all operations in a transaction either complete entirely or roll back completely?",
          options: ["Atomicity", "Consistency", "Isolation", "Durability"],
          answer: "Atomicity",
        },
      ],
    },
  ],

  "dsa": [
    {
      moduleId: "dsa",
      slug: "arrays-linked-lists",
      title: "Arrays & Linked Lists",
      guide: `
# Data Structures: Arrays & Linked Lists

## Arrays
An Array stores elements in contiguous memory locations. Because memory is sequential, elements can be accessed in constant time O(1) using their index.

- **Access**: O(1)
- **Search**: O(n)
- **Insertion / Deletion**: O(n) (requires shifting elements)

## Linked Lists
A Linked List consists of node objects scattered in memory, where each node contains data and a reference (\`next\` pointer) to the next node.

\`\`\`cpp
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};
\`\`\`

- **Access**: O(n) (must traverse from head)
- **Insertion at Head**: O(1)
- **Deletion at Head**: O(1)
      `.trim(),
      quiz: [
        {
          question: "What is the time complexity of accessing an element by index in a contiguous array?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(1)",
        },
      ],
    },
    {
      moduleId: "dsa",
      slug: "stacks-queues-trees",
      title: "Stacks, Queues & Trees",
      guide: `
# Stacks, Queues & Trees

## Stacks & Queues
- **Stack (LIFO)**: Last-In, First-Out behavior. Operations: \`push()\`, \`pop()\`, \`peek()\`.
- **Queue (FIFO)**: First-In, First-Out behavior. Operations: \`enqueue()\`, \`dequeue()\`.

## Binary Search Trees (BST)
A Binary Tree is a hierarchical structure where each node has at most two children (\`left\` and \`right\`). In a Binary Search Tree (BST):
- Left child values are strictly smaller than the parent node.
- Right child values are strictly larger than the parent node.

\`\`\`cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
\`\`\`

## Tree Traversals
- **In-order (Left, Root, Right)**: Visits nodes in ascending sorted order.
- **Pre-order (Root, Left, Right)**: Useful for cloning or serializing trees.
- **Post-order (Left, Right, Root)**: Useful for deleting or evaluating expression trees.
      `.trim(),
      quiz: [
        {
          question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
          options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
          answer: "Stack",
        },
      ],
    },
    {
      moduleId: "dsa",
      slug: "sorting-searching-big-o",
      title: "Sorting, Searching & Big-O Notation",
      guide: `
# Sorting, Searching & Big-O Notation

## Big-O Complexity Hierarchy
Big-O notation describes the upper bound performance of an algorithm as input size n grows.

1. **O(1)**: Constant time (e.g. Array indexing)
2. **O(log n)**: Logarithmic time (e.g. Binary Search)
3. **O(n)**: Linear time (e.g. Iterating a list)
4. **O(n log n)**: Linearithmic time (e.g. Merge Sort, Quick Sort)
5. **O(n^2)**: Quadratic time (e.g. Bubble Sort, Insertion Sort)

## Searching Algorithms
- **Linear Search**: O(n) time on unsorted data.
- **Binary Search**: O(log n) time on sorted arrays by repeatedly halving the search range.

\`\`\`cpp
int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
\`\`\`
      `.trim(),
      quiz: [
        {
          question: "What is the average time complexity of Merge Sort?",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
          answer: "O(n log n)",
        },
      ],
    },
  ],

}