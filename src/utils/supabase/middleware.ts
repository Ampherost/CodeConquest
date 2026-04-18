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

  // If user is logged in, check role for protected routes.
  // Role is read from app_metadata (set by the sync_role_to_claims DB trigger) — no extra DB call.
  if (user) {
    const role = user.app_metadata?.role as string | undefined;

    if (!role) {
      console.error('Role not found in app_metadata');
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

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