import { v4 as uuidv4 } from 'uuid';

// We use deterministically generated UUIDs for templates to ensure consistency 
// across reloads while satisfying the UUID v4 database type requirement.
export const TEMPLATE_UUIDS = {
  template1: 'b5344c80-db05-4b08-8e68-0fa2e3c099b1',
  template2: '4d1b827e-cf9d-476a-9b41-285642a8b3f2',
  template3: 'f9a94121-65b1-4f38-958b-0e5414d4e0b3',
  template4: '8c3b7218-47e0-4ab9-80fb-125028ef7f24',
  template5: 'c71a3962-8419-4a0b-9df1-ab8a261811e5',
  template6: '1e9d8463-548c-4a31-b847-160fa48d7c96',
  template7: 'd50b4112-9c17-48f1-949f-b98a01f782c7',
  template8: '7a250391-4fb2-4917-8a15-0814fdb502d8'
};

// `ats: true` marks the layouts recruiting software (ATS) parses best: one
// column, standard section titles, contact details at the top, dark text on a
// light background. Checked by extracting the text of exported PDFs: these
// read top to bottom in the right order. Multi-column, card and dark layouts
// still export real text, but some ATS mix up their reading order.
export const CV_TEMPLATES_CONFIG = [
  {
    id: TEMPLATE_UUIDS.template1,
    name: 'Classique',
    description: 'Traditionnel, une colonne, en-tête centré.',
    color: '#475569',
    tags: ['Classique', 'Pro'],
    ats: true
  },
  {
    id: TEMPLATE_UUIDS.template2,
    name: 'Moderne',
    description: 'Colonne latérale sombre pour le contact et les compétences.',
    color: '#8b5cf6',
    tags: ['Moderne', 'Épuré']
  },
  {
    id: TEMPLATE_UUIDS.template3,
    name: 'Dégradé',
    description: 'En-tête en dégradé, sections en cartes sur deux colonnes.',
    color: '#0f172a',
    tags: ['Moderne', 'Coloré']
  },
  {
    id: TEMPLATE_UUIDS.template4,
    name: 'Tech',
    description: 'Fond sombre façon terminal, pour les profils techniques.',
    color: '#10b981',
    tags: ['Tech', 'Dev']
  },
  {
    id: TEMPLATE_UUIDS.template5,
    name: 'CléAvenir Pro',
    description: 'Design officiel avec colonne latérale et niveaux de compétences.',
    color: '#3b82f6',
    tags: ['Premium', 'Pro']
  },
  {
    id: TEMPLATE_UUIDS.template6,
    name: 'Minimaliste',
    description: 'Sobre, une colonne, titres de section dans la marge.',
    color: '#ec4899',
    tags: ['Simple', 'Élégant'],
    ats: true
  },
  {
    id: TEMPLATE_UUIDS.template7,
    name: 'Créatif',
    description: 'Blocs colorés disposés en grille.',
    color: '#1e293b',
    tags: ['Créatif', 'Design']
  },
  {
    id: TEMPLATE_UUIDS.template8,
    name: 'Élégance',
    description: 'Sur fond crème, en-tête centré et deux colonnes.',
    color: '#0ea5e9',
    tags: ['Élégant', 'Cadre']
  }
];
