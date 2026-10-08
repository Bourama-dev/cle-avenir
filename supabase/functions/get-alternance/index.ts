import { corsHeaders } from "./cors.ts";

const LBA_API = "https://api.apprentissage.beta.gouv.fr/api/job/v1/search";
const PAGE_SIZE_DEFAULT = 20;

function str(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

type Obj = Record<string, unknown>;

// The current LBA API nests the employer under `workplace` (siret, name, location.address, geopoint, domain.naf).
// Addresses come as a single line, e.g. "322 RUE DES PYRENEES 75020 PARIS".
function parseAddress(workplace: Obj): { city: string; zipcode: string; lat: number | null; lon: number | null } {
  const loc = (workplace.location ?? {}) as Obj;
  const address = str(loc.address) ?? "";
  const m = address.match(/\b(\d{5})\s+(.+)$/);
  const coords = ((loc.geopoint ?? {}) as Obj).coordinates;
  const [lon, lat] = Array.isArray(coords) ? coords.map(Number) : [NaN, NaN];
  return {
    zipcode: m ? m[1] : "",
    city: m ? m[2].trim() : "",
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
  };
}

// Normalise a job offer from the LBA "jobs" array into a consistent shape.
// The LBA API v1 may return different field names depending on result type
// (matcha offer vs LBB company). We try many aliases defensively.
function normaliseJob(job: Record<string, unknown>, idx: number) {
  // Nested sub-objects — try every known alias
  const workplace = (job.workplace ?? {}) as Obj;
  const offer     = (job.offer ?? {}) as Obj;
  const company  = (job.company  ?? job.entreprise ?? job.employer ?? job.recruteur ?? workplace) as Record<string, unknown>;
  const place    = (job.place    ?? job.lieu       ?? job.location ?? job.address ?? job.adresse ?? {}) as Record<string, unknown>;
  const wpAddr   = parseAddress(workplace);
  const contract = (job.contract ?? job.contrat    ?? job.job      ?? {}) as Record<string, unknown>;
  const apply    = (job.apply    ?? job.candidature ?? job.contact ?? {}) as Record<string, unknown>;

  const id = str(job._id ?? job.id ?? (job.identifier as Obj | undefined)?.id ?? job.ideaType) ?? `lba-${idx}`;

  // Title: many possible field names across LBA offer types
  const title = str(
    job.title ?? job.intitule ?? job.libelle ?? job.label ??
    (job.offer as Record<string, unknown>)?.title ??
    contract.romeDetails as string ??
    null
  ) ?? null;

  const desc = str(job.description ?? (job.offer as Record<string, unknown>)?.description) ?? "";

  const companyName = str(
    company.brand ?? company.name ?? company.nom ?? company.enseigne ?? company.legal_name ??
    company.label ?? company.raison_sociale ?? company.raisonSociale
  ) ?? "";
  const siret = str(company.siret) ?? "";

  const city    = str(place.city ?? place.ville ?? place.libelle ?? place.commune) ?? wpAddr.city;
  const zipcode = str(place.zipCode ?? place.codePostal ?? place.zip ?? place.cp) ?? wpAddr.zipcode;
  const dept    = str(place.departementNumber ?? place.codeDepartement ?? place.departement) ?? (zipcode ? zipcode.slice(0, 2) : "");
  const lat     = place.latitude  ?? place.lat  ?? wpAddr.lat;
  const lon     = place.longitude ?? place.lon  ?? wpAddr.lon;

  const contractType = str(
    contract.contractType ?? contract.typeContrat ??
    contract.nature ?? job.typeContrat ?? job.contractType ??
    (Array.isArray(contract.type) ? contract.type.join(", ") : null)
  ) ?? "Alternance";

  const durationRaw = contract.duration ?? contract.duree ?? contract.dureeTravail;
  const duration = typeof durationRaw === "number" ? `${durationRaw} mois` : (str(durationRaw) ?? "");

  const url = str(
    apply.url ?? apply.link ?? apply.lien ??
    job.url ?? job.lien ??
    (typeof job._id === "string" && job._id
      ? `https://labonnealternance.apprentissage.beta.gouv.fr/offre/${job._id}`
      : null)
  ) ?? "";

  const createdAt = str(job.createdAt ?? job.dateCreation ?? job.date ?? (offer.publication as Obj | undefined)?.creation) ?? "";
  const diploma   = str(job.diplomaLevel ?? job.niveauDiplome ?? job.niveau ?? (offer.target_diploma as Obj | undefined)?.label) ?? "";

  const romes: string[] = Array.isArray(job.romes) ? job.romes.map(String)
    : Array.isArray(job.rome) ? job.rome.map(String)
    : Array.isArray(offer.rome_codes) ? (offer.rome_codes as unknown[]).map(String) : [];

  // Use company name in fallback title so cards are more informative than just "Offre en alternance"
  const displayTitle = title ?? (companyName ? `Offre en alternance — ${companyName}` : "Offre en alternance");

  return {
    id,
    title: displayTitle,
    description: desc,
    company: { name: companyName, siret },
    location: { city, zipcode, departement: dept, lat, lon },
    contractType,
    duration,
    diplomaLevel: diploma,
    romes,
    url,
    createdAt,
    source: "lba",
  };
}

// Normalise a recruiter/LBB company from the LBA "recruiters" array.
// CompanyCard expects: name, naf_text, stars, city, zipcode, distance, headcount_text, url
function normaliseRecruiter(rec: Record<string, unknown>, idx: number) {
  const workplace = (rec.workplace ?? {}) as Obj;
  const wpAddr  = parseAddress(workplace);
  const wpNaf   = (((workplace.domain ?? {}) as Obj).naf ?? {}) as Obj;
  const place   = (rec.place ?? rec.lieu ?? rec.address ?? rec.adresse ?? {}) as Record<string, unknown>;
  const contact = (rec.contact ?? rec.contacts ?? {}) as Record<string, unknown>;

  const id   = str(rec._id ?? rec.id ?? (rec.identifier as Obj | undefined)?.id ?? rec.siret ?? workplace.siret) ?? `lba-rec-${idx}`;
  const name = str(
    workplace.brand ?? workplace.name ?? workplace.legal_name ??
    rec.name ?? rec.nom ?? rec.enseigne ?? rec.raison_sociale ?? rec.raisonSociale ??
    rec.company_name ?? rec.companyName
  ) ?? "";

  const siret = str(rec.siret ?? workplace.siret) ?? "";
  const naf   = str(rec.naf ?? rec.nafCode ?? rec.code_naf ?? rec.activitePrincipale ?? wpNaf.code) ?? "";
  const naf_text = str(
    rec.nafLabel ?? rec.naf_text ?? rec.nafText ?? rec.libelleActivite ??
    rec.secteur ?? rec.secteurActivite ?? wpNaf.label
  ) ?? "";

  const city    = str(place.city ?? place.ville ?? place.commune ?? rec.city ?? rec.ville) ?? wpAddr.city;
  const zipcode = str(place.zipCode ?? place.codePostal ?? place.zip ?? rec.zipcode ?? rec.codePostal) ?? wpAddr.zipcode;
  const lat  = place.latitude  ?? place.lat  ?? rec.lat  ?? wpAddr.lat;
  const lon  = place.longitude ?? place.lon  ?? rec.lon  ?? wpAddr.lon;
  const dist = typeof rec.distance === "number" ? rec.distance : null;

  const stars = typeof rec.stars === "number" ? rec.stars
    : typeof rec.score_alternance === "number" ? rec.score_alternance
    : typeof rec.scoring_alternance === "number" ? rec.scoring_alternance
    : 0;

  const headcount_text = str(rec.headcount_text ?? rec.trancheEffectif ?? rec.headcount ?? workplace.size) ?? "";

  const url = str(
    rec.url ?? rec.lien ?? contact.url ??
    (siret ? `https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage?siret=${siret}` : null)
  ) ?? "";

  return {
    id, name, siret, naf, naf_text,
    city, zipcode, lat, lon,
    distance: dist, stars, headcount_text, url,
    source: "lba_recruiter",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json();

    const apiKey =
      Deno.env.get("LBA_API_KEY") ??
      Deno.env.get("APPRENTISSAGE_API_KEY");

    if (!apiKey) {
      return respond({ jobs: [], recruiters: [], total: 0, warning: "api_key_missing" });
    }

    const lat = Number(body.latitude ?? body.lat);
    const lon = Number(body.longitude ?? body.lon);
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return respond({ jobs: [], recruiters: [], total: 0, warning: "location_required" });
    }

    const radius  = Number(body.radius ?? body.distance ?? 30);
    const romes   = str(body.romes);
    const page    = Math.max(1, Number(body.page) || 1);
    const limit   = Math.min(Math.max(Number(body.limit) || PAGE_SIZE_DEFAULT, 1), 100);

    const params = new URLSearchParams({
      latitude:  String(lat),
      longitude: String(lon),
      radius:    String(Math.min(radius, 200)),
      caller:    "cle-avenir",
    });
    if (romes) params.set("romes", romes);

    const url = `${LBA_API}?${params.toString()}`;
    console.log(`[get-alternance] GET ${url}`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status === 401 || res.status === 403) {
      const text = await res.text().catch(() => "");
      console.error(`[get-alternance] auth error ${res.status}: ${text}`);
      return respond({ jobs: [], recruiters: [], total: 0, warning: "auth_failed" });
    }

    if (res.status === 204) {
      return respond({ jobs: [], recruiters: [], total: 0 });
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[get-alternance] API error ${res.status}: ${text}`);
      return respond({ jobs: [], recruiters: [], total: 0, warning: `api_error_${res.status}` });
    }

    const data = await res.json() as Record<string, unknown>;

    // Response may be { jobs: [...], recruiters: [...] }
    // or nested { jobs: { results: [...] }, recruiters: [...] }
    let rawJobs: unknown[] = [];
    if (Array.isArray(data.jobs)) {
      rawJobs = data.jobs;
    } else if (data.jobs && typeof data.jobs === "object") {
      const jobsObj = data.jobs as Record<string, unknown>;
      rawJobs = [
        ...(Array.isArray(jobsObj.results) ? jobsObj.results : []),
        ...(Array.isArray(jobsObj.lbbCompanies) ? jobsObj.lbbCompanies : []),
        ...(Array.isArray(jobsObj.partnerJobs) ? jobsObj.partnerJobs : []),
      ];
    }
    const rawRecruiters: unknown[] = Array.isArray(data.recruiters) ? data.recruiters : [];

    // Debug: log raw structure of first item to diagnose field mapping issues
    if (rawJobs.length > 0) {
      console.log('[get-alternance] First raw job keys:', Object.keys(rawJobs[0] as Record<string, unknown>).join(', '));
      console.log('[get-alternance] First raw job sample:', JSON.stringify(rawJobs[0]).slice(0, 800));
    }

    const allJobs = rawJobs.map((j, i) => normaliseJob(j as Record<string, unknown>, i));
    const allRecruiters = rawRecruiters.map((r, i) => normaliseRecruiter(r as Record<string, unknown>, i));

    const total = allJobs.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const pagedJobs = allJobs.slice(start, start + limit);

    console.log(`[get-alternance] OK: ${allJobs.length} jobs, ${allRecruiters.length} recruiters`);
    console.log(`[get-alternance] Sample normalised job:`, JSON.stringify(pagedJobs[0]).slice(0, 400));

    return respond({
      jobs: pagedJobs,
      recruiters: allRecruiters,
      total,
      totalPages,
      page,
      _debug: {
        firstRawJob: rawJobs[0] ?? null,
        firstNormalisedJob: pagedJobs[0] ?? null,
        firstRawRecruiter: rawRecruiters[0] ?? null,
        firstNormalisedRecruiter: allRecruiters[0] ?? null,
      },
    });

  } catch (err) {
    console.error("[get-alternance] unhandled error:", err);
    return respond({ jobs: [], recruiters: [], total: 0, warning: "server_error" });
  }
});
