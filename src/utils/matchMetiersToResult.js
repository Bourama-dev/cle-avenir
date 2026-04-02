import { questions } from '@/data/questions';

const TRAIT_KEYWORD_MAPPING = {
  'tech': ['tech', 'informatique', 'digital', 'web', 'code', 'logiciel', 'données', 'data', 'numérique'],
  'analytique': ['analyse', 'finance', 'gestion', 'comptabilité', 'chiffres', 'rigueur', 'logic', 'stratégie', 'statistiques'],
  'creativite': ['design', 'art', 'création', 'graphisme', 'communication', 'creative', 'culture', 'interface'],
  'relationnel': ['social', 'rh', 'service', 'conseil', 'humain', 'accompagnement', 'aide', 'empathie'],
  'commerce': ['commerce', 'vente', 'marketing', 'business', 'négociation', 'client', 'persuasion'],
  'sante': ['santé', 'soin', 'médical', 'health', 'patient', 'bien-être', 'infirmier'],
  'environnement': ['nature', 'agriculture', 'environnement', 'outdoor', 'écologie', 'paysage', 'botanique'],
  'pratique': ['construction', 'artisanat', 'industrie', 'manual', 'terrain', 'technique', 'manuel', 'bâtiment'],
  'droit': ['droit', 'justice', 'juridique', 'law', 'règles', 'conformité', 'loi', 'administration'],
  'sport': ['sport', 'physique', 'performance', 'athlète'],
  'education': ['enseignement', 'formation', 'éducation', 'pédagogie', 'transmission', 'apprentissage'],
  'leadership': ['management', 'direction', 'gestion de projet', 'manager', 'lead', 'coordination'],
  'autonomie': ['indépendant', 'freelance', 'autonomie', 'télétravail'],
  'equipe': ['équipe', 'collaboration', 'projet'],
  'innovation': ['innovation', 'recherche', 'développement', 'futur']
};

export const classifyProfile = (userAnswers) => {
  console.log("[Matching] Starting classification with answers:", userAnswers);
  let vector = {};
  
  if (!userAnswers || !Array.isArray(userAnswers) || userAnswers.length === 0) {
    return { type: 'Généraliste', score: 50, vector: {}, topTraits: [], sectors: [] };
  }

  userAnswers.forEach(ans => {
    const q = questions.find(q => q.id === ans.questionId);
    if (!q) return;
    const a = q.answers.find(a => a.id === ans.answerId);
    if (!a || !a.weights) return;
    
    const qWeight = q.weight || 1.0;
    Object.entries(a.weights).forEach(([trait, value]) => {
      vector[trait] = (vector[trait] || 0) + (value * qWeight);
    });
  });

  const maxVal = Math.max(...Object.values(vector), 1);
  Object.keys(vector).forEach(k => {
    vector[k] = Math.round((vector[k] / maxVal) * 100);
  });

  const sortedTraits = Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .filter(t => t[1] > 20);

  const topTraits = sortedTraits.slice(0, 4).map(t => t[0]);
  
  let profileType = "Pragmatique & Polyvalent";
  if (topTraits.includes('tech') || topTraits.includes('analytique')) profileType = "Analytique & Tech";
  else if (topTraits.includes('creativite') || topTraits.includes('art')) profileType = "Créatif & Innovant";
  else if (topTraits.includes('sante') || topTraits.includes('relationnel')) profileType = "Social & Humain";
  else if (topTraits.includes('commerce') || topTraits.includes('leadership')) profileType = "Leader & Business";
  else if (topTraits.includes('environnement') || topTraits.includes('pratique')) profileType = "Pragmatique & Terrain";

  const recommendedSectors = [...new Set(topTraits.flatMap(t => {
    if (t === 'tech') return ['Technologie', 'Numérique'];
    if (t === 'sante') return ['Santé', 'Social'];
    if (t === 'commerce') return ['Commerce', 'Vente'];
    if (t === 'creativite') return ['Design', 'Arts'];
    if (t === 'environnement') return ['Environnement', 'Nature'];
    if (t === 'droit') return ['Juridique', 'Administration'];
    if (t === 'education') return ['Éducation', 'Formation'];
    if (t === 'pratique') return ['Construction', 'Ingénierie'];
    return [];
  }))];

  if (recommendedSectors.length === 0) recommendedSectors.push('Services', 'Management');

  return {
    type: profileType,
    score: Math.round(sortedTraits[0]?.[1] || 80),
    vector,
    topTraits,
    sectors: recommendedSectors.slice(0, 3)
  };
};

export const matchProfessions = (professions, profile) => {
  if (!professions || !professions.length) return [];
  if (!profile || !profile.vector) return professions;

  const userTraits = profile.vector;
  
  const scoredProfessions = professions.map(p => {
    let matchScore = 0;
    let maxPossibleScore = 0;

    const extractStrings = (arr) => Array.isArray(arr) ? arr.map(i => i.libelle || i).join(' ').toLowerCase() : '';

    const pKeywords = [
      p.code || '',
      p.libelle || '',
      p.description || '',
      p.debouches || '',
      extractStrings(p.competencesMobilisees),
      extractStrings(p.themes),
      extractStrings(p.divisionsNaf) // Verify casing
    ].join(' ');

    Object.entries(userTraits).forEach(([trait, userTraitScore]) => {
      const weight = userTraitScore / 100;
      const keywords = TRAIT_KEYWORD_MAPPING[trait] || [trait];
      
      const hasMatch = keywords.some(kw => pKeywords.includes(kw.toLowerCase()));

      const traitImportance = weight > 0.8 ? 2 : (weight > 0.5 ? 1 : 0.5);
      
      maxPossibleScore += 100 * traitImportance;
      if (hasMatch) {
        matchScore += 100 * traitImportance * weight;
      }
    });

    let finalScore = maxPossibleScore > 0 ? Math.round((matchScore / maxPossibleScore) * 100) : 50;
    
    // Check themes overlap
    if (p.themes && Array.isArray(p.themes) && p.themes.some(t => profile.sectors.includes(t.libelle))) {
      finalScore += 15;
    }

    finalScore = Math.max(30, Math.min(finalScore, 99));

    return { ...p, matchScore: finalScore };
  });

  return scoredProfessions.sort((a, b) => b.matchScore - a.matchScore);
};

export const filterAndSortJobs = (jobs, filters, sortOption) => {
  let result = [...jobs];

  if (filters.sector && filters.sector !== 'Tous') {
    result = result.filter(j => 
      j.themes && Array.isArray(j.themes) && j.themes.some(t => t.libelle === filters.sector)
    );
  }

  if (sortOption === 'score') {
    result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  return result;
};