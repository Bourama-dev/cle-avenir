import { corsHeaders } from "./cors.ts";

// ONISEP — Idéo-Structures d'enseignement secondaire (open data, no auth required)
const ONISEP_API = "https://api.opendata.onisep.fr/api/1.0/dataset/5fa5816ac6a6e/search";

type LyceeType = "general" | "technologique" | "professionnel" | "polyvalent" | "all";

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

// Exact ONISEP facet values for type_detablissement
const TYPE_GENERAL = "lycée général, technologique ou polyvalent";
const TYPE_PROFESSIONNEL = "lycée professionnel";

function normaliseLycee(r: Record<string, unknown>) {
  const typeRaw = str(r.type_detablissement ?? "").toLowerCase();
  let type: Exclude<LyceeType, "all">;
  if (typeRaw.includes("professionnel") || typeRaw.includes("agricole")) type = "professionnel";
  else if (typeRaw.includes("polyvalent")) type = "polyvalent";
  else type = "general";

  const statutRaw = str(r.statut ?? "").toLowerCase();
  const statut = statutRaw === "public" ? ("public" as const) : ("prive" as const);

  const geoloc = r._geoloc as Record<string, number> | null;
  const lat = geoloc?.lat != null ? Number(geoloc.lat)
    : r.latitude_y != null ? Number(r.latitude_y) : null;
  const lon = geoloc?.lon != null ? Number(geoloc.lon)
    : r.longitude_x != null ? Number(r.longitude_x) : null;

  return {
    id: str(r.code_uai ?? ""),
    uai: str(r.code_uai ?? ""),
    nom: str(r.nom ?? ""),
    adresse: str(r.adresse ?? ""),
    ville: str(r.commune ?? ""),
    code_postal: str(r.cp ?? ""),
    departement: str(r.departement ?? ""),
    code_departement: "",
    region: str(r.region ?? ""),
    academie: str(r.academie ?? ""),
    type,
    statut,
    telephone: str(r.telephone ?? ""),
    email: "",
    url: str(r.url_et_id_onisep ?? ""),
    nombre_eleves: null,
    coordonnees: lat != null && lon != null && !isNaN(lat) && !isNaN(lon)
      ? { lat, lon }
      : null,
    nature: str(r.type_detablissement ?? ""),
    langues: str(r.langues_enseignees ?? ""),
    jpo: str(r.journees_portes_ouvertes ?? ""),
  };
}

async function queryONISEP(params: {
  q: string;
  ville: string;
  departement: string;
  type: LyceeType;
  statut: string;
  limit: number;
  offset: number;
}) {
  const { q, ville, departement, type, statut, limit, offset } = params;

  const urlParams = new URLSearchParams({
    size: String(limit),
    from: String(offset),
  });

  // Full-text search — combine user query + ville (ONISEP doesn't have a separate commune facet)
  const textSearch = [q, ville].filter(Boolean).join(" ");
  if (textSearch) urlParams.set("q", textSearch);

  // Type filter using exact ONISEP facet values
  // Multiple values for the same facet are ORed by the API
  if (type === "professionnel") {
    urlParams.append("facet.type_detablissement", TYPE_PROFESSIONNEL);
  } else if (type === "all") {
    urlParams.append("facet.type_detablissement", TYPE_GENERAL);
    urlParams.append("facet.type_detablissement", TYPE_PROFESSIONNEL);
  } else {
    // general, technologique, polyvalent → all map to the same ONISEP type
    urlParams.append("facet.type_detablissement", TYPE_GENERAL);
  }

  // Statut filter
  if (statut === "public") urlParams.append("facet.statut", "public");
  else if (statut === "prive") urlParams.append("facet.statut", "privé sous contrat");

  // Département filter (exact facet match)
  if (departement) urlParams.append("facet.departement", departement);

  const url = `${ONISEP_API}?${urlParams}`;
  console.log(`[get-onisep-lycees] v14 GET ${url}`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(14_000),
  });

  const responseText = await res.text().catch(() => "");

  if (!res.ok) {
    const msg = `API ${res.status}: ${responseText.slice(0, 300)}`;
    console.error(`[get-onisep-lycees] FAIL ${msg}`);
    return { lycees: [], total: 0, warning: msg };
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(responseText) as Record<string, unknown>;
  } catch (_e) {
    const msg = `JSON parse error: ${responseText.slice(0, 200)}`;
    console.error(`[get-onisep-lycees] ${msg}`);
    return { lycees: [], total: 0, warning: msg };
  }

  const records = Array.isArray(data?.results)
    ? (data.results as Record<string, unknown>[])
    : [];
  const total = Number(data?.total ?? records.length);

  if (records.length > 0) {
    console.log(
      `[get-onisep-lycees] ${records.length} records / total ${total}. Ex: "${str(records[0].nom)}" type="${str(records[0].type_detablissement)}"`,
    );
  } else {
    console.warn(`[get-onisep-lycees] 0 records. total=${data?.total}. URL: ${url}`);
  }

  return { lycees: records.map(normaliseLycee), total };
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

    const q = str(body.q);
    const ville = str(body.ville);
    const departement = str(body.departement);
    const rawType = str(body.type ?? body.typeFormation ?? "all").toLowerCase();
    const type = (["general", "technologique", "professionnel", "polyvalent", "all"].includes(rawType)
      ? rawType
      : "all") as LyceeType;
    const statut = str(body.statut ?? "all").toLowerCase();
    const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 50);
    const offset = Math.max(Number(body.offset) || 0, 0);

    const result = await queryONISEP({ q, ville, departement, type, statut, limit, offset });

    return respond(result);
  } catch (err) {
    console.error("[get-onisep-lycees] error:", err);
    return respond({ lycees: [], total: 0, warning: String(err) });
  }
});
