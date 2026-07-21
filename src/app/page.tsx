import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getUserById } from "@/lib/db/users";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const userResult = await getUserById(supabase, user.id);
    if (userResult.ok) {
      if (userResult.data.role === "candidate") {
        redirect("/candidate/dashboard");
      } else if (userResult.data.role === "business") {
        redirect("/business/dashboard");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Site Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-20 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-8 max-w-3xl z-10">
          <span className="self-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Interactive Learning & Assessment Platform
          </span>

          <h1 className="text-4xl font-extrabold sm:text-6xl tracking-tight leading-tight">
            Conquer Your Coding Fundamentals with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              CodeConquest
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Master programming concepts through structured interactive modules, complete assessments, and prove your engineering skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Link
              href="/modules"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all"
            >
              Explore Modules
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold border border-zinc-700 transition-all"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

