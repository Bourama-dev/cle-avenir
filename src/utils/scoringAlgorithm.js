export function calculateCosineSimilarity(userVec, metierVec) {
  let dotProduct = 0;
  let normA_sq = 0;
  let normB_sq = 0;

  const keys = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  for (const key of keys) {
    const uVal = Number(userVec[key]) || 0;
    const mVal = Number(metierVec[key]) || 0;
    
    dotProduct += (uVal * mVal);
    normA_sq += (uVal * uVal);
    normB_sq += (mVal * mVal);
  }

  const normA = Math.sqrt(normA_sq);
  const normB = Math.sqrt(normB_sq);
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

export function applyBonuses(baseSimilarity) {
  let bonus = 0;
  if (baseSimilarity > 0.95) bonus += 0.05;
  else if (baseSimilarity > 0.90) bonus += 0.04;
  else if (baseSimilarity > 0.85) bonus += 0.03;
  else if (baseSimilarity > 0.80) bonus += 0.02;
  else if (baseSimilarity > 0.75) bonus += 0.01;
  return bonus;
}

export function applyDominantBonus(userDom, metierDom) {
  let bonus = 0;
  const userKeys = userDom.map(d => d.dimension);
  const metierKeys = metierDom.map(d => d.dimension);
  
  // Primary dimension match
  if (userKeys[0] === metierKeys[0]) bonus += 0.05;
  // Secondary dimension match
  else if (userKeys.includes(metierKeys[0]) || metierKeys.includes(userKeys[0])) bonus += 0.025;
  
  return bonus;
}

export function normalizeScores(scoredItems) {
  if (scoredItems.length === 0) return scoredItems;
  
  const scores = scoredItems.map(item => item.rawScore);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(scores.reduce((sq, val) => sq + Math.pow(val - mean, 2), 0) / scores.length) || 1;
  
  return scoredItems.map(item => {
    const zScore = (item.rawScore - mean) / stdDev;
    return {
      ...item,
      zScore
    };
  });
}

export function calculateFinalScore(userVec, metierVec) {
  const similarity = calculateCosineSimilarity(userVec, metierVec);
  
  const userDom = Object.entries(userVec).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([d])=>({dimension:d}));
  const metierDom = Object.entries(metierVec).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([d])=>({dimension:d}));
  
  const thresholdBonus = applyBonuses(similarity);
  const dominantBonus = applyDominantBonus(userDom, metierDom);
  
  // Base raw score in 0-1 scale
  let rawScore = similarity + thresholdBonus + dominantBonus;
  // Cap at 1.0
  rawScore = Math.min(1.0, Math.max(0, rawScore));
  
  // Convert to 0-100 scale
  return Math.round(rawScore * 100);
}