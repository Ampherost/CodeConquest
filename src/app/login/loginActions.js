'use server';

import { createClient } from '@/utils/supabase/server'
import { handleError } from '@/app/signup/lib/utility';
import { redirect } from 'next/navigation';

export async function HandleSignIn(state, formData) {
  const payload = {
    email: formData.get('email') || '',
    password: formData.get('password') || ''
  };

  try {
    const client = await createClient();
    const { error } = await client.auth.signInWithPassword(payload);

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status || 500,
        },
      };
    }

    // For local development, use a relative URL for redirection
    // This will trigger a redirect only on the server-side render
     // Use a relative path instead of full URL for client-side rendering

    // If you need to handle the redirect in the server, consider adding a custom response like res.writeHead(302, { Location: '/dashboard' })
  } catch (error) {
    return {
      success: false,
      error: {
        message: handleError(error),
        status: 500,
      },
    };
  }

  redirect('/dashboard');
}
