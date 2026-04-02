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

export const CV_TEMPLATES_CONFIG = [
  { 
    id: TEMPLATE_UUIDS.template1, 
    name: 'Classique', 
    description: 'Traditionnel, police avec empattement, mise en page centrée.',
    color: '#475569',
    tags: ['Classique', 'Pro']
  },
  { 
    id: TEMPLATE_UUIDS.template2, 
    name: 'Moderne', 
    description: 'Design épuré avec barre latérale et accents.',
    color: '#8b5cf6',
    tags: ['Moderne', 'Épuré']
  },
  { 
    id: TEMPLATE_UUIDS.template3, 
    name: 'Minimaliste', 
    description: 'Noir et blanc, typographie forte.',
    color: '#0f172a',
    tags: ['Simple', 'Élégant']
  },
  { 
    id: TEMPLATE_UUIDS.template4, 
    name: 'Créatif', 
    description: 'En-tête audacieux, formes géométriques.',
    color: '#10b981',
    tags: ['Créatif', 'Design']
  },
  { 
    id: TEMPLATE_UUIDS.template5, 
    name: 'CléAvenir Pro', 
    description: 'Design officiel avec sidebar.',
    color: '#3b82f6',
    tags: ['Premium', 'Pro']
  },
  { 
    id: TEMPLATE_UUIDS.template6, 
    name: 'CléAvenir Élégance', 
    description: 'En-tête dégradé élégant.',
    color: '#ec4899',
    tags: ['Premium', 'Élégant']
  },
  { 
    id: TEMPLATE_UUIDS.template7, 
    name: 'Exécutif', 
    description: 'Pour les profils seniors et cadres.',
    color: '#1e293b',
    tags: ['Senior', 'Cadre']
  },
  { 
    id: TEMPLATE_UUIDS.template8, 
    name: 'Tech', 
    description: 'Idéal pour les profils techniques et développeurs.',
    color: '#0ea5e9',
    tags: ['Tech', 'Dev']
  }
];