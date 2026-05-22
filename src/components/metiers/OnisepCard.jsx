import React, { useEffect, useState } from 'react';
import { ExternalLink, BookOpen, Tag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';

const OnisepCard = ({ metierTitle, romeCode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!romeCode && !metierTitle) return;
    setLoading(true);
    supabase.functions
      .invoke('get-onisep-metier', { body: { romeCode, q: metierTitle } })
      .then(({ data: res }) => {
        setData(res?.metier ?? null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [romeCode, metierTitle]);

  if (loading) {
    return (
      <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-orange-400 animate-spin shrink-0" />
        <span className="text-sm text-slate-500">Chargement profil ONISEP…</span>
      </div>
    );
  }

  if (!data?.url) return null;

  return (
    <div className="bg-orange-50/60 border border-orange-200/70 rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-orange-600" />
        </div>
        <span className="text-sm font-semibold text-slate-800">Fiche ONISEP officielle</span>
      </div>

      {/* Domain */}
      {data.domain && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-600">{data.domain}</span>
          {data.subdomain && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-orange-200 text-orange-700 bg-white">
              {data.subdomain}
            </Badge>
          )}
        </div>
      )}

      {/* ROME tags */}
      {data.romes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.romes.filter(r => r.code).map((r) => (
            <a
              key={r.code}
              href={r.url || undefined}
              target={r.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[11px] font-mono px-2 py-0.5 bg-white border border-orange-200 rounded-md text-orange-700 hover:bg-orange-50 transition-colors"
            >
              {r.code}{r.label ? ` · ${r.label}` : ''}
            </a>
          ))}
        </div>
      )}

      {/* CTA */}
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-900 transition-colors"
      >
        Voir la fiche métier complète <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

export default OnisepCard;
