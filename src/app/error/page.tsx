import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 p-6">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-white">Something Went Wrong</h1>
        <p className="text-gray-400">
          Your verification link is invalid or has expired. Please request a new one.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
          >
            Back to login
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-700 text-gray-300 rounded hover:bg-zinc-600 transition"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
