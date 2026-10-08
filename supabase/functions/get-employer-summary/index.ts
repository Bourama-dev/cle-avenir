import { corsHeaders } from "./cors.ts";

// France Travail — Synthèse des pages employeur (API partenaire)
// Scopes required: pages-employeurs-synthese api_synthese-pages-employeursv1
// Doc: https://francetravail.io/produits-partages/catalogue/synthese-pages-employeurs/documentation
//
// Actions (POST body):
//   { sirets: string[], sirens?: string[] }  -> employer summaries for those companies
//   { featured: true, where?: "75 92", codesNaf?: string[], limit?: number } -> highlighted employers
//   { logo: { idRCE: string, type: "LOGO_ENTREPRISE" | "LOGO_ETABLISSEMENT" } } -> { dataUrl }

const API = "https://api.francetravail.io/partenaire/synthese-pages-employeurs/v1";
const AUTH_URL = "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire";
const SCOPE = "pages-employeurs-synthese api_synthese-pages-employeursv1";
// "where" is mandatory on the search endpoint: when searching by SIRET/SIREN we cover every region.
const ALL_REGIONS = "r01 r02 r03 r04 r06 r11 r24 r27 r28 r32 r44 r52 r53 r75 r76 r84 r93 r94";

const TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();
let TOKEN: { token: string; expiresAt: number } | null = null;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const str = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};

const digits = (v: unknown, len: number): string | null => {
  const s = String(v ?? "").replace(/\s/g, "");
  return new RegExp(`^\\d{${len}}$`).test(s) ? s : null;
};

async function getToken(clientId: string, secret: string): Promise<string> {
  const now = Date.now();
  if (TOKEN && TOKEN.expiresAt > now + 10_000) return TOKEN.token;
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: secret,
      scope: SCOPE,
    }).toString(),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`auth ${res.status}: ${await res.text().catch(() => "")}`);
  const d = await res.json();
  if (!d.access_token) throw new Error("auth: no access_token");
  TOKEN = { token: d.access_token, expiresAt: now + Math.max(0, (d.expires_in ?? 1800) - 30) * 1000 };
  return TOKEN.token;
}

// deno-lint-ignore no-explicit-any
function normalise(r: any) {
  const p = r?.pageEmployeur ?? {};
  const entete = p.page?.entete ?? {};
  const employeur = p.employeur ?? null;
  const etab = p.etablissement ?? null;
  const sirenOrSiret = str(p.sirenOrSiret) ?? "";
  const isSiret = sirenOrSiret.length === 14;
  // deno-lint-ignore no-explicit-any
  const sirets: string[] = ((employeur?.etablissements ?? []) as any[]).map((e) => str(e.siret)).filter(Boolean) as string[];
  if (etab?.siret) sirets.push(String(etab.siret));
  return {
    siren: str(employeur?.siren) ?? (sirenOrSiret ? sirenOrSiret.slice(0, 9) : null),
    sirets,
    primary_siret: isSiret ? sirenOrSiret : null,
    name: str(entete.pageName),
    tagline: str(entete.accroche),
    naf: str(entete.naf) ?? str(etab?.naf),
    offers_count: typeof p.offresCount === "number" ? p.offresCount : 0,
    cover_image_id: str(entete.imageCouverture),
    id_rce: str(employeur?.idRCE) ?? str(etab?.idRCE),
    logo_type: isSiret ? "LOGO_ETABLISSEMENT" : "LOGO_ENTREPRISE",
    has_logo: Boolean(isSiret ? etab?.content?.logoUpdated : entete.logoUpdated),
    // deno-lint-ignore no-explicit-any
    url_path: ((p.urls ?? []) as any[]).find((u) => u?.actif)?.urlPath ?? null,
    city: str(etab?.adresse?.libelleDistributionPostale),
    zipcode: str(etab?.adresse?.codePostal),
    // visible establishments (hidden ones are masked on the employer page)
    // deno-lint-ignore no-explicit-any
    locations: ((employeur?.etablissements ?? []) as any[])
      .filter((e) => e?.content?.visibilite !== false)
      .map((e) => ({ city: str(e?.adresse?.libelleDistributionPostale), zipcode: str(e?.adresse?.codePostal) }))
      .filter((l) => l.city)
      .slice(0, 100),
  };
}

type Employer = ReturnType<typeof normalise>;

