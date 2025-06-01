// app/modules/page.tsx
import Link from "next/link"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { modules } from "../../../lib/modules"

export default function ModulesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />

      <main className="flex-grow p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">📚 Learning Modules</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/modules/${mod.id}`}
              className="block rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800 hover:shadow-lg hover:border-transparent transition"
            >
              <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {mod.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}



