import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error: otpError } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (otpError) {
      console.error('OTP verification failed:', otpError.message);
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // destruct user from supabase auth
    const 
    {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) 
    {
      console.error('User not found after OTP verification.');
      return NextResponse.redirect(new URL('/error', request.url));
    }

    //get supabase user role
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    //we check if user has role or not
    if (roleError || !userData?.role) 
    {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // we reidrect to role page
    const redirectPath = `/${userData.role}/dashboard`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  //if token is not valid/not there we go to error page
  return NextResponse.redirect(new URL('/error', request.url));
}
