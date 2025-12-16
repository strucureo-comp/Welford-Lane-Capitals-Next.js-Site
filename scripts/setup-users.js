const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
  process.exit(1);
}

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
      if (error.message.includes('already registered')) {
        console.log('✓ Admin user already exists');
        return;
      }
      console.error('Error creating admin user:', error.message);
      return;
    }

    console.log('✓ Admin user created successfully!');
    console.log('  Email: admin@welfordlane.com');
    console.log('  Password:', password);
    console.log('  ⚠️  SAVE THIS PASSWORD - it will not be shown again!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function createInvestorUser() {
  const email = 'investor@example.com';
  const password = process.env.INVESTOR_PASSWORD || require('crypto').randomBytes(16).toString('hex') + '!Aa1';

  console.log('\nCreating investor user...');
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
      if (error.message.includes('already registered')) {
        console.log('✓ Investor user already exists');
        return;
      }
      console.error('Error creating investor user:', error.message);
      return;
    }

    console.log('✓ Investor user created successfully!');

    await supabase
      .from('profiles')
      .update({
        company: 'Greenfield Capital',
        aum: 75000000
      })
      .eq('id', data.user.id);

    console.log('  Email: investor@example.com');
    console.log('  Password:', password);
    console.log('  ⚠️  SAVE THIS PASSWORD - it will not be shown again!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function main() {
  console.log('=== Setting Up Test Users ===\n');
  await createAdminUser();
  await createInvestorUser();
  console.log('\n=== Setup Complete ===\n');
  console.log('You can now login at http://localhost:3000/login\n');
  process.exit(0);
}

main();
