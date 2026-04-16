import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Briefcase, Download, Share2, Compass,
  FileText, TrendingUp, RefreshCw, Users,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Primary action definitions keyed by action id.
 * Each entry has: label, sublabel, icon, color classes, route.
 */
const ACTION_DEFS = {
  metiers: {
    label:    'Explorer les métiers',
    sublabel: 'Découvrez plus d\'opportunités',
    Icon:     Compass,
    bg:       'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
    iconBg:   'bg-indigo-100 text-indigo-600',
    route:    '/metiers',
  },
  formations: {
    label:    'Chercher une formation',
    sublabel: 'Trouvez le bon parcours',
    Icon:     GraduationCap,
    bg:       'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200',
    iconBg:   'bg-pink-100 text-pink-600',
    route:    '/formations',
  },
  offres: {
    label:    'Voir les offres d\'emploi',
    sublabel: 'Postulez dès maintenant',
    Icon:     Briefcase,
    bg:       'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    iconBg:   'bg-emerald-100 text-emerald-600',
    route:    '/offres-emploi',
  },
  cv: {
    label:    'Créer mon CV',
    sublabel: 'Généré par IA en 2 minutes',
    Icon:     FileText,
    bg:       'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200',
    iconBg:   'bg-violet-100 text-violet-600',
    route:    '/cv-builder',
  },
  bilan: {
    label:    'Bilan de compétences',
    sublabel: 'CPF · Reconversion',
    Icon:     TrendingUp,
    bg:       'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
    iconBg:   'bg-amber-100 text-amber-600',
    route:    '/bilan-competences',
  },
  alternance: {
    label:    'Chercher une alternance',
    sublabel: 'Combiner études et travail',
    Icon:     Users,
    bg:       'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200',
    iconBg:   'bg-sky-100 text-sky-600',
    route:    '/alternance',
  },
  retest: {
    label:    'Repasser le test',
    sublabel: 'Affiner mon profil RIASEC',
    Icon:     RefreshCw,
    bg:       'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200',
    iconBg:   'bg-slate-100 text-slate-500',
    route:    '/test-orientation',
  },
};

/**
 * Returns the prioritised list of action ids based on user_status.
 * First 3 are shown as large buttons; the rest as secondary actions.
 */
const getActionsForStatus = (status) => {
  switch (status) {
    case 'lyceen':
      return ['formations', 'alternance', 'metiers'];
    case 'etudiant':
      return ['formations', 'alternance', 'offres'];
    case 'en_emploi':
      return ['formations', 'bilan', 'metiers'];
    case 'en_recherche':
      return ['offres', 'cv', 'formations'];
    case 'reconversion':
      return ['bilan', 'formations', 'metiers'];
    default:
      return ['metiers', 'formations', 'offres'];
  }
};

const RecommendedActionsSection = ({ userProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const status = userProfile?.user_status || null;
  const primaryActions = getActionsForStatus(status);

  return (
    <div className="grid grid-cols-1 gap-3 mb-10">
      {primaryActions.map((id) => {
        const def = ACTION_DEFS[id];
        if (!def) return null;
        const { label, sublabel, Icon, bg, iconBg, route } = def;
        return (
          <Button
            key={id}
            onClick={() => navigate(route)}
            className={`h-auto py-4 flex items-center justify-start gap-3 border shadow-sm w-full ${bg}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold">{label}</div>
              <div className="text-xs opacity-70 font-normal">{sublabel}</div>
            </div>
          </Button>
        );
      })}

      {/* Secondary utility buttons */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button
          variant="outline"
          onClick={() => toast({ title: 'PDF', description: 'La génération du PDF est en cours de développement.' })}
          className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <Download className="w-4 h-4 mr-2" /> PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: 'Lien copié', description: 'Le lien de votre plan a été copié.' });
          }}
          className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <Share2 className="w-4 h-4 mr-2" /> Partager
        </Button>
      </div>
    </div>
  );
};

export default RecommendedActionsSection;
