import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Calendar, Tag, Database,
  Building2, FileText, Hash, AlertCircle, Loader2, BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { newsService, CATEGORIES } from '@/services/newsService';
import { supabase } from '@/lib/customSupabaseClient';
import MetaTags from '@/components/SEO/MetaTags';
import './ActualitesDetailPage.css';

// ── Constants ────────────────────────────────────────────────────────────────
const CHART_COLORS = ['#6366f1', '#f43f5e', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'];

// ── HTML Sanitizer ───────────────────────────────────────────────────────────
const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'span', 'div', 'section',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
  'blockquote', 'code', 'pre',
]);

function cleanNode(node, doc) {
  if (node.nodeType === Node.TEXT_NODE) return;
  if (node.nodeType !== Node.ELEMENT_NODE) { node.remove(); return; }
  const tag = node.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) {
    const isBlock = ['div', 'section', 'article', 'main', 'aside', 'header', 'footer'].includes(tag);
    const replacement = doc.createElement(isBlock ? 'div' : 'span');
    while (node.firstChild) replacement.appendChild(node.firstChild);
    node.replaceWith(replacement);
    [...replacement.childNodes].forEach((c) => cleanNode(c, doc));
    return;
  }
  const allowed = tag === 'a' ? ['href', 'title'] : [];
  [...node.attributes].forEach((attr) => {
    if (!allowed.includes(attr.name)) {
      node.removeAttribute(attr.name);
    } else if (attr.name === 'href') {
      const val = attr.value.trim().toLowerCase();
      if (val.startsWith('javascript:') || val.startsWith('data:')) node.removeAttribute('href');
      else { node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener noreferrer'); }
    }
  });
  [...node.childNodes].forEach((c) => cleanNode(c, doc));
}

function sanitizeHTML(raw) {
  if (!raw) return '';
  if (!/<[a-z][\s\S]*?>/i.test(raw)) {
    return raw.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }
  const doc = new DOMParser().parseFromString(raw, 'text/html');
  [...doc.body.childNodes].forEach((n) => cleanNode(n, doc));
  return doc.body.innerHTML;
}

