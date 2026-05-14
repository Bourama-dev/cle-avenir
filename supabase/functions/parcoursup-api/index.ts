// v1.2 — field-name-safe build
import { corsHeaders } from "./cors.ts";

const PARCOURSUP_API =
  "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records";

const CATALOGUE_API =
  "https://catalogue-apprentissage.intercaricom.fr/api/v1/entity/formations";

interface Formation {
  id_formation: string;
  g_ea_lib_vx?: string;
  libelle_formation: string;
  description: string;
  ville: string;
  etablissements: { nom: string; ville: string; code_postal?: string }[];
  source: "parcoursup" | "apprentissage";
  lien?: string;
  niveau?: string;
  tags?: string[];
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function pick(record: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = str(record[k]);
    if (v) return v;
  }
  return "";
}

function slugId(prefix: string, s: string): string {
  return prefix + "_" + s.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
}

// ── Parcoursup ────────────────────────────────────────────────────────────────
function normalizeParcoursup(r: Record<string, unknown>): Formation {
  // Try every known field name variant for the formation title
  const title = pick(r,
    "lib_for_voe_ins",
    "form_lib_voe_acc",
    "libelle_formation",
    "intitule_formation",
    "g_ta_lib_vx",
    "lib_comp_voe_ins",
  ) || pick(r, "g_ea_lib_vx") || "Formation";

  const etab = pick(r, "g_ea_lib_vx", "etablissement", "nom_etablissement");
  const ville = pick(r, "commune_etab", "commune", "ville", "libelle_commune");
  const uai = str(r["cod_uai"]);
  const fili = pick(r, "fili", "filiere", "type_formation");
  const lien = pick(r, "lien_form_psup", "url", "lien");

  return {
    id_formation: uai ? `psup_${uai}_${fili || "x"}` : slugId("psup", title),
    g_ea_lib_vx: etab,
    libelle_formation: title,
    description: buildPsupDesc(r, fili),
    ville,
    etablissements: [{ nom: etab, ville }],
    source: "parcoursup",
    lien: lien || undefined,
    niveau: filiToNiveau(fili),
    tags: ["Parcoursup"],
  };
}

function filiToNiveau(f: string): string {
  const t = f.toUpperCase();
  if (t.includes("MASTER") || t.includes("ING")) return "BAC+5";
  if (t.includes("LICENCE") || t.includes("BUT") || t.includes("STAPS")) return "BAC+3";
  if (t.includes("BTS") || t.includes("CPGE") || t.includes("DEUST") || t.includes("DUT")) return "BAC+2";
  return "BAC+3";
}

function buildPsupDesc(r: Record<string, unknown>, fili: string): string {
  const parts: string[] = [];
  if (fili) parts.push(`Filière : ${fili}`);
  const dep = pick(r, "dep_lib", "departement");
  if (dep) parts.push(`Dép. : ${dep}`);
  const reg = pick(r, "reg_lib_affect", "region");
  if (reg && reg !== dep) parts.push(reg);
  return parts.join(" — ") || "Formation supérieure disponible sur Parcoursup.";
}

async function fetchParcoursup(params: { q: string; ville: string; limit: number; offset: number }) {
  const { q, ville, limit, offset } = params;
  const sp = new URLSearchParams();
  sp.set("limit", String(Math.min(limit, 100)));
  sp.set("offset", String(offset));
  sp.set("lang", "fr");
  sp.set("timezone", "Europe/Paris");

  // Use free-text search — avoids assuming specific field names
  if (q) sp.set("search", q);

  // City filter only if provided — commune_etab is a verified field
  if (ville) sp.set("where", `commune_etab like '%${ville}%'`);

  const url = `${PARCOURSUP_API}?${sp.toString()}`;
  console.log("[psup] GET", url);

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[psup] error", res.status, text.slice(0, 300));
      return { results: [], total: 0 };
    }
    const data = JSON.parse(text);
    const records: Record<string, unknown>[] = Array.isArray(data?.results) ? data.results : [];
    console.log("[psup] records", records.length, "total", data?.total_count);
    return { results: records.map(normalizeParcoursup), total: data?.total_count ?? records.length };
  } catch (e) {
    console.error("[psup] fetch failed", e);
    return { results: [], total: 0 };
  }
}

