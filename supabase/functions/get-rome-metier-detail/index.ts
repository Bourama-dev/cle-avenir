import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const FRANCE_TRAVAIL_TOKEN_URL = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire';
const ROME_API_BASE = 'https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

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
    throw new Error(`Token error: ${response.statusText}`);
  }

  const tokenData = await response.json();
  return tokenData.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing ROME code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First: try to get from DB (which may have enriched data)
    const { data: dbMetier, error: dbError } = await supabase
      .from('rome_metiers')
      .select('*')
      .eq('code', code)
      .single();

    // Try to enrich from France Travail API
    const clientId = Deno.env.get('FRANCE_TRAVAIL_CLIENT_ID');
    const secret = Deno.env.get('FRANCE_TRAVAIL_SECRET');

    if (clientId && secret) {
      try {
        const token = await getAccessToken(clientId, secret);

        const apiRes = await fetch(`${ROME_API_BASE}/${code}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();

          // Merge API data with DB data (DB data takes precedence for base fields)
          const merged = {
            ...(dbMetier || {}),
            ...apiData,
            code: code,
            libelle: dbMetier?.libelle || apiData.libelle,
            description: dbMetier?.description || apiData.definition || apiData.descriptifRome,
            definition: apiData.definition || apiData.descriptifRome || dbMetier?.description,
          };

          return new Response(JSON.stringify(merged), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (apiErr) {
        console.error('France Travail API error, falling back to DB:', apiErr);
      }
    }

    // Fallback: return DB data
    if (dbMetier) {
      return new Response(JSON.stringify(dbMetier), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Métier not found', code }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error in get-rome-metier-detail:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
