/**
 * Mock Métiers Database for Testing
 * Covers 6 RIASEC categories with diverse profiles
 * Used as fallback when Supabase is unavailable
 */

export const mockMetiers = [
  // ===== RÉALISTE (R) - Technical, Manual, Practical =====
  {
    code: 'A1234', libelle: 'Électricien', definition: 'Installer et maintenir les installations électriques',
    riasecMajeur: 'R', riasecMineur: 'C',
    adjusted_weights: { R: 60, I: 20, A: 0, S: 10, E: 5, C: 5 },
    salaire: '28 000 - 35 000 €', debouches: 'Très favorable', niveau_etudes: 'CAP/BEP'
  },
  {
    code: 'A1235', libelle: 'Mécanicien Automobile', definition: 'Réparer et entretenir les véhicules automobiles',
    riasecMajeur: 'R', riasecMineur: 'I',
    adjusted_weights: { R: 65, I: 25, A: 0, S: 5, E: 3, C: 2 },
    salaire: '26 000 - 32 000 €', debouches: 'Favorable', niveau_etudes: 'CAP/BEP'
  },
  {
    code: 'A1236', libelle: 'Plombier', definition: 'Installer et maintenir les systèmes de plomberie',
    riasecMajeur: 'R', riasecMineur: 'C',
    adjusted_weights: { R: 70, I: 10, A: 0, S: 10, E: 5, C: 5 },
    salaire: '26 000 - 40 000 €', debouches: 'Très favorable', niveau_etudes: 'CAP/BEP'
  },
  {
    code: 'A1237', libelle: 'Charpentier', definition: 'Construire et assembler des structures en bois',
    riasecMajeur: 'R', riasecMineur: 'A',
    adjusted_weights: { R: 60, I: 15, A: 15, S: 5, E: 3, C: 2 },
    salaire: '24 000 - 35 000 €', debouches: 'Favorable', niveau_etudes: 'CAP/BEP'
  },
  {
    code: 'A1238', libelle: 'Soudeur', definition: 'Assembler les pièces métalliques par soudure',
    riasecMajeur: 'R', riasecMineur: 'I',
    adjusted_weights: { R: 70, I: 20, A: 5, S: 3, E: 1, C: 1 },
    salaire: '25 000 - 35 000 €', debouches: 'Favorable', niveau_etudes: 'CAP/BEP'
  },

  // ===== INVESTIGATEUR (I) - Research, Analysis, Problem-solving =====
  {
    code: 'B1001', libelle: 'Informaticien', definition: 'Développer et maintenir les systèmes informatiques',
    riasecMajeur: 'I', riasecMineur: 'R',
    adjusted_weights: { R: 15, I: 70, A: 5, S: 5, E: 3, C: 2 },
    salaire: '35 000 - 55 000 €', debouches: 'Très favorable', niveau_etudes: 'Bac+2'
  },
  {
    code: 'B1002', libelle: 'Chimiste', definition: 'Conduire les analyses et réactions chimiques',
    riasecMajeur: 'I', riasecMineur: 'R',
    adjusted_weights: { R: 30, I: 65, A: 0, S: 3, E: 1, C: 1 },
    salaire: '32 000 - 48 000 €', debouches: 'Favorable', niveau_etudes: 'Licence'
  },
  {
    code: 'B1003', libelle: 'Data Scientist', definition: 'Analyser et interpréter les données',
    riasecMajeur: 'I', riasecMineur: 'E',
    adjusted_weights: { R: 10, I: 75, A: 5, S: 5, E: 3, C: 2 },
    salaire: '42 000 - 65 000 €', debouches: 'Très favorable', niveau_etudes: 'Bac+3'
  },
  {
    code: 'B1004', libelle: 'Chercheur Scientifique', definition: 'Conduire des recherches scientifiques',
    riasecMajeur: 'I', riasecMineur: 'A',
    adjusted_weights: { R: 20, I: 70, A: 5, S: 3, E: 1, C: 1 },
    salaire: '35 000 - 55 000 €', debouches: 'Favorable', niveau_etudes: 'Doctorat'
  },
  {
    code: 'B1005', libelle: 'Analyste Financier', definition: 'Analyser les données financières',
    riasecMajeur: 'I', riasecMineur: 'E',
    adjusted_weights: { R: 10, I: 70, A: 0, S: 5, E: 10, C: 5 },
    salaire: '40 000 - 70 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },

  // ===== ARTISTIQUE (A) - Creativity, Design, Expression =====
  {
    code: 'C1101', libelle: 'Graphiste', definition: 'Créer des designs et des visuels',
    riasecMajeur: 'A', riasecMineur: 'I',
    adjusted_weights: { R: 5, I: 20, A: 70, S: 3, E: 1, C: 1 },
    salaire: '26 000 - 40 000 €', debouches: 'Favorable', niveau_etudes: 'Bac+2'
  },
  {
    code: 'C1102', libelle: 'Designer UX/UI', definition: 'Concevoir les interfaces utilisateur',
    riasecMajeur: 'A', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 30, A: 60, S: 0, E: 0, C: 0 },
    salaire: '32 000 - 50 000 €', debouches: 'Très favorable', niveau_etudes: 'Bac+3'
  },
  {
    code: 'C1103', libelle: 'Architecte', definition: 'Concevoir les bâtiments et espaces',
    riasecMajeur: 'A', riasecMineur: 'R',
    adjusted_weights: { R: 30, I: 25, A: 40, S: 3, E: 1, C: 1 },
    salaire: '35 000 - 60 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'C1104', libelle: 'Illustrateur', definition: 'Créer des illustrations et des dessins',
    riasecMajeur: 'A', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 10, A: 80, S: 3, E: 1, C: 1 },
    salaire: '20 000 - 40 000 €', debouches: 'Moyenne', niveau_etudes: 'Bac+2'
  },
  {
    code: 'C1105', libelle: 'Musicien', definition: 'Jouer d\'instruments et composer',
    riasecMajeur: 'A', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 10, A: 75, S: 5, E: 3, C: 2 },
    salaire: '20 000 - 50 000 €', debouches: 'Moyenne', niveau_etudes: 'Conservatoire'
  },

  // ===== SOCIAL (S) - Helping, Collaboration, Service =====
  {
    code: 'D2001', libelle: 'Infirmier', definition: 'Assurer les soins aux patients',
    riasecMajeur: 'S', riasecMineur: 'R',
    adjusted_weights: { R: 25, I: 15, A: 5, S: 50, E: 3, C: 2 },
    salaire: '28 000 - 40 000 €', debouches: 'Très favorable', niveau_etudes: 'Bac+3'
  },
  {
    code: 'D2002', libelle: 'Travailleur Social', definition: 'Aider les personnes en difficulté',
    riasecMajeur: 'S', riasecMineur: 'A',
    adjusted_weights: { R: 5, I: 15, A: 20, S: 55, E: 3, C: 2 },
    salaire: '25 000 - 38 000 €', debouches: 'Favorable', niveau_etudes: 'Licence'
  },
  {
    code: 'D2003', libelle: 'Professeur', definition: 'Enseigner une matière à des élèves',
    riasecMajeur: 'S', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 30, A: 10, S: 45, E: 3, C: 2 },
    salaire: '28 000 - 45 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'D2004', libelle: 'Psychologue', definition: 'Aider les patients à résoudre leurs problèmes',
    riasecMajeur: 'S', riasecMineur: 'I',
    adjusted_weights: { R: 5, I: 35, A: 10, S: 45, E: 3, C: 2 },
    salaire: '30 000 - 50 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'D2005', libelle: 'Éducateur Sportif', definition: 'Enseigner une activité physique',
    riasecMajeur: 'S', riasecMineur: 'R',
    adjusted_weights: { R: 40, I: 5, A: 10, S: 40, E: 3, C: 2 },
    salaire: '24 000 - 35 000 €', debouches: 'Favorable', niveau_etudes: 'Bac+2'
  },

  // ===== ENTREPRENEUR (E) - Leadership, Initiative, Persuasion =====
  {
    code: 'E3001', libelle: 'Manager', definition: 'Diriger une équipe et piloter les projets',
    riasecMajeur: 'E', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 25, A: 5, S: 30, E: 25, C: 5 },
    salaire: '40 000 - 70 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'E3002', libelle: 'Entrepreneur', definition: 'Créer et gérer son propre entreprise',
    riasecMajeur: 'E', riasecMineur: 'I',
    adjusted_weights: { R: 15, I: 25, A: 10, S: 15, E: 30, C: 5 },
    salaire: '35 000 - 100 000 €', debouches: 'Moyenne', niveau_etudes: 'Bac+2'
  },
  {
    code: 'E3003', libelle: 'Commercial', definition: 'Vendre des produits ou services',
    riasecMajeur: 'E', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 10, A: 5, S: 35, E: 40, C: 5 },
    salaire: '26 000 - 50 000 €', debouches: 'Favorable', niveau_etudes: 'Bac+1'
  },
  {
    code: 'E3004', libelle: 'Consultant', definition: 'Conseiller les entreprises sur leurs stratégies',
    riasecMajeur: 'E', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 40, A: 5, S: 15, E: 25, C: 5 },
    salaire: '40 000 - 80 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'E3005', libelle: 'Directeur Général', definition: 'Diriger une entreprise',
    riasecMajeur: 'E', riasecMineur: 'I',
    adjusted_weights: { R: 5, I: 30, A: 5, S: 20, E: 35, C: 5 },
    salaire: '60 000 - 150 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },

  // ===== CONFORMISTE (C) - Organization, Rules, Precision =====
  {
    code: 'F4001', libelle: 'Comptable', definition: 'Gérer les comptes et la trésorerie',
    riasecMajeur: 'C', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 25, A: 0, S: 10, E: 5, C: 50 },
    salaire: '28 000 - 42 000 €', debouches: 'Favorable', niveau_etudes: 'Bac+2'
  },
  {
    code: 'F4002', libelle: 'Auditeur', definition: 'Vérifier la conformité des comptes',
    riasecMajeur: 'C', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 30, A: 0, S: 5, E: 5, C: 50 },
    salaire: '35 000 - 55 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
  {
    code: 'F4003', libelle: 'Assistant Administratif', definition: 'Assurer la gestion administrative',
    riasecMajeur: 'C', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 10, A: 0, S: 20, E: 5, C: 60 },
    salaire: '22 000 - 30 000 €', debouches: 'Moyenne', niveau_etudes: 'Bac'
  },
  {
    code: 'F4004', libelle: 'Responsable RH', definition: 'Gérer les ressources humaines',
    riasecMajeur: 'C', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 15, A: 5, S: 30, E: 10, C: 35 },
    salaire: '32 000 - 48 000 €', debouches: 'Favorable', niveau_etudes: 'Licence'
  },
  {
    code: 'F4005', libelle: 'Notaire', definition: 'Authentifier les actes juridiques',
    riasecMajeur: 'C', riasecMineur: 'I',
    adjusted_weights: { R: 5, I: 30, A: 0, S: 15, E: 10, C: 40 },
    salaire: '40 000 - 100 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },

  // ===== HYBRID PROFILES (Mixed RIASEC) =====
  {
    code: 'G5001', libelle: 'Ingénieur Logiciel', definition: 'Concevoir et développer des logiciels',
    riasecMajeur: 'I', riasecMineur: 'R',
    adjusted_weights: { R: 25, I: 60, A: 5, S: 5, E: 3, C: 2 },
    salaire: '40 000 - 65 000 €', debouches: 'Très favorable', niveau_etudes: 'Master'
  },
  {
    code: 'G5002', libelle: 'Docteur', definition: 'Diagnostiquer et traiter les maladies',
    riasecMajeur: 'S', riasecMineur: 'I',
    adjusted_weights: { R: 15, I: 50, A: 5, S: 25, E: 3, C: 2 },
    salaire: '50 000 - 100 000 €', debouches: 'Très favorable', niveau_etudes: 'Doctorat'
  },
  {
    code: 'G5003', libelle: 'Journaliste', definition: 'Rédiger et publier des articles',
    riasecMajeur: 'A', riasecMineur: 'S',
    adjusted_weights: { R: 5, I: 25, A: 50, S: 15, E: 3, C: 2 },
    salaire: '28 000 - 50 000 €', debouches: 'Moyenne', niveau_etudes: 'Licence'
  },
  {
    code: 'G5004', libelle: 'Chef de Projet', definition: 'Piloter les projets d\'entreprise',
    riasecMajeur: 'E', riasecMineur: 'I',
    adjusted_weights: { R: 10, I: 30, A: 5, S: 20, E: 30, C: 5 },
    salaire: '40 000 - 70 000 €', debouches: 'Très favorable', niveau_etudes: 'Master'
  },
  {
    code: 'G5005', libelle: 'Directeur Marketing', definition: 'Piloter la stratégie marketing',
    riasecMajeur: 'E', riasecMineur: 'A',
    adjusted_weights: { R: 5, I: 20, A: 30, S: 15, E: 25, C: 5 },
    salaire: '45 000 - 75 000 €', debouches: 'Favorable', niveau_etudes: 'Master'
  },
];
