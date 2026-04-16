/**
 * formationKeywords.js
 *
 * Analyzes a full formation title (e.g. "BTS Services Informatiques aux
 * Organisations") and returns clean, meaningful keywords suitable for
 * searching métiers and offres d'emploi.
 *
 * Strategy:
 *  1. Strip diploma-type prefixes (BTS, Master, CAP …)
 *  2. Expand common French acronyms to their full form
 *  3. Remove stopwords & noise chars
 *  4. Deduplicate & return an object with
 *       - metierKeyword  : best single-phrase keyword for /metiers search
 *       - offresKeyword  : best single-phrase keyword for /offres-emploi search
 *       - terms          : array of individual meaningful words
 */

// ── 1. Diploma type prefixes to strip ────────────────────────────────────────
const DEGREE_PREFIXES = [
  // Full names
  "Diplôme d'État", "Diplome d'Etat",
  "Titre Professionnel", "Titre Pro",
  "Brevet de Technicien Supérieur",
  "Bachelor Universitaire de Technologie",
  "Licence Professionnelle",
  "Brevet Professionnel",
  "Certificat de Qualification Professionnelle",
  "Master of Science",
  "Master of Business Administration",
  // Abbreviations
  'MBA', 'MS', 'MSc',
  'DEAS', 'DEI', 'DE ', 'DEUG', 'DEUST',
  'DNMADE', 'DNSEP', 'DNAT',
  'BTS', 'BUT', 'DUT', 'BEP', 'CAP',
  'BAC\\+[0-9]', 'BAC', 'CPGE',
  'Licence', 'Master', 'Mastère', 'MBA',
  'Doctorat', 'Doctorate', 'PhD',
  'Bachelor', 'Grande École',
  'Formation ', 'Certificat ', 'Certification ',
  'Prépa ', 'PREPA ',
  'DCG', 'DSCG', 'CFA',
  'Bac ', 'bac ',
];

// ── 2. French stopwords ───────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'en', 'de', 'du', 'des', 'les', 'aux', 'et', 'le', 'la', "l'", 'à', 'a',
  'par', 'pour', 'sur', 'sous', 'avec', 'sans', 'dans', 'un', 'une', 'ou',
  'que', 'qui', 'au', 'ces', 'ses', 'mes', 'son', 'sa', 'se', 'si', 'ni',
  'y', 'en', 'leur', 'leurs', 'dont', 'où', 'mais', 'car', 'soit',
  'mention', 'parcours', 'option', 'spécialité', 'spécialité', 'niveau',
  'mention', 'cursus', 'voie', 'filière', 'programme',
]);

// ── 3. Acronym expansion (acronym → search-friendly term) ────────────────────
const ACRONYM_MAP = {
  'SIO': 'informatique services',
  'SLAM': 'développement logiciel',
  'SISR': 'réseau informatique',
  'MCO': 'management commercial',
  'NDRC': 'développement commercial relation client',
  'CG': 'comptabilité gestion',
  'GPM': 'gestion production maintenance',
  'ERO': 'économie régionale organisations',
  'AG': 'assistance gestion',
  'SAP': 'services aux personnes',
  'SP3S': 'services personnes santé social',
  'ESF': 'économie sociale familiale',
  'ASSP': 'accompagnement soins services personne',
  'SAPAT': 'services agriculture personne aménagement territoire',
  'ICSI': 'intervention sanitaire sociale',
  'TC': 'technico-commercial',
  'MUC': 'management unités commerciales',
  'NRC': 'négociation relation client',
  'ATI': 'assistance technique ingénierie',
  'IRV': 'instrumentation régulation automatismes',
  'MS': 'management systèmes',
  'RH': 'ressources humaines',
  'GRH': 'gestion ressources humaines',
  'FI': 'finance',
  'GEA': 'gestion entreprises administrations',
  'GEI': 'génie électrique informatique industrielle',
  'GIM': 'génie industriel maintenance',
  'GMP': 'génie mécanique productique',
  'GCCD': 'génie civil construction durable',
  'GEII': 'génie électrique informatique industrielle',
  'MMI': 'métiers multimédia internet',
  'INFONUM': 'information numérique',
  'GACO': 'gestion administrative commerciale organisations',
  'GLT': 'gestion logistique transport',
};

