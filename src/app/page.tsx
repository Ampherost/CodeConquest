export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-16 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-center">
      <main className="flex flex-col gap-6 max-w-2xl">
        <h1 className="text-4xl font-bold sm:text-5xl tracking-tight">
          Welcome to CodeConquest 🚀
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300">
          A simple platform to help you improve your coding fundamentals through interactive learning and practice.
        </p>
      </main>

      <footer className="mt-20 text-sm text-zinc-500 dark:text-zinc-400">
        <p>Made with ❤️ using Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}