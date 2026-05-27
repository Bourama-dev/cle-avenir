import { corsHeaders } from "./cors.ts";

const MEN_API_BASE =
  "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets";

// Annuaire full-record fetch (to get all available fields for a UAI)
const ANNUAIRE =
  `${MEN_API_BASE}/fr-en-annuaire-education/records`;

// IDEO formations dataset (formations per school by UAI)
const IDEO_FORMATIONS =
  `${MEN_API_BASE}/fr-en-ideo-formations-lycees/records`;

function str(v: unknown): string {
  return v != null ? String(v).trim() : "";
}

// Extract specialties/filières from the raw annuaire record
function extractFromAnnuaire(r: Record<string, unknown>) {
  const fields: string[] = [];

  // Fields that might contain formation info in the annuaire dataset
  const candidates = [
    "secteurs_de_formation",
    "secteur_formations",
    "formations_dispensees",
    "libelle_formation",
    "liste_formations",
    "options",
    "secteur_lycee",
    "voies",
    "filiere",
  ];

  for (const key of candidates) {
    const val = r[key];
    if (!val) continue;
    if (Array.isArray(val)) {
      fields.push(...val.map((v) => String(v).trim()).filter(Boolean));
    } else if (typeof val === "string" && val.trim()) {
      // Sometimes values are comma/semicolon-separated lists
      const parts = val.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      fields.push(...parts);
    }
  }

  return [...new Set(fields)]; // deduplicate
}

// Normalise one record from the ideo-formations dataset
function normaliseIdeo(r: Record<string, unknown>): {
  libelle: string;
  diplome: string;
  code_specialite: string;
  niveau: string;
} | null {
  // Try several possible field name conventions
  const libelle =
    str(r.libelle_formation ?? r.libelle ?? r.denomination ?? r.nom_formation ?? "");
  const diplome =
    str(r.libelle_diplome ?? r.diplome ?? r.type_diplome ?? r.code_diplome ?? "");
  const code_specialite =
    str(r.code_specialite ?? r.code_formation ?? r.code ?? "");
  const niveau =
    str(r.libelle_niveau ?? r.niveau_diplome ?? r.niveau ?? "");

  if (!libelle && !diplome) return null;
  return { libelle, diplome, code_specialite, niveau };
}

// Fetch annuaire record for the UAI, extract any formation fields
async function fetchAnnuaireExtras(
  uai: string,
): Promise<{ formations: string[]; allFields: string[] }> {
  const where = encodeURIComponent(`identifiant_de_l_etablissement="${uai}"`);
  const url = `${ANNUAIRE}?where=${where}&limit=1&lang=fr`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { formations: [], allFields: [] };

    const data = await res.json() as Record<string, unknown>;
    const records = Array.isArray(data?.results)
      ? (data.results as Record<string, unknown>[])
      : [];
    if (records.length === 0) return { formations: [], allFields: [] };

    const r = records[0];
    const allFields = Object.keys(r);
    console.log(`[get-lycee-formations] annuaire fields: ${allFields.join(", ")}`);
    return { formations: extractFromAnnuaire(r), allFields };
  } catch {
    return { formations: [], allFields: [] };
  }
}

// Fetch from ideo-formations dataset by UAI
async function fetchIdeoFormations(
  uai: string,
): Promise<ReturnType<typeof normaliseIdeo>[]> {
  // Try multiple UAI field names the dataset might use
  const uaiFields = [
    `identifiant_de_l_etablissement="${uai}"`,
    `numero_uai="${uai}"`,
    `uai="${uai}"`,
    `code_uai="${uai}"`,
  ];

  for (const filter of uaiFields) {
    const where = encodeURIComponent(filter);
    const url = `${IDEO_FORMATIONS}?where=${where}&limit=100&lang=fr`;

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });

      if (res.status === 404) {
        console.warn("[get-lycee-formations] ideo dataset not found (404)");
        return [];
      }
      if (!res.ok) continue;

      const data = await res.json() as Record<string, unknown>;
      const records = Array.isArray(data?.results)
        ? (data.results as Record<string, unknown>[])
        : [];

      if (records.length > 0) {
        console.log(
          `[get-lycee-formations] ideo: ${records.length} formations. Keys: ${Object.keys(records[0]).join(", ")}`,
        );
        return records.map(normaliseIdeo).filter(Boolean) as ReturnType<
          typeof normaliseIdeo
        >[];
      }
    } catch {
      continue;
    }
  }

  return [];
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
    if (!uai) return respond({ formations: [], extras: [], error: "uai required" }, 400);

    // Run both fetches in parallel
    const [ideoFormations, annuaireExtras] = await Promise.all([
      fetchIdeoFormations(uai),
      fetchAnnuaireExtras(uai),
    ]);

    return respond({
      uai,
      formations: ideoFormations,
      extras: annuaireExtras.formations,
      available_fields: annuaireExtras.allFields,
    });
  } catch (err) {
    console.error("[get-lycee-formations] error:", err);
    return respond({ formations: [], extras: [], error: String(err) });
  }
});
