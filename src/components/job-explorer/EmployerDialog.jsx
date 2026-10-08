import React, { useMemo } from 'react';
import { Building2, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { employerOffersUrl } from '@/lib/employerSummary';

// Employer sheet shown inside CléAvenir (data: France Travail "Synthèse pages employeurs").
// The employer's list of offers is not exposed by the partner APIs (the offers search cannot filter
// by company), so the France Travail page is offered as a secondary link.
const EmployerDialog = ({ employer, logo, open, onOpenChange }) => {
  const cities = useMemo(() => {
    const seen = new Map();
    for (const l of employer.locations ?? []) {
      const key = String(l.city).toLowerCase();
      if (!seen.has(key)) seen.set(key, l);
    }
    if (employer.city && !seen.has(String(employer.city).toLowerCase())) {
      seen.set(String(employer.city).toLowerCase(), { city: employer.city, zipcode: employer.zipcode });
    }
    return [...seen.values()];
  }, [employer.locations, employer.city, employer.zipcode]);

  const ftUrl = employerOffersUrl(employer.url_path);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-6">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {logo
                ? <img src={logo} alt={`Logo ${employer.name}`} className="w-full h-full object-contain" />
                : <Building2 className="w-6 h-6 text-slate-300" />}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-left leading-tight">{employer.name}</DialogTitle>
              <DialogDescription className="text-left">
                {employer.naf ? `Secteur (NAF) ${employer.naf}` : 'Employeur'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {employer.tagline && (
          <p className="text-sm text-slate-600 dark:text-slate-300 italic">« {employer.tagline} »</p>
        )}

        <div className="flex items-center gap-2 rounded-xl bg-rose-50 text-rose-700 px-3 py-2 text-sm font-semibold">
          <Briefcase className="w-4 h-4 shrink-0" />
          {employer.offers_count > 0
            ? `${employer.offers_count} offre${employer.offers_count > 1 ? 's' : ''} en cours`
            : 'Aucune offre en cours'}
        </div>

        {cities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Établissements ({cities.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cities.slice(0, 12).map((l) => (
                <span key={`${l.city}-${l.zipcode}`} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {l.city}{l.zipcode ? ` (${l.zipcode.slice(0, 2)})` : ''}
                </span>
              ))}
              {cities.length > 12 && <span className="text-xs px-2 py-1 text-slate-400">+{cities.length - 12}</span>}
            </div>
          </div>
        )}

        {ftUrl && employer.offers_count > 0 && (
          <a
            href={ftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir ses offres sur France Travail <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployerDialog;
