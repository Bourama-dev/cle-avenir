import { corsHeaders } from "./cors.ts";

// ─── API endpoints ────────────────────────────────────────────────────────────
const PARCOURSUP_API =
  "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records";

const CATALOGUE_API =
  "https://catalogue-apprentissage.intercaricom.fr/api/v1/entity/formations";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Formation {
  id_formation: string;
  g_ea_lib_vx?: string;
  libelle_formation: string;
  description: string;
  ville: string;
  etablissements: { nom: string; ville: string; code_postal?: string }[];
  source: "parcoursup" | "apprentissage";
  lien?: string;
  fili?: string;
  niveau?: string;
  tags?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function slugId(prefix: string, s: string): string {
  return prefix + "_" + s.replace(/\s+/g, "_").slice(0, 40);
}

// ─── Parcoursup normalization ─────────────────────────────────────────────────
function normalizeParcoursup(record: Record<string, unknown>): Formation {
  const etabNom = str(record["g_ea_lib_vx"]);
  const ville = str(record["commune_etab"]);
  const codeUai = str(record["cod_uai"]);
  const libFormation = str(record["lib_for_voe_ins"]) || str(record["g_ea_lib_vx"]) || "Formation";
  const fili = str(record["fili"]);

  return {
    id_formation: codeUai ? `psup_${codeUai}_${fili}` : slugId("psup", libFormation),
    g_ea_lib_vx: etabNom,
    libelle_formation: libFormation,
    description: buildParcoursupDescription(record),
    ville,
    etablissements: [{ nom: etabNom, ville }],
    source: "parcoursup",
    lien: str(record["lien_form_psup"]) || undefined,
    fili,
    niveau: filToNiveau(fili),
    tags: ["Parcoursup"],
  };
}

function filToNiveau(fili: string): string {
  const map: Record<string, string> = {
    "BTS": "BAC+2",
    "BUT": "BAC+3",
    "CPGE": "BAC+2",
    "LICENCE": "BAC+3",
    "DEUST": "BAC+2",
    "MASTER": "BAC+5",
    "ING": "BAC+5",
    "PACES": "BAC+1",
    "STAPS": "BAC+3",
    "DUT": "BAC+2",
  };
  for (const [key, val] of Object.entries(map)) {
    if (fili.toUpperCase().includes(key)) return val;
  }
  return "BAC+3";
}

function buildParcoursupDescription(r: Record<string, unknown>): string {
  const parts: string[] = [];
  const dep = str(r["dep_lib"]);
  const reg = str(r["reg_lib_affect"]);
  const fili = str(r["fili"]);
  if (fili) parts.push(`Filière : ${fili}`);
  if (dep) parts.push(`Département : ${dep}`);
  if (reg && reg !== dep) parts.push(`Région : ${reg}`);
  return parts.join(" — ") || "Formation supérieure disponible sur Parcoursup.";
}

// ─── Catalogue Apprentissage normalization ────────────────────────────────────
function normalizeCatalogue(record: Record<string, unknown>): Formation {
  const id = str(record["_id"]) || str(record["id"]);
  const intitule = str(record["intitule_long"]) || str(record["intitule_court"]) || "Formation en apprentissage";
  const etabNom =
    str(record["etablissement_gestionnaire_enseigne"]) ||
    str(record["etablissement_gestionnaire_raison_sociale"]) ||
    "CFA";
  const codePostal = str(record["lieu_formation_adresse_computed_code_postal"]) ||
    str(record["code_postal_responsable"]) || "";
  const ville =
    str(record["lieu_formation_adresse_computed_city"]) ||
    str(record["localite_responsable"]) ||
    str(record["commune"]) || "";
  const niveau = europeenToNiveau(str(record["niveau_entree_obligatoire"]));

  return {
    id_formation: id ? `app_${id}` : slugId("app", intitule + ville),
    libelle_formation: intitule,
    description: buildCatalogueDescription(record),
    ville,
    etablissements: [{ nom: etabNom, ville, code_postal: codePostal }],
    source: "apprentissage",
    niveau,
    tags: ["Apprentissage", "Alternance"],
  };
}

function europeenToNiveau(code: string): string {
  const map: Record<string, string> = {
    "3": "CAP/BEP",
    "4": "BAC",
    "5": "BAC+2",
    "6": "BAC+3",
    "7": "BAC+5",
    "8": "BAC+8",
  };
  return map[code] || "BAC+2";
}

function buildCatalogueDescription(r: Record<string, unknown>): string {
  const parts: string[] = [];
  const rncp = str(r["rncp_intitule"]);
  const diplome = str(r["diplome"]);
  const duree = str(r["duree_incoterms"]);
  if (rncp) parts.push(rncp);
  else if (diplome) parts.push(diplome);
  if (duree) parts.push(`Durée : ${duree}`);
  parts.push("Formation en apprentissage.");
  return parts.join(" — ");
}

// ─── Parcoursup fetch ─────────────────────────────────────────────────────────
async function fetchParcoursup(params: {
  q: string;
  ville: string;
  limit: number;
  offset: number;
}): Promise<{ results: Formation[]; total: number }> {
  const { q, ville, limit, offset } = params;

  const sp = new URLSearchParams();
  sp.set("select", "cod_uai,g_ea_lib_vx,lib_for_voe_ins,commune_etab,dep_lib,reg_lib_affect,fili,lien_form_psup");
  sp.set("limit", String(Math.min(limit, 100)));
  sp.set("offset", String(offset));
  sp.set("lang", "fr");

  const whereParts: string[] = [];
  if (q) {
    // Full-text search on formation name OR etablissement name
    whereParts.push(`(lib_for_voe_ins like '%${q}%' or g_ea_lib_vx like '%${q}%')`);
  }
  if (ville) {
    whereParts.push(`commune_etab like '%${ville}%'`);
  }
  if (whereParts.length) sp.set("where", whereParts.join(" and "));

  const url = `${PARCOURSUP_API}?${sp.toString()}`;
  console.log("[parcoursup-api] Parcoursup URL:", url);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    console.error("[parcoursup-api] Parcoursup error:", res.status, await res.text());
    return { results: [], total: 0 };
  }

  const data = await res.json();
  const records: Record<string, unknown>[] = Array.isArray(data?.results) ? data.results : [];
  const total: number = data?.total_count ?? records.length;

  return {
    results: records.map(normalizeParcoursup),
    total,
  };
}

