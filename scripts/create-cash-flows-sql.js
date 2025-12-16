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

async function createCashFlowsTableAndData() {
  console.log('🚀 Setting up cash_flows table and data...\n');

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

    console.log('📋 Instructions to create cash_flows table:\n');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run this SQL:\n');
    console.log('─'.repeat(80));
    console.log(`
CREATE TABLE IF NOT EXISTS cash_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cash_flows_user_id ON cash_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flows_date ON cash_flows(date);

ALTER TABLE cash_flows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cash flows" ON cash_flows;
CREATE POLICY "Users can view their own cash flows" ON cash_flows FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all cash flows" ON cash_flows;
CREATE POLICY "Admins can view all cash flows" ON cash_flows FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Users can insert their own cash flows" ON cash_flows;
CREATE POLICY "Users can insert their own cash flows" ON cash_flows FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert all cash flows" ON cash_flows;
CREATE POLICY "Admins can insert all cash flows" ON cash_flows FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
    `);
    console.log('─'.repeat(80));
    console.log('\n4. Then run this to insert sample cash flow data:\n');
    console.log('─'.repeat(80));
    console.log(`
INSERT INTO cash_flows (user_id, amount, type, date, description) VALUES
('${investor.id}', 31500, 'deposit', '2024-01-15', 'Initial investment'),
('${investor.id}', 800, 'withdrawal', '2024-03-15', 'Portfolio rebalancing fee'),
('${investor.id}', 33000, 'deposit', '2024-06-10', 'Additional capital injection'),
('${investor.id}', 800, 'withdrawal', '2024-07-20', 'Profit distribution'),
('${investor.id}', 25000, 'deposit', '2024-09-05', 'Q3 investment allocation');
    `);
    console.log('─'.repeat(80));
    console.log('\n✅ Copy the SQL above and run it in Supabase SQL Editor\n');
    console.log('📊 This will create:');
    console.log('   • cash_flows table with proper structure');
    console.log('   • RLS policies for security');
    console.log('   • 5 sample cash flow entries\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createCashFlowsTableAndData();
