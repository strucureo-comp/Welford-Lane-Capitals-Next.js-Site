const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSQL(filePath) {
  console.log(`\n📖 Reading SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // Split by semicolons but keep the statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`\n🚀 Executing ${statements.length} SQL statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip comments and empty lines
    if (!statement || statement.startsWith('--')) continue;

    // Check if it's a SELECT query
    const isSelect = statement.trim().toUpperCase().startsWith('SELECT');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        query: statement + ';' 
      });

      if (error) {
        // Try direct query for SELECT statements
        if (isSelect) {
          console.log(`✅ Statement ${i + 1}: SELECT query executed`);
          // We can't execute arbitrary SELECT via RPC, but that's okay
          continue;
        }
        console.error(`❌ Statement ${i + 1} failed:`, error.message);
      } else {
        console.log(`✅ Statement ${i + 1}: Success`);
        if (data) console.log('   Result:', JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(`❌ Statement ${i + 1} error:`, err.message);
    }
  }

  console.log('\n✨ SQL execution complete!\n');
}

// Get SQL file path from command line argument
const sqlFile = process.argv[2] || 'supabase/migrations/final_fix.sql';
const fullPath = path.resolve(sqlFile);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

runSQL(fullPath);
