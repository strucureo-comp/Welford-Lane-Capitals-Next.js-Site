'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Remove httpOnly so client can access the session
            const clientOptions = { ...options, httpOnly: false };
            cookieStore.set(name, value, clientOptions);
          } catch (error) {
            // Ignore errors from setting cookies in server actions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (error) {
            // Ignore errors
          }
        },
      },
    }
  );

  // Sign in
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('Login attempt:', { email, hasUser: !!data.user, hasSession: !!data.session, error: signInError });

  if (signInError || !data.user) {
    return { error: signInError?.message || 'Login failed' };
  }

  // Check user profile and status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status, email_verified')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: 'User profile not found' };
  }

  // Check approval status
  if (profile.role !== 'admin' && profile.status !== 'approved') {
    await supabase.auth.signOut();
    return { error: 'Your access request is pending approval.' };
  }

  console.log('Login successful, redirecting to:', profile.role === 'admin' ? '/admin' : '/dashboard');
  console.log('Session exists:', !!data.session);

  // Redirect based on role
  const redirectTo = profile.role === 'admin' ? '/admin' : '/dashboard';
  redirect(redirectTo);
}
