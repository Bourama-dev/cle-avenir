import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, ArrowRight, Building2, GraduationCap, Wrench, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LYCEE_TYPE_LABELS, LYCEE_TYPE_DESCRIPTIONS } from '@/services/onisepLyceeService';

const TYPE_ICON = {
  general: GraduationCap,
  technologique: Cpu,
  polyvalent: GraduationCap,
  professionnel: Wrench,
};

const TYPE_BADGE_CLASSES = {
  general:      'bg-blue-100 text-blue-700 border-blue-200',
  technologique:'bg-violet-100 text-violet-700 border-violet-200',
  polyvalent:   'bg-indigo-100 text-indigo-700 border-indigo-200',
  professionnel:'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const STATUT_BADGE_CLASSES = {
  public: 'bg-slate-100 text-slate-600 border-slate-200',
  prive:  'bg-amber-100 text-amber-700 border-amber-200',
};

export default function LyceeCard({ lycee }) {
  const navigate = useNavigate();
  if (!lycee) return null;

  const typeInfo = LYCEE_TYPE_DESCRIPTIONS[lycee.type] ?? LYCEE_TYPE_DESCRIPTIONS.general;
  const TypeIcon = TYPE_ICON[lycee.type] ?? Building2;
  const typeBadgeClass = TYPE_BADGE_CLASSES[lycee.type] ?? TYPE_BADGE_CLASSES.general;

  const handleClick = () => {
    navigate(`/lycee/${lycee.uai}`, { state: { lycee } });
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden"
    >
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              lycee.type === 'general' ? 'bg-blue-100' :
              lycee.type === 'technologique' ? 'bg-violet-100' :
              lycee.type === 'polyvalent' ? 'bg-indigo-100' : 'bg-emerald-100'
            }`}
          >
            <TypeIcon className={`w-5 h-5 ${
              lycee.type === 'general' ? 'text-blue-600' :
              lycee.type === 'technologique' ? 'text-violet-600' :
              lycee.type === 'polyvalent' ? 'text-indigo-600' : 'text-emerald-600'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {lycee.nom || 'Lycée sans nom'}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {lycee.code_postal} {lycee.ville}
                {lycee.departement ? ` · ${lycee.departement}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={`text-[11px] px-2 py-0.5 ${typeBadgeClass}`}>
            {typeInfo.icon} {LYCEE_TYPE_LABELS[lycee.type] ?? lycee.type}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[11px] px-2 py-0.5 ${STATUT_BADGE_CLASSES[lycee.statut] ?? STATUT_BADGE_CLASSES.public}`}
          >
            {lycee.statut === 'prive' ? 'Privé' : 'Public'}
          </Badge>
        </div>

        {/* Short description */}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
          {typeInfo.short}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            {lycee.telephone && (
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                <Phone className="w-3 h-3" />
                <span>{lycee.telephone}</span>
              </div>
            )}
            {lycee.url && (
              <a
                href={lycee.url.startsWith('http') ? lycee.url : `https://${lycee.url}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] hover:underline"
              >
                <Globe className="w-3 h-3" />
                <span>Site web</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] group-hover:gap-2 transition-all">
            <span>Voir</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
