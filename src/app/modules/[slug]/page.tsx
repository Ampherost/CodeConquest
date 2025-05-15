import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function ModuleOverviewPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-zinc-900 text-zinc-100">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-2">Module Overview</h1>
        <p>This is where the list of chapters for the selected module will appear.</p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

  