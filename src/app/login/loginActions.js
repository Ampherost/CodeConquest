'use server';

import { createClient } from '@/utils/supabase/server';
import { handleError } from '@/app/signup/lib/utility';

export async function HandleSignIn(state, formData) {
  const payload = {
    email: formData.get('email') || '',
    password: formData.get('password') || '',
  };

  try {
    const client = await createClient();
    const { error: signInError } = await client.auth.signInWithPassword(payload);

    if (signInError) {
      return {
        success: false,
        error: {
          message: signInError.message,
          status: signInError.status || 500,
        },
      };
    }

    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: {
          message: 'User not found after sign in.',
          status: 401,
        },
      };
    }

    const { data: userData, error: roleError } = await client
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !userData?.role) {
      return { success: true, redirectTo: '/unauthorized' };
    }

    return { success: true, redirectTo: `/${userData.role}/dashboard` };

  } catch (err) {
    return {
      success: false,
      error: {
        message: handleError(err),
        status: 500,
      },
    };
  }
}
