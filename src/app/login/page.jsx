'use client';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { HandleSignIn } from '@/app/login/loginActions';
import { useActionState } from 'react';

export default function SignIn() {
  const [isBusiness, setIsBusiness] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const [state, formAction, isPending] = useActionState(HandleSignIn, null);

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
          {state?.error?.message && (
            <div className="text-red-500 text-sm mt-1">
              {Array.isArray(state.error.message) ? (
                state.error.email.map((error, index) => (
                  <p key={index}>{error}</p>
                ))
              ) : (
                <p>{state.error.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-1">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          />
          {state?.error?.password && (
            <div className="text-red-500 text-sm mt-1">
              {Array.isArray(state.error.password) ? (
                state.error.password.map((error, index) => (
                  <p key={index}>{error}</p>
                ))
              ) : (
                <p>{state.error.password}</p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
