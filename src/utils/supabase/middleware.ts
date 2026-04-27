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

  const exactPublicPaths = ['/', '/login', '/signup', '/about', '/modules', '/unauthorized', '/error'];
  const prefixPublicPaths = ['/modules/'];

  const isPublicRoute =
    exactPublicPaths.includes(pathname) ||
    prefixPublicPaths.some((prefix) => pathname.startsWith(prefix));

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

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

    if (pathname.startsWith('/business') && role !== 'business') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/candidate') && role !== 'candidate') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}