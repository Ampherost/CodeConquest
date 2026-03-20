import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Exact public paths (no trailing content allowed unless explicitly handled)
  const exactPublicPaths = ['/', '/login', '/signup', '/about', '/modules'];

  // Prefix-based public paths (these allow sub-paths)
  const prefixPublicPaths = ['/modules/'];

  const isPublicRoute =
    exactPublicPaths.includes(pathname) ||
    prefixPublicPaths.some((prefix) => pathname.startsWith(prefix));

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in, check role for protected routes
  if (user) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userData || error) {
      console.error('Role fetch error or user not found');
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    const role = userData.role;

    // Business routes
    if (pathname.startsWith('/business') && role !== 'business') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // Candidate routes
    if (pathname.startsWith('/candidate') && role !== 'candidate') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}