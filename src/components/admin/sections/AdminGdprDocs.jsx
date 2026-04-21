import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, CheckCircle2, AlertCircle, ExternalLink,
  ChevronDown, ChevronRight, BookOpen, Scale, Shield, Cookie, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOCS = [
  {
    id: 'privacy',
    label: 'Politique de Confidentialité',
    icon: Shield,
    color: 'text-emerald-600 bg-emerald-50',
    route: '/privacy',
    adminRoute: '/admin/content',
    status: 'published',
    description: 'Définit comment les données personnelles sont collectées, traitées et conservées.',
    articles: [
      'Responsable du traitement',
      'Données collectées et finalités',
      'Base légale des traitements',
      'Durée de conservation',
      'Droits des utilisateurs',
      'Transferts internationaux',
    ],
  },
  {
    id: 'cgu',
    label: "Conditions Générales d'Utilisation",
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
    route: '/terms',
    adminRoute: '/admin/content',
    status: 'published',
    description: "Définit les règles d'utilisation de la plateforme CléAvenir.",
    articles: [
      'Objet et champ d\'application',
      'Accès au service',
      'Création de compte',
      'Utilisation du service',
      'Propriété intellectuelle',
      'Responsabilité',
    ],
  },
  {
    id: 'cookies',
    label: 'Politique des Cookies',
    icon: Cookie,
    color: 'text-amber-600 bg-amber-50',
    route: '/legal/cookies',
    adminRoute: '/admin/content',
    status: 'published',
    description: 'Informe sur les cookies utilisés et leur finalité.',
    articles: [
      'Définition des cookies',
      'Cookies essentiels',
      'Cookies analytiques',
      'Cookies de personnalisation',
      'Gestion des préférences',
      'Durée de conservation',
    ],
  },
  {
    id: 'legal',
    label: 'Mentions Légales',
    icon: Scale,
    color: 'text-rose-600 bg-rose-50',
    route: '/legal',
    adminRoute: '/admin/content',
    status: 'published',
    description: 'Informations légales sur l\'éditeur, l\'hébergeur et les responsabilités.',
    articles: [
      'Éditeur du site',
      'Directeur de la publication',
      'Hébergement',
      'Propriété intellectuelle',
      'Médiation',
    ],
  },
  {
    id: 'rgpd',
    label: 'RGPD — Droits des Utilisateurs',
    icon: Globe,
    color: 'text-indigo-600 bg-indigo-50',
    route: '/preferences-rgpd',
    adminRoute: '/admin/content',
    status: 'published',
    description: 'Explique les droits RGPD et comment les exercer.',
    articles: [
      'Droit d\'accès',
      'Droit de rectification',
      'Droit à l\'effacement',
      'Droit à la portabilité',
      'Droit d\'opposition',
      'Contact DPO & CNIL',
    ],
  },
];

const OBLIGATIONS = [
  { label: 'Registre des activités de traitement (RAT)', status: true, note: 'Tenu à jour via les logs d\'audit' },
  { label: 'Analyse d\'impact (AIPD)', status: true, note: 'Réalisée lors du lancement' },
  { label: 'DPO désigné', status: true, note: 'dpo@cleavenir.com' },
  { label: 'Contrats sous-traitants (DPA)', status: true, note: 'Supabase, Vercel, Stripe' },
  { label: 'Procédure de notification de violation', status: true, note: '72h CNIL + utilisateurs concernés' },
  { label: 'Anonymisation des données supprimées', status: false, note: 'À finaliser' },
  { label: 'Audit RGPD annuel', status: false, note: 'Planifier pour 2026' },
];

const DocCard = ({ doc }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const Icon = doc.icon;

  return (
    <Card className="border-slate-200 overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${doc.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm">{doc.label}</span>
            {doc.status === 'published' ? (
              <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs">Publié</Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 border-none text-xs">Brouillon</Badge>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{doc.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={doc.route}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
            title="Voir la page publique"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {doc.articles.map((a, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {a}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(doc.adminRoute)}
            className="text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Modifier dans l'éditeur
          </Button>
        </div>
      )}
    </Card>
  );
};

const AdminGdprDocs = () => {
  const publishedCount = DOCS.filter(d => d.status === 'published').length;
  const obligationsDone = OBLIGATIONS.filter(o => o.status).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Documentation RGPD</h2>
        <p className="text-slate-500 text-sm mt-1">
          Vue d'ensemble de tous les documents légaux et obligations RGPD.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200">
          <p className="text-2xl font-bold text-emerald-600">{publishedCount}/{DOCS.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Documents publiés</p>
        </Card>
        <Card className="p-4 border-slate-200">
          <p className="text-2xl font-bold text-indigo-600">{obligationsDone}/{OBLIGATIONS.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Obligations remplies</p>
        </Card>
        <Card className="p-4 border-slate-200 col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-amber-600">{OBLIGATIONS.length - obligationsDone}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Points à traiter</p>
        </Card>
      </div>

      {/* Documents */}
      <div>
        <h3 className="font-bold text-slate-800 text-sm mb-3">Documents légaux</h3>
        <div className="space-y-3">
          {DOCS.map(doc => <DocCard key={doc.id} doc={doc} />)}
        </div>
      </div>

      {/* Obligations RGPD */}
      <div>
        <h3 className="font-bold text-slate-800 text-sm mb-3">Obligations légales RGPD</h3>
        <Card className="border-slate-200 divide-y divide-slate-100">
          {OBLIGATIONS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                {item.status ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <div>
                  <span className="font-medium text-slate-700 text-sm">{item.label}</span>
                  {item.note && <p className="text-slate-400 text-xs mt-0.5">{item.note}</p>}
                </div>
              </div>
              {item.status ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs shrink-0">Conforme</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs shrink-0">À faire</Badge>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default AdminGdprDocs;
