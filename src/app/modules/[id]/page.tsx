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
    <div className="flex h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-zinc-200 dark:border-zinc-700">
        <ChapterList
          basePath={`/modules/${mod.id}/chapter`}
          chapters={mod.chapters}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <Header />

        <section className="flex-grow p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to {mod.title}!
          </h1>
          <p className="mb-8 text-zinc-700 dark:text-zinc-300">
            {mod.description}
          </p>
          <p>Select a chapter from the list on the left to get started.</p>
        </section>

        <Footer />
      </main>
    </div>
  )
}


