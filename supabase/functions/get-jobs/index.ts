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

// Converts a French postal code to an INSEE commune code using the official geo API.
// France Travail API requires INSEE codes (e.g. "33063") not postal codes ("33000").
async function resolveInseeCode(postalCode: string): Promise<string | null> {
  try {
    const url = `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(postalCode)}&fields=code&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3_000) });
    if (!res.ok) return null;
    const communes = await res.json() as Array<{ code: string }>;
    return communes[0]?.code ?? null;
  } catch {
    return null;
  }
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

    // Location — three possible inputs, in priority order:
    //   1. body.inseeCode  — pre-resolved INSEE code sent by frontend (use directly, no API call)
    //   2. body.commune    — postal code (5 digits) → resolve to INSEE via geo.api.gouv.fr
    //   3. body.commune    — city name string → pass through (France Travail handles it poorly,
    //                        but better than nothing when no code is available)
    const directInsee = str(body.inseeCode);
    const rawCommune  = str(body.commune);
    const locationInput = directInsee || rawCommune;

    if (locationInput) {
      let inseeCode: string;

      if (directInsee) {
        // Frontend already resolved to INSEE — use directly, never re-query
        inseeCode = directInsee;
      } else if (/^\d{5}$/.test(rawCommune)) {
        // Looks like a postal code — resolve to INSEE
        inseeCode = (await resolveInseeCode(rawCommune)) ?? rawCommune;
      } else {
        // City name or other string — pass through as-is
        inseeCode = rawCommune;
      }

      params.set("commune", inseeCode);
      // France Travail requires distance when commune is set.
      // Omitting it causes a 400. Use 200 (API max) when the user chose "no limit".
      const dist = str(body.distance);
      params.set("distance", dist ?? "200");
      console.log(`[get-jobs] location: inseeCode=${directInsee || "—"} rawCommune=${rawCommune || "—"} → commune=${inseeCode} distance=${dist ?? "200"}`);
    }

    // Contract types mapping:
    //   typeContrat: CDI, CDD, MIS (intérim), LIB (freelance)
    //   natureContrat: E2 (apprentissage), FS (professionnalisation) → alternance
    //   Stage is not a standard France Travail typeContrat filter
    const TYPE_CONTRAT_MAP: Record<string, string> = {
      cdi: "CDI",
      cdd: "CDD",
      intérim: "MIS", interim: "MIS", mission: "MIS",
      freelance: "LIB", "indépendant": "LIB", independant: "LIB",
    };
    // Codes that go into natureContrat instead of typeContrat
    const NATURE_CONTRAT_MAP: Record<string, string> = {
      alternance: "E2,FS",
      apprentissage: "E2",
    };

    const contractsRaw: string[] = Array.isArray(body.contracts) ? body.contracts
      : body.contract ? [body.contract] : [];

    const typeCodes: string[] = [];
    const natureCodes: string[] = [];

    for (const c of contractsRaw) {
      const key = c.toLowerCase();
      if (key in NATURE_CONTRAT_MAP) {
        // Alternance → natureContrat (split comma values)
        NATURE_CONTRAT_MAP[key].split(",").forEach(n => natureCodes.push(n));
      } else if (key in TYPE_CONTRAT_MAP) {
        typeCodes.push(TYPE_CONTRAT_MAP[key]);
      } else if (key !== "stage") {
        // Unknown type passed through; skip "stage" (not supported by API)
        typeCodes.push(c.toUpperCase());
      }
    }

    if ([...new Set(typeCodes)].length > 0) {
      params.set("typeContrat", [...new Set(typeCodes)].join(","));
    }
    if ([...new Set(natureCodes)].length > 0) {
      params.set("natureContrat", [...new Set(natureCodes)].join(","));
    }

    // Experience: UI sends '0'–'4', API expects '1' (débutant), '2' (1-3 ans), '3' (3+ ans)
    const EXPERIENCE_MAP: Record<string, string> = {
      "0": "1", "1": "2", "2": "3", "3": "3", "4": "3",
    };
    const experiencesRaw = Array.isArray(body.experiences) ? body.experiences
      : body.experience ? [body.experience] : [];
    if (experiencesRaw.length > 0) {
      const apiVals = [...new Set(
        experiencesRaw.map((e: unknown) => EXPERIENCE_MAP[String(e)]).filter(Boolean)
      )].sort();
      if (apiVals.length > 0) params.set("experience", apiVals[0]); // most inclusive
    }

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
      console.error(`[get-jobs] Request URL was: ${url}`);
      return new Response(
        JSON.stringify({ data: { resultats: [] }, meta: { total: 0 }, warning: `api_error_${res.status}`, debug: text.slice(0, 300) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