// ─── Catalogue Apprentissage fetch ────────────────────────────────────────────
async function fetchCatalogue(params: {
  q: string;
  ville: string;
  limit: number;
  offset: number;
}): Promise<{ results: Formation[]; total: number }> {
  const { q, ville, limit, offset } = params;

  // Build MongoDB-style query
  const query: Record<string, unknown> = { published: true };
  if (q) {
    query["intitule_long"] = { $regex: q, $options: "i" };
  }
  if (ville) {
    query["lieu_formation_adresse_computed_city"] = { $regex: ville, $options: "i" };
  }

  const page = Math.floor(offset / limit) + 1;
  const sp = new URLSearchParams();
  sp.set("query", JSON.stringify(query));
  sp.set("limit", String(Math.min(limit, 100)));
  sp.set("page", String(page));

  const url = `${CATALOGUE_API}?${sp.toString()}`;
  console.log("[parcoursup-api] Catalogue URL:", url);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    console.error("[parcoursup-api] Catalogue error:", res.status, await res.text());
    return { results: [], total: 0 };
  }

  const data = await res.json();
  const records: Record<string, unknown>[] = Array.isArray(data?.formations) ? data.formations : [];
  const total: number = data?.pagination?.total ?? records.length;

  return {
    results: records.map(normalizeCatalogue),
    total,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json().catch(() => ({}));

    const action = str(body.action) || "formations";
    const q = str(body.q);
    const ville = str(body.ville);
    const limit = Math.min(Math.max(Number(body.limit) || 50, 1), 100);
    const offset = Math.max(Number(body.offset) || 0, 0);

    if (action === "formations") {
      // Fetch both sources in parallel; each gets half the limit
      const half = Math.ceil(limit / 2);

      const [psup, catalogue] = await Promise.allSettled([
        fetchParcoursup({ q, ville, limit: half, offset: Math.floor(offset / 2) }),
        fetchCatalogue({ q, ville, limit: half, offset: Math.floor(offset / 2) }),
      ]);

      const psupData = psup.status === "fulfilled" ? psup.value : { results: [], total: 0 };
      const catData = catalogue.status === "fulfilled" ? catalogue.value : { results: [], total: 0 };

      if (psup.status === "rejected") console.error("[parcoursup-api] Parcoursup failed:", psup.reason);
      if (catalogue.status === "rejected") console.error("[parcoursup-api] Catalogue failed:", catalogue.reason);

      // Interleave results (parcoursup, apprentissage, parcoursup, apprentissage…)
      const merged: Formation[] = [];
      const maxLen = Math.max(psupData.results.length, catData.results.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < psupData.results.length) merged.push(psupData.results[i]);
        if (i < catData.results.length) merged.push(catData.results[i]);
      }

      // Deduplicate by id
      const seen = new Set<string>();
      const deduped = merged.filter(f => {
        if (seen.has(f.id_formation)) return false;
        seen.add(f.id_formation);
        return true;
      });

      return json({
        success: true,
        results: deduped,
        total: (psupData.total + catData.total),
        sources: {
          parcoursup: psupData.results.length,
          apprentissage: catData.results.length,
        },
      });
    }

    // Unknown action
    return json({ success: false, error: `Unknown action: ${action}` }, 400);

  } catch (err) {
    console.error("[parcoursup-api] Unhandled error:", err);
    return json({ success: false, error: "server_error", results: [], total: 0 }, 500);
  }
});
