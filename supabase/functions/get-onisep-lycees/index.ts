import { corsHeaders } from "./cors.ts";

// Ministry of Education API — fr-en-annuaire-education (no auth required)
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
  return "general"; // "Lycée" = lycée général et technologique (LGT)
}

function normaliseLycee(r: Record<string, unknown>) {
  // Correct field names for fr-en-annuaire-education dataset
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

  // Filter by lycée type using the correct type_etablissement field values
  if (type === "professionnel") {
    conditions.push("type_etablissement like 'Lyc%professionnel%'");
  } else if (type === "general") {
    // "Lycée" = LGT (général + technologique), excludes professional
    conditions.push(
      "(type_etablissement = 'Lycée' OR type_etablissement like '%général%' OR type_etablissement like '%technologique%')",
    );
  } else if (type === "technologique") {
    conditions.push(
      "(type_etablissement like '%technologique%' OR type_etablissement = 'Lycée')",
    );
  } else {
    // All lycées — broad match on "Lyc"
    conditions.push("type_etablissement like 'Lyc%'");
  }

  // Public/private filter
  if (statut === "public") conditions.push("statut_public_prive = 'Public'");
  else if (statut === "prive") conditions.push("statut_public_prive like '%riv%'");

  // City filter — dataset stores communes in various cases, use LIKE
  if (ville) {
    const safeVille = ville.replace(/'/g, "''").toUpperCase();
    conditions.push(`nom_commune like '%${safeVille}%'`);
  }

  // Department filter
  if (departement) {
    const safeDep = departement.replace(/'/g, "''").toUpperCase();
    conditions.push(
      `(libelle_departement like '%${safeDep}%' OR code_departement_insee like '${safeDep}%')`,
    );
  }

  const sp = new URLSearchParams({
    where: conditions.join(" AND "),
    limit: String(limit),
    offset: String(offset),
    lang: "fr",
    timezone: "Europe/Paris",
  });
  if (q) sp.set("search", q);

  const url = `${MEN_API}?${sp}`;
  console.log(`[get-onisep-lycees] GET ${url}`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[get-onisep-lycees] ${res.status}: ${text.slice(0, 400)}`);
    return { lycees: [], total: 0, warning: `api_error_${res.status}` as string };
  }

  const data = await res.json() as Record<string, unknown>;
  const records = Array.isArray(data?.results)
    ? (data.results as Record<string, unknown>[])
    : [];
  const total = Number(data?.total_count ?? records.length);

  // Log first record keys for debugging
  if (records.length > 0) {
    console.log(
      `[get-onisep-lycees] ${records.length} records / total ${total}. First keys: ${Object.keys(records[0]).join(", ")}`,
    );
  } else {
    console.warn("[get-onisep-lycees] 0 records returned.");
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
    return respond({ lycees: [], total: 0, warning: "server_error" });
  }
});
