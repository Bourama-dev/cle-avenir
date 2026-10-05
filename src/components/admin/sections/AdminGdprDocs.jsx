import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Shield, Scale, Eye, Mail } from 'lucide-react';

const GDPR_DOCS = [
  {
    title: 'Règlement RGPD — EU 2016/679',
    description: 'Texte officiel du règlement du Parlement européen sur la protection des données.',
    category: 'Réglementation',
    icon: Scale,
    url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679',
  },
  {
    title: 'CNIL — Cookies et traceurs',
    description: 'Recommandations de la CNIL sur la gestion des cookies et le consentement.',
    category: 'Consentement',
    icon: Eye,
    url: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite',
  },
  {
    title: 'CNIL — Durées de conservation',
    description: 'Référentiel des durées maximales de conservation selon le type de données.',
    category: 'Rétention',
    icon: Shield,
    url: 'https://www.cnil.fr/fr/les-durees-de-conservation-des-donnees',
  },
  {
    title: 'Modèle de registre des traitements (CNIL)',
    description: 'Modèle CNIL pour tenir le registre obligatoire des activités de traitement.',
    category: 'Registre',
    icon: FileText,
    url: 'https://www.cnil.fr/fr/RGDP-le-registre-des-activites-de-traitement',
  },
];

const INTERNAL_DOCS = [
  { title: 'Politique de confidentialité', description: 'Document interne (éditable dans Gestion du contenu).', icon: Shield, url: '/politique-confidentialite' },
  { title: 'CGU', description: 'Conditions Générales d\'Utilisation (éditable dans Gestion du contenu).', icon: FileText, url: '/cgu' },
  { title: 'Page RGPD — Droits utilisateurs', description: 'Page publique avec les droits RGPD et le contact DPO.', icon: Mail, url: '/preferences-rgpd' },
];

const CATEGORY_COLORS = {
  'Réglementation': 'bg-purple-100 text-purple-700',
  'Consentement':   'bg-blue-100 text-blue-700',
  'Rétention':      'bg-orange-100 text-orange-700',
  'Registre':       'bg-slate-100 text-slate-700',
};

const DocCard = ({ doc, badge }) => (
  <a
    href={doc.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors group"
  >
    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors flex-shrink-0">
      <doc.icon className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-medium text-sm text-slate-900 group-hover:text-blue-700">{doc.title}</span>
        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{doc.description}</p>
      {badge && (
        <div className="mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[badge] || 'bg-slate-100 text-slate-700'}`}>{badge}</span>
        </div>
      )}
    </div>
  </a>
);

const AdminGdprDocs = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-slate-900">Documentation RGPD</h2>
      <Badge variant="outline">{GDPR_DOCS.length + INTERNAL_DOCS.length} document(s)</Badge>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="w-4 h-4 text-purple-500" /> Références réglementaires externes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {GDPR_DOCS.map(doc => <DocCard key={doc.title} doc={doc} badge={doc.category} />)}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4 text-green-500" /> Documents internes Clé Avenir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {INTERNAL_DOCS.map(doc => <DocCard key={doc.title} doc={doc} />)}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Les documents internes sont éditables depuis <strong>Gestion du contenu → Documents légaux</strong>.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AdminGdprDocs;
