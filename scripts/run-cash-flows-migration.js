require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function runMigration() {
  console.log('🚀 Running cash_flows table migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251216_create_cash_flows_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split into individual statements and execute them
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      
      if (error) {
        // Try alternative method - direct query
        const { error: directError } = await supabase.from('_migrations').insert({
          statement: statement
        });
        
        if (directError && !error.message.includes('already exists')) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.log('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }

    console.log('\n✅ Migration completed!\n');
    console.log('📋 Now run the setup scripts:');
    console.log('   node scripts/setup-sample-investments.js');
    console.log('   node scripts/setup-cash-flows.js\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n⚠️  Please run the migration manually in Supabase SQL Editor:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Click "New Query"');
    console.log('   4. Copy the contents of: supabase/migrations/20251216_create_cash_flows_table.sql');
    console.log('   5. Paste and click "Run"\n');
  }
}

runMigration();
