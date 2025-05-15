import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Site Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 p-8 sm:p-32 text-center">
        <div className="flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl font-bold sm:text-5xl tracking-tight">
            Welcome to CodeConquest 🚀
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300">
            A simple platform to help you improve your coding fundamentals through interactive learning and practice.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
