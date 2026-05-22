import { corsHeaders } from "./cors.ts";

// API Stats Perspectives Retour Emploi — France Travail
// Endpoint confirmed: https://api.francetravail.io/partenaire/stats-perspectives-retour-emploi/v1/indicateur/stat-acces-emploi
// OAuth2 scope: api_stats-perspectives-retour-emploiv1
// Returns: employment return rates for job seekers exiting training, by ROME code & territory
// Data source: France Travail + ACOSS, updated quarterly
// Note: sectors with <60 graduates at national level are excluded from results

const AUTH_URL =
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire";
const BASE = "https://api.francetravail.io/partenaire/stats-perspectives-retour-emploi/v1";
const SCOPE = "api_stats-perspectives-retour-emploiv1";

type TokenCache = { token: string; expiresAt: number };
let TOKEN_CACHE: TokenCache | null = null;

async function getToken(clientId: string, secret: string): Promise<string> {
  const now = Date.now();
  if (TOKEN_CACHE && TOKEN_CACHE.expiresAt > now + 10_000) return TOKEN_CACHE.token;

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: secret,
      scope: SCOPE,
    }).toString(),
  });

  if (!res.ok) throw new Error(`Auth ${res.status}: ${await res.text().catch(() => "")}`);
  const d = await res.json();
  if (!d.access_token) throw new Error("No access_token");

  TOKEN_CACHE = {
    token: d.access_token,
    expiresAt: now + Math.max(0, (d.expires_in ?? 1800) - 30) * 1000,
  };
  return TOKEN_CACHE.token;
}

// Field names are best guesses — normalise defensively across multiple naming conventions
function normalise(raw: Record<string, unknown>) {
  const pick = (...keys: string[]) => {
    for (const k of keys) if (raw[k] != null) return raw[k];
    return null;
  };

  // Employment return rate (% of trainees employed after 6 months, typically 0-100)
  const tauxRetour =
    pick("tauxRetourEmploi", "taux_retour_emploi", "tauxRetour", "taux_acces_emploi",
         "tauxAccesEmploi", "taux_insertion");

  // Breakdown by return delay
  const retour6Mois = pick("tauxRetour6Mois", "taux_retour_6mois", "retour6Mois");
  const retour12Mois = pick("tauxRetour12Mois", "taux_retour_12mois", "retour12Mois");

  // Count of trainees in the sample
  const effectif = pick("effectif", "nbSortants", "nb_sortants", "nombreSortants");

  // Type of training / formation type
  const typeFormation = pick("typeFormation", "type_formation", "libelleTypeFormation");

  // Territory info
  const territoire = pick("libelleTerritoire", "territoire", "libelle_territoire");

  return {
    tauxRetourEmploi: tauxRetour,
    retour6Mois,
    retour12Mois,
    effectif,
    typeFormation,
    territoire,
    _raw: raw,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json();

    const clientId =
      Deno.env.get("FRANCE_TRAVAIL_CLIENT_ID") ?? Deno.env.get("POLE_EMPLOI_CLIENT_ID");
    const secret =
      Deno.env.get("FRANCE_TRAVAIL_SECRET") ?? Deno.env.get("POLE_EMPLOI_CLIENT_SECRET");

    if (!clientId || !secret) {
      return respond({ stats: null, warning: "credentials_missing" });
    }

    const romeCode = String(body.romeCode ?? body.rome ?? "").trim().toUpperCase();
    if (!romeCode) return respond({ stats: null, warning: "romeCode_required" });

    // Territory: N = national (default), R = region, D = departement
    const typeTerritory = String(body.typeTerritory ?? "N");
    const codeTerritory = String(body.codeTerritory ?? "00");

    let token: string;
    try {
      token = await getToken(clientId, secret);
    } catch (e) {
      console.error("[get-sortants-formation] auth error:", e);
      return respond({ stats: null, warning: "auth_failed" });
    }

    // Confirmed endpoint: /indicateur/stat-acces-emploi
    const qs = new URLSearchParams({ codeRome: romeCode, typeTerritory, codeTerritory });
    const url = `${BASE}/indicateur/stat-acces-emploi?${qs}`;

    console.log(`[get-sortants-formation] GET ${url}`);
    let apiRes: Response;
    let usedUrl = url;
    try {
      apiRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal: AbortSignal.timeout(8_000),
      });
    } catch (e) {
      console.error(`[get-sortants-formation] fetch error:`, e);
      return respond({ stats: null, warning: "server_error" });
    }

    if (apiRes.status === 401 || apiRes.status === 403) {
      return respond({ stats: null, warning: apiRes.status === 403 ? "not_subscribed" : "auth_failed" });
    }
    if (apiRes.status === 204) {
      return respond({ stats: null });
    }
    if (!apiRes.ok) {
      const text = await apiRes.text().catch(() => "");
      console.error(`[get-sortants-formation] ${apiRes.status} at ${usedUrl}: ${text}`);
      return respond({ stats: null, warning: `api_error_${apiRes.status}` });
    }

    const data = await apiRes.json();
    const items: unknown[] = Array.isArray(data) ? data : data.results ?? data.data ?? [data];

    // Return all items normalised (one per training type / territory)
    const stats = items.map((item) => normalise(item as Record<string, unknown>));
    console.log(`[get-sortants-formation] OK: ${stats.length} rows for rome=${romeCode}`);

    return respond({ stats });
  } catch (err) {
    console.error("[get-sortants-formation] error:", err);
    return respond({ stats: null, warning: "server_error" });
  }
});
