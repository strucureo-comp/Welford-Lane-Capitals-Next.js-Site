require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupCashFlowsTable() {
  console.log('🚀 Setting up cash_flows table...\n');

  try {
    // Check if table exists by trying to query it
    const { data: existingFlows, error: queryError } = await supabase
      .from('cash_flows')
      .select('id')
      .limit(1);

    if (queryError && queryError.message.includes('does not exist')) {
      console.log('ℹ️  Cash flows table does not exist. Please run the migration SQL in Supabase SQL Editor:');
      console.log('   supabase/migrations/20251216_create_cash_flows_table.sql\n');
      return;
    }

    // Get investor user
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'investor')
      .eq('status', 'approved')
      .limit(1);

    if (!profiles || profiles.length === 0) {
      console.log('⚠️  No approved investors found. Create sample investor first.');
      return;
    }

    const investor = profiles[0];
    console.log(`📊 Creating sample cash flows for: ${investor.full_name}\n`);

    // Sample cash flows
    const sampleFlows = [
      {
        user_id: investor.id,
        amount: 31500,
        type: 'deposit',
        date: '2024-01-15',
        description: 'Initial investment'
      },
      {
        user_id: investor.id,
        amount: 800,
        type: 'withdrawal',
        date: '2024-03-15',
        description: 'Portfolio rebalancing'
      },
      {
        user_id: investor.id,
        amount: 33000,
        type: 'deposit',
        date: '2024-06-10',
        description: 'Additional capital injection'
      },
      {
        user_id: investor.id,
        amount: 800,
        type: 'withdrawal',
        date: '2024-07-20',
        description: 'Profit distribution'
      }
    ];

    // Delete existing cash flows for this user
    await supabase
      .from('cash_flows')
      .delete()
      .eq('user_id', investor.id);

    // Insert sample flows
    const { data: insertedFlows, error: insertError } = await supabase
      .from('cash_flows')
      .insert(sampleFlows)
      .select();

    if (insertError) {
      console.error('❌ Error inserting cash flows:', insertError.message);
      return;
    }

    console.log(`✅ Created ${insertedFlows.length} cash flow entries\n`);

    // Display summary
    console.log('📈 Cash Flow Summary:');
    sampleFlows.forEach(flow => {
      const sign = flow.type === 'deposit' ? '+' : '-';
      const color = flow.type === 'deposit' ? '🟢' : '🔴';
      console.log(`   ${color} ${sign}$${flow.amount.toLocaleString()} on ${flow.date} - ${flow.description}`);
    });

    console.log('\n✨ Cash flows table setup complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupCashFlowsTable();
