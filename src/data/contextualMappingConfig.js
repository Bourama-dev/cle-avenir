/**
 * Contextual Mapping Configuration
 * Maps RIASEC Axes + Sectors to job recommendations with keywords and boost factors
 */

export const AXIS_SECTOR_CONFIGS = {
  // ===== ENTREPRENEUR (E) - Leadership, Initiative, Persuasion =====
  'E': {
    'Défense & Armée': {
      label: 'Leadership Militaire',
      jobPatterns: ['Officier', 'Colonel', 'Commandant', 'Général', 'Capitaine', 'Sergent', 'Chef d\'état-major'],
      keywords: ['commandement', 'hiérarchie', 'stratégie militaire', 'protection', 'discipline', 'déploiement'],
      boostFactors: { leadership: 1.6, responsibility: 1.5, rigor: 1.3 },
      description: 'Rôles où vous dirigerez des équipes et appliquerez la stratégie militaire'
    },
    'Sports & Activités Physiques': {
      label: 'Management Sportif',
      jobPatterns: ['Coach', 'Manager d\'équipe', 'Directeur sportif', 'Agent sportif', 'Entraîneur', 'Responsable'],
      keywords: ['performance', 'équipe', 'compétition', 'motivation', 'coaching', 'athlétisme', 'sport'],
      boostFactors: { leadership: 1.5, teamwork: 1.4, responsibility: 1.3 },
      description: 'Rôles où vous motiverez des athlètes et gérerez des équipes sportives'
    },
    'Management Sportif': {
      label: 'Gestion Sportive',
      jobPatterns: ['Directeur', 'Manager d\'équipe', 'Responsable sponsoring', 'Directeur général'],
      keywords: ['gestion', 'équipe', 'stratégie sportive', 'performances', 'budgets'],
      boostFactors: { leadership: 1.5, responsibility: 1.4 },
      description: 'Rôles stratégiques dans le management des organisations sportives'
    },
    'Gestion & Management': {
      label: 'Management Généraliste',
      jobPatterns: ['Manager', 'Directeur', 'Responsable', 'Chef de projet', 'Coordinateur'],
      keywords: ['gestion', 'équipe', 'stratégie', 'leadership', 'performance'],
      boostFactors: { leadership: 1.4, responsibility: 1.3 },
      description: 'Rôles managériaux transversaux dans tous les secteurs'
    },
    'Entrepreneuriat': {
      label: 'Création d\'Entreprise',
      jobPatterns: ['Entrepreneur', 'Créateur', 'Fondateur', 'Directeur général startup'],
      keywords: ['création', 'innovation', 'initiative', 'entrepreneuriat', 'startup'],
      boostFactors: { leadership: 1.5, responsibility: 1.4 },
      description: 'Créer et développer votre propre entreprise ou projet'
    },
    'Commerce & Vente': {
      label: 'Vente et Persuasion',
      jobPatterns: ['Commercial', 'Responsable vente', 'Business Developer', 'Account manager'],
      keywords: ['vente', 'commercial', 'persuasion', 'négociation', 'client'],
      boostFactors: { leadership: 1.3, responsibility: 1.2 },
      description: 'Rôles commerciaux avec prise d\'initiative et prospection'
    },
    'default': {
      label: 'Management & Leadership',
      jobPatterns: ['Manager', 'Consultant', 'Directeur', 'Chef de projet', 'Responsable'],
      keywords: ['gestion', 'stratégie', 'équipe', 'initiative', 'leadership'],
      boostFactors: { leadership: 1.3, responsibility: 1.2 },
      description: 'Rôles managériaux adaptés à votre profil entrepreneur'
    }
  },

  // ===== INVESTIGATEUR (I) - Analysis, Research, Problem-solving =====
  'I': {
    'Informatique & Numérique': {
      label: 'Tech & Innovation',
      jobPatterns: ['Développeur', 'Data Scientist', 'Ingénieur logiciel', 'Architecte IT', 'Chercheur'],
      keywords: ['programmation', 'données', 'algorithme', 'analyse', 'développement', 'tech'],
      boostFactors: { analysis: 1.5, creativity: 1.2 },
      description: 'Rôles techniques où vous résoudrez des problèmes complexes'
    },
    'Recherche Scientifique': {
      label: 'Recherche & Science',
      jobPatterns: ['Chercheur', 'Scientifique', 'Chercheur postdoctoral', 'Laboratoire'],
      keywords: ['recherche', 'science', 'expérimentation', 'analyse', 'découverte'],
      boostFactors: { analysis: 1.6, rigor: 1.4 },
      description: 'Rôles de recherche fondamentale et appliquée'
    },
    'Chimie & Pharmacie': {
      label: 'Chimie & Pharma',
      jobPatterns: ['Chimiste', 'Pharmacien', 'Responsable R&D', 'Analyste'],
      keywords: ['chimie', 'pharmacie', 'molécules', 'analyse', 'laboratoire'],
      boostFactors: { analysis: 1.5, rigor: 1.3 },
      description: 'Rôles d\'analyse et de recherche en chimie et pharmacologie'
    },
    'Finance & Comptabilité': {
      label: 'Analyse Financière',
      jobPatterns: ['Analyste financier', 'Économiste', 'Auditeur', 'Responsable'],
      keywords: ['analyse', 'données financières', 'audit', 'modélisation'],
      boostFactors: { analysis: 1.4, organization: 1.2 },
      description: 'Rôles d\'analyse et de modélisation financière'
    },
    'Ingénierie': {
      label: 'Ingénierie',
      jobPatterns: ['Ingénieur', 'Responsable technique', 'Chef de projet'],
      keywords: ['ingénierie', 'technique', 'problèmes complexes', 'innovation'],
      boostFactors: { analysis: 1.4, practical: 1.3 },
      description: 'Rôles techniques requérant analyse et résolution de problèmes'
    },
    'default': {
      label: 'Analyse & Recherche',
      jobPatterns: ['Analyste', 'Chercheur', 'Ingénieur', 'Expert'],
      keywords: ['analyse', 'recherche', 'données', 'problèmes', 'solution'],
      boostFactors: { analysis: 1.3, creativity: 1.1 },
      description: 'Rôles analytiques et de recherche'
    }
  },

  // ===== ARTISTIQUE (A) - Creativity, Design, Expression =====
  'A': {
    'Arts & Design': {
      label: 'Arts & Design',
      jobPatterns: ['Designer', 'Graphiste', 'Artiste', 'Directeur créatif', 'Illustrateur'],
      keywords: ['design', 'créativité', 'esthétique', 'visuel', 'art'],
      boostFactors: { creativity: 1.6, analysis: 1.1 },
      description: 'Rôles créatifs et de conception visuelle'
    },
    'Beaux-Arts': {
      label: 'Beaux-Arts',
      jobPatterns: ['Artiste', 'Sculpteur', 'Peintre', 'Restaurateur'],
      keywords: ['art', 'création', 'beaux-arts', 'expression', 'esthétique'],
      boostFactors: { creativity: 1.7 },
      description: 'Expression artistique et création'
    },
    'Musique & Spectacle': {
      label: 'Musique & Performance',
      jobPatterns: ['Musicien', 'Compositeur', 'Performer', 'Chef d\'orchestre'],
      keywords: ['musique', 'spectacle', 'performance', 'art', 'création'],
      boostFactors: { creativity: 1.6, teamwork: 1.2 },
      description: 'Carrière en musique et spectacle vivant'
    },
    'Architecture': {
      label: 'Architecture',
      jobPatterns: ['Architecte', 'Designer', 'Urbaniste', 'Responsable projet'],
      keywords: ['architecture', 'design', 'bâtiment', 'création', 'espace'],
      boostFactors: { creativity: 1.4, analysis: 1.3 },
      description: 'Conception d\'espaces et de bâtiments'
    },
    'Multimédia & Audiovisuel': {
      label: 'Multimédia & Audiovisuel',
      jobPatterns: ['Vidéaste', 'Réalisateur', 'Motion designer', 'Producteur'],
      keywords: ['vidéo', 'multimédia', 'audiovisuel', 'création', 'production'],
      boostFactors: { creativity: 1.5, teamwork: 1.2 },
      description: 'Production audiovisuelle et multimédia'
    },
    'Marketing & Communication': {
      label: 'Communication Créative',
      jobPatterns: ['Creative manager', 'Copywriter', 'Directeur créatif', 'Brand manager'],
      keywords: ['création', 'communication', 'stratégie créative', 'branding'],
      boostFactors: { creativity: 1.4, responsibility: 1.2 },
      description: 'Rôles créatifs en communication et marketing'
    },
    'default': {
      label: 'Création & Expression',
      jobPatterns: ['Designer', 'Créatif', 'Artiste', 'Directeur créatif'],
      keywords: ['créativité', 'art', 'design', 'expression', 'création'],
      boostFactors: { creativity: 1.4 },
      description: 'Rôles privilégiant la créativité et l\'expression'
    }
  },

  // ===== SOCIAL (S) - Helping, Collaboration, Service =====
  'S': {
    'Professions Médicales': {
      label: 'Métiers Médicaux',
      jobPatterns: ['Docteur', 'Médecin', 'Chirurgien', 'Spécialiste', 'Généraliste'],
      keywords: ['santé', 'médecine', 'patient', 'diagnostic', 'soin'],
      boostFactors: { teamwork: 1.3, responsibility: 1.4 },
      description: 'Carrière en médecine et soins aux patients'
    },
    'Santé & Paramédical': {
      label: 'Métiers Paramédicaux',
      jobPatterns: ['Infirmier', 'Physiothérapeute', 'Aide-soignant', 'Technicien'],
      keywords: ['soin', 'santé', 'patient', 'assistance', 'bien-être'],
      boostFactors: { teamwork: 1.4, responsibility: 1.3 },
      description: 'Professions paramédicales et assistance aux patients'
    },
    'Santé & Social': {
      label: 'Social & Solidarité',
      jobPatterns: ['Travailleur social', 'Éducateur', 'Conseiller', 'Responsable'],
      keywords: ['social', 'aide', 'accompagnement', 'solidarité', 'bien-être'],
      boostFactors: { teamwork: 1.4, responsibility: 1.3 },
      description: 'Rôles d\'aide sociale et d\'accompagnement'
    },
    'Éducation & Enseignement': {
      label: 'Éducation & Pédagogie',
      jobPatterns: ['Professeur', 'Éducateur', 'Formateur', 'Responsable pédagogique'],
      keywords: ['enseignement', 'éducation', 'apprentissage', 'pédagogie', 'transmission'],
      boostFactors: { teamwork: 1.4, creativity: 1.1 },
      description: 'Métiers de l\'enseignement et de la formation'
    },
    'Petite Enfance': {
      label: 'Petite Enfance',
      jobPatterns: ['Éducateur petite enfance', 'Assistante maternelle', 'Puéricultrice'],
      keywords: ['enfants', 'éducation', 'soin', 'développement', 'bienveillance'],
      boostFactors: { teamwork: 1.4, responsibility: 1.3 },
      description: 'Éducation et soin des jeunes enfants'
    },
    'Services à la Personne': {
      label: 'Services à la Personne',
      jobPatterns: ['Aide à domicile', 'Accompagnateur', 'Agent de service'],
      keywords: ['service', 'assistance', 'aide', 'bien-être', 'accompagnement'],
      boostFactors: { teamwork: 1.3, responsibility: 1.2 },
      description: 'Services d\'aide et d\'accompagnement personnalisé'
    },
    'default': {
      label: 'Aide & Service',
      jobPatterns: ['Assistant', 'Éducateur', 'Aide', 'Agent de service'],
      keywords: ['aide', 'service', 'personne', 'bien-être', 'assistance'],
      boostFactors: { teamwork: 1.3 },
      description: 'Rôles de service et d\'aide à autrui'
    }
  },

  // ===== RÉALISTE (R) - Technical, Manual, Practical =====
  'R': {
    'Industrie & Mécanique': {
      label: 'Industrie & Mécanique',
      jobPatterns: ['Mécanicien', 'Technicien', 'Ouvrier', 'Responsable production'],
      keywords: ['mécanique', 'industrie', 'machine', 'production', 'maintenance'],
      boostFactors: { practical: 1.5, responsibility: 1.2 },
      description: 'Rôles techniques en mécanique et production'
    },
    'Électricité & Électronique': {
      label: 'Électrique & Électronique',
      jobPatterns: ['Électricien', 'Technicien', 'Installateur', 'Responsable'],
      keywords: ['électricité', 'électronique', 'installation', 'maintenance', 'installation'],
      boostFactors: { practical: 1.5, organization: 1.2 },
      description: 'Rôles techniques en électricité et électronique'
    },
    'Logistique & Transport': {
      label: 'Logistique & Transport',
      jobPatterns: ['Chauffeur', 'Responsable logistique', 'Magasinier', 'Opérateur'],
      keywords: ['logistique', 'transport', 'organisation', 'déplacement', 'distribution'],
      boostFactors: { practical: 1.4, organization: 1.3 },
      description: 'Métiers de logistique et transport'
    },
    'Agriculture & Métiers Verts': {
      label: 'Agriculture & Environnement',
      jobPatterns: ['Agriculteur', 'Jardinier', 'Forestier', 'Environnementaliste'],
      keywords: ['agriculture', 'nature', 'environnement', 'cultivation', 'terrain'],
      boostFactors: { practical: 1.4, creativity: 1.1 },
      description: 'Métiers de la terre et de l\'environnement'
    },
    'Hôtellerie & Restauration': {
      label: 'Hôtellerie & Restauration',
      jobPatterns: ['Chef', 'Cuisinier', 'Responsable cuisine', 'Gérant'],
      keywords: ['cuisine', 'restauration', 'hôtellerie', 'food', 'service'],
      boostFactors: { practical: 1.4, teamwork: 1.2 },
      description: 'Métiers de la cuisine et l\'accueil'
    },
    'default': {
      label: 'Métiers Techniques',
      jobPatterns: ['Technicien', 'Mécanicien', 'Opérateur', 'Responsable'],
      keywords: ['technique', 'pratique', 'maintenance', 'opération', 'machine'],
      boostFactors: { practical: 1.3 },
      description: 'Rôles techniques et pratiques'
    }
  },

  // ===== CONFORMISTE (C) - Organization, Rules, Precision =====
  'C': {
    'Finance & Comptabilité': {
      label: 'Finance & Comptabilité',
      jobPatterns: ['Comptable', 'Auditeur', 'Contrôleur', 'Responsable finance'],
      keywords: ['comptabilité', 'finance', 'audit', 'trésorier', 'bilan'],
      boostFactors: { organization: 1.5, rigor: 1.5 },
      description: 'Gestion financière et comptable précise'
    },
    'Droit & Légal': {
      label: 'Droit & Légal',
      jobPatterns: ['Avocat', 'Notaire', 'Juriste', 'Responsable légal'],
      keywords: ['droit', 'légal', 'loi', 'contrat', 'juridique'],
      boostFactors: { rigor: 1.6, analysis: 1.2 },
      description: 'Métiers du droit et de la conformité légale'
    },
    'Conformité & Audit': {
      label: 'Conformité & Audit',
      jobPatterns: ['Auditeur', 'Compliance officer', 'Responsable conformité'],
      keywords: ['conformité', 'audit', 'risque', 'protocole', 'vérification'],
      boostFactors: { rigor: 1.6, organization: 1.4 },
      description: 'Assurance qualité et conformité réglementaire'
    },
    'Ressources Humaines': {
      label: 'Ressources Humaines',
      jobPatterns: ['Responsable RH', 'Gestionnaire', 'Recruteur', 'Responsable paye'],
      keywords: ['rh', 'recrutement', 'paie', 'gestion', 'personnel'],
      boostFactors: { organization: 1.4, responsibility: 1.2 },
      description: 'Gestion et organisation des ressources humaines'
    },
    'Administration': {
      label: 'Administration & Organisation',
      jobPatterns: ['Assistant administratif', 'Gestionnaire', 'Responsable admin', 'Secrétaire'],
      keywords: ['administration', 'organisation', 'gestion administrative', 'dossiers'],
      boostFactors: { organization: 1.5, rigor: 1.3 },
      description: 'Gestion administrative et organisation'
    },
    'default': {
      label: 'Organisation & Précision',
      jobPatterns: ['Responsable', 'Gestionnaire', 'Administrateur', 'Assistant'],
      keywords: ['organisation', 'gestion', 'ordre', 'précision', 'protocole'],
      boostFactors: { organization: 1.3, rigor: 1.2 },
      description: 'Rôles privilégiant organisation et rigueur'
    }
  },
};
