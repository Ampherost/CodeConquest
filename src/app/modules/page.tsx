import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { listModules } from "@/lib/db/modules";
import { createClient } from "@/utils/supabase/server";

export default async function ModulesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await listModules(null);
  const modules = result.ok ? result.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              📚 Learning Modules
            </h1>
            <p className="text-zinc-400 mt-1">
              Explore interactive lessons and practice core computer science concepts.
            </p>
          </div>

          {!user && (
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Sign Up to Track Progress
            </Link>
          )}
        </div>

        {!user && (
          <div className="mb-8 p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>
              💡 You are currently browsing as a guest. Sign in to save your chapter progress and submit quizzes.
            </span>
            <Link
              href="/login"
              className="font-semibold underline hover:text-white whitespace-nowrap"
            >
              Sign In →
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/modules/${mod.id}`}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800 p-6 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-xl transition-all"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-zinc-300">
                <span>Start Learning</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}




