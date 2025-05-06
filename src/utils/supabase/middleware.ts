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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = [
    '/login',
    '/signup',
    '/about',
    '/',
  ];

  const isPublicRoute =
    publicPaths.some((path) => request.nextUrl.pathname.startsWith(path)) ||
    /^\/blog\/[^\/]+$/.test(request.nextUrl.pathname);

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in, check role
  if (user) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

      //if use not logged
    if (!userData || error) {
      console.error('Role fetch error or user not found');
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    //we get the role from user database
    const role = userData.role;

    //bussiness routes
    if (request.nextUrl.pathname.startsWith('/business') && role !== 'business') 
    {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // Candidate routes
    if (request.nextUrl.pathname.startsWith('/candidate') && role !== 'candidate') 
    {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
