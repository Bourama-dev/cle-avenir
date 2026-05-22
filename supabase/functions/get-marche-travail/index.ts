import { corsHeaders } from "./cors.ts";

// API Marché du travail — France Travail
// OAuth2 scope: api_marche-travailv1
// Provides: tension indicators, job-seeker counts, hiring stats by ROME code & territory
//
// ⚠  Verify the exact resource paths against the Swagger docs on francetravail.io
//    before subscribing. Log output (Supabase dashboard → Edge Functions) shows the
//    attempted URL and response so you can diagnose 404s.

const AUTH_URL =
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire";
const BASE = "https://api.francetravail.io/partenaire/marche-travail/v1";
const SCOPE = "api_marche-travailv1";

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
  if (!d.access_token) throw new Error("No access_token in auth response");

  TOKEN_CACHE = {
    token: d.access_token,
    expiresAt: now + Math.max(0, (d.expires_in ?? 1800) - 30) * 1000,
  };
  return TOKEN_CACHE.token;
}

// Normalise the indicator response — field names may differ by API version
function normalise(data: Record<string, unknown>) {
  const pick = (...keys: string[]) => {
    for (const k of keys) if (data[k] != null) return data[k];
    return null;
  };

  return {
    // Tension / recruitment difficulty indicator (typically 0-5 or 0-100 scale)
    tension: pick("indicateurTension", "tension", "indicateur_tension", "tensionRecrutement"),
    // Job-seeker count (registered with France Travail in this ROME)
    demandeursEmploi: pick("nombreDemandeurs", "demandeursEmploi", "demandeurs_emploi", "nbDemandeurs"),
    // Open job offer count
    offresEmploi: pick("nombreOffres", "offresEmploi", "offres_emploi", "nbOffres"),
    // Hiring / recruitment count
    recrutements: pick("nombreRecrutements", "recrutements", "nbRecrutements"),
    // Overall territory employment dynamism score
    dynamisme: pick("indicateurDynamisme", "dynamisme", "dynamisme_emploi"),
    // Territory label
    territoire: pick("libelleTerritoire", "territoire", "libelle_territoire"),
    // ROME code echoed back
    codeRome: pick("codeRome", "code_rome", "rome"),
    // Raw data for debugging
    _raw: data,
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
      return respond({ indicateurs: null, warning: "credentials_missing" });
    }

    const romeCode = String(body.romeCode ?? body.rome ?? "").trim().toUpperCase();
    if (!romeCode) return respond({ indicateurs: null, warning: "romeCode_required" });

    // Territory defaults to national (NAT / FR)
    const typeTerritory = String(body.typeTerritory ?? "NAT");
    const codeTerritory = String(body.codeTerritory ?? "FR");

    let token: string;
    try {
      token = await getToken(clientId, secret);
    } catch (e) {
      console.error("[get-marche-travail] auth error:", e);
      return respond({ indicateurs: null, warning: "auth_failed" });
    }

    // Attempt 1 — path-based pattern matching Data Emploi URL structure
    const url1 = `${BASE}/indicateurs/${typeTerritory}/${codeTerritory}/${romeCode}`;
    // Attempt 2 — query-string pattern (common in older France Travail APIs)
    const qs2 = new URLSearchParams({ codeRome: romeCode, typeTerritory, codeTerritory });
    const url2 = `${BASE}/indicateurs?${qs2}`;

    let apiRes: Response | null = null;
    for (const url of [url1, url2]) {
      console.log(`[get-marche-travail] GET ${url}`);
      try {
        const r = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          signal: AbortSignal.timeout(8_000),
        });
        if (r.status === 404) {
          console.warn(`[get-marche-travail] 404 at ${url}, trying next`);
          continue;
        }
        apiRes = r;
        break;
      } catch (e) {
        console.warn(`[get-marche-travail] fetch error at ${url}:`, e);
      }
    }

    if (!apiRes) {
      return respond({ indicateurs: null, warning: "endpoint_not_found" });
    }

    if (apiRes.status === 401 || apiRes.status === 403) {
      return respond({ indicateurs: null, warning: apiRes.status === 403 ? "not_subscribed" : "auth_failed" });
    }
    if (apiRes.status === 204) {
      return respond({ indicateurs: null });
    }
    if (!apiRes.ok) {
      const text = await apiRes.text().catch(() => "");
      console.error(`[get-marche-travail] ${apiRes.status}: ${text}`);
      return respond({ indicateurs: null, warning: `api_error_${apiRes.status}` });
    }

    const data = await apiRes.json();
    // Handle both single object and array responses
    const raw: Record<string, unknown> = Array.isArray(data) ? data[0] ?? {} : data;
    console.log(`[get-marche-travail] OK for rome=${romeCode}`);

    return respond({ indicateurs: normalise(raw) });
  } catch (err) {
    console.error("[get-marche-travail] error:", err);
    return respond({ indicateurs: null, warning: "server_error" });
  }
});
