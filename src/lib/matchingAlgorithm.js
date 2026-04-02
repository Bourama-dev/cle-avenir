import { jobsDatabase } from '@/data/jobsDatabase';

const TRAIT_MAPPING = {
  'creativite': 'creative',
  'analytique': 'analytical',
  'relationnel': 'social',
  'commerce': 'business',
  'marketing': 'business',
  'sante': 'health',
  'environnement': 'nature',
  'innovation': 'tech',
  'rigueur': 'analytical',
  'technique': 'tech',
  'tech': 'tech',
  'art': 'creative',
  'droit': 'analytical',
  'sport': 'outdoor',
  'pratique': 'manual',
  'etudes_longues': 'education',
  'education': 'education',
  'leadership': 'leadership',
  'bien_etre': 'health', 
  'equipe': 'social',
  'autonomie': 'solo',
  'risque': 'business',
  'argent': 'money',
  'communication': 'social',
  'admin': 'office',
  'organisation': 'analytical'
};

export function calculateMatchScore(userProfile, job) {
  if (!userProfile || !job) return { score: 0, reasons: [] };

  let score = 60;
  const reasons = [];

  if (userProfile.skills && job.skills) {
    const commonSkills = job.skills.filter(skill => 
      userProfile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    if (commonSkills.length > 0) {
      score += commonSkills.length * 5;
      reasons.push(`${commonSkills.length} compétences en commun`);
    }
  }

  if (userProfile.location && job.location) {
    if (job.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
      score += 15;
      reasons.push('Localisation idéale');
    }
  }

  if (userProfile.preferences?.contractType && job.contractType) {
    if (job.contractType === userProfile.preferences.contractType) {
      score += 10;
    }
  }

  return {
    score: Math.min(98, score),
    reasons: reasons.slice(0, 2)
  };
}

export function calculateMatches(userAnswers) {
  let userScores = {
    tech: 0, analytical: 0, creative: 0, social: 0, manual: 0, 
    office: 0, outdoor: 0, solo: 0, leadership: 0, empathy: 0, 
    resilience: 0, health: 0, business: 0, education: 0, money: 0,
    nature: 0
  };
  
  if (!userAnswers) return [];

  if (userAnswers.dimensions) {
      userScores = { ...userScores, ...userAnswers.dimensions };
  } else {
      return []; 
  }

  const matches = jobsDatabase.map(job => {
    let rawScore = 0;
    const vector = job.vector || job.tags || {};
    
    rawScore += 15;

    Object.keys(vector).forEach(trait => {
      const jobWeight = vector[trait];
      let userScoreVal = 0;
      
      if (userScores[trait] !== undefined) {
          userScoreVal = userScores[trait];
      } else {
          const mappedKey = TRAIT_MAPPING[trait];
          userScoreVal = userScores[mappedKey] || 0;
      }

      if (userScoreVal > 0) {
        rawScore += userScoreVal * (jobWeight / 10); 
      }
    });

    let percentage = Math.min(99, Math.max(10, Math.round(rawScore * 1.5)));

    return {
      ...job,
      matchPercentage: percentage
    };
  });

  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}