import { corsHeaders } from "./cors.ts";

// Ministry of Education API — complete establishment directory (no auth required)
const MEN_API =
  "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records";

// ONISEP Open Data API — same base used by get-onisep-metier
const ONISEP_BASE = "https://api.opendata.onisep.fr/api/1.0/dataset";
// Idéo-Formations dataset (lycée-level formations)
const ONISEP_FORMATIONS_ID = "5fa59e917f501";

type LyceeType = "general" | "technologique" | "professionnel" | "polyvalent" | "all";

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

function detectType(nature: string): Exclude<LyceeType, "all"> {
  const n = nature.toUpperCase();
  if (n.includes("PROFESSIONNEL")) return "professionnel";
  if (n.includes("GENERAL") && n.includes("TECHNOLOGIQUE")) return "polyvalent";
  if (n.includes("TECHNOLOGIQUE")) return "technologique";
  return "general";
}

function normaliseLycee(r: Record<string, unknown>) {
  // The dataset may use slightly different field names depending on the version
  const nature = str(r.nature_uai_libe ?? r.nature_uai ?? r.type_uai_libe);
  const nom = str(
    r.appellation_officielle ?? r.denomination_principale ?? r.denomination ?? r.nom,
  );
  const statut = str(r.secteur_public_prive_libe ?? r.secteur_prive_public ?? r.secteur)
    .toUpperCase()
    .includes("PRIV")
    ? ("prive" as const)
    : ("public" as const);

  const lat = r.coordonnee_y != null ? Number(r.coordonnee_y) : null;
  const lon = r.coordonnee_x != null ? Number(r.coordonnee_x) : null;
  // Some record variants embed geo in a nested "geo_point_2d" field
  const geo = r.geo_point_2d as Record<string, unknown> | null | undefined;

  return {
    id: str(r.numero_uai ?? r.uai),
    uai: str(r.numero_uai ?? r.uai),
    nom,
    adresse: str(r.adresse_uai ?? r.adresse),
    ville: str(r.libelle_commune ?? r.commune ?? r.libelle_commune_acheminement),
    code_postal: str(r.code_postal_uai ?? r.code_postal),
    departement: str(r.libelle_departement ?? r.departement),
    code_departement: str(r.code_departement ?? r.code_dep),
    region: str(r.libelle_region ?? r.region),
    type: detectType(nature),
    statut,
    telephone: str(r.numero_telephone_uai ?? r.telephone ?? r.tel),
    email: str(r.mail ?? r.email ?? r.adresse_mail),
    url: str(r.web ?? r.url_web ?? r.site_web ?? r.site),
    coordonnees:
      lat != null && lon != null && !isNaN(lat) && !isNaN(lon)
        ? { lat, lon }
        : geo?.lat != null && geo?.lon != null
        ? { lat: Number(geo.lat), lon: Number(geo.lon) }
        : null,
    nature,
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

  // Build OpenDataSoft SQL-like WHERE clause
  const conditions: string[] = ["nature_uai_libe like '%LYCEE%'"];

  if (type === "professionnel") {
    conditions.push("nature_uai_libe like '%PROFESSIONNEL%'");
  } else if (type === "general") {
    // Includes LGT (général + techno) and pure général; excludes professional
    conditions.push("NOT nature_uai_libe like '%PROFESSIONNEL%'");
  } else if (type === "technologique") {
    conditions.push("nature_uai_libe like '%TECHNOLOGIQUE%'");
  }

  if (statut === "public") {
    conditions.push("secteur_public_prive_libe like '%PUBLIC%'");
  } else if (statut === "prive") {
    conditions.push("secteur_public_prive_libe like '%PRIVE%'");
  }

  const safeVille = ville.replace(/'/g, "''").toUpperCase();
  const safeDep = departement.replace(/'/g, "''").toUpperCase();

  if (safeVille) conditions.push(`libelle_commune like '%${safeVille}%'`);
  if (safeDep) {
    conditions.push(
      `(libelle_departement like '%${safeDep}%' OR code_departement like '%${safeDep}%')`,
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
  console.log(`[get-onisep-lycees] MEN GET ${url}`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[get-onisep-lycees] MEN ${res.status}: ${text.slice(0, 300)}`);
    return { lycees: [], total: 0, warning: `men_api_${res.status}` as string };
  }

  const data = await res.json() as Record<string, unknown>;
  const records = Array.isArray(data?.results)
    ? (data.results as Record<string, unknown>[])
    : [];
  const total = Number(data?.total_count ?? records.length);

  return { lycees: records.map(normaliseLycee), total };
}

// Attempt to enrich with ONISEP formation data for a single lycée
async function enrichWithOnisep(lyceeNom: string): Promise<string[]> {
  try {
    const url =
      `${ONISEP_BASE}/${ONISEP_FORMATIONS_ID}/search?q=${encodeURIComponent(lyceeNom)}&size=8`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return [];
    const data = await res.json() as Record<string, unknown>;
    const results = Array.isArray(data?.results)
      ? (data.results as Record<string, unknown>[])
      : [];
    return results
      .map((r) =>
        str(r.libelle ?? r.libelle_formation ?? r.titre ?? r["libellé formation"])
      )
      .filter(Boolean)
      .slice(0, 6);
  } catch {
    return [];
  }
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
    const enrich = body.enrich === true || body.enrich === "true"; // opt-in ONISEP enrichment

    const result = await queryMEN({ q, ville, departement, type, statut, limit, offset });

    // Optional: enrich first result with ONISEP formation data (single lycée lookup)
    if (enrich && result.lycees.length > 0) {
      const firstNom = result.lycees[0].nom;
      const formations = await enrichWithOnisep(firstNom);
      (result.lycees[0] as Record<string, unknown>).formations_onisep = formations;
    }

    console.log(
      `[get-onisep-lycees] OK — ${result.lycees.length} lycées (total: ${result.total})`,
    );
    return respond(result);
  } catch (err) {
    console.error("[get-onisep-lycees] error:", err);
    return respond({ lycees: [], total: 0, warning: "server_error" });
  }
});
