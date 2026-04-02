/* -------------------------------------------
   Normalisation (accents, ponctuation, espaces)
-------------------------------------------- */
function normalizeText(input) {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')                 // sépare accents
    .replace(/[\u0300-\u036f]/g, '')  // enlève accents
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* -------------------------------------------
   Règles de matching (extensibles)
   Chaque règle = un domaine de formation
-------------------------------------------- */
const RULES = [
  {
    id: 'informatique',
    patterns: [
      /\binformatique\b/,
      /\bdevelopp(eur|ement)\b/,
      /\bdev\b/,
      /\blogiciel\b/,
      /\breseau(x)?\b/,
      /\bcyber(securite)?\b/,
      /\bdata\b/,
      /\bintelligence artificielle\b/,
      /\bmachine learning\b/,
      /\bcloud\b/,
    ],
    niveau: 'Bac+2 à Bac+5',
    metiers: ['Développeur', 'Ingénieur informatique', 'Data scientist', 'Administrateur réseau'],
    emplois: ['Développeur web', 'Développeur mobile', 'Ingénieur logiciel', 'Architecte système'],
    weight: 1.0,
  },
  {
    id: 'infirmier',
    patterns: [
      /\binfirmier(e)?\b/,
      /\bsoins\b/,
      /\bifsi\b/,
      /\bparamedical\b/,
    ],
    niveau: 'Bac+3',
    metiers: ['Infirmier', 'Infirmier spécialisé', 'Cadre infirmier'],
    emplois: ['Infirmier hospitalier', 'Infirmier libéral', 'Infirmier scolaire'],
    weight: 1.0,
  },
  {
    id: 'commerce',
    patterns: [
      /\bcommerce\b/,
      /\bvente(s)?\b/,
      /\bmarketing\b/,
      /\bnegociation\b/,
      /\bdistribution\b/,
      /\bmanagement commercial\b/,
      /\baccount manager\b/,
    ],
    niveau: 'Bac+2 à Bac+5',
    metiers: ['Commercial', 'Manager commercial', 'Responsable ventes', 'Chef de projet'],
    emplois: ['Commercial B2B', 'Commercial B2C', 'Responsable secteur', 'Account manager'],
    weight: 0.9,
  },
  {
    id: 'ingenieur',
    patterns: [
      /\bingenieur(e)?\b/,
      /\bgenie\b/,
      /\bindustriel(le)?\b/,
      /\bqualite\b/,
      /\bproduction\b/,
      /\bautomatique\b/,
    ],
    niveau: 'Bac+5',
    metiers: ['Ingénieur', 'Ingénieur senior', 'Chef de projet technique'],
    emplois: ['Ingénieur développement', 'Ingénieur qualité', 'Ingénieur production'],
    weight: 0.85,
  },
  {
    id: 'droit',
    patterns: [
      /\bdroit\b/,
      /\bjuridique\b/,
      /\bjuriste\b/,
      /\bavocat\b/,
      /\bnotaire\b/,
      /\bcontentieux\b/,
    ],
    niveau: 'Bac+3 à Bac+5',
    metiers: ['Avocat', 'Juriste', 'Notaire', 'Magistrat'],
    emplois: ["Juriste d'entreprise", 'Avocat conseil', 'Notaire'],
    weight: 0.95,
  },
  {
    id: 'sante',
    patterns: [
      /\bsante\b/,
      /\bmedecin(e)?\b/,
      /\bpharmacie(n)?\b/,
      /\bdentaire\b/,
      /\bpsycholog(ie|ue)\b/,
      /\bchirurg(ien|ie)\b/,
    ],
    niveau: 'Bac+5 à Bac+6',
    metiers: ['Médecin', 'Pharmacien', 'Dentiste', 'Psychologue'],
    emplois: ['Médecin généraliste', 'Pharmacien officinal', 'Dentiste'],
    weight: 0.9,
  },
];

/* -------------------------------------------
   Inverse mapping (métier -> formations)
   (tu peux garder ton objet, je le normalise)
-------------------------------------------- */
const CAREER_TO_FORMATIONS = {
  'developpeur': ['Licence Informatique', 'BUT Informatique', 'Master Informatique', 'Bootcamp Développement'],
  'infirmier': ["Diplôme d'État Infirmier", 'BTS Santé', 'Licence Santé'],
  'ingenieur informatique': ["Diplôme d'ingénieur", 'Master Informatique', 'Licence Informatique'],
  'commercial': ['BTS Commerce', 'Licence Commerce', 'Master Vente', 'BTS Vente'],
  'avocat': ['Licence Droit', 'Master Droit', "Diplôme d'avocat"],
  'data scientist': ['Master Data Science', 'Master Informatique', 'Licence Informatique'],
  'administrateur reseau': ['BTS Informatique', 'BUT Informatique', 'Licence Informatique'],
  'medecin': ['Licence Santé', 'Master Médecine', "Diplôme d'État Médecin"],
  'pharmacien': ['Licence Pharmacie', 'Master Pharmacie', "Diplôme d'État Pharmacien"],
  'psychologue': ['Licence Psychologie', 'Master Psychologie', "Diplôme d'État Psychologue"],
};

/* -------------------------------------------
   Core matcher (ML-ready)
   Retourne un classement des règles qui matchent
-------------------------------------------- */
function matchFormationText(text) {
  const t = normalizeText(text);
  if (!t) return [];

  const hits = [];

  for (const rule of RULES) {
    let count = 0;
    const matchedPatterns = [];

    for (const p of rule.patterns) {
      if (p.test(t)) {
        count++;
        matchedPatterns.push(p.toString());
      }
    }

    if (count > 0) {
      // score simple: nb de patterns matchés * poids
      const score = count * (rule.weight ?? 1);
      hits.push({
        key: rule.id,
        score,
        matchedPatterns,
        niveau: rule.niveau,
        metiers: rule.metiers,
        emplois: rule.emplois,
      });
    }
  }

  // tri décroissant
  hits.sort((a, b) => b.score - a.score);

  return hits;
}

/* -------------------------------------------
   API publique (compat + enrichie)
-------------------------------------------- */

/**
 * Version enrichie (recommandée)
 * Retourne { metiers, emplois, niveau, debug } avec score
 */
export function getLinksForFormation(formation) {
  const label = formation?.libelle_formation || '';
  const hits = matchFormationText(label);

  if (!hits.length) {
    return { metiers: [], emplois: [], niveau: null, debug: { hits: [] } };
  }

  // Top rule only (simple)
  const top = hits[0];

  return {
    metiers: top.metiers,
    emplois: top.emplois,
    niveau: top.niveau,
    debug: {
      formation: label,
      hits, // utile pour ML / tuning
    }
  };
}

/**
 * Compat: renvoie juste les métiers (ancienne signature)
 */
export function getLinkedMetiers(formation) {
  return getLinksForFormation(formation).metiers;
}

/**
 * Compat: renvoie juste les emplois (ancienne signature)
 */
export function getLinkedEmplois(formation) {
  return getLinksForFormation(formation).emplois;
}

/**
 * Formations liées à un métier (normalisation robuste)
 */
export function getFormationsForMetier(metier) {
  const key = normalizeText(metier);
  if (!key) return [];

  // match exact
  if (CAREER_TO_FORMATIONS[key]) return CAREER_TO_FORMATIONS[key];

  // match partiel (fallback)
  for (const [k, formations] of Object.entries(CAREER_TO_FORMATIONS)) {
    if (key.includes(k) || k.includes(key)) return formations;
  }

  return [];
}

/**
 * Formations liées à un emploi (même logique que métier)
 */
export function getFormationsForEmploi(emploi) {
  return getFormationsForMetier(emploi);
}

/**
 * Détails métier (placeholder)
 */
export function getCareerDetails(careerName) {
  return null;
}

/**
 * Filtre les formations selon un métier cible
 */
export function filterFormationsByCareer(formations, careerName) {
  const linked = getFormationsForMetier(careerName).map(normalizeText);
  if (!linked.length) return [];

  return (formations || []).filter(f => {
    const name = normalizeText(f?.libelle_formation);
    return linked.some(l => l && name.includes(l));
  });
}