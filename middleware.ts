import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Skip middleware for login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return response;
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/investor'];
  const adminRoutes = ['/admin'];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('Middleware check for:', pathname, 'Has session:', !!session, 'Error:', error);
    
    if (!session) {
      // No session, redirect to login
      console.log('No session found, redirecting to login');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // If admin route, check user role
    if (isAdminRoute) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', session.user.id)
        .maybeSingle();

      console.log('Admin route check - Profile:', profile, 'Error:', profileError);

      if (!profile || profile.role !== 'admin') {
        // Not an admin, redirect to dashboard
        console.log('Not an admin, redirecting to dashboard');
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/investor/:path*',
  ],
};
