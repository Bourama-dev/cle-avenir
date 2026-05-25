// v1.3 — replace broken Catalogue Apprentissage with Parcoursup alternance search
import { corsHeaders } from "./cors.ts";

const PARCOURSUP_API =
  "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/records";

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
function isAlternanceFili(fili: string): boolean {
  const t = fili.toLowerCase();
  return (
    t.includes("apprentissage") ||
    t.includes("alternance") ||
    t.includes("contrat pro") ||
    t.includes("professionnalisation")
  );
}

function normalizeParcoursup(r: Record<string, unknown>): Formation {
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

  const titleLower = title.toLowerCase();
  const isAlt = isAlternanceFili(fili) ||
    titleLower.includes("apprentissage") ||
    titleLower.includes("alternance");

  const source: Formation["source"] = isAlt ? "apprentissage" : "parcoursup";
  const tags = isAlt ? ["Alternance", "Apprentissage", "Parcoursup"] : ["Parcoursup"];

  return {
    id_formation: uai ? `psup_${uai}_${fili || "x"}` : slugId("psup", title),
    g_ea_lib_vx: etab,
    libelle_formation: title,
    description: buildPsupDesc(r, fili),
    ville,
    etablissements: [{ nom: etab, ville }],
    source,
    lien: lien || undefined,
    niveau: filiToNiveau(fili),
    tags,
  };
}

function filiToNiveau(f: string): string {
  const t = f.toUpperCase();
  if (t.includes("MASTER") || t.includes("ING")) return "BAC+5";
  if (t.includes("LICENCE") || t.includes("BUT") || t.includes("STAPS")) return "BAC+3";
  if (t.includes("BTS") || t.includes("CPGE") || t.includes("DEUST") || t.includes("DUT")) return "BAC+2";
  if (t.includes("CAP") || t.includes("BEP") || t.includes("BAC PRO") || t.includes("BREVET PRO")) return "CAP/BEP";
  if (t.includes("BAC") || t.includes("TERMINALE") || t.includes("MENTION COMPLEMENTAIRE")) return "BAC";
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

async function fetchParcoursup(params: { q: string; ville: string; limit: number; offset: number; extraSearch?: string }) {
  const { q, ville, limit, offset, extraSearch } = params;
  const sp = new URLSearchParams();
  sp.set("limit", String(Math.min(limit, 100)));
  sp.set("offset", String(offset));
  sp.set("lang", "fr");
  sp.set("timezone", "Europe/Paris");

  const searchTerm = extraSearch ? `${extraSearch}${q ? " " + q : ""}` : q;
  if (searchTerm) sp.set("search", searchTerm);
  // Parcoursup/Socrata LIKE is case-sensitive; commune_etab is stored in uppercase.
  if (ville) sp.set("where", `commune_etab like '%${ville.toUpperCase()}%'`);

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

    // Two parallel Parcoursup queries: general + alternance-specific
    const [general, alternance] = await Promise.allSettled([
      fetchParcoursup({ q, ville, limit: half, offset: halfOffset }),
      fetchParcoursup({ q, ville, limit: half, offset: halfOffset, extraSearch: "apprentissage alternance" }),
    ]);

    const generalData = general.status === "fulfilled" ? general.value : { results: [], total: 0 };
    const altData = alternance.status === "fulfilled" ? alternance.value : { results: [], total: 0 };

    if (general.status === "rejected") console.error("[psup-general] rejected", general.reason);
    if (alternance.status === "rejected") console.error("[psup-alt] rejected", alternance.reason);

    // Interleave so both types appear together
    const merged: Formation[] = [];
    const max = Math.max(generalData.results.length, altData.results.length);
    for (let i = 0; i < max; i++) {
      if (i < generalData.results.length) merged.push(generalData.results[i]);
      if (i < altData.results.length) merged.push(altData.results[i]);
    }

    const seen = new Set<string>();
    const deduped = merged.filter(f => {
      if (seen.has(f.id_formation)) return false;
      seen.add(f.id_formation);
      return true;
    });

    const altCount = deduped.filter(f => f.source === "apprentissage").length;
    console.log(`[parcoursup-api] OK — general:${generalData.results.length} alt:${altData.results.length} alternance_final:${altCount} total:${deduped.length}`);

    return json({
      success: true,
      results: deduped,
      total: generalData.total + altData.total,
      sources: { parcoursup: deduped.filter(f => f.source === "parcoursup").length, apprentissage: altCount },
    });

  } catch (err) {
    console.error("[parcoursup-api] unhandled", err);
    return json({ success: false, error: "server_error", results: [], total: 0 }, 500);
  }
});
