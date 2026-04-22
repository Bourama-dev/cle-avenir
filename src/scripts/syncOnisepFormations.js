/**
 * Script to sync formations from ONISEP API
 * Usage: node syncOnisepFormations.js [limit] [offset]
 *
 * Example:
 * node syncOnisepFormations.js 100 0      // Sync first 100 formations
 * node syncOnisepFormations.js 50 50      // Sync formations 50-100
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncOnisepFormations(limit = 50, offset = 0) {
  console.log(`\n🎓 Starting ONISEP formations sync...`);
  console.log(`   Limit: ${limit}, Offset: ${offset}\n`);

  try {
    const { data, error } = await supabase.functions.invoke('sync-onisep-formations', {
      body: {
        limit,
        offset,
        syncToDb: true,
      },
    });

    if (error) {
      console.error('❌ Function error:', error);
      process.exit(1);
    }

    console.log('✅ Sync completed successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total formations retrieved: ${data.total}`);
    console.log(`   - Formations synced to DB: ${data.sync?.count || 0}`);

    if (data.sync?.errors && data.sync.errors.length > 0) {
      console.log(`\n⚠️  Errors during sync:`);
      data.sync.errors.forEach(err => {
        console.log(`   - ${err}`);
      });
    }

    if (data.formations && data.formations.length > 0) {
      console.log(`\n📚 Sample formations (first 5):`);
      data.formations.forEach((f, idx) => {
        console.log(`   ${idx + 1}. ${f.libelle || f.intitule || 'N/A'}`);
      });
    }

    console.log('\n✨ Sync complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0], 10) : 50;
const offset = args[1] ? parseInt(args[1], 10) : 0;

syncOnisepFormations(limit, offset).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
