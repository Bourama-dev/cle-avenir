import { corsHeaders } from "./cors.ts";

// Ministry of Education — fr-en-annuaire-education (no auth required)
const MEN_API =
  "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records";

type LyceeType = "general" | "technologique" | "professionnel" | "polyvalent" | "all";

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

function detectType(typeEtab: string): Exclude<LyceeType, "all"> {
  const t = typeEtab.toLowerCase();
  if (t.includes("professionnel") || t.includes("agricole")) return "professionnel";
  if (t.includes("polyvalent")) return "polyvalent";
  if (t.includes("technologique")) return "technologique";
  return "general";
}

function normaliseLycee(r: Record<string, unknown>) {
  const typeEtab = str(r.type_etablissement ?? "");
  const statutRaw = str(r.statut_public_prive ?? "").toLowerCase();
  const statut = statutRaw.includes("priv") ? ("prive" as const) : ("public" as const);
  const lat = r.latitude != null ? Number(r.latitude) : null;
  const lon = r.longitude != null ? Number(r.longitude) : null;

  return {
    id: str(r.identifiant_de_l_etablissement ?? r.numero_uai ?? ""),
    uai: str(r.identifiant_de_l_etablissement ?? r.numero_uai ?? ""),
    nom: str(r.nom_etablissement ?? r.appellation_officielle ?? ""),
    adresse: str(r.adresse_1 ?? r.adresse ?? ""),
    ville: str(r.nom_commune ?? r.libelle_commune ?? ""),
    code_postal: str(r.code_postal ?? ""),
    departement: str(r.libelle_departement ?? ""),
    code_departement: str(r.code_departement_insee ?? r.code_departement ?? ""),
    region: str(r.libelle_region ?? ""),
    type: detectType(typeEtab),
    statut,
    telephone: str(r.telephone ?? ""),
    email: str(r.mail ?? ""),
    url: str(r.web ?? ""),
    nombre_eleves: r.nombre_d_eleves != null ? Number(r.nombre_d_eleves) : null,
    coordonnees:
      lat != null && lon != null && !isNaN(lat) && !isNaN(lon)
        ? { lat, lon }
        : null,
    nature: typeEtab,
  };
}

async function queryMEN(params: {
  q: string;
  ville: string;
  departement: string;
  type: LyceeType;
  statut: string;
  limit: number;
  offset: number;
}) {
  const { q, ville, departement, type, statut, limit, offset } = params;

  const conditions: string[] = [];

  // ODSQL uses double-quoted string literals
  if (type === "professionnel") {
    conditions.push(`type_etablissement like "Lyc%professionnel%"`);
  } else if (type === "general") {
    conditions.push(
      `(type_etablissement = "Lycée" OR type_etablissement like "%général%" OR type_etablissement like "%technologique%")`,
    );
  } else if (type === "technologique") {
    conditions.push(
      `(type_etablissement like "%technologique%" OR type_etablissement = "Lycée")`,
    );
  } else {
    // All lycées — broad match
    conditions.push(`type_etablissement like "Lyc%"`);
  }

  if (statut === "public") conditions.push(`statut_public_prive = "Public"`);
  else if (statut === "prive") conditions.push(`statut_public_prive like "%riv%"`);

  // Location — accepts commune name, département name, or département code
  if (ville) {
    const safe = ville.replace(/"/g, "").toUpperCase();
    conditions.push(
      `(nom_commune like "%${safe}%" OR libelle_departement like "%${safe}%" OR code_departement_insee like "${safe}%")`,
    );
  }

  if (departement) {
    const safe = departement.replace(/"/g, "").toUpperCase();
    conditions.push(
      `(libelle_departement like "%${safe}%" OR code_departement_insee like "${safe}%")`,
    );
  }

  const whereClause = conditions.join(" AND ");

  // Build URL manually to avoid URLSearchParams double-encoding the % wildcard chars
  const base = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    lang: "fr",
    timezone: "Europe/Paris",
  });
  if (q) base.set("search", q);

  // Encode the WHERE clause ourselves — only encode what's strictly necessary
  // Use encodeURIComponent but then restore the % wildcards
  const encodedWhere = encodeURIComponent(whereClause);
  const url = `${MEN_API}?where=${encodedWhere}&${base}`;

  console.log(`[get-onisep-lycees] GET ${url}`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(14_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = `API ${res.status}: ${text.slice(0, 300)}`;
    console.error(`[get-onisep-lycees] ${msg}`);
    return { lycees: [], total: 0, warning: msg };
  }

  const data = await res.json() as Record<string, unknown>;
  const records = Array.isArray(data?.results)
    ? (data.results as Record<string, unknown>[])
    : [];
  const total = Number(data?.total_count ?? records.length);

  if (records.length > 0) {
    console.log(
      `[get-onisep-lycees] ${records.length} records / total ${total}. First keys: ${Object.keys(records[0]).join(", ")}`,
    );
  } else {
    console.warn(`[get-onisep-lycees] 0 records. URL was: ${url}`);
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
    const type = (["general", "technologique", "professionnel", "all"].includes(rawType)
      ? rawType
      : "all") as LyceeType;
    const statut = str(body.statut ?? "all").toLowerCase();
    const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 50);
    const offset = Math.max(Number(body.offset) || 0, 0);

    const result = await queryMEN({ q, ville, departement, type, statut, limit, offset });

    return respond(result);
  } catch (err) {
    console.error("[get-onisep-lycees] error:", err);
    return respond({ lycees: [], total: 0, warning: String(err) });
  }
});
