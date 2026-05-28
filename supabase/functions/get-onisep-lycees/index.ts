import { corsHeaders } from "./cors.ts";

// Ministry of Education — fr-en-annuaire-education (no auth required)
const MEN_API =
  "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records";

type LyceeType = "general" | "technologique" | "professionnel" | "polyvalent" | "all";

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

function detectType(typeEtab: string, nom = ""): Exclude<LyceeType, "all"> {
  const t = typeEtab.toLowerCase();
  const n = nom.toLowerCase();
  if (t.includes("professionnel") || t.includes("agricole")) return "professionnel";
  if (t.includes("polyvalent")) return "polyvalent";
  // "Lycée général et technologique" is the most common French type — classify as polyvalent
  const hasGeneral = t.includes("général") || t.includes("general");
  if (hasGeneral && t.includes("technologique")) return "polyvalent";
  if (t.includes("technologique")) return "technologique";
  if (n.includes("professionnel") || n.includes("agricole")) return "professionnel";
  if (n.includes("polyvalent")) return "polyvalent";
  if (n.includes("technologique") || n.includes("technique")) return "technologique";
  return "general";
}

function normaliseLycee(r: Record<string, unknown>) {
  const typeEtab = str(r.type_etablissement ?? "");
  const nom = str(r.nom_etablissement ?? r.appellation_officielle ?? "");
  const statutRaw = str(r.statut_public_prive ?? "").toLowerCase();
  const statut = statutRaw.includes("priv") ? ("prive" as const) : ("public" as const);
  const lat = r.latitude != null ? Number(r.latitude) : null;
  const lon = r.longitude != null ? Number(r.longitude) : null;

  return {
    id: str(r.identifiant_de_l_etablissement ?? r.numero_uai ?? ""),
    uai: str(r.identifiant_de_l_etablissement ?? r.numero_uai ?? ""),
    nom,
    adresse: str(r.adresse_1 ?? r.adresse ?? ""),
    ville: str(r.nom_commune ?? r.libelle_commune ?? ""),
    code_postal: str(r.code_postal ?? ""),
    departement: str(r.libelle_departement ?? ""),
    code_departement: str(r.code_departement ?? ""),
    region: str(r.libelle_region ?? ""),
    type: detectType(typeEtab, nom),
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

/**
 * Encode a WHERE clause for the OpenDataSoft API.
 * Unlike standard URL encoding, we preserve literal % wildcard characters
 * because the API's ODSQL engine expects them as raw % in the URL,
 * not as %25 (which would be treated as the literal string "%25").
 */
function encodeWhere(where: string): string {
  return encodeURIComponent(where).replace(/%25/g, "%");
}

// Strip characters that could cause ODSQL injection or encoding issues
function safeStr(s: string): string {
  return s.replace(/['"%;|]/g, "").trim();
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

  // Base + type filter : valeurs exactes, zéro wildcard %
  // "Lycée général et technologique" couvre la grande majorité des lycées français
  if (type === "professionnel") {
    conditions.push(`type_etablissement = 'Lycée professionnel'`);
  } else if (type === "general" || type === "technologique") {
    conditions.push(
      `(type_etablissement = 'Lycée général et technologique' OR type_etablissement = 'Lycée polyvalent')`,
    );
  } else {
    // type === "all"
    conditions.push(
      `(type_etablissement = 'Lycée général et technologique' OR type_etablissement = 'Lycée professionnel' OR type_etablissement = 'Lycée polyvalent')`,
    );
  }

  // Statut — valeur exacte, aucun wildcard %
  if (statut === "public") conditions.push(`statut_public_prive = 'Public'`);
  else if (statut === "prive") conditions.push(`NOT statut_public_prive = 'Public'`);

  // Location filters
  if (ville) {
    const safe = safeStr(ville).toUpperCase();
    if (safe) {
      conditions.push(
        `(nom_commune like '%${safe}%' OR libelle_departement like '%${safe}%')`,
      );
    }
  }

  if (departement) {
    const safe = safeStr(departement).toUpperCase();
    if (safe) {
      conditions.push(`libelle_departement like '%${safe}%'`);
    }
  }

  const whereClause = conditions.join(" AND ");

  const base = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    lang: "fr",
    timezone: "Europe/Paris",
  });
  if (q) base.set("search", q);

  // Preserve % as literal wildcard in URL (not encoded as %25)
  const encodedWhere = encodeWhere(whereClause);
  const url = `${MEN_API}?where=${encodedWhere}&${base}`;

  console.log(`[get-onisep-lycees] v13 GET ${url}`);

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
  const total = Number(data?.total_count ?? records.length);

  if (records.length > 0) {
    console.log(
      `[get-onisep-lycees] ${records.length} records / total ${total}. Keys: ${Object.keys(records[0]).join(", ")}`,
    );
  } else {
    console.warn(`[get-onisep-lycees] 0 records. total_count=${data?.total_count}. URL: ${url}`);
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
