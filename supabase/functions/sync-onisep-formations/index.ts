import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ONISEP API - Free public API
const ONISEP_API_BASE = 'https://data.onisep.fr/api';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

interface OnisepFormation {
  id?: string;
  libelle?: string;
  intitule?: string;
  description?: string;
  niveau?: string;
  duree?: string;
  secteur?: string;
  domaine?: string;
  type?: string;
  url?: string;
  sigle?: string;
  [key: string]: any;
}

async function fetchOnisepFormations(params: {
  limit?: number;
  offset?: number;
  secteur?: string;
  domaine?: string;
  niveau?: string;
}): Promise<OnisepFormation[]> {
  const limit = Math.min(Math.max(params.limit || 20, 1), 100);
  const offset = Math.max(params.offset || 0, 0);

  try {
    const url = new URL(`${ONISEP_API_BASE}/formations`);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());

    if (params.secteur) url.searchParams.set('secteur', params.secteur);
    if (params.domaine) url.searchParams.set('domaine', params.domaine);
    if (params.niveau) url.searchParams.set('niveau', params.niveau);

    console.log(`[ONISEP] Fetching from: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Cle-Avenir/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`ONISEP API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // ONISEP returns data in different formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else if (data.formations && Array.isArray(data.formations)) {
      return data.formations;
    }

    return [];
  } catch (error) {
    console.error('[ONISEP] Fetch error:', error);
    throw error;
  }
}

async function syncFormationsToDatabase(
  supabase: any,
  formations: OnisepFormation[]
): Promise<{ success: boolean; count: number; errors?: string[] }> {
  const errors: string[] = [];
  let successCount = 0;

  for (const formation of formations) {
    try {
      const formationData = {
        name: formation.libelle || formation.intitule || 'Formation sans titre',
        title: formation.libelle || formation.intitule,
        description: formation.description || '',
        level: formation.niveau || 'Inconnu',
        duration: formation.duree || '',
        sector: formation.secteur || formation.domaine || 'Général',
        type: formation.type || 'Formation',
        url: formation.url || null,
        sigle: formation.sigle || null,
        external_id: formation.id?.toString() || null,
        source: 'onisep',
        slug: (formation.libelle || formation.intitule || 'formation')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
        metadata: formation, // Store full ONISEP data as metadata
      };

      // Upsert to handle duplicates
      const { error } = await supabase
        .from('formations')
        .upsert([formationData], {
          onConflict: 'external_id,source',
          ignoreDuplicates: false
        });

      if (error) {
        errors.push(`Formation "${formationData.name}": ${error.message}`);
      } else {
        successCount++;
      }
    } catch (error) {
      errors.push(`Formation processing error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    success: errors.length === 0 || successCount > 0,
    count: successCount,
    errors: errors.length > 0 ? errors : undefined,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await req.json();

    const {
      limit = 50,
      offset = 0,
      secteur = null,
      domaine = null,
      niveau = null,
      syncToDb = true,
    } = body;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return json({ error: 'Missing environment variables' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch from ONISEP
    console.log('[ONISEP Sync] Starting sync...');
    const formations = await fetchOnisepFormations({
      limit,
      offset,
      secteur,
      domaine,
      niveau,
    });

    console.log(`[ONISEP Sync] Retrieved ${formations.length} formations`);

    let syncResult = { success: true, count: 0 };

    if (syncToDb && formations.length > 0) {
      syncResult = await syncFormationsToDatabase(supabase, formations);
      console.log(`[ONISEP Sync] Synced ${syncResult.count} formations to database`);
    }

    return json({
      success: true,
      message: `Retrieved ${formations.length} formations from ONISEP`,
      formations: formations.slice(0, 5), // Return sample
      sync: syncResult,
      total: formations.length,
    });
  } catch (error) {
    console.error('[ONISEP Sync] Error:', error);
    return json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      500
    );
  }
});
