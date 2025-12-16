import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Generate a random password
function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create service role client to bypass RLS
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

    // Get the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Generate a random password
    const temporaryPassword = generatePassword(12);

    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: profile.email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: profile.full_name,
        role: 'investor'
      }
    });

    if (authError) {
      // If user already exists in auth, update their password
      if (authError.message.includes('already registered')) {
        const { data: existingUser } = await supabase.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === profile.email);
        
        if (user) {
          await supabase.auth.admin.updateUserById(user.id, {
            password: temporaryPassword
          });
        }
      } else {
        console.error('Auth error:', authError);
        return NextResponse.json(
          { error: 'Failed to create user account', details: authError.message },
          { status: 500 }
        );
      }
    }

    // Update profile status to approved
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        status: 'approved',
        role: 'investor',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile status' },
        { status: 500 }
      );
    }

    // Get admin email from environment or use default
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@welfordlane.com';

    // Call the edge function to send email
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-approval-email`;
    
    try {
      const emailResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          email: profile.email,
          password: temporaryPassword,
          fullName: profile.full_name,
          adminEmail: adminEmail
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email sending failed:', errorText);
        // Don't fail the whole operation if email fails
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the whole operation if email fails
    }

    // Log the approval activity (non-critical, don't fail if this errors)
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'User approved and credentials sent',
        details: { email: profile.email, role: 'investor' },
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('Failed to log activity:', logError);
    }

    console.log(`✅ User approved: ${profile.email}`);

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      email: profile.email,
      temporaryPassword: temporaryPassword // Return for admin to see
    });
  } catch (error: any) {
    console.error('Approve user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
