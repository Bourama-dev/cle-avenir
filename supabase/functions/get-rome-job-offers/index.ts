const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const TOKEN_URLS = [
  'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire',
  'https://www.francetravail.io/connect/oauth2/access_token?realm=%2Fpartenaire',
];

const JOBS_API = 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function emptyResult() {
  return json({ data: [], meta: { total: 0 } });
}

async function getToken(clientId: string, secret: string): Promise<string | null> {
  const creds = btoa(`${clientId}:${secret}`);
  const body = 'grant_type=client_credentials&scope=api_offresdemploiv2 o2dsoffre';

  for (const url of TOKEN_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const clientId =
      Deno.env.get('FRANCE_TRAVAIL_CLIENT_ID') ??
      Deno.env.get('POLE_EMPLOI_CLIENT_ID');
    const clientSecret =
      Deno.env.get('FRANCE_TRAVAIL_SECRET') ??
      Deno.env.get('POLE_EMPLOI_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.warn('[get-rome-job-offers] credentials_missing');
      return json({ data: [], meta: { total: 0 }, warning: 'credentials_missing' });
    }

    const { code, limit = 10 } = await req.json();

    if (!code) {
      return json({ error: 'Missing ROME code' }, 400);
    }

    const token = await getToken(clientId, clientSecret);
    if (!token) {
      console.error('[get-rome-job-offers] Failed to obtain access token');
      return emptyResult();
    }

    // France Travail API uses range header for pagination: "0-<limit-1>"
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const rangeEnd = safeLimit - 1;

    const url = new URL(JOBS_API);
    url.searchParams.set('codeROME', String(code));
    url.searchParams.set('sort', '1'); // sort by date

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Range: `0-${rangeEnd}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[get-rome-job-offers] API error ${res.status}: ${text}`);
      return emptyResult();
    }

    const data = await res.json();
    const resultats = data?.resultats ?? [];

    // Extract total from Content-Range header if available
    const contentRange = res.headers.get('Content-Range');
    let total = resultats.length;
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) total = parseInt(match[1], 10);
    }

    return json({ data: resultats, meta: { total } });
  } catch (err) {
    console.error('[get-rome-job-offers] Unexpected error:', err);
    return emptyResult();
  }
});
