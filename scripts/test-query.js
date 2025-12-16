const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testQuery() {
  console.log('\n🔍 Testing direct query to profiles table...\n');

  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('status', 'pending');

  console.log('Query result:');
  console.log('  Error:', error);
  console.log('  Count:', count);
  console.log('  Data:', data);
  
  if (data && data.length > 0) {
    console.log('\n✅ Found pending users:');
    data.forEach(user => {
      console.log(`  - ${user.full_name} (${user.email})`);
    });
  } else {
    console.log('\n❌ No pending users found');
  }
}

testQuery();
