// src/app/modules/[id]/chapter/[chapter]/page.tsx
import { notFound } from "next/navigation"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { modules, Module } from "../../../../../lib/modules"
import { chaptersByModule, ChapterContent } from "../../../../../lib/chapters"
// import { markdownToHtml } from "@/../../lib/markdown"  // or implement your own

type Params = { id: string; chapter: string }

/** Build all /modules/:id/chapter/:chapter pages at build time */
export function generateStaticParams(): Params[] {
  return modules.flatMap((mod) =>
    (chaptersByModule[mod.id] || []).map((c) => ({
      id: mod.id,
      chapter: c.slug,
    }))
  )
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { id, chapter } = await params

  // 1️⃣ Find the module
  const mod: Module | undefined = modules.find((m) => m.id === id)
  // 2️⃣ Find the chapter content
  const content: ChapterContent | undefined =
    chaptersByModule[id]?.find((c) => c.slug === chapter)

  if (!mod || !content) {
    notFound()
  }

  // 3️⃣ (Optional) convert Markdown guide to HTML
  // const html = markdownToHtml(content.guide)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />

      <article className="prose dark:prose-invert mx-auto flex-grow p-6 sm:p-10">
        <h1>{content.title}</h1>

        <p className="mt-6 whitespace-pre-wrap">
        {content.guide}
       </p>

        {content.quiz.length > 0 && (
          <section className="mt-12">
            <h2>Quiz</h2>
            <ul className="list-disc pl-6 space-y-4">
              {content.quiz.map((q, i) => (
                <li key={i}>
                  <p className="font-semibold">{q.question}</p>
                  <ul className="list-decimal pl-6">
                    {q.options.map((opt) => (
                      <li key={opt}>{opt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <Footer />
    </div>
  )
}