// ── Catalogue Apprentissage ───────────────────────────────────────────────────
function normalizeCatalogue(r: Record<string, unknown>): Formation {
  const id = pick(r, "_id", "id");
  const title = pick(r,
    "intitule_long",
    "intitule_court",
    "libelle_formation",
    "intitule",
  ) || "Formation en apprentissage";
  const etab = pick(r,
    "etablissement_gestionnaire_enseigne",
    "etablissement_gestionnaire_raison_sociale",
    "nom_organisme",
  ) || "CFA";
  const ville = pick(r,
    "lieu_formation_adresse_computed_city",
    "localite_responsable",
    "commune",
    "ville",
  );
  const cp = pick(r,
    "lieu_formation_adresse_computed_code_postal",
    "code_postal_responsable",
    "code_postal",
  );
  const niveau = euNiveau(pick(r, "niveau_entree_obligatoire", "niveau_sortie"));

  return {
    id_formation: id ? `app_${id}` : slugId("app", title + ville),
    libelle_formation: title,
    description: buildCatDesc(r),
    ville,
    etablissements: [{ nom: etab, ville, code_postal: cp }],
    source: "apprentissage",
    niveau,
    tags: ["Apprentissage", "Alternance"],
  };
}

function euNiveau(code: string): string {
  const m: Record<string, string> = { "3": "CAP/BEP", "4": "BAC", "5": "BAC+2", "6": "BAC+3", "7": "BAC+5", "8": "BAC+8" };
  return m[code] || "BAC+2";
}

function buildCatDesc(r: Record<string, unknown>): string {
  const parts: string[] = [];
  const rncp = pick(r, "rncp_intitule");
  if (rncp) parts.push(rncp);
  const duree = pick(r, "duree_incoterms", "duree");
  if (duree) parts.push(`Durée : ${duree}`);
  parts.push("Formation en apprentissage.");
  return parts.join(" — ");
}

async function fetchCatalogue(params: { q: string; ville: string; limit: number; offset: number }) {
  const { q, ville, limit, offset } = params;
  const query: Record<string, unknown> = { published: true };
  if (q) query["intitule_long"] = { $regex: q, $options: "i" };
  if (ville) query["lieu_formation_adresse_computed_city"] = { $regex: ville, $options: "i" };

  const page = Math.floor(offset / limit) + 1;
  const sp = new URLSearchParams();
  sp.set("query", JSON.stringify(query));
  sp.set("limit", String(Math.min(limit, 100)));
  sp.set("page", String(page));

  const url = `${CATALOGUE_API}?${sp.toString()}`;
  console.log("[cat] GET", url);

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[cat] error", res.status, text.slice(0, 300));
      return { results: [], total: 0 };
    }
    const data = JSON.parse(text);
    const records: Record<string, unknown>[] = Array.isArray(data?.formations) ? data.formations : [];
    console.log("[cat] records", records.length, "total", data?.pagination?.total);
    return { results: records.map(normalizeCatalogue), total: data?.pagination?.total ?? records.length };
  } catch (e) {
    console.error("[cat] fetch failed", e);
    return { results: [], total: 0 };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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

    if (action !== "formations") {
      return json({ success: false, error: `Unknown action: ${action}` }, 400);
    }

    const half = Math.ceil(limit / 2);
    const halfOffset = Math.floor(offset / 2);

    const [psup, cat] = await Promise.allSettled([
      fetchParcoursup({ q, ville, limit: half, offset: halfOffset }),
      fetchCatalogue({ q, ville, limit: half, offset: halfOffset }),
    ]);

    const psupData = psup.status === "fulfilled" ? psup.value : { results: [], total: 0 };
    const catData  = cat.status  === "fulfilled" ? cat.value  : { results: [], total: 0 };

    if (psup.status === "rejected") console.error("[psup] rejected", psup.reason);
    if (cat.status  === "rejected") console.error("[cat] rejected",  cat.reason);

    // Interleave so both sources appear together
    const merged: Formation[] = [];
    const max = Math.max(psupData.results.length, catData.results.length);
    for (let i = 0; i < max; i++) {
      if (i < psupData.results.length) merged.push(psupData.results[i]);
      if (i < catData.results.length)  merged.push(catData.results[i]);
    }

    const seen = new Set<string>();
    const deduped = merged.filter(f => {
      if (seen.has(f.id_formation)) return false;
      seen.add(f.id_formation);
      return true;
    });

    console.log(`[parcoursup-api] OK — psup:${psupData.results.length} cat:${catData.results.length} total:${deduped.length}`);

    return json({
      success: true,
      results: deduped,
      total: psupData.total + catData.total,
      sources: { parcoursup: psupData.results.length, apprentissage: catData.results.length },
    });

  } catch (err) {
    console.error("[parcoursup-api] unhandled", err);
    return json({ success: false, error: "server_error", results: [], total: 0 }, 500);
  }
});
