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

// Premium: Cosine similarity for robust vectorial matching
function cosineSimilarity(vec1, vec2) {
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  dimensions.forEach(dim => {
    const v1 = vec1[dim] || 0;
    const v2 = vec2[dim] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Premium: Detect major incompatibilities in dominant dimensions
function analyzeIncompatibility(userProfile, jobProfile) {
  const topUserDims = getTopDimensions(userProfile, 3);
  let incompatibilityPenalty = 0;

  topUserDims.forEach((dim, idx) => {
    const userVal = userProfile[dim] || 0;
    const jobVal = jobProfile[dim] || 0;

    // If user's top dimension is weak in the job, penalize progressively
    if (userVal > 60 && jobVal < 20) {
      const diff = userVal - jobVal;
      incompatibilityPenalty += (diff / 100) * (15 - idx * 2); // Stronger penalty for #1 dimension
    }
  });

  return Math.min(incompatibilityPenalty, 25); // Cap at 25% penalty
}

// Premium: Calculate dimensional divergence (how spread out each profile is)
function calculateDivergence(profile) {
  const dims = Object.values(profile);
  const mean = dims.reduce((a, b) => a + b, 0) / 6;
  const variance = dims.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 6;
  return Math.sqrt(variance);
}

// Premium: Advanced matching with weighted bonuses
function calculateAdvancedBonus(userProfile, jobProfile, similarity) {
  let bonus = 0;
  const topUser = getTopDimensions(userProfile, 2);
  const topJob = getTopDimensions(jobProfile, 2);

  // Bonus 1: Primary dimension match (top user dimension exists in job top 2)
  if (topUser[0] && topJob.includes(topUser[0])) {
    const userVal = userProfile[topUser[0]] || 0;
    const jobVal = jobProfile[topUser[0]] || 0;
    const alignmentRatio = Math.min(jobVal / userVal, 1);
    bonus += 12 * alignmentRatio; // Up to 12 points
  }

  // Bonus 2: Secondary dimension support
  if (topUser[1] && topJob.includes(topUser[1])) {
    bonus += 8;
  }

  // Bonus 3: Dimensional overlap in top 2
  const intersection = topUser.filter(dim => topJob.includes(dim));
  bonus += (intersection.length - 1) * 4; // 0-4 additional points

  // Bonus 4: Similarity-based confidence bonus (only if high similarity)
  if (similarity > 0.75) {
    bonus += 6;
  } else if (similarity > 0.65) {
    bonus += 3;
  }

  // Bonus 5: Complementary strength (job strong where user is weak)
  const userDivergence = calculateDivergence(userProfile);
  const jobDivergence = calculateDivergence(jobProfile);
  if (userDivergence < 20 && jobDivergence > 25) { // User is specialized, job is versatile
    bonus += 4;
  }

  return bonus;
}

export function calculateRiasecMatch(rawUserVec, rawMetierVec) {
  const userProfile = normalizeTo100(rawUserVec);
  const romeProfile = normalizeTo100(rawMetierVec);

  // Premium Method 1: Cosine similarity as base (0-1 scale)
  const similarity = cosineSimilarity(userProfile, romeProfile);
  let matchScore = similarity * 110; // Boost base score for higher starting point

  // Premium Method 2: Euclidean distance penalty for refinement
  let euclideanDist = 0;
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  dimensions.forEach(dim => {
    euclideanDist += Math.pow((userProfile[dim] || 0) - (romeProfile[dim] || 0), 2);
  });
  euclideanDist = Math.sqrt(euclideanDist);

  // Enhanced penalty for better differentiation (increased from 35 to 50)
  const euclideanPenalty = (euclideanDist / 245) * 50;
  matchScore -= euclideanPenalty;

  // Premium Method 3: Incompatibility analysis (increased penalty)
  const incompatibilityPenalty = analyzeIncompatibility(userProfile, romeProfile);
  matchScore -= (incompatibilityPenalty * 1.2); // Amplify incompatibility impact

  // Premium Method 4: Advanced weighted bonuses
  const advancedBonus = calculateAdvancedBonus(userProfile, romeProfile, similarity);
  matchScore += advancedBonus;

  // Premium Method 5: Specialization bonus (reward specialized profiles)
  const userSpecialization = 100 - calculateDivergence(userProfile);
  const jobSpecialization = 100 - calculateDivergence(romeProfile);
  const specializationAlignmentBonus = Math.min((userSpecialization / 100) * (jobSpecialization / 100) * 15, 10);
  matchScore += specializationAlignmentBonus;

  // Premium: Calibration for better spread (15-98 range gives us 83 points to work with)
  // Normalize to 0-100 first, then map to 15-98
  matchScore = Math.min(100, Math.max(0, matchScore));
  matchScore = 15 + (matchScore * 0.83);
  matchScore = Math.round(matchScore);

  return {
    matchScore,
    userProfile,
    romeProfile,
    similarity: Math.round(similarity * 100),
    confidence: calculateConfidence(userProfile, romeProfile, similarity)
  };
}

// Premium: Confidence score (how clear is the match?)
function calculateConfidence(userProfile, jobProfile, similarity) {
  const topUserDims = getTopDimensions(userProfile, 2);
  const topJobDims = getTopDimensions(jobProfile, 2);

  let confidence = Math.round(similarity * 100);

  // Adjust confidence based on dimension clarity
  const userDominance = userProfile[topUserDims[0]] - userProfile[topUserDims[1]];
  if (userDominance > 30) { // Very clear user profile
    confidence = Math.min(100, confidence + 10);
  }

  // Check if top dimensions align
  if (topUserDims[0] === topJobDims[0]) {
    confidence = Math.min(100, confidence + 5);
  }

  return Math.min(100, Math.max(0, confidence));
}