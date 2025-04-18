// src/app/about/page.tsx
export default function About() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-16 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-center">
        <main className="flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl font-bold sm:text-5xl tracking-tight">
            About CodeConquest
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300">
            CodeConquest is a simple, interactive platform designed to strengthen
            your coding fundamentals through hands‑on exercises and instant feedback.
          </p>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300">
            Our mission is to make learning to code engaging and accessible,
            whether you’re taking your first steps or sharpening your skills for
            real‑world projects.
          </p>
        </main>
      </div>
    );
  }
  