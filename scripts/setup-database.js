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

async function setupDatabase() {
  console.log('\n🚀 Setting up database...\n');

  try {
    // Step 1: Create admin profile
    console.log('1️⃣ Creating admin profile...');
    const { data: adminUser } = await supabase.auth.admin.listUsers();
    const admin = adminUser.users.find(u => u.email === 'admin@welfordlane.com');
    
    if (admin) {
      const { error: adminError } = await supabase
        .from('profiles')
        .upsert({
          id: admin.id,
          email: 'admin@welfordlane.com',
          full_name: 'System Administrator',
          role: 'admin',
          status: 'approved',
          email_verified: true,
          company: 'Welford Lane Capitals',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (adminError) {
        console.error('   ❌ Admin profile error:', adminError.message);
      } else {
        console.log('   ✅ Admin profile created');
      }
    }

    // Step 2: Create investor profile
    console.log('2️⃣ Creating investor profile...');
    const investor = adminUser.users.find(u => u.email === 'investor@example.com');
    
    if (investor) {
      const { error: investorError } = await supabase
        .from('profiles')
        .upsert({
          id: investor.id,
          email: 'investor@example.com',
          full_name: 'Demo Investor',
          role: 'investor',
          status: 'approved',
          email_verified: true,
          company: 'Example Investment Firm',
          aum: 1000000.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (investorError) {
        console.error('   ❌ Investor profile error:', investorError.message);
      } else {
        console.log('   ✅ Investor profile created');
      }
    }

    // Step 3: Create pending users
    console.log('3️⃣ Creating pending demo users...');
    const pendingUsers = [
      { id: 'a1111111-1111-1111-1111-111111111111', email: 'john.doe@example.com', full_name: 'John Doe', phone: '+15551234567', date: '2023-10-24T10:00:00Z' },
      { id: 'a2222222-2222-2222-2222-222222222222', email: 'alice.s@example.com', full_name: 'Alice Smith', phone: '+15559876543', date: '2023-10-23T15:30:00Z' },
      { id: 'a3333333-3333-3333-3333-333333333333', email: 'een.de@example.com', full_name: 'Eran Finterman', phone: '+15551234567', date: '2023-10-24T09:15:00Z' },
      { id: 'a4444444-4444-4444-4444-444444444444', email: 'alieoan@example.com', full_name: 'Lina Harlast', phone: '+15551234543', date: '2023-10-23T14:20:00Z' },
      { id: 'a5555555-5555-5555-5555-555555555555', email: 'marysmith@example.com', full_name: 'Mary Smith', phone: '+15551276543', date: '2023-10-23T11:45:00Z' },
      { id: 'a6666666-6666-6666-6666-666666666666', email: 'alicesmith2@example.com', full_name: 'Alice Smith', phone: '+15559876543', date: '2023-10-23T15:30:00Z' }
    ];

    for (const user of pendingUsers) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: 'investor',
          status: 'pending',
          email_verified: false,
          phone_number: user.phone,
          created_at: user.date,
          updated_at: new Date().toISOString()
        });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`   ❌ Error creating ${user.full_name}:`, error.message);
      }
    }
    console.log('   ✅ Pending users created');

    // Step 4: Verify
    console.log('\n📊 Verification:');
    const { data: profiles, error: countError } = await supabase
      .from('profiles')
      .select('role, status', { count: 'exact' });
    
    if (profiles) {
      const adminCount = profiles.filter(p => p.role === 'admin').length;
      const approvedInvestors = profiles.filter(p => p.role === 'investor' && p.status === 'approved').length;
      const pendingCount = profiles.filter(p => p.status === 'pending').length;
      
      console.log(`   👤 Admins: ${adminCount}`);
      console.log(`   ✅ Approved Investors: ${approvedInvestors}`);
      console.log(`   ⏳ Pending Users: ${pendingCount}`);
      console.log(`   📁 Total Profiles: ${profiles.length}`);
    }

    console.log('\n✨ Database setup complete!\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error);
  }
}

setupDatabase();
