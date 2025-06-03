"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { HandleSignIn } from "@/app/login/loginActions";
import { useActionState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(HandleSignIn, null);

  // Client-side redirect on success
  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-100 p-6">
      <form
        action={formAction}
        className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">
          Sign In
        </h2>

        <div className="flex flex-col space-y-1">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>

        {/* Combined error‐display block below the button */}
        {state?.error && (
          <div className="text-red-500 text-sm space-y-1 mt-2">
            {/* If there's a general “message” (e.g. email‐related) */}
            {state.error.message &&
              (Array.isArray(state.error.message) ? (
                state.error.message.map((err, i) => (
                  <p key={`msg-${i}`}>{err}</p>
                ))
              ) : (
                <p>{state.error.message}</p>
              ))}

            {/* If there's a password‐specific error */}
            {state.error.password &&
              (Array.isArray(state.error.password) ? (
                state.error.password.map((err, i) => (
                  <p key={`pwd-${i}`}>{err}</p>
                ))
              ) : (
                <p>{state.error.password}</p>
              ))}

            {/* If there are any other field‐specific errors (e.g. state.error.email) */}
            {state.error.email &&
              (Array.isArray(state.error.email) ? (
                state.error.email.map((err, i) => (
                  <p key={`email-${i}`}>{err}</p>
                ))
              ) : (
                <p>{state.error.email}</p>
              ))}
          </div>
        )}

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign Up
          </Link>
        </div>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Check us out{" "}
          <Link
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            here
          </Link>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