// ── Dataset info parser ──────────────────────────────────────────────────────
function getDatasetInfo(item) {
  if (!item?.is_internal || !item?.external_url) return null;
  const m = item.external_url.match(/explore\/dataset\/([^/?#]+)/);
  if (!m) return null;
  const datasetId = m[1];
  if (item.id.startsWith('dares_')) return { source: 'dares', datasetId };
  if (item.id.startsWith('psup_')) return { source: 'parcoursup', datasetId };
  return null;
}

// ── Number formatter ─────────────────────────────────────────────────────────
function fmtNum(val) {
  if (typeof val !== 'number' || isNaN(val)) return val;
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(1) + 'k';
  if (Math.abs(val) < 10) return val.toFixed(2);
  return val.toFixed(1);
}

function fmtDateNum(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return '—'; }
}

function fmtNumber(n) {
  if (!n) return null;
  return new Intl.NumberFormat('fr-FR').format(n);
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="flex justify-between gap-4">
          <span>{entry.name}</span>
          <span className="font-mono font-semibold">{fmtNum(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

// ── Chart section ─────────────────────────────────────────────────────────────
function ChartSection({ item }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const datasetInfo = useMemo(() => getDatasetInfo(item), [item]);

  useEffect(() => {
    if (!datasetInfo) { setLoading(false); return; }

    supabase.functions
      .invoke('fetch-dataset-preview', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: datasetInfo.source, dataset_id: datasetInfo.datasetId }),
      })
      .then(({ data, error: err }) => {
        if (err) throw err;
        if (!data?.success) throw new Error(data?.error || 'preview failed');
        setPreview(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [datasetInfo]);

  if (!datasetInfo) return null;

  if (loading) {
    return (
      <section>
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
          <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
          Visualisation des données
        </h2>
        <div className="h-64 rounded-2xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border-color)]" />
      </section>
    );
  }

  if (error || !preview?.chart) return null;

  const { chart, records, total } = preview;

  // Build Recharts-compatible data array
  const chartData = records
    .map((row) => {
      const xRaw = row[chart.x_field];
      const x = xRaw === null || xRaw === undefined ? '' : String(xRaw);
      if (!x) return null;
      const entry = { name: x };
      chart.y_fields.forEach((field, i) => {
        const label = chart.y_labels?.[i] || field;
        const raw = row[field];
        entry[label] = typeof raw === 'number' ? raw : parseFloat(String(raw)) || 0;
      });
      return entry;
    })
    .filter(Boolean);

  if (chartData.length === 0) return null;

  const isLine = chart.type === 'line';
  const ChartComponent = isLine ? LineChart : BarChart;
  const DataComponent = isLine ? Line : Bar;

  const tickFormatter = (val) => {
    const s = String(val);
    return s.length > 14 ? s.slice(0, 13) + '…' : s;
  };

  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-1">
        <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
        Visualisation des données
      </h2>
      <p className="text-xs text-[var(--text-secondary)] mb-4">
        {chartData.length} enregistrements affichés sur {fmtNumber(total) ?? total} — source : {item.source}
      </p>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 overflow-hidden">
        <ResponsiveContainer width="100%" height={320}>
          <ChartComponent data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickFormatter={tickFormatter}
              angle={chartData.length > 10 ? -40 : 0}
              textAnchor={chartData.length > 10 ? 'end' : 'middle'}
              interval={0}
              label={chart.x_label ? {
                value: chart.x_label,
                position: 'insideBottom',
                offset: -50,
                fontSize: 12,
                fill: 'var(--text-secondary)',
              } : undefined}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickFormatter={fmtNum}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {chart.y_fields.length > 1 && (
              <Legend
                verticalAlign="top"
                height={28}
                wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
              />
            )}
            {chart.y_fields.map((field, i) => {
              const label = chart.y_labels?.[i] || field;
              const color = CHART_COLORS[i % CHART_COLORS.length];
              if (isLine) {
                return (
                  <Line
                    key={field}
                    type="monotone"
                    dataKey={label}
                    stroke={color}
                    strokeWidth={2}
                    dot={chartData.length < 20}
                    activeDot={{ r: 5 }}
                  />
                );
              }
              return (
                <Bar key={field} dataKey={label} fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Meta card ─────────────────────────────────────────────────────────────────
function MetaCard({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ActualitesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    newsService.getAll().then(({ items }) => {
      const found = items.find((i) => i.id === id);
      if (found) setItem(found);
      else setNotFound(true);
      setLoading(false);
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const safeHTML = useMemo(
    () => (item?.full_description ? sanitizeHTML(item.full_description) : ''),
    [item?.full_description],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-secondary)] px-4 text-center">
        <AlertCircle className="w-12 h-12 text-[var(--text-secondary)] opacity-40" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Actualité introuvable</h2>
        <p className="text-[var(--text-secondary)]">Cet élément n'est plus disponible ou a expiré du cache (30 min).</p>
        <Button variant="outline" onClick={() => navigate('/actualites')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux actualités
        </Button>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === item.category);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <MetaTags
        title={`${item.title} | CléAvenir Actualités`}
        description={item.excerpt}
        url={`/actualites/${item.id}`}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <Link
          to="/actualites"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-400" />

          <div className="p-6 md:p-10 flex flex-col gap-7">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                <span className="text-xl">{item.source_logo}</span>
                {item.source}
              </span>
              {cat && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--color-primary)] border border-[var(--border-color)]">
                  {cat.emoji} {cat.label}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug">
              {item.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Calendar className="w-4 h-4" />
              Dernière mise à jour : <strong className="text-[var(--text-primary)]">{fmtDateNum(item.published_at)}</strong>
            </div>

            <hr className="border-[var(--border-color)]" />

            {/* ── Chart ── */}
            <ChartSection item={item} />

            {/* ── Description HTML ── */}
            {safeHTML && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
                  <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                  Description
                </h2>
                <div className="news-description" dangerouslySetInnerHTML={{ __html: safeHTML }} />
              </section>
            )}

            {/* ── Metadata grid ── */}
            {(item.publisher || item.license || item.records_count || item.theme?.length) && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
                  <Hash className="w-4 h-4 text-[var(--color-primary)]" />
                  Informations sur le jeu de données
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MetaCard icon={Building2} label="Éditeur" value={item.publisher} />
                  <MetaCard icon={FileText} label="Licence" value={item.license} />
                  <MetaCard
                    icon={Database}
                    label="Enregistrements"
                    value={fmtNumber(item.records_count) ? `${fmtNumber(item.records_count)} lignes` : null}
                  />
                  <MetaCard
                    icon={Hash}
                    label="Thème"
                    value={item.theme?.length ? item.theme.join(', ') : null}
                  />
                </div>
              </section>
            )}

            {/* ── Keywords ── */}
            {item.keywords?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-3">
                  <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                  Mots-clés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw) => (
                    <span key={kw} className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <hr className="border-[var(--border-color)]" />

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {item.external_url && (
                <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Accéder aux données brutes
                  </Button>
                </a>
              )}
              <Link to="/actualites">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voir toutes les actualités
                </Button>
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
