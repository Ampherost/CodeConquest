// src/app/dev-playground/page.tsx
import Header from '@/app/components/Header';

export default function DevPlayground() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl bg-blue-900 text-amber-500 mb-4">Component Testing</h1>
      <section>
        <Header />
      </section>
    </main>
  );
}