// ── 4. Domain keyword hints (extracted specialty → better search term) ────────
const DOMAIN_HINTS = [
  // Santé / Social
  { pattern: /infirmi[eè]r/i,             metier: 'infirmier',                 offre: 'infirmier soins' },
  { pattern: /aide.soignant|aide soignant/i, metier: 'aide-soignant',          offre: 'aide soignant' },
  { pattern: /kinesith[eé]rapie|kine/i,   metier: 'kinésithérapeute',          offre: 'kinésithérapeute' },
  { pattern: /sage.femme/i,               metier: 'sage-femme',                offre: 'sage-femme' },
  { pattern: /laborantin|analyses bio/i,  metier: 'laborantin',                offre: 'technicien laboratoire' },
  { pattern: /pharmacie/i,                metier: 'pharmacien préparateur',    offre: 'pharmacie' },
  { pattern: /psycholog/i,                metier: 'psychologue',               offre: 'psychologue' },
  { pattern: /educateur|éducateur/i,      metier: 'éducateur',                 offre: 'éducateur spécialisé' },
  { pattern: /travailleur social/i,       metier: 'travailleur social',        offre: 'travail social' },
  // Informatique / Numérique
  { pattern: /d[eé]veloppeur|d[eé]veloppement (web|logiciel|mobile)/i, metier: 'développeur', offre: 'développeur' },
  { pattern: /cybersécurité|cyber s[eé]curit[eé]/i, metier: 'cybersécurité',  offre: 'cybersécurité' },
  { pattern: /intelligence artificielle|machine learning|IA/i, metier: 'data scientist IA', offre: 'intelligence artificielle' },
  { pattern: /réseaux|r[eé]seau t[eé]l[eé]com/i, metier: 'administrateur réseau', offre: 'réseau télécom' },
  { pattern: /data|science des données/i, metier: 'data analyst',             offre: 'data analyst' },
  { pattern: /cloud|devops/i,             metier: 'ingénieur cloud',           offre: 'cloud devops' },
  { pattern: /informatique (de gestion|industrielle)/i, metier: 'informaticien', offre: 'informatique' },
  { pattern: /syst[eè]mes embarqu[eé]s/i, metier: 'ingénieur systèmes embarqués', offre: 'systèmes embarqués' },
  { pattern: /m[eé]tiers (du )?multim[eé]dia|MMI/i, metier: 'développeur web', offre: 'multimédia web' },
  // Commerce / Vente
  { pattern: /commerce|vente|commercial/i, metier: 'commercial',              offre: 'commercial vente' },
  { pattern: /marketing digital/i,        metier: 'chargé marketing digital', offre: 'marketing digital' },
  { pattern: /marketing/i,                metier: 'responsable marketing',    offre: 'marketing' },
  { pattern: /e.commerce/i,               metier: 'responsable e-commerce',   offre: 'e-commerce' },
  { pattern: /management (des)? unit/i,   metier: 'manager unité commerciale', offre: 'responsable magasin' },
  // Finance / Comptabilité
  { pattern: /comptabilit[eé]|comptable/i, metier: 'comptable',               offre: 'comptable' },
  { pattern: /audit/i,                    metier: 'auditeur',                 offre: 'auditeur audit' },
  { pattern: /contr[oô]le de gestion/i,   metier: 'contrôleur de gestion',    offre: 'contrôle de gestion' },
  { pattern: /finance|financ[iè]er/i,     metier: 'analyste financier',       offre: 'finance analyste' },
  { pattern: /banque|bancaire/i,          metier: 'conseiller bancaire',      offre: 'banque conseiller' },
  { pattern: /assurance/i,                metier: 'chargé assurance',         offre: 'assurance' },
  // RH / Management
  { pattern: /ressources humaines|gestion.*(personnel|RH)/i, metier: 'chargé RH', offre: 'ressources humaines RH' },
  { pattern: /management|gestion.*(équipe|projet)/i, metier: 'manager chef de projet', offre: 'management' },
  // Communication / Médias
  { pattern: /communication|relations (publiques|presse)/i, metier: 'chargé communication', offre: 'communication' },
  { pattern: /journalisme/i,              metier: 'journaliste',              offre: 'journaliste rédacteur' },
  { pattern: /design (graphique|UX|UI)|graphisme/i, metier: 'designer graphique', offre: 'designer graphique' },
  { pattern: /photographie/i,             metier: 'photographe',              offre: 'photographe' },
  { pattern: /audiovisuel|cin[eé]ma|vid[eé]o/i, metier: 'monteur vidéo',     offre: 'audiovisuel vidéo' },
  // BTP / Industrie
  { pattern: /[eé]lectricit[eé]|[eé]lectrotech/i, metier: 'électricien',     offre: 'électricien' },
  { pattern: /plomberie|g[eé]nie sanitaire/i, metier: 'plombier',            offre: 'plombier chauffagiste' },
  { pattern: /maçonnerie|construction|g[eé]nie civil/i, metier: 'maçon conducteur travaux', offre: 'gros oeuvre BTP' },
  { pattern: /m[eé]canique|m[eé]catronique/i, metier: 'mécanicien technicien', offre: 'mécanique automobile' },
  { pattern: /automatisme|robotique/i,    metier: 'automaticien',             offre: 'automatisme robotique' },
  { pattern: /logistique|supply chain|transport/i, metier: 'logisticien',    offre: 'logistique transport' },
  // Juridique / Droit
  { pattern: /droit|juridique/i,          metier: 'juriste',                  offre: 'juriste droit' },
  { pattern: /notariat/i,                 metier: 'clerc de notaire',         offre: 'notaire notariat' },
  // Tourisme / Hôtellerie
  { pattern: /tourisme|h[oô]tellerie.restauration/i, metier: 'conseiller tourisme', offre: 'tourisme hôtellerie' },
  { pattern: /restauration|cuisine|cuisinier/i, metier: 'cuisinier chef',     offre: 'cuisinier restauration' },
  // Environnement / Agriculture
  { pattern: /environnement|[eé]cologie/i, metier: 'chargé environnement',   offre: 'environnement écologie' },
  { pattern: /agriculture|agronomie/i,    metier: 'ingénieur agronome',       offre: 'agriculture agronomie' },
  // Éducation
  { pattern: /enseignement|professorat|[eé]ducation nationale/i, metier: 'professeur enseignant', offre: 'enseignant professeur' },
  // Langues
  { pattern: /langues [eé]trang[eè]res|LEA|LCE/i, metier: 'traducteur interprète', offre: 'langues traduction' },
];

