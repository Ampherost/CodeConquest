// src/app/dev-playground/page.tsx
import Header from '@/app/components/Header';

export default function DevPlayground() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl mb-4">Component Playground</h1>
      <section>
        <Header />
      </section>
    </main>
  );
}
