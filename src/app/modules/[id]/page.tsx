// src/app/modules/[id]/page.tsx
import { notFound } from "next/navigation"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import ChapterList from "@/app/components/chapter/ChapterList"
import { modules } from "../../../../lib/modules"
import { getModuleBySlug, type ModuleSummary } from "@/lib/db/modules"

export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }))
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getModuleBySlug(null, id)
  if (!result.ok) notFound()
  const mod: ModuleSummary = result.data

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />

      <main className="w-full max-w-5xl sm:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to {mod.title}!
        </h1>
        <p className="mb-8 text-zinc-700 dark:text-zinc-300 text-lg">
          {mod.description}
        </p>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400 font-medium">Select a chapter from the list below to get started.</p>

        {/* ← ChapterList moved in here */}
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
          <ChapterList
            basePath={`/modules/${mod.id}`}
            chapters={mod.chapters}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}


