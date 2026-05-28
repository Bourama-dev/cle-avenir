import { corsHeaders } from "./cors.ts";

// ONISEP — Idéo-Actions de formation initiale-Univers lycée
const ONISEP_FORMATIONS_API =
  "https://api.opendata.onisep.fr/api/1.0/dataset/605340ddc19a9/search";

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

interface Formation {
  id: string;
  libelle: string;
  diplome: string;
  niveau: string;
  type: string;
  url_onisep: string;
  domaine: string;
}

function normaliseFormation(r: Record<string, unknown>): Formation | null {
  const libelle = str(r.formation_for_libelle ?? r.for_libelle ?? "");
  const diplome = str(r.for_nature_du_certificat ?? r.for_type ?? "");
  if (!libelle && !diplome) return null;

  return {
    id: str(r.action_de_formation_af_identifiant_onisep ?? r.af_identifiant_onisep ?? ""),
    libelle,
    diplome,
    niveau: str(r.for_niveau_de_sortie ?? ""),
    type: str(r.for_type ?? ""),
    url_onisep: str(r.for_url_et_id_onisep ?? ""),
    domaine: str(r.for_indexation_domaine_web_onisep ?? ""),
  };
}

async function fetchFormations(uai: string): Promise<{ formations: Formation[]; total: number }> {
  const urlParams = new URLSearchParams({ size: "100", from: "0" });
  urlParams.append("facet.ens_code_uai", uai);

  const url = `${ONISEP_FORMATIONS_API}?${urlParams}`;
  console.log(`[get-lycee-formations] v2 GET ${url}`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });

  const responseText = await res.text().catch(() => "");

  if (!res.ok) {
    const msg = `API ${res.status}: ${responseText.slice(0, 300)}`;
    console.error(`[get-lycee-formations] FAIL ${msg}`);
    return { formations: [], total: 0 };
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(responseText) as Record<string, unknown>;
  } catch (_e) {
    console.error(`[get-lycee-formations] JSON parse error`);
    return { formations: [], total: 0 };
  }

  const records = Array.isArray(data?.results)
    ? (data.results as Record<string, unknown>[])
    : [];
  const total = Number(data?.total ?? records.length);

  if (records.length > 0) {
    console.log(
      `[get-lycee-formations] ${records.length} formations / total ${total}. Keys: ${Object.keys(records[0]).join(", ")}`,
    );
  } else {
    console.warn(`[get-lycee-formations] 0 formations for UAI=${uai}`);
  }

  const formations = records
    .map(normaliseFormation)
    .filter((f): f is Formation => f !== null);

  return { formations, total };
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body =
      req.method === "GET"
        ? Object.fromEntries(new URL(req.url).searchParams.entries())
        : await req.json().catch(() => ({}));

    const uai = str(body.uai ?? "").toUpperCase();
    if (!uai) return respond({ formations: [], total: 0, error: "uai required" }, 400);

    const { formations, total } = await fetchFormations(uai);
    return respond({ uai, formations, total });
  } catch (err) {
    console.error("[get-lycee-formations] error:", err);
    return respond({ formations: [], total: 0, error: String(err) });
  }
});
