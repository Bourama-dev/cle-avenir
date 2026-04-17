import { corsHeaders } from "./cors.ts";

type TokenCache = { token: string; expiresAt: number };
let TOKEN_CACHE: TokenCache | null = null;

const API_PAGE_SIZE = 100; // France Travail max per Range request
const JOBS_API = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";

const AUTH_URLS = [
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire",
  "https://www.francetravail.io/connect/oauth2/access_token?realm=%2Fpartenaire",
];

function parseTotalFromContentRange(h: string | null): number | null {
  if (!h) return null;
  const match = h.match(/\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function str(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

async function getToken(clientId: string, secret: string): Promise<string> {
  const now = Date.now();
  if (TOKEN_CACHE && TOKEN_CACHE.expiresAt > now + 10_000) return TOKEN_CACHE.token;

  let lastErr = "unknown";
  for (const url of AUTH_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: secret,
          scope: "api_offresdemploiv2 o2dsoffre",
        }).toString(),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.access_token) {
          TOKEN_CACHE = {
            token: d.access_token,
            expiresAt: now + Math.max(0, (d.expires_in ?? 1800) - 30) * 1000,
          };
          return TOKEN_CACHE.token;
        }
      }
      lastErr = `HTTP ${res.status}: ${await res.text().catch(() => '')}`;
    } catch (e) {
      lastErr = String(e);
    }
  }
  throw new Error(`Auth failed: ${lastErr}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const empty = (reason: string) =>
    new Response(
      JSON.stringify({ data: { resultats: [] }, meta: { total: 0 }, warning: reason }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  try {
    const body = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json();

    const clientId =
      Deno.env.get("FRANCE_TRAVAIL_CLIENT_ID") ??
      Deno.env.get("POLE_EMPLOI_CLIENT_ID");
    const clientSecret =
      Deno.env.get("FRANCE_TRAVAIL_SECRET") ??
      Deno.env.get("POLE_EMPLOI_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return empty("credentials_missing");
    }

    let token: string;
    try {
      token = await getToken(clientId, clientSecret);
    } catch (e) {
      console.error("[get-jobs] auth error:", e);
      return empty(`auth_failed`);
    }

    // --- Build query params ---
    const params = new URLSearchParams();

    // Keywords / search
    const keywords = str(body.search);
    if (keywords) params.set("motsCles", keywords);

    // Sort (0=relevance, 1=date, 2=distance)
    const sort = [0, 1, 2].includes(Number(body.sort)) ? Number(body.sort) : 1;
    params.set("sort", String(sort));

    // Location: commune (zipcode/INSEE) sent by hook
    const commune = str(body.commune);
    if (commune) {
      params.set("commune", commune);
      const dist = str(body.distance);
      if (dist) params.set("distance", dist);
    }

    // Contract type: CDI, CDD, MIS (interim), etc.
    const contract = str(body.contract);
    if (contract) params.set("typeContrat", contract.toUpperCase());

    // Experience level: 1=no exp required, 2=1-3 yrs, 3=3+ yrs
    const experience = str(body.experience);
    if (experience && experience !== "all") params.set("experience", experience);

    // Télétravail filter
    if (body.teletravauxOnly === true || body.teletravauxOnly === "true") {
      params.set("modesTravail", "T"); // T = télétravail
    }

    // --- Pagination via Range header (required by France Travail API) ---
    const page = Math.max(1, Number(body.page) || 1);
    const limit = Math.min(Math.max(Number(body.limit) || 20, 1), API_PAGE_SIZE);
    const rangeStart = (page - 1) * limit;
    const rangeEnd = rangeStart + limit - 1;

    const url = `${JOBS_API}?${params.toString()}`;
    console.log(`[get-jobs] GET ${url} Range: ${rangeStart}-${rangeEnd}`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        Range: `${rangeStart}-${rangeEnd}`, // Required by France Travail API
      },
    });

    // 204 = no content (no results)
    if (res.status === 204) {
      return new Response(
        JSON.stringify({ data: { resultats: [] }, meta: { total: 0 } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!res.ok) {
      const text = await res.text();
      console.error(`[get-jobs] API error ${res.status}: ${text}`);
      return empty(`api_error_${res.status}`);
    }

    const data = await res.json();
    const resultats = Array.isArray(data?.resultats) ? data.resultats : [];

    // Total from Content-Range header: "items 0-19/1234"
    const total = parseTotalFromContentRange(res.headers.get("Content-Range")) ?? resultats.length;

    console.log(`[get-jobs] OK: ${resultats.length} results, total=${total}`);

    return new Response(
      JSON.stringify({ data: { resultats }, meta: { total } }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[get-jobs] unhandled error:", err);
    return empty(`server_error`);
  }
});
