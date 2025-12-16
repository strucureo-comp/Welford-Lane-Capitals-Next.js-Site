import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let response = NextResponse.next();
    const cookieStore: { name: string; value: string; options: CookieOptions }[] = [];

    // Create server client that sets cookies properly
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.push({ name, value, options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.push({ name, value: '', options });
          },
        },
      }
    );

    // Sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      return NextResponse.json(
        { error: signInError?.message || 'Login failed' },
        { status: 401 }
      );
    }

    // Check user profile and status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status, email_verified')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check approval status
    if (profile.role !== 'admin' && profile.status !== 'approved') {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Your access request is pending approval.' },
        { status: 403 }
      );
    }

    // Create final response with all cookies
    const finalResponse = NextResponse.json({
      success: true,
      redirectTo: profile.role === 'admin' ? '/admin' : '/dashboard'
    });

    // Apply all collected cookies
    cookieStore.forEach(({ name, value, options }) => {
      finalResponse.cookies.set(name, value, options);
    });

    return finalResponse;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
