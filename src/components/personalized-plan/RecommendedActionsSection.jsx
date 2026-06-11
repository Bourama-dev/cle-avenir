import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Briefcase, Download, Share2, Compass,
  FileText, TrendingUp, RefreshCw, Users,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RIASEC_TRAIT = {
  R: 'manuel et technique',
  I: 'analytique et curieux',
  A: 'créatif et expressif',
  S: 'humain et social',
  E: 'entrepreneurial et leader',
  C: 'rigoureux et organisé',
};

const STATUS_LABEL = {
  lyceen:       'lycéen(ne)',
  etudiant:     'étudiant(e)',
  en_emploi:    'en poste',
  en_recherche: 'en recherche d\'emploi',
  reconversion: 'en reconversion',
};

/** Generates a context-aware sublabel for each action button */
const buildSublabel = (actionId, userProfile, riasecTop) => {
  const status = userProfile?.user_status;
  const edu    = userProfile?.education_level;
  const region = userProfile?.region;
  const trait  = riasecTop ? RIASEC_TRAIT[riasecTop] : null;
  const regionHint = region ? ` près de ${region}` : '';

  switch (actionId) {
    case 'metiers':
      return trait
        ? `Métiers adaptés à ton profil ${trait}`
        : 'Découvrez plus d\'opportunités';

    case 'formations':
      if (status === 'lyceen') return `Formations après le Bac${regionHint}`;
      if (status === 'reconversion') return `Formations courtes & CPF${regionHint}`;
      if (edu) return `Formations à partir de ${edu}${regionHint}`;
      return `Trouvez le bon parcours${regionHint}`;

    case 'offres':
      return trait
        ? `Offres pour profil ${trait}${regionHint}`
        : `Postulez dès maintenant${regionHint}`;

    case 'cv':
      if (status === 'en_recherche') return 'Optimise ton CV pour décrocher un poste';
      if (status === 'reconversion') return 'Valorise tes compétences transférables';
      return 'Généré par IA en 2 minutes';

    case 'bilan':
      if (status === 'en_emploi') return 'Finançable par ton employeur (CPF)';
      if (status === 'reconversion') return 'Clarifie ton projet · Pris en charge CPF';
      return 'CPF · Reconversion professionnelle';

    case 'alternance':
      if (status === 'lyceen') return `Apprends en entreprise dès la rentrée${regionHint}`;
      if (status === 'etudiant') return `Bac+2 à Bac+5 · Rémunéré${regionHint}`;
      return 'Combiner études et travail';

    case 'retest':
      return 'Affiner mon profil RIASEC';

    default:
      return '';
  }
};

const ACTION_BASE = {
  metiers: {
    label:  'Explorer les métiers',
    Icon:   Compass,
    bg:     'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-600',
    route:  '/metiers',
  },
  formations: {
    label:  'Chercher une formation',
    Icon:   GraduationCap,
    bg:     'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200',
    iconBg: 'bg-pink-100 text-pink-600',
    route:  '/formations',
  },
  offres: {
    label:  "Voir les offres d'emploi",
    Icon:   Briefcase,
    bg:     'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    route:  '/offres-emploi',
  },
  cv: {
    label:  'Créer mon CV',
    Icon:   FileText,
    bg:     'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600',
    route:  '/cv-builder',
  },
  bilan: {
    label:  'Bilan de compétences',
    Icon:   TrendingUp,
    bg:     'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    route:  '/bilan-competences',
  },
  alternance: {
    label:  'Chercher une alternance',
    Icon:   Users,
    bg:     'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200',
    iconBg: 'bg-sky-100 text-sky-600',
    route:  '/alternance',
  },
  retest: {
    label:  'Repasser le test',
    Icon:   RefreshCw,
    bg:     'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-500',
    route:  '/test-orientation',
  },
};

const getActionsForStatus = (status) => {
  switch (status) {
    case 'lyceen':      return ['formations', 'alternance', 'metiers'];
    case 'etudiant':    return ['formations', 'alternance', 'offres'];
    case 'en_emploi':   return ['formations', 'bilan', 'metiers'];
    case 'en_recherche':return ['offres', 'cv', 'formations'];
    case 'reconversion':return ['bilan', 'formations', 'metiers'];
    default:            return ['metiers', 'formations', 'offres'];
  }
};

const RecommendedActionsSection = ({ userProfile, riasecProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const status   = userProfile?.user_status || null;
  const riasecTop = riasecProfile
    ? Object.entries(riasecProfile).sort(([, a], [, b]) => b - a)[0]?.[0]
    : null;

  const primaryActions = getActionsForStatus(status);

  // Personalized header hint
  const statusLabel = STATUS_LABEL[status] || null;
  const headerHint = statusLabel
    ? `Actions prioritaires pour toi en tant que ${statusLabel}`
    : 'Tes prochaines étapes';

  return (
    <div className="space-y-3 mb-10">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">{headerHint}</p>

      <div className="grid grid-cols-1 gap-3">
        {primaryActions.map((id) => {
          const def = ACTION_BASE[id];
          if (!def) return null;
          const { label, Icon, bg, iconBg, route } = def;
          const sublabel = buildSublabel(id, userProfile, riasecTop);
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
                {sublabel && <div className="text-xs opacity-70 font-normal">{sublabel}</div>}
              </div>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
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
