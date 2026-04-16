/**
 * Utilities for comparing education levels and adapting the
 * personalized plan to the user's academic background and status.
 */

/** Ordered scale of education levels (lowest → highest) */
export const EDUCATION_ORDER = {
  sans_diplome: 0,
  cap_bep:      1,
  bac:          2,
  'bac+2':      3,
  'bac+3':      4,
  'bac+5':      5,
  doctorat:     6,
};

/** Human-readable labels */
export const EDUCATION_LABELS = {
  sans_diplome: 'Sans diplôme',
  cap_bep:      'CAP / BEP',
  bac:          'Baccalauréat',
  'bac+2':      'Bac+2 (BTS, BUT…)',
  'bac+3':      'Bac+3 (Licence)',
  'bac+5':      'Bac+5 (Master)',
  doctorat:     'Doctorat',
};

/**
 * Returns the numeric level for a user profile's education_level string.
 * Defaults to bac (2) if unknown.
 */
export const getUserEducationLevel = (profile) =>
  EDUCATION_ORDER[profile?.education_level] ?? 2;

/**
 * Returns the numeric level stored inside a formation or metier object.
 * Tries several common column names.
 */
export const getFormationLevel = (formation) => {
  const raw =
    formation?.required_education_level ||
    formation?.minimum_education ||
    formation?.education_level ||
    formation?.level ||
    null;
  if (!raw) return 0;
  // Try direct key lookup first
  if (EDUCATION_ORDER[raw] !== undefined) return EDUCATION_ORDER[raw];
  // Normalise strings like "Bac+3", "BAC+5" → "bac+3"
  const normalised = String(raw).toLowerCase().replace(/\s/g, '');
  return EDUCATION_ORDER[normalised] ?? 0;
};

/**
 * Returns whether a formation's entry requirements are reachable by the user.
 * "Reachable" = user's level ≥ formation's required prerequisite.
 */
export const isFormationAccessible = (formation, userProfile) =>
  getUserEducationLevel(userProfile) >= getFormationLevel(formation);

/**
 * Returns a short accessibility label for a formation card.
 */
export const getAccessibilityLabel = (formation, userProfile) => {
  const userLevel = getUserEducationLevel(userProfile);
  const formLevel = getFormationLevel(formation);
  if (userLevel >= formLevel) return 'accessible';
  if (formLevel - userLevel === 1) return 'prochainement';
  return 'hors_portee';
};

/* ─── User status context ───────────────────────────────────────────────── */

export const USER_STATUS_LABELS = {
  lyceen:       'Lycéen·ne',
  etudiant:     'Étudiant·e',
  en_emploi:    'En emploi',
  en_recherche: 'En recherche d\'emploi',
  reconversion: 'En reconversion',
};

/**
 * Returns contextual content for each user_status:
 *  - stepLabels: personalised labels for the ProgressionSection steps
 *  - formationTitle: section title shown above formations
 *  - quickActions: priority actions to highlight in RecommendedActionsSection
 */
export const getStatusContext = (userStatus) => {
  switch (userStatus) {
    case 'lyceen':
      return {
        stepLabels: [
          { title: 'Profil RIASEC', desc: 'Tes intérêts analysés' },
          { title: 'Choisir un métier', desc: 'Cibler 1 à 3 métiers' },
          { title: 'Après le bac', desc: 'BTS, BUT, Licence Pro…' },
          { title: 'Candidatures', desc: 'Parcoursup & alternance' },
        ],
        formationTitle: 'Formations accessibles après le bac',
        primaryAction: 'formations',
        quickActions: ['formations', 'metiers', 'offres'],
      };

    case 'etudiant':
      return {
        stepLabels: [
          { title: 'Profil RIASEC', desc: 'Tes intérêts analysés' },
          { title: 'Cibler un métier', desc: '1 à 3 métiers cibles' },
          { title: 'Poursuite d\'études', desc: 'Master, alternance, stage' },
          { title: 'Premier emploi', desc: 'Préparer ta candidature' },
        ],
        formationTitle: 'Formations et spécialisations complémentaires',
        primaryAction: 'formations',
        quickActions: ['formations', 'offres', 'metiers'],
      };

    case 'en_emploi':
      return {
        stepLabels: [
          { title: 'Profil RIASEC', desc: 'Vos intérêts analysés' },
          { title: 'Métier cible', desc: 'Évolution ou pivot' },
          { title: 'Formation continue', desc: 'CPF, e-learning, certif.' },
          { title: 'Transition', desc: 'Négocier ou postuler' },
        ],
        formationTitle: 'Formations compatibles avec votre emploi',
        primaryAction: 'offres',
        quickActions: ['offres', 'formations', 'metiers'],
      };

    case 'en_recherche':
      return {
        stepLabels: [
          { title: 'Profil RIASEC', desc: 'Vos intérêts analysés' },
          { title: 'Métier cible', desc: 'Clarifier votre projet' },
          { title: 'Formation booster', desc: 'Renforcer votre profil' },
          { title: 'Candidatures', desc: 'CV, lettres, entretiens' },
        ],
        formationTitle: 'Formations pour renforcer votre candidature',
        primaryAction: 'offres',
        quickActions: ['offres', 'formations', 'metiers'],
      };

    case 'reconversion':
      return {
        stepLabels: [
          { title: 'Bilan RIASEC', desc: 'Vos nouvelles orientations' },
          { title: 'Nouveau métier', desc: 'Valider votre projet' },
          { title: 'Reconversion', desc: 'VAE, CPF, bilan de compét.' },
          { title: 'Nouvelle activité', desc: 'Candidature ou création' },
        ],
        formationTitle: 'Formations de reconversion recommandées',
        primaryAction: 'formations',
        quickActions: ['formations', 'metiers', 'offres'],
      };

    default:
      return {
        stepLabels: [
          { title: 'Test complété', desc: 'Profil RIASEC analysé' },
          { title: 'Choisir un métier', desc: 'Cibler 1 à 3 métiers' },
          { title: 'Planifier la formation', desc: 'Trouver le bon parcours' },
          { title: 'Chercher des offres', desc: 'Préparer votre candidature' },
        ],
        formationTitle: 'Parcours de Formation Suggérés',
        primaryAction: 'formations',
        quickActions: ['formations', 'metiers', 'offres'],
      };
  }
};
