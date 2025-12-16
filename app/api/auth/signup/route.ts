import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role = 'investor', company, phone_number } = await request.json();

    if (!email || !password || !full_name || !phone_number) {
      return NextResponse.json(
        { error: 'Email, password, full name, and phone number are required' },
        { status: 400 }
      );
    }

    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
          company,
          phone_number,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Update the profile with phone_number and set status to pending
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone_number,
          status: 'pending',
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
