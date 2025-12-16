import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'admin@welfordlane.com';
  const password = process.env.ADMIN_PASSWORD || require('crypto').randomBytes(16).toString('hex') + '!Aa1';

  console.log('Creating admin user...');
  console.log('Email:', email);
  console.log('⚠️  Set ADMIN_PASSWORD env var to use custom password');

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return;
    }

    console.log('✓ Admin user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('\nLogin credentials:');
    console.log('Email: admin@welfordlane.com');
    console.log('Password:', password);
    console.log('⚠️  SAVE THIS PASSWORD - it will not be shown again!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function createInvestorUser() {
  const email = 'investor@example.com';
  const password = process.env.INVESTOR_PASSWORD || require('crypto').randomBytes(16).toString('hex') + '!Aa1';

  console.log('\nCreating investor user...');
  console.log('Email:', email);
  console.log('⚠️  Set INVESTOR_PASSWORD env var to use custom password');

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'John Investor',
        role: 'investor'
      }
    });

    if (error) {
      console.error('Error creating investor user:', error.message);
      return;
    }

    console.log('✓ Investor user created successfully!');
    console.log('User ID:', data.user.id);

    await supabase
      .from('profiles')
      .update({
        company: 'Greenfield Capital',
        aum: 75000000
      })
      .eq('id', data.user.id);

    console.log('\nLogin credentials:');
    console.log('Email: investor@example.com');
    console.log('Password:', password);
    console.log('⚠️  SAVE THIS PASSWORD - it will not be shown again!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function main() {
  console.log('=== Creating Test Users ===\n');
  await createAdminUser();
  await createInvestorUser();
  console.log('\n=== Setup Complete ===');
  process.exit(0);
}

main();
