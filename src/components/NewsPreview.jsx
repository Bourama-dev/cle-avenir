import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { newsService } from '@/services/newsService';

const MAX_ITEMS = 4;

const CATEGORY_STYLES = {
  'emploi':         { bg: 'bg-rose-50',   text: 'text-rose-600',   label: 'Emploi' },
  'formation':      { bg: 'bg-cyan-50',   text: 'text-cyan-600',   label: 'Formation' },
  'orientation':    { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Orientation' },
  'marche-travail': { bg: 'bg-amber-50',  text: 'text-amber-600',  label: 'Marché du travail' },
  'economie':       { bg: 'bg-emerald-50',text: 'text-emerald-600',label: 'Économie' },
  'open-data':      { bg: 'bg-slate-100', text: 'text-slate-600',  label: 'Open Data' },
};

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function NewsCard({ item, index }) {
  const style = CATEGORY_STYLES[item.category] ?? {
    bg: 'bg-slate-100', text: 'text-slate-600', label: item.category,
  };

  const cardClass = "group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all duration-200 overflow-hidden";
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay: index * 0.07 },
  };

  const inner = (
    <>
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-cyan-400 opacity-70" />
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[110px]">
            {item.source_logo} {item.source}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3 group-hover:text-rose-600 transition-colors flex-1">
          {item.title}
        </h3>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {formatDate(item.published_at)}
          </span>
          {item.is_internal ? (
            <span className="flex items-center gap-1 text-xs font-medium text-rose-500 group-hover:text-rose-700">
              Voir le détail <ArrowRight className="w-3 h-3" />
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-rose-500 group-hover:text-rose-700">
              Lire <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (item.is_internal) {
    return (
      <motion.div {...motionProps} className={cardClass}>
        <Link to={item.link} className="flex flex-col flex-1">{inner}</Link>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      {...motionProps}
      className={cardClass}
    >
      {inner}
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-slate-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded-full bg-slate-100" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
        <div className="h-3.5 w-full rounded bg-slate-100" />
        <div className="h-3.5 w-5/6 rounded bg-slate-100" />
        <div className="h-3.5 w-4/6 rounded bg-slate-100" />
        <div className="flex justify-between pt-2 border-t border-slate-50">
          <div className="h-3 w-16 rounded bg-slate-100" />
          <div className="h-3 w-10 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

const NewsPreview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getAll().then((res) => {
      setItems((res.items || []).slice(0, MAX_ITEMS));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-3xl font-extrabold text-slate-900 mb-2"
            >
              🗞️ Actualités emploi & formation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-slate-600 text-base"
            >
              Les dernières nouvelles du marché du travail — sources officielles françaises.
            </motion.p>
          </div>

          <Link
            to="/actualites"
            className="group hidden sm:flex items-center gap-1 text-rose-600 font-semibold hover:text-rose-700 transition-colors shrink-0"
          >
            Voir toutes les actualités
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: MAX_ITEMS }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) => <NewsCard key={item.id} item={item} index={i} />)
          }
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-1 text-rose-600 font-bold hover:underline"
          >
            Voir toutes les actualités <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
