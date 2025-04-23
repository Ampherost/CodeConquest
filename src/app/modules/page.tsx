import Link from "next/link";

const modules = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "An intro to software engineering",
  },
  {
    id: "compilers",
    title: "Compilers",
    description: "An intro to compilers",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "An intro to web-development",
  },
];

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">📚 Learning Modules</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            href={`/modules/${mod.id}`}
            className="block rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800 hover:shadow-lg hover:border-transparent transition"
          >
            <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
