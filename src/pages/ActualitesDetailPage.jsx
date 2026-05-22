import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Calendar, Tag, Database,
  Building2, FileText, Hash, AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { newsService, CATEGORIES } from '@/services/newsService';
import MetaTags from '@/components/SEO/MetaTags';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return '—'; }
}

function formatNumber(n) {
  if (!n) return null;
  return new Intl.NumberFormat('fr-FR').format(n);
}

export default function ActualitesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    newsService.getAll().then(({ items }) => {
      const found = items.find((i) => i.id === id);
      if (found) {
        setItem(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [id]);

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
        <p className="text-[var(--text-secondary)]">Cet élément n'est plus disponible ou a expiré du cache.</p>
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

        {/* Back */}
        <Link
          to="/actualites"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm"
        >
          {/* Header bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-400" />

          <div className="p-6 md:p-10 flex flex-col gap-6">

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
              Dernière mise à jour : {formatDate(item.published_at)}
            </div>

            <hr className="border-[var(--border-color)]" />

            {/* Description */}
            {item.full_description && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-3">
                  <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                  Description
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {item.full_description}
                </p>
              </section>
            )}

            {/* Metadata grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {item.publisher && (
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    <Building2 className="w-3.5 h-3.5" /> Éditeur
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.publisher}</span>
                </div>
              )}

              {item.license && (
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5" /> Licence
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.license}</span>
                </div>
              )}

              {formatNumber(item.records_count) && (
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    <Database className="w-3.5 h-3.5" /> Enregistrements
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {formatNumber(item.records_count)} lignes
                  </span>
                </div>
              )}

              {item.theme?.length > 0 && (
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    <Hash className="w-3.5 h-3.5" /> Thème
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {item.theme.join(', ')}
                  </span>
                </div>
              )}
            </section>

            {/* Keywords */}
            {item.keywords?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-3">
                  <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                  Mots-clés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <hr className="border-[var(--border-color)]" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {item.external_url && (
                <a
                  href={item.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
