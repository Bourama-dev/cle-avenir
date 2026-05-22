import React from 'react';
import { MapPin, Users, ExternalLink, Star, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Maps star score (0–5) to label + colour
function hiringLabel(stars) {
  if (stars >= 4) return { label: 'Fort potentiel', color: 'bg-emerald-100 text-emerald-700' };
  if (stars >= 3) return { label: 'Bon potentiel', color: 'bg-blue-100 text-blue-700' };
  if (stars >= 2) return { label: 'Potentiel moyen', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Potentiel faible', color: 'bg-slate-100 text-slate-500' };
}

const CompanyCard = ({ company }) => {
  const { label, color } = hiringLabel(company.stars);
  const starsFilled = Math.round(company.stars);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
          <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-base leading-tight truncate">
              {company.name}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${color}`}>
              {label}
            </span>
          </div>

          {/* NAF / sector */}
          {company.naf_text && (
            <p className="text-sm text-slate-500 mt-0.5 truncate">{company.naf_text}</p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i <= starsFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">Probabilité d'embauche</span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            {(company.city || company.zipcode) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {company.city}{company.zipcode ? ` (${company.zipcode})` : ''}
                {company.distance > 0 && (
                  <span className="text-slate-400"> · {company.distance.toFixed(0)} km</span>
                )}
              </span>
            )}
            {company.headcount_text && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {company.headcount_text}
              </span>
            )}
            {company.contract === 'alternance' && (
              <Badge className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 border-0">
                Alternance
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-3 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 gap-1.5 transition-colors"
          onClick={() => window.open(company.url, '_blank', 'noopener,noreferrer')}
        >
          Voir l'entreprise <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default CompanyCard;
