/**
 * Script to synchronize ROME metiers from France Travail API to Supabase
 *
 * Usage:
 *   node syncRomeMetiers.js <CLIENT_ID> <SECRET>
 *
 * The script fetches all French job occupations from the official ROME catalog
 * and stores them in the rome_metiers table.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY env vars required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get OAuth2 token from France Travail API
 */
async function getAccessToken(clientId, secret) {
  try {
    // Try the correct endpoint for Emploi-Store API token
    const response = await fetch('https://www.emploi-store.fr/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: secret,
        scope: 'api_rome-metiers',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Failed to get access token:', error.message);
    throw error;
  }
}

/**
 * Fetch all metiers from France Travail API with pagination
 */
async function fetchAllMetiers(accessToken) {
  const allMetiers = [];
  let cursor = null;
  let page = 0;
  const pageSize = 100;

  console.log('\n📡 Fetching metiers from France Travail API...\n');

  while (true) {
    page++;
    let url = `https://api.emploi-store.fr/api/metiers/search?limit=${pageSize}`;
    if (cursor) {
      url += `&curseurSuivant=${encodeURIComponent(cursor)}`;
    }

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const metiers = data.resultats || [];

      allMetiers.push(...metiers);
      console.log(`✅ Page ${page}: Fetched ${metiers.length} metiers (Total: ${allMetiers.length})`);

      // Check if there's a next page
      cursor = data.curseurSuivant;
      if (!cursor || metiers.length < pageSize) {
        break;
      }
    } catch (error) {
      console.error(`❌ Error on page ${page}:`, error.message);
      throw error;
    }
  }

  return allMetiers;
}

/**
 * Transform API metier to database format
 */
function transformMetier(apiMetier) {
  return {
    code: apiMetier.code,
    libelle: apiMetier.libelle || '',
    description: apiMetier.definition || apiMetier.descriptifRome || '',
    riasecMajeur: apiMetier.riasecMajeur || '',
    riasecMineur: apiMetier.riasecMineur || '',
    debouches: apiMetier.debouches || '',
    salaire: apiMetier.salaire || '',
    niveau_etudes: apiMetier.niveauEtudes || '',
    is_active: true,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Insert metiers into database using upsert
 */
async function insertMetiers(metiers) {
  console.log(`\n💾 Inserting ${metiers.length} metiers into database...\n`);

  const batchSize = 500;
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < metiers.length; i += batchSize) {
    const batch = metiers.slice(i, i + batchSize);
    const transformed = batch.map(transformMetier);

    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .upsert(transformed, { onConflict: 'code' });

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        throw error;
      }

      const count = transformed.length;
      inserted += count;
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${count} metiers upserted`);
    } catch (error) {
      console.error(`❌ Error inserting batch:`, error.message);
      throw error;
    }
  }

  return inserted;
}

/**
 * Main sync function
 */
async function syncRomeMetiers(clientId, secret) {
  try {
    console.log('🚀 Starting ROME metiers synchronization...\n');

    // Step 1: Get access token
    console.log('1️⃣ Getting access token from France Travail API...');
    const accessToken = await getAccessToken(clientId, secret);
    console.log('✅ Access token obtained\n');

    // Step 2: Fetch all metiers
    console.log('2️⃣ Fetching metiers from France Travail API');
    const metiers = await fetchAllMetiers(accessToken);
    console.log(`\n✅ Successfully fetched ${metiers.length} metiers\n`);

    // Step 3: Insert into database
    console.log('3️⃣ Storing metiers in database');
    await insertMetiers(metiers);

    // Step 4: Verify
    console.log('\n4️⃣ Verifying database...');
    const { count, error: countError } = await supabase
      .from('rome_metiers')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    console.log(`\n✅ SYNCHRONIZATION COMPLETE!`);
    console.log(`📊 Database now contains ${count} metiers\n`);
    return { success: true, count };
  } catch (error) {
    console.error('\n❌ Synchronization failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node syncRomeMetiers.js <CLIENT_ID> <SECRET>');
  process.exit(1);
}

const [clientId, secret] = args;
syncRomeMetiers(clientId, secret);
