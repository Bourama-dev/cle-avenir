// fetch-news-feeds v1.2
// Aggregates news from French employment/career public sources (RSS + JSON APIs).
// No API keys needed — all sources are freely accessible.
// Items from structured APIs (DARES, data.gouv.fr, Parcoursup) are marked
// is_internal=true so the frontend routes them to an internal detail page.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  link: string;           // internal /actualites/:id OR external https://
  is_internal: boolean;   // true → Link, false → <a target="_blank">
  external_url?: string;  // original source for "Voir la source" button
  source: string;
  source_logo: string;
  category: string;
  published_at: string;
  // Extended fields (filled for structured API items)
  full_description?: string;
  keywords?: string[];
  publisher?: string;
  license?: string;
  records_count?: number;
  theme?: string[];
}

const RSS_SOURCES = [
  {
    url: "https://travail-emploi.gouv.fr/actualites/presse/rss",
    name: "Ministère du Travail",
    category: "emploi",
    logo: "🏛️",
  },
  {
    url: "https://dares.travail-emploi.gouv.fr/publications/rss",
    name: "DARES",
    category: "marche-travail",
    logo: "📊",
  },
  {
    url: "https://www.economie.gouv.fr/rss",
    name: "Min. Économie & Finances",
    category: "economie",
    logo: "📈",
  },
  {
    url: "https://www.onisep.fr/rss",
    name: "ONISEP",
    category: "orientation",
    logo: "🎓",
  },
  {
    url: "https://www.centre-inffo.fr/spip.php?page=backend",
    name: "Centre Inffo",
    category: "formation",
    logo: "📚",
  },
];

function extractTag(content: string, tag: string): string {
  const cdataRe = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
    "i",
  );
  const m = content.match(cdataRe);
  if (m?.[1]?.trim()) return m[1].trim();

  const plainRe = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i");
  const m2 = content.match(plainRe);
  if (m2?.[1]?.trim()) return m2[1].trim();

  return "";
}

function extractLink(content: string): string {
  const atom = content.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (atom?.[1]) return atom[1];
  const rss = extractTag(content, "link");
  if (rss) return rss;
  const guid = extractTag(content, "guid");
  if (guid?.startsWith("http")) return guid;
  return "";
}

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRSS(xml: string, source: string, logo: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const title = stripHTML(extractTag(block, "title"));
    const link = extractLink(block);
    const description = stripHTML(
      extractTag(block, "description") || extractTag(block, "summary"),
    ).slice(0, 350);
    const pubDateRaw =
      extractTag(block, "pubDate") ||
      extractTag(block, "dc:date") ||
      extractTag(block, "published") ||
      extractTag(block, "updated");

    if (!title || !link) continue;

    let published_at: string;
    try {
      published_at = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();
    } catch {
      published_at = new Date().toISOString();
    }

    items.push({
      id: btoa(encodeURIComponent(link)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) +
          Math.random().toString(36).slice(2, 6),
      title,
      excerpt: description,
      link,           // external article URL
      is_internal: false,
      source,
      source_logo: logo,
      category,
      published_at,
    });
  }

  return items;
}

async function fetchRSS(src: { url: string; name: string; category: string; logo: string }): Promise<NewsItem[]> {
  try {
    const res = await fetch(src.url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "CleAvenir/1.0 NewsAggregator (+https://cleavenir.com)",
      },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.warn(`[news] ${src.name} → HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const items = parseRSS(xml, src.name, src.logo, src.category);
    console.log(`[news] ${src.name} → ${items.length} items`);
    return items.slice(0, 8);
  } catch (e) {
    console.warn(`[news] ${src.name} failed:`, (e as Error).message);
    return [];
  }
}

// DARES Explore API v2 — internal detail page
async function fetchDARES(): Promise<NewsItem[]> {
  try {
    const url =
      "https://data.dares.travail-emploi.gouv.fr/api/explore/v2.1/catalog/datasets?limit=6&order_by=modified%20desc&lang=fr";
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const datasets: Record<string, unknown>[] = Array.isArray(data?.results) ? data.results : [];

    return datasets.map((d) => {
      const meta = (d.metas as Record<string, Record<string, unknown>>)?.default ?? {};
      const datasetId = String(d.dataset_id ?? "");
      const id = `dares_${datasetId.slice(0, 30)}`;
      const fullDesc = stripHTML(String(meta.description ?? ""));
      const keywords = Array.isArray(meta.keyword) ? (meta.keyword as string[]) : [];
      const theme = Array.isArray(meta.theme) ? (meta.theme as string[]) : [];

      return {
        id,
        title: String(meta.title ?? "Statistiques DARES"),
        excerpt: fullDesc.slice(0, 300),
        link: `/actualites/${id}`,
        is_internal: true,
        external_url: `https://data.dares.travail-emploi.gouv.fr/explore/dataset/${datasetId}/information/`,
        source: "DARES",
        source_logo: "📊",
        category: "marche-travail",
        published_at: String(meta.modified ?? new Date().toISOString()),
        full_description: fullDesc,
        keywords,
        theme,
        publisher: String(meta.publisher ?? "DARES — Ministère du Travail"),
        license: String(meta.license ?? "Licence Ouverte v2.0"),
        records_count: typeof meta.records_count === "number" ? meta.records_count : undefined,
      };
    });
  } catch (e) {
    console.warn("[news] DARES failed:", (e as Error).message);
    return [];
  }
}

