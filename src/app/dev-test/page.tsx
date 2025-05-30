// src/app/dev-playground/page.tsx
import Header from '@/app/components/Header';
import Container from '@/app/components/Container';

export default function DevPlayground() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl bg-blue-900 text-amber-500 mb-6 p-4 rounded">
        Component Testing
      </h1>

      {/* Example 1: Wrapping your Header in a Container */}
      <Container title="Header Preview">
        <Header />
      </Container>

      {/* Example 2: Container with custom content */}
      <Container title="Some Custom Content">
        <p className="mb-4">
          This is just a paragraph inside the container. You could drop any
          JSX here—lists, forms, images, etc.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Click Me
        </button>
      </Container>
    </main>
  );
}

