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

async function fixRLS() {
  console.log('\n🔒 Fixing RLS policies for admin access...\n');

  const policies = [
    // Drop existing policies
    'DROP POLICY IF EXISTS "Users can read own profile" ON profiles',
    'DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles',
    'DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles',
    'DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles',
    
    // Create new policies
    `CREATE POLICY "Users can read own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id)`,
    
    `CREATE POLICY "Admins can read all profiles"
     ON profiles FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE id = auth.uid()
         AND role = 'admin'
       )
     )`,
    
    `CREATE POLICY "Admins can update all profiles"
     ON profiles FOR UPDATE
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE id = auth.uid()
         AND role = 'admin'
       )
     )`,
  ];

  for (const sql of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: sql });
      if (error) {
        console.log('⚠️ ', sql.substring(0, 50) + '...', error.message);
      } else {
        console.log('✅', sql.substring(0, 50) + '...');
      }
    } catch (err) {
      console.log('⚠️ Error:', err.message);
    }
  }

  console.log('\n✨ RLS policies updated!\n');
}

fixRLS();
