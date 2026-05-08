// src/app/modules/[id]/chapter/[chapter]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Container from "@/app/components/Container";
import { modules } from "../../../../../lib/modules";
import { getModuleBySlug, type ModuleSummary } from "@/lib/db/modules";
import type { ChapterContent } from "../../../../../lib/chapters";
import { markdownToHtml } from "../../../../../lib/markdown";
import ClientTracker from "@/app/components/ClientTracker";

type Params = { id: string; chapter: string };

/** Build all /modules/:id/chapter/:chapter pages at build time */
export function generateStaticParams(): Params[] {
  return modules.flatMap((mod) =>
    (mod.chapters || []).map((c) => ({
      id: mod.id,
      chapter: c.id,
    }))
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, chapter } = await params;

  const modResult = await getModuleBySlug(null, id);
  if (!modResult.ok) notFound();

  const mod: ModuleSummary = modResult.data;
  const content: ChapterContent | undefined =
    modResult.data.chapterContents.find((c) => c.slug === chapter);

  if (!content) {
    notFound();
  }

   const html = await markdownToHtml(content.guide);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />

      {/* Wrap the whole chapter in your Container */}
      <div className="mx-auto flex-grow px-6 sm:px-10">
        <Container title={content.title}>
          {/* Guide text */}
          <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Quiz, if any */}
          {content.quiz.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Quiz</h2>
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
        </Container>
      </div>
        {/* Place this at the bottom so it triggers on page load */}
      <ClientTracker
        moduleId={id}
        title={mod.title}
        chapterSlug={chapter}
      />
      <Footer />
    </div>
  );
}


