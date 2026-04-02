export function normalizeTo100(vector) {
  if (!vector) return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  const total = Object.values(vector).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const normalized = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  if (total === 0) return normalized;
  
  Object.keys(normalized).forEach(key => {
    normalized[key] = Math.round(((Number(vector[key]) || 0) / total) * 100);
  });
  
  return normalized;
}

export function getTopDimensions(normalizedVector, count = 2) {
  return Object.entries(normalizedVector)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key]) => key);
}

export function calculateRiasecMatch(rawUserVec, rawMetierVec) {
  const userProfile = normalizeTo100(rawUserVec);
  const romeProfile = normalizeTo100(rawMetierVec);
  
  let totalDiff = 0;
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  dimensions.forEach(dim => {
    totalDiff += Math.abs((userProfile[dim] || 0) - (romeProfile[dim] || 0));
  });
  
  const avgDifference = totalDiff / 6;
  
  // Base Score logic: 100 - avgDiff * 2.5
  let matchScore = 100 - (avgDifference * 2.5);
  
  // Get top 2
  const topUser = getTopDimensions(userProfile, 2);
  const topMetier = getTopDimensions(romeProfile, 2);
  
  // Apply bonuses
  if (topUser[0] && topMetier[0] && topUser[0] === topMetier[0]) {
    matchScore += 10; // Dominant matches
  }
  
  // Check overlap in top 2 for secondary bonuses
  const intersection = topUser.filter(dim => topMetier.includes(dim));
  matchScore += (intersection.length * 5); // +5 per shared dimension in top 2
  
  // Ensure we clamp between 0 and 100
  matchScore = Math.min(100, Math.max(0, Math.round(matchScore)));
  
  // Ensure good matches are in a realistic high range if similarity is decent
  if (matchScore > 50 && intersection.length > 0) {
    matchScore = Math.max(matchScore, 70); // Bump floor for matching profiles
  }
  
  return {
    matchScore,
    userProfile,
    romeProfile
  };
}