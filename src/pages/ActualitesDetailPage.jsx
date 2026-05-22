import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, AlertCircle, Loader2, BarChart2,
  TrendingUp, TrendingDown, Calendar, Tag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { newsService, CATEGORIES } from '@/services/newsService';
import { supabase } from '@/lib/customSupabaseClient';
import MetaTags from '@/components/SEO/MetaTags';
import './ActualitesDetailPage.css';

// ── Category hero gradients ───────────────────────────────────────────────────
const CATEGORY_STYLES = {
  'marche-travail': { from: '#1d4ed8', to: '#3730a3', accent: '#3b82f6' },
  'orientation':    { from: '#6d28d9', to: '#4c1d95', accent: '#8b5cf6' },
  'formation':      { from: '#047857', to: '#065f46', accent: '#10b981' },
  'emploi':         { from: '#be123c', to: '#881337', accent: '#f43f5e' },
  'economie':       { from: '#b45309', to: '#78350f', accent: '#f59e0b' },
  'open-data':      { from: '#334155', to: '#0f172a', accent: '#64748b' },
};
const DEFAULT_STYLE = { from: '#4f46e5', to: '#3730a3', accent: '#6366f1' };

const CHART_COLORS = ['#6366f1', '#f43f5e', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'];

// ── Per-article embedded chart configs ───────────────────────────────────────
const ARTICLE_CHARTS = {
  curated_chomage_2026_q1: {
    type: 'line',
    title: 'Évolution du taux de chômage au sens du BIT (%)',
    xKey: 'name',
    series: [
      { key: 'France hors Mayotte', color: '#3b82f6' },
      { key: 'France métro.', color: '#6366f1' },
    ],
    data: [
      { name: 'T1 24', 'France hors Mayotte': 7.5, 'France métro.': 7.2 },
      { name: 'T2 24', 'France hors Mayotte': 7.3, 'France métro.': 7.1 },
      { name: 'T3 24', 'France hors Mayotte': 7.4, 'France métro.': 7.2 },
      { name: 'T4 24', 'France hors Mayotte': 7.3, 'France métro.': 7.1 },
      { name: 'T1 25', 'France hors Mayotte': 7.4, 'France métro.': 7.2 },
      { name: 'T2 25', 'France hors Mayotte': 7.6, 'France métro.': 7.4 },
      { name: 'T3 25', 'France hors Mayotte': 7.7, 'France métro.': 7.5 },
      { name: 'T4 25', 'France hors Mayotte': 7.9, 'France métro.': 7.7 },
      { name: 'T1 26', 'France hors Mayotte': 8.1, 'France métro.': 7.9 },
    ],
  },
  curated_bmo_metiers_2026: {
    type: 'bar_h',
    title: 'Top 9 métiers — projets de recrutement 2026 (milliers)',
    xKey: 'name',
    series: [{ key: 'projets', color: '#f43f5e' }],
    data: [
      { name: 'Cuisiniers', projets: 51.6 },
      { name: 'Employés libre-service', projets: 59.9 },
      { name: 'Aides-soignants', projets: 62.1 },
      { name: 'Aides à domicile', projets: 69.5 },
      { name: 'Agents entretien', projets: 80.9 },
      { name: 'Ouvriers agricoles', projets: 82.0 },
      { name: 'Viticulteurs', projets: 83.8 },
      { name: 'Serveurs', projets: 93.8 },
      { name: 'Aides de cuisine', projets: 97.1 },
    ],
  },
  curated_cpf_2026: {
    type: 'bar',
    title: 'Plafonds de prise en charge CPF 2026 (€)',
    xKey: 'name',
    series: [{ key: 'plafond', color: '#10b981' }],
    data: [
      { name: 'Reste à charge', plafond: 150 },
      { name: 'Permis légers', plafond: 900 },
      { name: 'Certifications RS', plafond: 1500 },
      { name: 'Bilan de compétences', plafond: 1600 },
    ],
  },
  curated_voie_pro_2026: {
    type: 'bar',
    title: 'Montée en charge des certificats de spécialisation Bac+1',
    xKey: 'name',
    series: [{ key: 'places', color: '#8b5cf6' }],
    data: [
      { name: 'Rentrée 2026', places: 10000 },
      { name: 'Objectif 2027', places: 15000 },
      { name: 'Objectif final', places: 20000 },
    ],
  },
};

// ── Number helpers ────────────────────────────────────────────────────────────
function fmtNum(val, decimals) {
  if (typeof val !== 'number' || isNaN(val)) return '—';
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + ' M';
  if (Math.abs(val) >= 1_000) return new Intl.NumberFormat('fr-FR').format(Math.round(val));
  if (decimals !== undefined) return val.toFixed(decimals);
  return Math.abs(val) < 10 ? val.toFixed(2) : val.toFixed(1);
}

function fmtCell(val) {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'number') return fmtNum(val);
  return String(val);
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return '—'; }
}

