import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, company, phone } = await request.json();

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if email already exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existingProfile) {
      if (existingProfile.status === 'pending') {
        return NextResponse.json(
          { error: 'A registration with this email is already pending review' },
          { status: 400 }
        );
      } else if (existingProfile.status === 'approved') {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please login instead.' },
          { status: 400 }
        );
      } else if (existingProfile.status === 'rejected') {
        return NextResponse.json(
          { error: 'A previous registration with this email was rejected. Please contact support.' },
          { status: 400 }
        );
      }
    }

    // Check if email exists in auth (shouldn't happen, but just in case)
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.users.find(u => u.email === email);
    
    if (existingAuthUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login instead.' },
        { status: 400 }
      );
    }

    // Create a new profile with status='pending'
    // IMPORTANT: We do NOT create an auth user yet - that happens on approval
    const newProfileId = uuidv4();
    
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newProfileId,
        full_name: fullName,
        email: email.toLowerCase().trim(),
        company: company || null,
        phone_number: phone || null,
        role: 'pending',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create registration request' },
        { status: 500 }
      );
    }

    // Log the registration activity (non-critical, don't fail if this errors)
    try {
      await supabase.from('activity_logs').insert({
        user_id: newProfileId,
        action: 'New access request submitted',
        details: { email, company: company || null },
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('Failed to log activity:', logError);
    }

    console.log(`✅ Registration submitted: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      id: newProfile.id
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
