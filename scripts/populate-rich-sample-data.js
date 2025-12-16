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

async function populateRichSampleData() {
  console.log('🚀 Populating rich sample data for investor dashboard...\n');

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
    console.log(`📊 Creating rich sample data for: ${investor.full_name}\n`);

    // ============================================
    // STEP 1: Clear existing data
    // ============================================
    console.log('🧹 Clearing existing data...');
    await supabase.from('investments').delete().eq('user_id', investor.id);
    await supabase.from('cash_flows').delete().eq('user_id', investor.id);
    console.log('✅ Cleared existing data\n');

    // ============================================
    // STEP 2: Create diverse investment portfolio
    // ============================================
    console.log('📈 Creating investment portfolio...');
    
    const investments = [
      // Tech stocks
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
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 35,
        purchase_price: 380.00,
        current_price: 420.50,
        purchase_date: '2024-02-10'
      },
      {
        user_id: investor.id,
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 40,
        purchase_price: 142.50,
        current_price: 155.80,
        purchase_date: '2024-03-05'
      },
      {
        user_id: investor.id,
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        shares: 25,
        purchase_price: 485.00,
        current_price: 520.75,
        purchase_date: '2024-03-15'
      },
      // Mixed performance
      {
        user_id: investor.id,
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        shares: 20,
        purchase_price: 245.00,
        current_price: 238.50,
        purchase_date: '2024-04-01'
      },
      {
        user_id: investor.id,
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        shares: 30,
        purchase_price: 178.25,
        current_price: 185.40,
        purchase_date: '2024-05-12'
      },
      {
        user_id: investor.id,
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        shares: 22,
        purchase_price: 485.50,
        current_price: 510.20,
        purchase_date: '2024-06-08'
      },
      // Some losses
      {
        user_id: investor.id,
        symbol: 'NYX',
        name: 'Apple Paronyia, Inc',
        shares: 30,
        purchase_price: 67.00,
        current_price: 33.33,
        purchase_date: '2024-07-15'
      },
      // Recent additions
      {
        user_id: investor.id,
        symbol: 'AMD',
        name: 'Advanced Micro Devices',
        shares: 45,
        purchase_price: 155.75,
        current_price: 162.30,
        purchase_date: '2024-08-20'
      },
      {
        user_id: investor.id,
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        shares: 15,
        purchase_price: 625.00,
        current_price: 648.90,
        purchase_date: '2024-09-10'
      }
    ];

    const { data: insertedInvestments, error: invError } = await supabase
      .from('investments')
      .insert(investments)
      .select();

    if (invError) {
      console.error('❌ Error inserting investments:', invError.message);
      return;
    }

    console.log(`✅ Created ${insertedInvestments.length} investment positions\n`);

    // Calculate and display portfolio summary
    let totalValue = 0;
    let totalCost = 0;
    
    console.log('📊 Investment Portfolio Summary:');
    console.log('─'.repeat(80));
    console.log('Symbol'.padEnd(8) + 'Shares'.padEnd(10) + 'Avg Price'.padEnd(15) + 'Current'.padEnd(15) + 'P/L');
    console.log('─'.repeat(80));
    
    investments.forEach(inv => {
      const value = inv.shares * inv.current_price;
      const cost = inv.shares * inv.purchase_price;
      const pl = value - cost;
      const plPercent = ((value - cost) / cost) * 100;
      
      totalValue += value;
      totalCost += cost;
      
      const sign = pl >= 0 ? '+' : '';
      const emoji = pl >= 0 ? '📈' : '📉';
      
      console.log(
        `${emoji} ${inv.symbol.padEnd(6)}` +
        `${inv.shares.toString().padEnd(10)}` +
        `$${inv.purchase_price.toFixed(2).padEnd(13)}` +
        `$${inv.current_price.toFixed(2).padEnd(13)}` +
        `${sign}$${pl.toFixed(2)} (${sign}${plPercent.toFixed(2)}%)`
      );
    });

    const totalPL = totalValue - totalCost;
    const totalPLPercent = ((totalValue - totalCost) / totalCost) * 100;
    const sign = totalPL >= 0 ? '+' : '';

    console.log('─'.repeat(80));
    console.log(`💰 Total Portfolio Value: $${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`💵 Total Invested: $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`📊 Total P/L: ${sign}$${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sign}${totalPLPercent.toFixed(2)}%)\n`);

    // ============================================
    // STEP 3: Create cash flow history
    // ============================================
    console.log('💸 Creating cash flow history...');

    // Check if cash_flows table exists
    const { error: tableCheckError } = await supabase
      .from('cash_flows')
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      console.log('⚠️  Cash flows table does not exist yet. Skipping cash flows.');
      console.log('   Please create the table first using the migration SQL.\n');
    } else {
      const cashFlows = [
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
          description: 'Portfolio rebalancing fee'
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
        },
        {
          user_id: investor.id,
          amount: 25000,
          type: 'deposit',
          date: '2024-09-05',
          description: 'Q3 investment allocation'
        }
      ];

      const { data: insertedFlows, error: flowError } = await supabase
        .from('cash_flows')
        .insert(cashFlows)
        .select();

      if (flowError) {
        console.error('❌ Error inserting cash flows:', flowError.message);
      } else {
        console.log(`✅ Created ${insertedFlows.length} cash flow entries\n`);
        
        console.log('💰 Cash Flow Timeline:');
        console.log('─'.repeat(80));
        cashFlows
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .forEach(flow => {
            const sign = flow.type === 'deposit' ? '+' : '-';
            const emoji = flow.type === 'deposit' ? '🟢' : '🔴';
            const amount = flow.amount.toLocaleString();
            console.log(`${emoji} ${flow.date}  ${sign}$${amount.padEnd(12)} - ${flow.description}`);
          });
        console.log('─'.repeat(80) + '\n');
      }
    }

    // ============================================
    // STEP 4: Summary
    // ============================================
    console.log('✨ Sample data population complete!\n');
    console.log('📋 Summary:');
    console.log(`   • ${investments.length} investment positions created`);
    console.log(`   • Portfolio value: $${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    console.log(`   • Total P/L: ${sign}${totalPLPercent.toFixed(2)}%`);
    console.log(`   • Cash flow events: ${tableCheckError ? 'Skipped (table not created)' : cashFlows.length + ' entries'}\n`);
    
    console.log('🎉 Login as investor@welfordlane.com to see the rich dashboard!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateRichSampleData();
