import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsFor, json, getAuthedUser, isAdminUser, secretMatches } from '../_shared/auth.ts';

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
    riasecmajeur: m.riasecMajeur || null,
    riasecmineur: m.riasecMineur || null,
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
  const cors = corsFor(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Max-Age': '86400' } });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, cors);
  }

  try {
    // Auth: cron secret OR authenticated admin
    const cronOk = secretMatches(req.headers.get('x-cron-secret'), Deno.env.get('CRON_SECRET'));
    if (!cronOk) {
      const user = await getAuthedUser(req);
      if (!user) return json({ error: 'Unauthorized' }, 401, cors);
      if (!(await isAdminUser(user.id))) return json({ error: 'Forbidden' }, 403, cors);
    }

    // Credentials come from env only, never from the request
    const clientId = Deno.env.get('FRANCE_TRAVAIL_CLIENT_ID') ?? Deno.env.get('POLE_EMPLOI_CLIENT_ID');
    const secret = Deno.env.get('FRANCE_TRAVAIL_SECRET') ?? Deno.env.get('POLE_EMPLOI_CLIENT_SECRET');
    if (!clientId || !secret) {
      console.error('Missing France Travail credentials in env');
      return json({ error: 'Service not configured' }, 500, cors);
    }

    console.log('Starting ROME métiers synchronization...');
    const accessToken = await getAccessToken(clientId, secret);
    const metiers = await fetchAllMetiers(accessToken);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await insertMetiersToSupabase(supabase, metiers);

    return json({
      success: true,
      message: `Successfully synced ${metiers.length} métiers from France Travail API`,
      count: metiers.length,
    }, 200, cors);
  } catch (error) {
    console.error('Error:', error);
    return json({ error: 'internal_error' }, 500, cors);
  }
});