function tickShort(val) {
  const s = String(val ?? '');
  return s.length > 12 ? s.slice(0, 11) + '…' : s;
}

// ── HTML sanitizer ────────────────────────────────────────────────────────────
function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') return '';
  try {
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc || !doc.body) return html;

    const allowed = new Set(['p','br','strong','b','em','i','u','s','ul','ol','li',
      'h1','h2','h3','h4','h5','h6','blockquote','table','thead','tbody','tr','th','td',
      'code','pre','hr','a','span','div']);
    const allowedAttrs = {
      a: ['href','target','rel'],
      td: ['rowspan','colspan'],
      th: ['rowspan','colspan'],
    };

    const clean = (node) => {
      if (!node) return;
      if (node.nodeType === 3 /* TEXT_NODE */) return;
      if (node.nodeType === 1 /* ELEMENT_NODE */) {
        const tag = node.tagName.toLowerCase();
        if (!allowed.has(tag)) {
          node.replaceWith(doc.createTextNode(node.textContent));
          return;
        }
        const permitted = allowedAttrs[tag] || [];
        [...node.attributes].forEach(attr => {
          if (!permitted.includes(attr.name)) node.removeAttribute(attr.name);
        });
        if (tag === 'a') {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer');
        }
      }
      [...node.childNodes].forEach(clean);
    };

    clean(doc.body);
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

// ── Dataset info extractor ────────────────────────────────────────────────────
function getDatasetInfo(item) {
  if (!item?.is_internal || !item?.external_url) return null;
  const m = item.external_url.match(/explore\/dataset\/([^/?#]+)/);
  if (!m) return null;
  const datasetId = m[1];
  if (item.id.startsWith('dares_')) return { source: 'dares', datasetId };
  if (item.id.startsWith('psup_')) return { source: 'parcoursup', datasetId };
  return null;
}

// ── Custom chart tooltip ──────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-lg p-3 text-sm max-w-xs">
      <p className="font-semibold text-[var(--text-primary)] mb-2 truncate">{label}</p>
      {payload.map((e) => (
        <p key={e.name} style={{ color: e.color }} className="flex justify-between gap-6">
          <span className="truncate max-w-[140px]">{e.name}</span>
          <span className="font-mono font-semibold shrink-0">{fmtNum(e.value)}</span>
        </p>
      ))}
    </div>
  );
}

// ── Article KPI card ──────────────────────────────────────────────────────────
function ArticleKPICard({ kpi, accent, index }) {
  const TrendIcon = kpi.trend > 0 ? TrendingUp : kpi.trend < 0 ? TrendingDown : null;
  const trendColor = kpi.trend > 0 ? '#10b981' : kpi.trend < 0 ? '#f43f5e' : 'var(--text-secondary)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accent }} />
      <p className="text-xs font-medium text-[var(--text-secondary)] leading-tight mb-2 mt-1">{kpi.label}</p>
      <p className="text-2xl font-black leading-none" style={{ color: accent }}>{kpi.value}</p>
      {kpi.trendLabel && (
        <p
          className="flex items-center gap-1 text-xs mt-1.5 font-medium"
          style={{ color: kpi.trend !== null && kpi.trend !== undefined ? trendColor : 'var(--text-secondary)' }}
        >
          {TrendIcon && <TrendIcon className="w-3 h-3 shrink-0" />}
          {kpi.trendLabel}
        </p>
      )}
    </motion.div>
  );
}

