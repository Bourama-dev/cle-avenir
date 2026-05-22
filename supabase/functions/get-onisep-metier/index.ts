import { corsHeaders } from "./cors.ts";

// ONISEP Ideo-Métiers open dataset — no authentication required.
// Dataset ID: 5fa591127f501  (Idéo-Métiers Onisep, >1 000 occupations)
const ONISEP_SEARCH = "https://api.opendata.onisep.fr/api/1.0/dataset/5fa591127f501/search";

function str(v: unknown): string {
  return (v != null && String(v).trim()) ? String(v).trim() : "";
}

// Normalise the raw result object — ONISEP field names vary by dataset version.
function normalise(raw: Record<string, unknown>) {
  const title =
    str(raw.libelle_metier ?? raw.libelle ?? raw.titre ?? raw["libellé métier"]);
  const url =
    str(raw.url_fiche_metier ?? raw.url ?? raw.lien ?? raw.url_fiche ?? raw["url fiche métier"]);
  const domain =
    str(raw.domaine ?? raw.domaine_sous_domaine ?? raw["domaine - sous-domaine"]);
  const subdomain = str(raw.sous_domaine ?? raw["sous-domaine"]);

  // ROME codes — may be a comma-separated string or a nested object
  let romes: Array<{ code: string; label: string; url: string }> = [];
  const rawRome = raw.rome ?? raw.code_rome ?? raw.rome_v3 ?? raw.codes_rome;
  if (rawRome && typeof rawRome === "object" && !Array.isArray(rawRome)) {
    // Nested object like { code: "M1805", libelle: "...", lien: "..." }
    const r = rawRome as Record<string, unknown>;
    romes = [{ code: str(r.code), label: str(r.libelle ?? r.label), url: str(r.lien ?? r.url) }];
  } else if (typeof rawRome === "string" && rawRome.trim()) {
    romes = rawRome.split(",").map((c) => ({ code: c.trim(), label: "", url: "" }));
  }

  return { title, url, domain, subdomain, romes };
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

    const q = String(body.q ?? body.title ?? body.libelle ?? "").trim();
    const romeCode = String(body.romeCode ?? body.rome ?? "").trim();

    if (!q && !romeCode) {
      return respond({ metier: null, warning: "q_or_romeCode_required" });
    }

    // Build search query — prefer ROME code for precision, fall back to title search
    const searchQ = romeCode || q;
    const params = new URLSearchParams({ q: searchQ, size: "5" });
    const url = `${ONISEP_SEARCH}?${params}`;
    console.log(`[get-onisep-metier] GET ${url}`);

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });

    if (res.status === 429) {
      return respond({ metier: null, warning: "rate_limited" });
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[get-onisep-metier] ${res.status}: ${text}`);
      return respond({ metier: null, warning: `api_error_${res.status}` });
    }

    const data = await res.json() as Record<string, unknown>;
    const results: unknown[] = Array.isArray(data.results) ? data.results
      : Array.isArray((data as Record<string, unknown[]>).data) ? (data as Record<string, unknown[]>).data
      : [];

    console.log(`[get-onisep-metier] ${results.length} results for "${searchQ}"`);

    if (results.length === 0) {
      return respond({ metier: null });
    }

    // If searched by ROME code, find exact match first
    let best = results[0] as Record<string, unknown>;
    if (romeCode) {
      const exact = results.find((r) => {
        const raw = r as Record<string, unknown>;
        const romeField = raw.rome ?? raw.code_rome ?? raw.rome_v3;
        if (typeof romeField === "string") return romeField.includes(romeCode);
        if (romeField && typeof romeField === "object") {
          return String((romeField as Record<string, unknown>).code ?? "").includes(romeCode);
        }
        return false;
      });
      if (exact) best = exact as Record<string, unknown>;
    }

    const metier = normalise(best);

    return respond({ metier, total: data.total ?? results.length });
  } catch (err) {
    console.error("[get-onisep-metier] error:", err);
    return respond({ metier: null, warning: "server_error" });
  }
});