// data.gouv.fr — internal detail page
async function fetchDataGouv(): Promise<NewsItem[]> {
  try {
    const url =
      "https://www.data.gouv.fr/api/1/datasets/?tag=emploi&sort=-created_at&page_size=6";
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const datasets: Record<string, unknown>[] = Array.isArray(data?.data) ? data.data : [];

    return datasets.map((d) => {
      const id = `datagouv_${String(d.id ?? "").slice(0, 20)}`;
      const fullDesc = stripHTML(String(d.description ?? ""));
      const tags: string[] = Array.isArray(d.tags) ? (d.tags as string[]) : [];
      const org = (d.organization as Record<string, unknown> | null)?.name;

      return {
        id,
        title: String(d.title ?? "Dataset emploi"),
        excerpt: fullDesc.slice(0, 300),
        link: `/actualites/${id}`,
        is_internal: true,
        external_url: `https://www.data.gouv.fr/fr/datasets/${d.slug ?? d.id}/`,
        source: "data.gouv.fr",
        source_logo: "🗃️",
        category: "open-data",
        published_at: String(d.created_at ?? new Date().toISOString()),
        full_description: fullDesc,
        keywords: tags.slice(0, 8),
        publisher: org ? String(org) : "data.gouv.fr",
        license: String((d.license as string | undefined) ?? "Licence Ouverte"),
      };
    });
  } catch (e) {
    console.warn("[news] data.gouv.fr failed:", (e as Error).message);
    return [];
  }
}

// Parcoursup / MESRI — internal detail page
async function fetchParcoursupStats(): Promise<NewsItem[]> {
  try {
    const url =
      "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets?where=publisher%3D%22MESRI%22&limit=4&order_by=modified%20desc&lang=fr";
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const datasets: Record<string, unknown>[] = Array.isArray(data?.results) ? data.results : [];

    return datasets.map((d) => {
      const meta = (d.metas as Record<string, Record<string, unknown>>)?.default ?? {};
      const datasetId = String(d.dataset_id ?? "");
      const id = `psup_${datasetId.slice(0, 30)}`;
      const fullDesc = stripHTML(String(meta.description ?? ""));
      const keywords = Array.isArray(meta.keyword) ? (meta.keyword as string[]) : [];
      const theme = Array.isArray(meta.theme) ? (meta.theme as string[]) : [];

      return {
        id,
        title: String(meta.title ?? "Données enseignement supérieur"),
        excerpt: fullDesc.slice(0, 300),
        link: `/actualites/${id}`,
        is_internal: true,
        external_url: `https://data.enseignementsup-recherche.gouv.fr/explore/dataset/${datasetId}/`,
        source: "MESRI / Parcoursup",
        source_logo: "🎓",
        category: "formation",
        published_at: String(meta.modified ?? new Date().toISOString()),
        full_description: fullDesc,
        keywords,
        theme,
        publisher: "Ministère de l'Enseignement Supérieur (MESRI)",
        license: String(meta.license ?? "Licence Ouverte v2.0"),
        records_count: typeof meta.records_count === "number" ? meta.records_count : undefined,
      };
    });
  } catch (e) {
    console.warn("[news] Parcoursup stats failed:", (e as Error).message);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
    });

  try {
    const settled = await Promise.allSettled([
      ...RSS_SOURCES.map(fetchRSS),
      fetchDARES(),
      fetchDataGouv(),
      fetchParcoursupStats(),
    ]);

    const allItems: NewsItem[] = [];
    for (const r of settled) {
      if (r.status === "fulfilled") allItems.push(...r.value);
    }

    allItems.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );

    const seen = new Set<string>();
    const deduped = allItems.filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    console.log(`[news] returning ${deduped.length} items`);

    return respond({
      success: true,
      items: deduped,
      total: deduped.length,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[news] unhandled error:", err);
    return respond({ success: false, error: "server_error", items: [], total: 0 }, 500);
  }
});
