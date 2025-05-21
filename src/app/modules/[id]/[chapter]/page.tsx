import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function ChapterPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-zinc-900 text-zinc-100">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-2">Chapter Content</h1>
        <p>This is where the content and quiz for the chapter will go.</p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
