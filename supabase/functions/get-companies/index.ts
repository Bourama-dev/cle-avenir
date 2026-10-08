import { corsHeaders } from "./cors.ts";

// La Bonne Boîte API v2 — identifies companies likely to hire by location + ROME code
// Scopes required: search office api_labonneboitev2  (v1 scope api_labonneboitev1 is no longer accepted)
// Doc: https://francetravail.io/produits-partages/catalogue/bonne-boite-v2/documentation

const LBB_API = "https://api.francetravail.io/partenaire/labonneboite/v2/recherche";
const AUTH_URL = "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire";

type TokenCache = { token: string; expiresAt: number };
let TOKEN_CACHE: TokenCache | null = null;

interface Company {
  siret: string;
  name: string;
  naf: string;
  naf_text: string;
  city: string;
  zipcode: string;
  address: string;
  stars: number;          // hiring potential 0–5 (higher = more likely to hire)
  headcount_text: string; // "10-19 salariés" etc.
  distance: number;       // km from search centre
  lat: number;
  lon: number;
  url: string;            // company profile on La Bonne Boîte
  contract: "dpae" | "alternance" | "all";
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

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
      scope: "search office api_labonneboitev2",
    }).toString(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`LBB auth failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  const d = await res.json();
  if (!d.access_token) throw new Error("LBB auth: no access_token in response");

  TOKEN_CACHE = {
    token: d.access_token,
    expiresAt: now + Math.max(0, (d.expires_in ?? 1800) - 30) * 1000,
  };
  return TOKEN_CACHE.token;
}

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

// Great-circle distance in km (v2 does not return the distance to the search centre)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function headcountText(min: unknown, max: unknown): string {
  const lo = str(min);
  const hi = str(max);
  if (lo && hi) return lo === hi ? `${lo} salariés` : `${lo} à ${hi} salariés`;
  if (lo) return `${lo} salariés et plus`;
  if (hi) return `jusqu'à ${hi} salariés`;
  return "";
}

// v2 item (SearchResponseItem): siret, company_name, office_name, naf, naf_label, location{latitude,longitude},
// city, postcode, headcount_min/max, hiring_potential (0-100)
function normalize(raw: Record<string, unknown>, contractFilter: string, center: { lat: number; lon: number }): Company {
  const siret = str(raw.siret) ?? "";
  const loc = (raw.location ?? {}) as Record<string, unknown>;
  const lat = Number(loc.latitude ?? raw.latitude ?? 0);
  const lon = Number(loc.longitude ?? raw.longitude ?? 0);
  const potential = Number(raw.hiring_potential ?? 0);
  return {
    siret,
    name: str(raw.office_name) ?? str(raw.company_name) ?? str(raw.name) ?? "Entreprise",
    naf: str(raw.naf) ?? "",
    naf_text: str(raw.naf_label) ?? str(raw.naf_text) ?? "",
    city: str(raw.city) ?? "",
    zipcode: str(raw.postcode) ?? str(raw.zipcode) ?? "",
    address: "",
    // hiring_potential is 0–100; the UI shows 0–5 stars
    stars: Number.isFinite(potential) ? Math.round(Math.min(Math.max(potential, 0), 100) / 20 * 10) / 10 : 0,
    headcount_text: headcountText(raw.headcount_min, raw.headcount_max),
    distance: lat && lon ? Math.round(haversineKm(center.lat, center.lon, lat, lon) * 10) / 10 : 0,
    lat,
    lon,
    url: `https://labonneboite.francetravail.fr/entreprises/siret/${siret}`,
    contract: contractFilter as Company["contract"],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json().catch(() => ({}));

    const clientId = Deno.env.get("FRANCE_TRAVAIL_CLIENT_ID") ?? Deno.env.get("POLE_EMPLOI_CLIENT_ID");
    const clientSecret = Deno.env.get("FRANCE_TRAVAIL_SECRET") ?? Deno.env.get("POLE_EMPLOI_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return json({ success: false, warning: "credentials_missing", companies: [], total: 0 });
    }

    // Coordinates are required — La Bonne Boîte is location-centric
    const lat = Number(body.latitude);
    const lon = Number(body.longitude);
    if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
      return json({ success: false, error: "latitude and longitude are required", companies: [], total: 0 }, 400);
    }

    let token: string;
    try {
      token = await getToken(clientId, clientSecret);
    } catch (e) {
      console.error("[get-companies] auth error:", e);
      return json({ success: false, warning: "auth_failed", companies: [], total: 0 });
    }

    const distance = Math.min(Math.max(Number(body.distance) || 30, 5), 100);
    const page = Math.max(1, Number(body.page) || 1);
    const pageSize = Math.min(Math.max(Number(body.page_size) || 20, 1), 100);
    const romeCodes = str(body.rome_codes);        // comma-separated ROME codes, optional
    const job = str(body.job)?.slice(0, 100);      // free-text job search, optional
    // v2 requires at least one of job | granddomain | domain | rome | naf
    if (!romeCodes && !job) {
      return json({ success: false, warning: "criteria_required", companies: [], total: 0 });
    }

    // v2: array parameters are repeated (rome=A&rome=B); distance must be in ]0, 200[ km.
    // The old `contract` filter (dpae/alternance) no longer exists in v2.
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      distance: String(distance),
      page: String(page),
      page_size: String(pageSize),
    });
    if (romeCodes) {
      for (const code of romeCodes.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 60)) {
        params.append("rome", code);
      }
    }
    if (job) params.set("job", job);

    const url = `${LBB_API}?${params.toString()}`;
    console.log(`[get-companies] GET ${url}`);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status === 204) {
      return json({ success: true, companies: [], total: 0, page });
    }

    if (!res.ok) {
      const text = await res.text();
      console.error(`[get-companies] API error ${res.status}:`, text.slice(0, 400));
      // 403 = not subscribed to La Bonne Boîte API (v2)
      if (res.status === 403) {
        return json({ success: false, warning: "not_subscribed", companies: [], total: 0 });
      }
      return json({ success: false, warning: `api_error_${res.status}`, companies: [], total: 0 });
    }

    const data = await res.json();

    // v2 wraps results in { hits: N, items: [...] }
    const raw: Record<string, unknown>[] = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.companies)
      ? data.companies
      : Array.isArray(data)
      ? data
      : [];
    const total: number = Number(data?.hits ?? data?.companies_count ?? data?.total ?? raw.length);

    const companies = raw.map((c) => normalize(c, "all", { lat, lon }));
    console.log(`[get-companies] OK: ${companies.length} companies, total=${total}`);

    return json({ success: true, companies, total, page });

  } catch (err) {
    console.error("[get-companies] unhandled:", err);
    return json({ success: false, warning: "server_error", companies: [], total: 0 }, 500);
  }
});