// ── Embedded article chart ────────────────────────────────────────────────────
function ArticleChart({ config, accent }) {
  const isHBar = config.type === 'bar_h';
  const isLine = config.type === 'line';
  const barColor = config.series?.[0]?.color || accent;
  const height = isHBar ? Math.max(240, config.data.length * 34) : 280;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-6 md:mx-10 mb-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden"
    >
      <div className="px-5 pt-4 pb-1 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
        <p className="text-sm font-semibold text-[var(--text-primary)]">{config.title}</p>
      </div>

      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={height}>
          {isLine ? (
            <LineChart data={config.data} margin={{ top: 8, right: 20, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey={config.xKey} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={['auto', 'auto']}
                tickFormatter={(v) => `${v} %`} width={52} />
              <Tooltip
                formatter={(v, name) => [`${v} %`, name]}
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              {config.series.map((s) => (
                <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color}
                  strokeWidth={2.5} dot={{ r: 4, fill: s.color }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          ) : isHBar ? (
            <BarChart data={config.data} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis type="category" dataKey={config.xKey} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                width={130} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '12px' }}
              />
              {config.series.map((s) => (
                <Bar key={s.key} dataKey={s.key} radius={[0, 6, 6, 0]} maxBarSize={26}>
                  {config.data.map((_, i) => (
                    <Cell key={i} fill={`${s.color}${Math.round(60 + (i / config.data.length) * 195).toString(16).padStart(2, '0')}`} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          ) : (
            <BarChart data={config.data} margin={{ top: 8, right: 20, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey={config.xKey} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => fmtNum(v)} width={56} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '12px' }}
              />
              {config.series.map((s, si) => (
                <Bar key={s.key} dataKey={s.key} radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {config.data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(si + i) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ── Article view (curated editorial content) ──────────────────────────────────
function ArticleView({ item }) {
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const style = CATEGORY_STYLES[item.category] || DEFAULT_STYLE;

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden px-8 md:px-12 py-10 md:py-14"
        style={{ background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)` }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-8 -bottom-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-1/3 top-1/2 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5 relative z-10">
          <span className="text-2xl leading-none">{item.source_logo}</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/10">
            {item.source}
          </span>
          {cat && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/10">
              {cat.emoji} {cat.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight relative z-10 max-w-3xl">
          {item.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-4 relative z-10">
          <span className="flex items-center gap-1.5 text-white/75 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {fmtDate(item.published_at)}
          </span>
          {item.publisher && (
            <span className="flex items-center gap-1.5 text-white/75 text-sm">
              <Tag className="w-3.5 h-3.5" />
              {item.publisher}
            </span>
          )}
        </div>
      </div>

      {/* ── KPI strip ── */}
      {item.kpis?.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 md:p-6 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
          {item.kpis.map((kpi, i) => (
            <ArticleKPICard key={i} kpi={kpi} accent={style.accent} index={i} />
          ))}
        </div>
      )}

      {/* ── Keywords ── */}
      {item.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 md:px-10 pt-5">
          {item.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-color)]"
              style={{ color: style.accent, backgroundColor: `${style.accent}14` }}
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      {/* ── Embedded chart ── */}
      {ARTICLE_CHARTS[item.id] && (
        <div className="pt-5">
          <ArticleChart config={ARTICLE_CHARTS[item.id]} accent={style.accent} />
        </div>
      )}

      {/* ── Prose content ── */}
      <div className="px-6 md:px-10 py-8">
        <div
          className="news-description"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.full_description) }}
        />
      </div>

      {/* ── Footer ── */}
      <div className="mx-6 md:mx-10 pb-8 pt-5 border-t border-[var(--border-color)] flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-[var(--text-secondary)]">
          {item.publisher} · Informations à titre éducatif
        </p>
        {item.external_url && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="w-3.5 h-3.5" /> Source
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Dashboard KPI card (dataset view) ────────────────────────────────────────
function KPICard({ kpi, index }) {
  const TrendIcon = kpi.trend > 0 ? TrendingUp : kpi.trend < 0 ? TrendingDown : null;
  const trendColor = kpi.trend > 0 ? 'text-emerald-500' : kpi.trend < 0 ? 'text-rose-500' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col gap-1.5 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
    >
      <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{kpi.label}</span>
      <span className="text-2xl font-bold text-[var(--text-primary)] leading-none">{kpi.value}</span>
      {kpi.trend !== null && kpi.trend !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
          {kpi.trend > 0 ? '+' : ''}{fmtNum(kpi.trend)} vs période précédente
        </span>
      )}
    </motion.div>
  );
}

// ── Dataset data table ────────────────────────────────────────────────────────
function DataTable({ records, fields, chart }) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const priorityNames = [chart.x_field, ...chart.y_fields];
  const otherFields = fields.filter((f) => !priorityNames.includes(f.name)).slice(0, Math.max(0, 6 - priorityNames.length));
  const visibleFields = [
    ...priorityNames.map((n) => fields.find((f) => f.name === n)).filter(Boolean),
    ...otherFields,
  ];

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const rows = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Données brutes
          <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
            ({records.length} enregistrements affichés)
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
        <table className="data-table w-full text-sm">
          <thead>
            <tr>
              {visibleFields.map((f) => (
                <th key={f.name}>{f.label || f.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {visibleFields.map((f) => (
                  <td key={f.name}>{fmtCell(row[f.name])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ← Précédent
          </Button>
          <span className="text-xs text-[var(--text-secondary)]">Page {page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            Suivant →
          </Button>
        </div>
      )}
    </section>
  );
}

// ── Dataset main chart ────────────────────────────────────────────────────────
function MainChart({ records, fields, chart }) {
  const chartData = useMemo(() => records.map((row) => {
    const x = row[chart.x_field];
    if (x === null || x === undefined) return null;
    const entry = { name: String(x) };
    chart.y_fields.forEach((field, i) => {
      const lbl = chart.y_labels?.[i] || field;
      const raw = row[field];
      entry[lbl] = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '')) || 0;
    });
    return entry;
  }).filter(Boolean), [records, chart]);

  if (!chartData.length) return null;

  const isLine = chart.type === 'line';
  const rotateX = chartData.length > 10;
  const bottomMargin = rotateX ? 70 : 30;

  return (
    <section>
      <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
        {chart.y_labels?.[0] || 'Évolution'}
        {chart.x_label && (
          <span className="font-normal text-[var(--text-secondary)]">par {chart.x_label}</span>
        )}
      </h2>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
        <ResponsiveContainer width="100%" height={360}>
          {isLine ? (
            <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: bottomMargin }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                tickFormatter={tickShort} angle={rotateX ? -40 : 0} textAnchor={rotateX ? 'end' : 'middle'} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => fmtNum(v)} width={64} />
              <Tooltip content={<CustomTooltip />} />
              {chart.y_fields.length > 1 && <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '12px' }} />}
              {chart.y_fields.map((field, i) => {
                const lbl = chart.y_labels?.[i] || field;
                return <Line key={field} type="monotone" dataKey={lbl} stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2.5} dot={chartData.length < 25} activeDot={{ r: 5 }} />;
              })}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: bottomMargin }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                tickFormatter={tickShort} angle={rotateX ? -40 : 0} textAnchor={rotateX ? 'end' : 'middle'} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => fmtNum(v)} width={64} />
              <Tooltip content={<CustomTooltip />} />
              {chart.y_fields.length > 1 && <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '12px' }} />}
              {chart.y_fields.map((field, i) => {
                const lbl = chart.y_labels?.[i] || field;
                return <Bar key={field} dataKey={lbl} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={52} />;
              })}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── KPI computation (dataset view) ───────────────────────────────────────────
function buildKPIs(records, fields, chart, total) {
  const kpis = [];

  const xField = fields.find((f) => f.name === chart.x_field);
  if (xField) {
    const vals = records.map((r) => r[chart.x_field]).filter(Boolean).sort((a, b) => String(a).localeCompare(String(b)));
    if (vals.length > 0) {
      const first = String(vals[0]), last = String(vals[vals.length - 1]);
      kpis.push({ label: 'Période', value: first === last ? first : `${first} → ${last}`, icon: null });
    }
  }

  chart.y_fields.slice(0, 2).forEach((field, i) => {
    const lbl = chart.y_labels?.[i] || field;
    const nums = records.map((r) => Number(r[field])).filter((n) => !isNaN(n) && isFinite(n));
    if (!nums.length) return;
    const latest = nums[nums.length - 1];
    const prev = nums.length > 1 ? nums[nums.length - 2] : null;
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const max = Math.max(...nums);
    const trend = prev !== null ? latest - prev : null;
    kpis.push({ label: `${lbl} (dernière valeur)`, value: fmtNum(latest), trend, unit: '' });
    if (nums.length > 2) kpis.push({ label: `${lbl} (moyenne)`, value: fmtNum(avg), unit: '' });
    kpis.push({ label: `${lbl} (maximum)`, value: fmtNum(max), unit: '' });
  });

  kpis.push({ label: 'Enregistrements', value: new Intl.NumberFormat('fr-FR').format(total), unit: ' lignes' });
  return kpis.slice(0, 4);
}

// ── Data dashboard (DARES / Parcoursup dataset) ───────────────────────────────
function DataDashboard({ item, preview }) {
  const { fields, records, total, chart } = preview;
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const kpis = useMemo(() => chart ? buildKPIs(records, fields, chart, total) : [], [records, fields, chart, total]);

  if (!chart || records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <BarChart2 className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
        <p className="text-[var(--text-secondary)]">Aucune donnée exploitable dans ce jeu de données.</p>
        {item.external_url && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 mt-2">
              <ExternalLink className="w-4 h-4" /> Consulter la source
            </Button>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-lg">{item.source_logo}</span>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{item.source}</span>
            {cat && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--color-primary)] border border-[var(--border-color)]">
                {cat.emoji} {cat.label}
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug">
            {item.title}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Mise à jour : {fmtDate(item.published_at)}
          </p>
        </div>
        {item.external_url && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Source
            </Button>
          </a>
        )}
      </div>

      {kpis.length > 0 && (
        <div className={`grid gap-3 ${kpis.length >= 4 ? 'grid-cols-2 lg:grid-cols-4' : `grid-cols-${kpis.length}`}`}>
          {kpis.map((kpi, i) => <KPICard key={i} kpi={kpi} index={i} />)}
        </div>
      )}

      <MainChart records={records} fields={fields} chart={chart} />
      <DataTable records={records} fields={fields} chart={chart} />

      <p className="text-xs text-center text-[var(--text-secondary)] opacity-60 pt-2 border-t border-[var(--border-color)]">
        Données publiques — Source : {item.source} · Licence Ouverte / Open Licence
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ActualitesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    newsService.getAll().then(({ items }) => {
      const found = items.find((i) => i.id === id);
      if (found) setItem(found);
      else setNotFound(true);
      setLoadingItem(false);
    }).catch(() => { setNotFound(true); setLoadingItem(false); });
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const info = getDatasetInfo(item);
    if (!info) return;
    setLoadingData(true);
    supabase.functions.invoke('fetch-dataset-preview', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: info.source, dataset_id: info.datasetId }),
    }).then(({ data, error: err }) => {
      if (err) throw err;
      if (!data?.success) throw new Error(data?.error || 'fetch failed');
      setPreview(data);
    }).catch((e) => setDataError(e.message))
      .finally(() => setLoadingData(false));
  }, [item]);

  // ── Early states ─────────────────────────────────────────────────────────────
  if (loadingItem) {
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
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Données introuvables</h2>
        <p className="text-[var(--text-secondary)]">Ce contenu n'est plus disponible ou a expiré du cache.</p>
        <Button variant="outline" onClick={() => navigate('/actualites')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
      </div>
    );
  }

  // Determine render mode — articles skip padding/colorbar for the full-bleed hero
  const isArticleMode = !loadingData && Boolean(item.full_description) && !preview;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <MetaTags
        title={`${item.title} | CléAvenir`}
        description={item.excerpt}
        url={`/actualites/${item.id}`}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        <Link
          to="/actualites"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden"
        >
          {/* Color bar only for dataset dashboard */}
          {!isArticleMode && (
            <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-400" />
          )}

          <div className={isArticleMode ? '' : 'p-6 md:p-10'}>
            {loadingData ? (
              <div className="flex flex-col gap-6 animate-pulse p-6 md:p-10">
                <div className="h-7 w-2/3 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl bg-[var(--bg-secondary)]" />)}
                </div>
                <div className="h-80 rounded-2xl bg-[var(--bg-secondary)]" />
                <div className="h-48 rounded-xl bg-[var(--bg-secondary)]" />
              </div>
            ) : preview ? (
              <DataDashboard item={item} preview={preview} />
            ) : item.full_description ? (
              <ArticleView item={item} />
            ) : (
              <div className="flex flex-col items-center gap-4 py-16 text-center p-6 md:p-10">
                <AlertCircle className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-[var(--text-secondary)]">Impossible de charger les données.</p>
                {item.external_url && (
                  <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> Voir la source
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