async function search(token: string, endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 204) return { pageEmployeurResults: [] };
  if (!res.ok) throw new Error(`search ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const clientId = Deno.env.get("FRANCE_TRAVAIL_CLIENT_ID") ?? Deno.env.get("POLE_EMPLOI_CLIENT_ID");
    const clientSecret = Deno.env.get("FRANCE_TRAVAIL_SECRET") ?? Deno.env.get("POLE_EMPLOI_CLIENT_SECRET");
    if (!clientId || !clientSecret) return json({ employers: [], warning: "credentials_missing" });

    let token: string;
    try {
      token = await getToken(clientId, clientSecret);
    } catch (e) {
      console.error("[get-employer-summary] auth error:", e);
      return json({ employers: [], warning: "auth_failed" });
    }

    // ── Logo ────────────────────────────────────────────────────────────────
    if (body.logo) {
      const idRCE = str(body.logo.idRCE);
      const type = body.logo.type === "LOGO_ETABLISSEMENT" ? "LOGO_ETABLISSEMENT" : "LOGO_ENTREPRISE";
      if (!idRCE || !/^[\w#-]{1,200}$/.test(idRCE)) return json({ dataUrl: null, warning: "invalid_id" }, 400);
      const ck = `logo:${type}:${idRCE}`;
      const hit = cache.get(ck);
      if (hit && Date.now() - hit.at < TTL_MS * 6) return json({ dataUrl: hit.value });
      const res = await fetch(`${API}/logo-employeur/${encodeURIComponent(idRCE)}?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        cache.set(ck, { at: Date.now(), value: null });
        return json({ dataUrl: null });
      }
      const mime = res.headers.get("content-type")?.split(";")[0] ?? "image/webp";
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (bytes.length < 100) {
        cache.set(ck, { at: Date.now(), value: null });
        return json({ dataUrl: null });
      }
      let bin = "";
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      const dataUrl = `data:${mime};base64,${btoa(bin)}`;
      cache.set(ck, { at: Date.now(), value: dataUrl });
      return json({ dataUrl });
    }

    // ── Featured employers (mise en avant) ──────────────────────────────────
    if (body.featured) {
      const limit = Math.min(Math.max(Number(body.limit) || 6, 1), 20);
      const payload: Record<string, unknown> = {
        where: str(body.where) ?? ALL_REGIONS,
        minOffres: Math.max(Number(body.minOffres) || 3, 1),
        minNbMots: true,
        pageNumber: 1,
        pageMaxSize: limit,
      };
      if (Array.isArray(body.codesNaf) && body.codesNaf.length) payload.codesNaf = body.codesNaf.slice(0, 20);
      const ck = `featured:${JSON.stringify(payload)}`;
      const hit = cache.get(ck);
      if (hit && Date.now() - hit.at < TTL_MS) return json({ employers: hit.value });
      const data = await search(token, "/page-employeur/recherche/mise-en-avant", payload);
      const employers = (data.pageEmployeurResults ?? []).map(normalise).filter((e: Employer) => e.name);
      cache.set(ck, { at: Date.now(), value: employers });
      return json({ employers, total: data.totalResults ?? employers.length });
    }

    // ── Lookup by SIRET / SIREN ─────────────────────────────────────────────
    const sirets = [...new Set(
      (Array.isArray(body.sirets) ? body.sirets : []).map((s: unknown) => digits(s, 14)).filter(Boolean),
    )] as string[];
    const sirens = [...new Set([
      ...(Array.isArray(body.sirens) ? body.sirens : []).map((s: unknown) => digits(s, 9)),
      ...sirets.map((s) => s.slice(0, 9)),
    ].filter(Boolean))] as string[];
    if (!sirets.length && !sirens.length) return json({ employers: [], warning: "no_identifier" }, 400);

    const fresh = (s: string) => {
      const c = cache.get(`siren:${s}`);
      return c && Date.now() - c.at < TTL_MS;
    };
    const missing = sirens.filter((s) => !fresh(s));
    for (let i = 0; i < missing.length; i += 100) {
      const chunk = missing.slice(i, i + 100);
      const data = await search(token, "/page-employeur/recherche", {
        where: ALL_REGIONS,
        sirens: chunk,
        pageNumber: 1,
        pageMaxSize: 100,
      });
      const found = new Map<string, Employer>();
      for (const r of data.pageEmployeurResults ?? []) {
        const n = normalise(r);
        if (n.siren && n.name) found.set(n.siren, n);
      }
      for (const s of chunk) cache.set(`siren:${s}`, { at: Date.now(), value: found.get(s) ?? null });
    }

    const employers = sirens
      .map((s) => cache.get(`siren:${s}`)?.value as Employer | null | undefined)
      .filter(Boolean);
    return json({ employers });
  } catch (err) {
    console.error("[get-employer-summary] unhandled error:", err);
    return json({ employers: [], warning: "server_error" });
  }
});
