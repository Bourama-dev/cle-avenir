import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const FRANCE_TRAVAIL_TOKEN_URL = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire';
const ROME_METIERS_API = 'https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier';

interface MetierFromAPI {
  code: string;
  libelle: string;
  definition?: string;
  descriptifRome?: string;
  riasecMajeur?: string;
  riasecMineur?: string;
  debouches?: string;
  salaire?: string;
  niveau_etudes?: string;
}

interface APIResponse {
  resultats: MetierFromAPI[];
  pagination?: {
    curseurSuivant?: string;
  };
}

// Get OAuth token from France Travail
async function getAccessToken(clientId: string, secret: string): Promise<string> {
  const credentials = btoa(`${clientId}:${secret}`);

  const response = await fetch(FRANCE_TRAVAIL_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=nomenclatureRome api_rome-metiersv1'
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch all metiers with pagination
async function fetchAllMetiers(accessToken: string): Promise<MetierFromAPI[]> {
  const allMetiers: MetierFromAPI[] = [];
  let cursor: string | undefined = undefined;
  let pageCount = 0;

  while (true) {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const url = new URL(ROME_METIERS_API);
    url.searchParams.append('limit', '100');
    if (cursor) {
      url.searchParams.append('curseur', cursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: APIResponse = await response.json();

    if (data.resultats && data.resultats.length > 0) {
      allMetiers.push(...data.resultats);
      console.log(`Page ${pageCount}: ${data.resultats.length} métiers (Total: ${allMetiers.length})`);
    }

    // Check if there are more pages
    if (!data.pagination?.curseurSuivant) {
      break;
    }

    cursor = data.pagination.curseurSuivant;
  }

  console.log(`Total métiers fetched: ${allMetiers.length}`);
  return allMetiers;
}

// Insert or update metiers in Supabase
async function insertMetiersToSupabase(supabase: any, metiers: MetierFromAPI[]) {
  console.log(`Inserting/updating ${metiers.length} métiers...`);

  // Transform API data to match our table schema
  const transformedMetiers = metiers.map((m) => ({
    code: m.code,
    libelle: m.libelle,
    description: m.descriptifRome || m.definition || '',
    riasecMajeur: m.riasecMajeur || null,
    riasecMineur: m.riasecMineur || null,
    debouches: m.debouches || null,
    salaire: m.salaire || null,
    niveau_etudes: m.niveau_etudes || null,
  }));

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < transformedMetiers.length; i += batchSize) {
    const batch = transformedMetiers.slice(i, i + batchSize);

    const { error } = await supabase
      .from('rome_metiers')
      .upsert(batch, { onConflict: 'code' });

    if (error) {
      throw new Error(`Failed to insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
    }

    console.log(`Inserted/updated batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(transformedMetiers.length / batchSize)}`);
  }

  console.log('All métiers inserted/updated successfully');
}

Deno.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get credentials from request body or environment
    const { clientId, secret } = await req.json();

    if (!clientId || !secret) {
      return new Response(
        JSON.stringify({ error: 'Missing clientId or secret' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting ROME métiers synchronization...');

    // Get access token
    console.log('Getting access token from France Travail...');
    const accessToken = await getAccessToken(clientId, secret);
    console.log('Access token obtained');

    // Fetch all metiers from API
    console.log('Fetching all métiers from API...');
    const metiers = await fetchAllMetiers(accessToken);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert metiers to Supabase
    await insertMetiersToSupabase(supabase, metiers);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${metiers.length} métiers from France Travail API`,
        count: metiers.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
