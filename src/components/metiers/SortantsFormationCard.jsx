import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Loader2, Info } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

function fmtPct(v) {
  if (v == null) return null;
  const n = parseFloat(String(v));
  if (isNaN(n)) return null;
  return `${n.toFixed(0)} %`;
}

function fmtN(v) {
  if (v == null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n.toLocaleString('fr-FR');
}

// Colour band for return-to-employment rate
function rateColor(v) {
  if (v == null) return 'slate';
  const n = parseFloat(String(v));
  if (isNaN(n)) return 'slate';
  if (n >= 70) return 'emerald';
  if (n >= 50) return 'blue';
  if (n >= 30) return 'amber';
  return 'red';
}

const colorText  = { emerald: 'text-emerald-700', blue: 'text-blue-700', amber: 'text-amber-700', red: 'text-red-600', slate: 'text-slate-500' };
const colorBg    = { emerald: 'bg-emerald-50 border-emerald-200', blue: 'bg-blue-50 border-blue-200', amber: 'bg-amber-50 border-amber-200', red: 'bg-red-50 border-red-200', slate: 'bg-slate-50 border-slate-200' };
const colorBar   = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-400', red: 'bg-red-500', slate: 'bg-slate-400' };

const SortantsFormationCard = ({ romeCode }) => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (!romeCode) return;
    setLoading(true);
    setWarning(null);
    supabase.functions
      .invoke('get-sortants-formation', { body: { romeCode } })
      .then(({ data }) => {
        if (data?.warning) setWarning(data.warning);
        setStats(data?.stats ?? null);
      })
      .catch(() => setWarning('server_error'))
      .finally(() => setLoading(false));
  }, [romeCode]);

  if (loading) {
    return (
      <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-5 flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
        <span className="text-sm text-slate-500">Chargement taux d'insertion…</span>
      </div>
    );
  }

  const silentWarnings = ['not_subscribed', 'endpoint_not_found', 'credentials_missing'];
  if (!stats?.length || (warning && silentWarnings.includes(warning))) return null;

  // Take the first row (national level) as the headline figure
  const main = stats[0];
  const rate = parseFloat(String(main?.tauxRetourEmploi ?? ''));
  const color = rateColor(rate);
  const pctDisplay = fmtPct(main?.tauxRetourEmploi);
  const effectifDisplay = fmtN(main?.effectif);
  const r6 = fmtPct(main?.retour6Mois);
  const r12 = fmtPct(main?.retour12Mois);

  if (!pctDisplay && !r6 && !r12) return null;

  return (
    <div className={`border rounded-2xl p-5 space-y-4 ${colorBg[color]}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
          <TrendingUp className="w-4 h-4 text-violet-600" />
        </div>
        <span className="text-sm font-semibold text-slate-800">Insertion professionnelle</span>
        <a
          href="https://francetravail.io/produits-partages/catalogue/sortants-formation-acces-emploi/documentation#/"
          target="_blank"
          rel="noopener noreferrer"
          title="Source : API Sortants de formation, France Travail"
          className="ml-auto"
        >
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
        </a>
      </div>

      {/* Headline rate */}
      {pctDisplay && (
        <div>
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-3xl font-extrabold ${colorText[color]}`}>{pctDisplay}</span>
            <span className="text-sm text-slate-500 mb-1">de retour à l'emploi</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
            <div
              className={`h-full rounded-full transition-all ${colorBar[color]}`}
              style={{ width: `${Math.min(100, isNaN(rate) ? 0 : rate)}%` }}
            />
          </div>
        </div>
      )}

      {/* Secondary stats */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        {r6 && (
          <span><span className="font-semibold text-slate-800">{r6}</span> à 6 mois</span>
        )}
        {r12 && (
          <span><span className="font-semibold text-slate-800">{r12}</span> à 12 mois</span>
        )}
        {effectifDisplay && (
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {effectifDisplay} sortants
          </span>
        )}
        {main?.typeFormation && (
          <span className="text-slate-400">{String(main.typeFormation)}</span>
        )}
      </div>

      <p className="text-[10px] text-slate-400">
        Source : France Travail · Données nationales · Mise à jour trimestrielle
      </p>
    </div>
  );
};

export default SortantsFormationCard;