/**
 * Main export: analyzes a formation title and returns
 * { metierKeyword, offresKeyword, terms }
 *
 * @param {string} title  Full formation title
 * @returns {{ metierKeyword: string, offresKeyword: string, terms: string[] }}
 */
export function extractFormationKeywords(title) {
  if (!title || typeof title !== 'string') {
    return { metierKeyword: '', offresKeyword: '', terms: [] };
  }

  // ── Step A: check domain hints first (most precise) ───────────────────────
  for (const hint of DOMAIN_HINTS) {
    if (hint.pattern.test(title)) {
      return {
        metierKeyword:  hint.metier,
        offresKeyword:  hint.offre,
        terms: [...hint.metier.split(' '), ...hint.offre.split(' ')],
      };
    }
  }

  // ── Step B: strip degree prefixes ─────────────────────────────────────────
  let cleaned = title;
  const degreeRegex = new RegExp(
    `^(${DEGREE_PREFIXES.join('|')})\\s*[-–—]?\\s*`,
    'gi',
  );
  cleaned = cleaned.replace(degreeRegex, '').trim();

  // Also remove trailing parenthesised acronyms: "(DEI)", "(BTS)", …
  cleaned = cleaned.replace(/\s*\([A-Z0-9+]{2,8}\)\s*$/g, '').trim();
  // Remove em-dashes, en-dashes, hyphens used as separators
  cleaned = cleaned.replace(/\s*[–—]\s*/g, ' ').trim();
  // Remove special chars except letters, digits, spaces, apostrophes, hyphens
  cleaned = cleaned.replace(/[^\w\sàâäéèêëîïôùûüçæœÀÂÄÉÈÊËÎÏÔÙÛÜÇÆŒ'-]/g, ' ');
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // ── Step C: expand acronyms ────────────────────────────────────────────────
  const words = cleaned.split(' ');
  const expandedWords = words.flatMap(w => {
    const upper = w.toUpperCase();
    if (ACRONYM_MAP[upper]) return ACRONYM_MAP[upper].split(' ');
    return [w];
  });

  // ── Step D: remove stopwords & very short tokens ──────────────────────────
  const meaningful = expandedWords.filter(w => {
    const lower = w.toLowerCase().replace(/[''']/g, "'");
    return w.length > 2 && !STOPWORDS.has(lower) && !STOPWORDS.has(w.toLowerCase());
  });

  // ── Step E: build search phrases ──────────────────────────────────────────
  // Use up to 4 words for a natural phrase search
  const phrase = meaningful.slice(0, 4).join(' ');
  // For offres: same phrase tends to work well
  const offresPhrase = meaningful.slice(0, 3).join(' ');

  return {
    metierKeyword: phrase || title,
    offresKeyword: offresPhrase || title,
    terms: meaningful,
  };
}
