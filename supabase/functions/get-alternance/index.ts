import { corsHeaders } from "./cors.ts";

const LBA_API = "https://api.apprentissage.beta.gouv.fr/api/job/v1/search";
const PAGE_SIZE_DEFAULT = 20;

function str(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

// Normalise a job offer from the LBA "jobs" array into a consistent shape.
// The LBA API v1 may return different field names depending on result type
// (matcha offer vs LBB company). We try many aliases defensively.
function normaliseJob(job: Record<string, unknown>, idx: number) {
  // Nested sub-objects — try every known alias
  const company  = (job.company  ?? job.entreprise ?? job.employer ?? job.recruteur ?? {}) as Record<string, unknown>;
  const place    = (job.place    ?? job.lieu       ?? job.location ?? job.workplace  ?? job.address ?? job.adresse ?? {}) as Record<string, unknown>;
  const contract = (job.contract ?? job.contrat    ?? job.job      ?? {}) as Record<string, unknown>;
  const apply    = (job.apply    ?? job.candidature ?? job.contact ?? {}) as Record<string, unknown>;

  const id = str(job._id ?? job.id ?? job.ideaType) ?? `lba-${idx}`;

  // Title: many possible field names across LBA offer types
  const title = str(
    job.title ?? job.intitule ?? job.libelle ?? job.label ??
    (job.offer as Record<string, unknown>)?.title ??
    contract.romeDetails as string ??
    null
  ) ?? null;

  const desc = str(job.description ?? (job.offer as Record<string, unknown>)?.description) ?? "";

  const companyName = str(
    company.name ?? company.nom ?? company.enseigne ??
    company.label ?? company.raison_sociale ?? company.raisonSociale
  ) ?? "";
  const siret = str(company.siret) ?? "";

  const city    = str(place.city ?? place.ville ?? place.libelle ?? place.commune) ?? "";
  const zipcode = str(place.zipCode ?? place.codePostal ?? place.zip ?? place.cp) ?? "";
  const dept    = str(place.departementNumber ?? place.codeDepartement ?? place.departement) ?? "";
  const lat     = place.latitude  ?? place.lat  ?? null;
  const lon     = place.longitude ?? place.lon  ?? null;

  const contractType = str(
    contract.contractType ?? contract.typeContrat ??
    contract.nature ?? job.typeContrat ?? job.contractType
  ) ?? "Alternance";

  const duration = str(contract.duration ?? contract.duree ?? contract.dureeTravail) ?? "";

  const url = str(
    apply.url ?? apply.link ?? apply.lien ??
    job.url ?? job.lien ??
    (typeof job._id === "string" && job._id
      ? `https://labonnealternance.apprentissage.beta.gouv.fr/offre/${job._id}`
      : null)
  ) ?? "";

  const createdAt = str(job.createdAt ?? job.dateCreation ?? job.date) ?? "";
  const diploma   = str(job.diplomaLevel ?? job.niveauDiplome ?? job.niveau) ?? "";

  const romes: string[] = Array.isArray(job.romes) ? job.romes.map(String)
    : Array.isArray(job.rome) ? job.rome.map(String) : [];

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

// Normalise a recruiter/LBB company from the LBA "recruiters" array
function normaliseRecruiter(rec: Record<string, unknown>, idx: number) {
  const place  = (rec.place ?? rec.lieu ?? rec.address ?? {}) as Record<string, unknown>;
  const id     = str(rec._id ?? rec.id ?? rec.siret) ?? `lba-rec-${idx}`;
  const name   = str(rec.name ?? rec.nom ?? rec.enseigne ?? rec.raison_sociale) ?? "";

  return {
    id,
    name,
    siret: str(rec.siret) ?? "",
    naf: str(rec.naf ?? rec.nafCode ?? rec.activitePrincipale) ?? "",
    nafText: str(rec.nafLabel ?? rec.naf_text ?? rec.libelleActivite) ?? "",
    city: str(place.city ?? place.ville ?? rec.city) ?? "",
    zipcode: str(place.zipCode ?? place.codePostal ?? rec.zipcode) ?? "",
    lat: place.latitude ?? place.lat ?? rec.lat ?? null,
    lon: place.longitude ?? place.lon ?? rec.lon ?? null,
    distance: typeof rec.distance === "number" ? rec.distance : null,
    stars: typeof rec.stars === "number" ? rec.stars
         : typeof rec.score_alternance === "number" ? rec.score_alternance : 0,
    url: str(rec.url ?? rec.lien ?? (id
      ? `https://labonnealternance.apprentissage.beta.gouv.fr/recherche-apprentissage?siret=${rec.siret ?? id}`
      : null)) ?? "",
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
      _debug: rawJobs.length > 0 ? { firstRawJob: rawJobs[0], firstNormalisedJob: pagedJobs[0] } : null,
    });

  } catch (err) {
    console.error("[get-alternance] unhandled error:", err);
    return respond({ jobs: [], recruiters: [], total: 0, warning: "server_error" });
  }
});
