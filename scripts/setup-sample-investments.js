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

async function setupSampleInvestments() {
  console.log('🚀 Setting up sample investments...\n');

  try {
    // Get investor user
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'investor')
      .eq('status', 'approved')
      .limit(1);

    if (!profiles || profiles.length === 0) {
      console.log('⚠️  No approved investors found.');
      return;
    }

    const investor = profiles[0];
    console.log(`📊 Creating sample investments for: ${investor.full_name}\n`);

    // Sample investments matching reference image
    const sampleInvestments = [
      {
        user_id: investor.id,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 50,
        purchase_price: 175.50,
        current_price: 175.50,
        purchase_date: '2024-01-20'
      },
      {
        user_id: investor.id,
        symbol: 'NYX',
        name: 'Apple Paronyia, Inc',
        shares: 30,
        purchase_price: 67.00,
        current_price: 33.33,
        purchase_date: '2024-02-15'
      }
    ];

    // Delete existing investments for this user (optional - uncomment if needed)
    // await supabase
    //   .from('investments')
    //   .delete()
    //   .eq('user_id', investor.id);

    // Insert sample investments
    const { data: insertedInvestments, error: insertError } = await supabase
      .from('investments')
      .insert(sampleInvestments)
      .select();

    if (insertError) {
      console.error('❌ Error inserting investments:', insertError.message);
      return;
    }

    console.log(`✅ Created ${insertedInvestments.length} investment entries\n`);

    // Display summary
    console.log('📈 Investment Portfolio:');
    let totalValue = 0;
    let totalCost = 0;
    
    sampleInvestments.forEach(inv => {
      const value = inv.shares * inv.current_price;
      const cost = inv.shares * inv.purchase_price;
      const pl = value - cost;
      const plPercent = ((value - cost) / cost) * 100;
      
      totalValue += value;
      totalCost += cost;
      
      const sign = pl >= 0 ? '+' : '';
      const emoji = pl >= 0 ? '📈' : '📉';
      
      console.log(`   ${emoji} ${inv.symbol} - ${inv.shares} shares`);
      console.log(`      Value: $${value.toFixed(2)} | P/L: ${sign}$${pl.toFixed(2)} (${sign}${plPercent.toFixed(2)}%)`);
    });

    const totalPL = totalValue - totalCost;
    const totalPLPercent = ((totalValue - totalCost) / totalCost) * 100;
    const sign = totalPL >= 0 ? '+' : '';

    console.log(`\n💰 Total Portfolio Value: $${totalValue.toFixed(2)}`);
    console.log(`📊 Total P/L: ${sign}$${totalPL.toFixed(2)} (${sign}${totalPLPercent.toFixed(2)}%)\n`);

    console.log('✨ Sample investments setup complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupSampleInvestments();
