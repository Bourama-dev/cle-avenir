import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const JOBS_API = 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search';
const AUTH_URLS = [
  'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire',
  'https://www.francetravail.io/connect/oauth2/access_token?realm=%2Fpartenaire',
];

// Default ROME codes to sync when no specific code is provided
const DEFAULT_ROME_CODES = [
  'M1805', // Études et développement informatique
  'M1801', // Administration de systèmes d'information
  'M1802', // Expertise et support en systèmes d'information
  'K1801', // Conseil en emploi et insertion professionnelle
  'K2104', // Direction d'établissement et d'enseignement
  'E1106', // Journalisme et information média
  'B1801', // Réalisation de contenus multimédias
  'D1211', // Vente en gros de matières premières
  'A1201', // Bûcheronnage et élagage
  'F1702', // Construction en béton
];

interface FranceTravailJob {
  id: string;
  intitule: string;
  description?: string;
  dateCreation?: string;
  dateActualisation?: string;
  lieuTravail?: { libelle?: string; codePostal?: string; commune?: string };
  romeCode?: string;
  romeLibelle?: string;
  entreprise?: { nom?: string; description?: string };
  typeContrat?: string;
  typeContratLibelle?: string;
  natureContrat?: string;
  experienceExige?: string;
  experienceLibelle?: string;
  salaire?: { libelle?: string; commentaire?: string };
  nombrePostes?: number;
  accessibleTH?: boolean;
  qualificationCode?: string;
  qualificationLibelle?: string;
  secteurActivite?: string;
  secteurActiviteLibelle?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

async function getToken(clientId: string, secret: string): Promise<string | null> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: secret,
    scope: 'api_offresdemploiv2 o2dsoffre',
  }).toString();

  for (const url of AUTH_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) return data.access_token;
      }
    } catch {
      // try next URL
    }
  }
  return null;
}

async function fetchJobsForRomeCode(
  token: string,
  romeCode: string,
  limit: number
): Promise<FranceTravailJob[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const url = new URL(JOBS_API);
  url.searchParams.set('codeROME', romeCode);
  url.searchParams.set('sort', '1'); // sort by date

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      Range: `0-${safeLimit - 1}`,
    },
  });

  if (res.status === 204) return [];
  if (!res.ok) {
    console.error(`[sync-france-travail-jobs] ROME ${romeCode} error ${res.status}`);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data?.resultats) ? data.resultats : [];
}

function parseSalaryMin(salaireLibelle?: string): number | null {
  if (!salaireLibelle) return null;
  const match = salaireLibelle.match(/(\d[\d\s]*)\s*€/);
  if (!match) return null;
  return parseInt(match[1].replace(/\s/g, ''), 10) || null;
}

function transformJob(job: FranceTravailJob, romeCode: string) {
  return {
    external_id: job.id,
    source: 'france_travail',
    title: job.intitule || 'Offre sans titre',
    description: job.description || null,
    company: job.entreprise?.nom || null,
    location: job.lieuTravail?.libelle || null,
    postal_code: job.lieuTravail?.codePostal || null,
    rome_code: job.romeCode || romeCode,
    rome_label: job.romeLibelle || null,
    contract_type: job.typeContrat || null,
    contract_type_label: job.typeContratLibelle || null,
    experience_level: job.experienceExige || null,
    experience_label: job.experienceLibelle || null,
    salary_label: job.salaire?.libelle || null,
    salary_min: parseSalaryMin(job.salaire?.libelle),
    positions_count: job.nombrePostes || 1,
    accessible_th: job.accessibleTH || false,
    sector: job.secteurActiviteLibelle || null,
    status: 'active',
    published_at: job.dateCreation || new Date().toISOString(),
    updated_at_source: job.dateActualisation || null,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const clientId =
      Deno.env.get('FRANCE_TRAVAIL_CLIENT_ID') ??
      Deno.env.get('POLE_EMPLOI_CLIENT_ID');
    const clientSecret =
      Deno.env.get('FRANCE_TRAVAIL_SECRET') ??
      Deno.env.get('POLE_EMPLOI_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return json({ warning: 'credentials_missing', synced: 0 });
    }

    const body = await req.json().catch(() => ({}));
    const romeCodes: string[] = body.romeCodes || DEFAULT_ROME_CODES;
    const limitPerCode: number = Math.min(body.limitPerCode || 20, 100);

    console.log(`[sync-france-travail-jobs] Starting sync for ${romeCodes.length} ROME codes`);

    const token = await getToken(clientId, clientSecret);
    if (!token) {
      console.error('[sync-france-travail-jobs] Failed to obtain access token');
      return json({ error: 'auth_failed', synced: 0 }, 500);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      return json({ error: 'supabase_credentials_missing' }, 500);
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let totalSynced = 0;
    let totalErrors = 0;

    for (const romeCode of romeCodes) {
      try {
        const jobs = await fetchJobsForRomeCode(token, romeCode, limitPerCode);
        if (jobs.length === 0) continue;

        const transformed = jobs.map(j => transformJob(j, romeCode));

        const { error } = await supabase
          .from('job_offers')
          .upsert(transformed, { onConflict: 'external_id,source' });

        if (error) {
          console.error(`[sync-france-travail-jobs] Upsert error for ${romeCode}:`, error.message);
          totalErrors++;
        } else {
          totalSynced += transformed.length;
          console.log(`[sync-france-travail-jobs] ${romeCode}: synced ${transformed.length} jobs`);
        }
      } catch (err) {
        console.error(`[sync-france-travail-jobs] Error for ${romeCode}:`, err);
        totalErrors++;
      }
    }

    // Mark old France Travail jobs as expired (older than 60 days)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('job_offers')
      .update({ status: 'expired' })
      .eq('source', 'france_travail')
      .lt('published_at', sixtyDaysAgo)
      .eq('status', 'active');

    return json({
      success: true,
      synced: totalSynced,
      errors: totalErrors,
      rome_codes_processed: romeCodes.length,
      message: `Synced ${totalSynced} jobs from France Travail`,
    });
  } catch (err) {
    console.error('[sync-france-travail-jobs] Unhandled error:', err);
    return json({ error: String(err) }, 500);
  }
});
