import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  // Function to remove cookies
  function removeCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      const cookieName = cookie.split('=')[0]
      document.cookie = cookieName + '=;expires=' + new Date(0).toUTCString() + ';path=/'
    })
  }

  // If in the browser environment, remove cookies
  if (typeof window !== 'undefined') {
    removeCookies()
  }

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // Redirect to 'next' path after successful verification
      const redirectUrl = new URL(next, request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect to error page if OTP verification fails
  const errorUrl = new URL('/error', request.url)
  return NextResponse.redirect(errorUrl)
}
