import { corsHeaders } from "./cors.ts";

// La Bonne Boîte API — identifies companies likely to hire by location + ROME code
// Scope required: api_labonneboitev1
// Doc: https://francetravail.io/produits-partages/catalogue/bonne-boite-v2/documentation

const LBB_API = "https://api.francetravail.io/partenaire/labonneboite/v1/company/";
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
      scope: "api_labonneboitev1",
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

function normalize(raw: Record<string, unknown>, contractFilter: string): Company {
  const siret = str(raw.siret) ?? "";
  return {
    siret,
    name: str(raw.name) ?? str(raw.label) ?? "Entreprise",
    naf: str(raw.naf) ?? "",
    naf_text: str(raw.naf_text) ?? str(raw.industry) ?? "",
    city: str(raw.city) ?? "",
    zipcode: str(raw.zipcode) ?? str(raw.zip) ?? "",
    address: str(raw.street) ?? str(raw.address) ?? "",
    stars: typeof raw.stars === "number" ? raw.stars : Number(raw.stars ?? 0),
    headcount_text: str(raw.headcount_text) ?? str(raw.size) ?? "",
    distance: typeof raw.distance === "number" ? raw.distance : Number(raw.distance ?? 0),
    lat: typeof raw.latitude === "number" ? raw.latitude : Number(raw.latitude ?? 0),
    lon: typeof raw.longitude === "number" ? raw.longitude : Number(raw.longitude ?? 0),
    url: str(raw.url) ??
      `https://labonneboite.francetravail.fr/entreprises/siret/${siret}`,
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
    const contract = str(body.contract);           // "dpae" | "alternance" | null

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      distance: String(distance),
      page: String(page),
      page_size: String(pageSize),
    });
    if (romeCodes) params.set("rome_codes", romeCodes);
    if (contract && (contract === "dpae" || contract === "alternance")) {
      params.set("contract", contract);
    }

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
      // 403 = not subscribed to La Bonne Boîte API
      if (res.status === 403) {
        return json({ success: false, warning: "not_subscribed", companies: [], total: 0 });
      }
      return json({ success: false, warning: `api_error_${res.status}`, companies: [], total: 0 });
    }

    const data = await res.json();

    // v1 wraps results in { companies: [...], companies_count: N }
    const raw: Record<string, unknown>[] = Array.isArray(data?.companies)
      ? data.companies
      : Array.isArray(data)
      ? data
      : [];
    const total: number = Number(data?.companies_count ?? data?.total ?? raw.length);

    const companies = raw.map((c) => normalize(c, contract ?? "all"));
    console.log(`[get-companies] OK: ${companies.length} companies, total=${total}`);

    return json({ success: true, companies, total, page });

  } catch (err) {
    console.error("[get-companies] unhandled:", err);
    return json({ success: false, warning: "server_error", companies: [], total: 0 }, 500);
  }
});
