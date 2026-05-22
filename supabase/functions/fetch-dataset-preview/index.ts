// fetch-dataset-preview v1.0
// Fetches records + field metadata from DARES or Parcoursup Explore API v2.1
// and returns a chart suggestion (type, axes) for the frontend.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const BASES: Record<string, string> = {
  dares: "https://data.dares.travail-emploi.gouv.fr/api/explore/v2.1/catalog/datasets",
  parcoursup: "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets",
};

interface Field {
  name: string;
  type: string;
  label: string;
}

interface ChartSuggestion {
  type: "bar" | "line" | "pie";
  x_field: string;
  y_fields: string[];
  x_label: string;
  y_labels: string[];
}

interface Preview {
  fields: Field[];
  records: Record<string, unknown>[];
  total: number;
  chart: ChartSuggestion | null;
}

const NUMERIC_TYPES = new Set(["int", "double", "float", "decimal", "long", "number"]);
const TIME_NAMES = /annee|year|date|trimestre|mois|periode|an$/i;
const CAT_NAMES = /region|secteur|type|categorie|filiere|domaine|code_naf|libelle|famille|metier|departement|pays|sexe|diplome|niveau/i;

function suggestChart(fields: Field[], records: Record<string, unknown>[]): ChartSuggestion | null {
  if (fields.length === 0 || records.length === 0) return null;

  const timeFields = fields.filter(
    (f) => f.type === "date" || f.type === "datetime" || TIME_NAMES.test(f.name),
  );
  const numericFields = fields.filter(
    (f) => NUMERIC_TYPES.has(f.type) && !timeFields.some((t) => t.name === f.name),
  );
  const categoryFields = fields.filter(
    (f) => f.type === "text" && CAT_NAMES.test(f.name) && !timeFields.some((t) => t.name === f.name),
  );

  // Time-series → line chart
  if (timeFields.length > 0 && numericFields.length > 0) {
    const yFields = numericFields.slice(0, 3);
    return {
      type: "line",
      x_field: timeFields[0].name,
      y_fields: yFields.map((f) => f.name),
      x_label: timeFields[0].label,
      y_labels: yFields.map((f) => f.label),
    };
  }

  // Categorical → bar chart
  if (categoryFields.length > 0 && numericFields.length > 0) {
    const yFields = numericFields.slice(0, 2);
    return {
      type: "bar",
      x_field: categoryFields[0].name,
      y_fields: yFields.map((f) => f.name),
      x_label: categoryFields[0].label,
      y_labels: yFields.map((f) => f.label),
    };
  }

  // Fallback: first text field + first numeric
  const textField = fields.find((f) => f.type === "text");
  if (textField && numericFields.length > 0) {
    return {
      type: "bar",
      x_field: textField.name,
      y_fields: [numericFields[0].name],
      x_label: textField.label,
      y_labels: [numericFields[0].label],
    };
  }

  return null;
}

function isSimpleValue(v: unknown): boolean {
  return v === null || typeof v !== "object" || v instanceof Date;
}

async function fetchPreview(source: string, datasetId: string): Promise<Preview> {
  const base = BASES[source];
  if (!base) throw new Error(`Unknown source: ${source}`);

  // ── Fetch field definitions ──────────────────────────────────────────────
  const metaRes = await fetch(`${base}/${datasetId}?lang=fr`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });

  if (!metaRes.ok) throw new Error(`Meta fetch failed: ${metaRes.status}`);
  const meta = await metaRes.json();

  const rawFields: Record<string, unknown>[] = Array.isArray(meta?.fields) ? meta.fields : [];
  const fields: Field[] = rawFields
    .filter((f) => isSimpleValue(f.type)) // skip geo/object types
    .map((f) => ({
      name: String(f.name ?? ""),
      type: String(f.type ?? "text").toLowerCase(),
      label: String(f.label ?? f.name ?? ""),
    }))
    .filter((f) => f.name);

  // ── Fetch records ────────────────────────────────────────────────────────
  // Try to sort by a time field for better chart data
  const timeField = fields.find((f) => f.type === "date" || f.type === "datetime" || TIME_NAMES.test(f.name));
  const orderBy = timeField ? `${timeField.name}%20asc` : "";
  const recordsUrl = `${base}/${datasetId}/records?limit=50&lang=fr${orderBy ? `&order_by=${orderBy}` : ""}`;

  const recordsRes = await fetch(recordsUrl, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!recordsRes.ok) throw new Error(`Records fetch failed: ${recordsRes.status}`);
  const recordsData = await recordsRes.json();

  // Keep only simple (non-nested) values per record
  const records: Record<string, unknown>[] = (Array.isArray(recordsData?.results) ? recordsData.results : [])
    .map((row: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        if (isSimpleValue(v)) cleaned[k] = v;
      }
      return cleaned;
    });

  const chart = suggestChart(fields, records);
  console.log(`[preview] ${source}/${datasetId} → ${records.length} records, chart=${chart?.type ?? "none"}`);

  return { fields, records, total: recordsData?.total_count ?? records.length, chart };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });

  try {
    const params = req.method === "GET"
      ? Object.fromEntries(new URL(req.url).searchParams)
      : await req.json().catch(() => ({}));

    const source = String(params.source ?? "").trim().toLowerCase();
    const datasetId = String(params.dataset_id ?? "").trim();

    if (!source || !datasetId) {
      return respond({ success: false, error: "source and dataset_id are required" }, 400);
    }
    if (!BASES[source]) {
      return respond({ success: false, error: `Unknown source: ${source}` }, 400);
    }

    const preview = await fetchPreview(source, datasetId);
    return respond({ success: true, ...preview });
  } catch (err) {
    console.error("[preview] error:", err);
    return respond({ success: false, error: String(err) }, 500);
  }
});
