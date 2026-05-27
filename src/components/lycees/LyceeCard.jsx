import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, ArrowRight, Building2, GraduationCap, Wrench, Cpu, Users, BookOpen, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LYCEE_TYPE_LABELS, LYCEE_TYPE_DESCRIPTIONS } from '@/services/onisepLyceeService';

const TYPE_ICON = {
  general: GraduationCap,
  technologique: Cpu,
  polyvalent: GraduationCap,
  professionnel: Wrench,
};

const TYPE_BADGE = {
  general:      'bg-blue-50 text-blue-700 border border-blue-200',
  technologique:'bg-violet-50 text-violet-700 border border-violet-200',
  polyvalent:   'bg-indigo-50 text-indigo-700 border border-indigo-200',
  professionnel:'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const TYPE_ICON_BG = {
  general:      'bg-blue-100 text-blue-600',
  technologique:'bg-violet-100 text-violet-600',
  polyvalent:   'bg-indigo-100 text-indigo-600',
  professionnel:'bg-emerald-100 text-emerald-600',
};

export default function LyceeCard({ lycee, index = 0 }) {
  const navigate = useNavigate();
  if (!lycee) return null;

  const typeInfo = LYCEE_TYPE_DESCRIPTIONS[lycee.type] ?? LYCEE_TYPE_DESCRIPTIONS.general;
  const TypeIcon = TYPE_ICON[lycee.type] ?? Building2;
  const typeBadge = TYPE_BADGE[lycee.type] ?? TYPE_BADGE.general;
  const typeIconBg = TYPE_ICON_BG[lycee.type] ?? TYPE_ICON_BG.general;

  const handleClick = () => {
    navigate(`/lycee/${lycee.uai}`, { state: { lycee } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.03 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row">

          {/* ── Left: main info ─────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`font-semibold ${typeBadge}`}>
                  {typeInfo.icon} {LYCEE_TYPE_LABELS[lycee.type] ?? lycee.type}
                </Badge>
                <Badge
                  variant="secondary"
                  className={lycee.statut === 'prive'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'}
                >
                  {lycee.statut === 'prive' ? 'Privé' : 'Public'}
                </Badge>
                {lycee.nombre_eleves && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    <Users className="h-3 w-3" />
                    <span>{lycee.nombre_eleves.toLocaleString('fr-FR')} élèves</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-700 transition-colors leading-tight">
                {lycee.nom || 'Lycée sans nom'}
              </h2>

              {/* Location */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4 text-sm font-medium">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  {[lycee.adresse, lycee.code_postal, lycee.ville].filter(Boolean).join(', ')}
                </span>
                {lycee.departement && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{lycee.departement}</span>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                {typeInfo.description}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-1">Type</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <TypeIcon className={`h-4 w-4 ${typeIconBg.split(' ')[1]}`} />
                    <span className="truncate">{typeInfo.short.split('—')[0].trim()}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-1">Niveaux</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>{typeInfo.niveaux?.length ?? 3} niveaux</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-1">Diplôme</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="truncate">{lycee.type === 'professionnel' ? 'Bac Pro / CAP' : lycee.type === 'technologique' ? 'Bac Techno' : 'Bac Général'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: details + CTA ─────────────────────────────────── */}
          <div className="w-full md:w-80 bg-slate-50/50 dark:bg-slate-800/50 p-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
            <div className="space-y-4 mb-6">

              {/* Débouchés */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-600" />
                  Débouchés
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 pl-6 list-disc space-y-1">
                  {(typeInfo.debouches ?? []).slice(0, 3).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Niveaux */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Parcours
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 pl-6 list-disc space-y-1">
                  {(typeInfo.niveaux ?? []).slice(0, 3).map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                onClick={handleClick}
              >
                Voir ce lycée
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <div className="flex gap-2">
                {lycee.telephone && (
                  <a
                    href={`tel:${lycee.telephone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 text-xs border border-slate-200 rounded-md py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    {lycee.telephone}
                  </a>
                )}
                {lycee.url && (
                  <a
                    href={lycee.url.startsWith('http') ? lycee.url : `https://${lycee.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1 text-xs border border-indigo-200 text-indigo-700 rounded-md px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    Site web
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </Card>
    </motion.div>
  );
}
