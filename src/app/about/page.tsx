// src/app/about/page.tsx
import Header from '@/app/components/Header';
import Footer from "@/app/components/Footer";
import Container from '@/app/components/Container';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Global header */}
      <Header />

      <div className="container mx-auto px-6 py-16 flex-1">
        {/* Hero section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              CodeConquest
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            CodeConquest is an interactive platform designed to strengthen
            your coding fundamentals through in-depth guides, hands-on exercises,
            and instant feedback
          </p>
        </section>

        {/* Feature cards using Container */}
        <section className="grid gap-8 md:grid-cols-2">
          <Container title="Our Mission">
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              We make learning to code engaging and accessible, whether you’re
              taking your first steps or sharpening your skills for real-world
              projects.
            </p>
          </Container>

          <Container title="What We Offer">
            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-1">
              <li>Comprehensive, modular guides</li>
              <li>Interactive coding quizzes</li>
              <li>Instant, contextual feedback</li>
              <li>Progress tracking, badges, and rankings (coming soon)</li>
            </ul>
          </Container>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

  