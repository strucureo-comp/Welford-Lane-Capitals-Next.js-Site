import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Generate a random login key
function generateLoginKey(): string {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
}

// Generate a random password
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, adminId } = await request.json();

    if (!userId || !adminId) {
      return NextResponse.json(
        { error: 'User ID and Admin ID are required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate credentials
    const loginKey = generateLoginKey();
    const tempPassword = generatePassword();

    // Update user password in auth
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: tempPassword }
    );

    if (updateAuthError) {
      return NextResponse.json(
        { error: `Failed to update password: ${updateAuthError.message}` },
        { status: 400 }
      );
    }

    // Update profile with approval
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'approved',
        login_key: loginKey,
        approved_at: new Date().toISOString(),
        approved_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    // Send verification email (using Supabase's built-in email)
    // Note: In production, you'd want to use a proper email service like SendGrid, Resend, etc.
    const { error: emailError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userProfile.email,
    });

    // Prepare email content (you'll need to implement actual email sending)
    const emailData = {
      to: userProfile.email,
      subject: 'Your Welford Lane Capitals Access Has Been Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Welford Lane Capitals</h2>
          <p>Dear ${userProfile.full_name},</p>
          <p>Your access request has been approved. Below are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>User ID:</strong> ${userProfile.id.substring(0, 8)}...</p>
            <p><strong>Login Key:</strong> ${loginKey}</p>
            <p><strong>Email:</strong> ${userProfile.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login.</p>
          <p>You can now log in at: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login">Investor Login</a></p>
          <p>Best regards,<br>Welford Lane Capitals Team</p>
        </div>
      `,
    };

    // Log the approval
    await supabase.from('activity_logs').insert({
      user_id: adminId,
      action: 'User approved',
      details: {
        approved_user_id: userId,
        approved_user_email: userProfile.email,
        login_key: loginKey,
      },
    });

    return NextResponse.json({
      success: true,
      credentials: {
        userId: userProfile.id,
        loginKey,
        email: userProfile.email,
        tempPassword,
      },
      message: 'User approved successfully. Credentials generated.',
      note: 'Email sending needs to be configured with a proper email service.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

