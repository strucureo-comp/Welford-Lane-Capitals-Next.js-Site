const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function removeAllRLS() {
  console.log('\n🔓 Removing ALL RLS policies from profiles table...\n');

  try {
    // Get all policies on profiles table
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('policyname')
      .eq('tablename', 'profiles');

    if (policyError) {
      console.log('Could not fetch policies, trying direct approach');
    } else {
      console.log('Found policies:', policies);
    }

    // Disable RLS entirely on profiles table
    console.log('\n1️⃣ Disabling RLS on profiles table...');
    const { data: d1, error: e1 } = await supabase.rpc('exec_raw_sql', {
      sql: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (e1) console.log('   Note:', e1.message);
    else console.log('   ✅ RLS disabled');

    // Try to verify
    console.log('\n2️⃣ Fetching pending users as admin...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id, email, full_name, status')
      .eq('status', 'pending');

    if (testError) {
      console.error('   ❌ Error:', testError.message);
    } else {
      console.log(`   ✅ Found ${testData.length} pending users:`, testData.map(u => u.email));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('\n✨ Done!\n');
}

removeAllRLS();
