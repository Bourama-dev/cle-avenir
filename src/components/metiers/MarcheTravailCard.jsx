import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Briefcase, AlertCircle, Loader2, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

// Converts a raw tension value to a readable label and colour
function tensionDisplay(raw) {
  if (raw == null) return null;
  const v = parseFloat(String(raw));
  if (isNaN(v)) return { label: String(raw), color: 'slate', pct: 50 };
  // Tension scale: typically 0 (no difficulty) → 5+ (very difficult to recruit)
  // Normalise to 0-100 for the progress bar
  const pct = Math.min(100, Math.max(0, (v / 5) * 100));
  if (v >= 4)  return { label: 'Très forte', color: 'red',    pct };
  if (v >= 3)  return { label: 'Forte',      color: 'orange', pct };
  if (v >= 2)  return { label: 'Modérée',    color: 'amber',  pct };
  if (v >= 1)  return { label: 'Faible',     color: 'green',  pct };
  return         { label: 'Très faible',     color: 'slate',  pct };
}

function fmt(v) {
  if (v == null) return '—';
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toLocaleString('fr-FR');
}

const colorBar = {
  red:    'bg-red-500',
  orange: 'bg-orange-500',
  amber:  'bg-amber-400',
  green:  'bg-emerald-500',
  slate:  'bg-slate-400',
};
const colorText = {
  red:    'text-red-700',
  orange: 'text-orange-700',
  amber:  'text-amber-700',
  green:  'text-emerald-700',
  slate:  'text-slate-500',
};
const colorBg = {
  red:    'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
  amber:  'bg-amber-50 border-amber-200',
  green:  'bg-emerald-50 border-emerald-200',
  slate:  'bg-slate-50 border-slate-200',
};

const MarcheTravailCard = ({ romeCode }) => {
  const [ind, setInd]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (!romeCode) return;
    setLoading(true);
    setWarning(null);
    supabase.functions
      .invoke('get-marche-travail', { body: { romeCode } })
      .then(({ data }) => {
        if (data?.warning) setWarning(data.warning);
        setInd(data?.indicateurs ?? null);
      })
      .catch(() => setWarning('server_error'))
      .finally(() => setLoading(false));
  }, [romeCode]);

  if (loading) {
    return (
      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5 flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
        <span className="text-sm text-slate-500">Chargement données marché…</span>
      </div>
    );
  }

  // Don't render anything for "not subscribed" or "endpoint not found" — not useful noise
  const silentWarnings = ['not_subscribed', 'endpoint_not_found', 'credentials_missing'];
  if (!ind || (warning && silentWarnings.includes(warning))) return null;

  if (warning === 'auth_failed') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">Identifiants France Travail invalides (API Marché du travail).</p>
      </div>
    );
  }

  const tension = tensionDisplay(ind.tension);
  const hasSomeData = ind.demandeursEmploi != null || ind.offresEmploi != null
    || ind.recrutements != null || tension != null;

  if (!hasSomeData) return null;

  return (
    <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4 text-teal-600" />
        </div>
        <span className="text-sm font-semibold text-slate-800">Marché du travail</span>
        {ind.territoire && (
          <span className="text-xs text-slate-400 ml-auto">{String(ind.territoire)}</span>
        )}
      </div>

      {/* Tension indicator */}
      {tension && (
        <div className={`rounded-xl border p-3 ${colorBg[tension.color]}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600">Tension de recrutement</span>
            <span className={`text-xs font-bold ${colorText[tension.color]}`}>{tension.label}</span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${colorBar[tension.color]}`}
              style={{ width: `${tension.pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {ind.demandeursEmploi != null && (
          <Stat icon={<Users className="w-4 h-4 text-blue-500" />}
            label="Demandeurs d'emploi" value={fmt(ind.demandeursEmploi)} />
        )}
        {ind.offresEmploi != null && (
          <Stat icon={<Briefcase className="w-4 h-4 text-emerald-500" />}
            label="Offres publiées" value={fmt(ind.offresEmploi)} />
        )}
        {ind.recrutements != null && (
          <Stat icon={<TrendingUp className="w-4 h-4 text-indigo-500" />}
            label="Recrutements" value={fmt(ind.recrutements)} />
        )}
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <div className="text-base font-bold text-slate-900">{value}</div>
    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{label}</div>
  </div>
);

export default MarcheTravailCard;
