import { advancedMatchingService } from '@/services/advancedMatchingService';

export const normalizeScores = (rawScores) => {
  const maxScore = Math.max(...Object.values(rawScores), 1);
  const normalized = {};
  for (const [key, value] of Object.entries(rawScores)) {
    normalized[key] = Math.round((value / maxScore) * 100);
  }
  return normalized;
};

export const calculateRIASECProfile = (answers, questions) => {
  // Use advanced matching service for weighted calculation
  const { rawScores, normalizedProfile, totalWeight } = advancedMatchingService.calculateWeightedRiasecProfile(answers, questions);

  return {
    rawScores,
    normalizedProfile,
    testScore: Math.round(totalWeight) // Using total weight as an engagement metric
  };
};

export const getTopDimensions = (profile, count = 3) => {
  return Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([dimension, score]) => ({ dimension, score }));
};

export const processAdvancedTestResults = (answers, questions, allMetiersData) => {
  // 1. Calculate Profile
  const profileData = calculateRIASECProfile(answers, questions);
  
  // 2. Analyze Patterns & Hybrid
  const patterns = advancedMatchingService.analyzeResponsePatterns(answers);
  const hybridData = advancedMatchingService.detectHybridProfile(profileData.normalizedProfile);
  
  // 3. Confidence Score
  const confidenceScore = advancedMatchingService.calculateConfidenceScore(patterns);
  
  // 4. Generate Recommendations
  const recommendations = advancedMatchingService.generateMultiLevelRecommendations(
    profileData.normalizedProfile, 
    allMetiersData || []
  );

  // 5. Generate Insights
  const insights = advancedMatchingService.generateDetailedInsights(profileData.normalizedProfile);

  return {
    ...profileData,
    patterns,
    hybridData,
    confidenceScore,
    recommendations,
    insights
  };
};

export const matchCareersToProfile = (normalizedProfile, careersList = []) => {
  // Kept for backward compatibility, but delegates to advanced service internally
  const recs = advancedMatchingService.generateMultiLevelRecommendations(normalizedProfile, careersList);
  return [...(recs.perfectMatches || []), ...(recs.excellentMatches || []), ...(recs.goodMatches || [])].slice(0, 3);
};

export const formatTestResultsForDisplay = (testData) => {
  if (!testData) return null;
  return {
    profile: testData.riasec_profile || testData.profile_result || {},
    careers: testData.top_3_careers || [],
    score: testData.test_score || 0,
    date: new Date(testData.created_at).toLocaleDateString(),
    // Include new advanced data if available
    confidenceScore: testData.results?.confidenceScore || null,
    insights: testData.results?.insights || null
  };
};