// src/app/modules/[id]/page.tsx
import { notFound } from "next/navigation"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import ChapterList from "@/app/components/chapter/ChapterList"
import { modules, Module } from "../../../../lib/modules"

export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }))
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mod: Module | undefined = modules.find((m) => m.id === id)
  if (!mod) notFound()

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />

      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to {mod.title}!
        </h1>
        <p className="mb-8 text-zinc-700 dark:text-zinc-300">
          {mod.description}
        </p>
        <p className="mb-4">Select a chapter from the list below to get started.</p>

        {/* ← ChapterList moved in here */}
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
          <ChapterList
            basePath={`/modules/${mod.id}/chapter`}
            chapters={mod.chapters}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}


