import { questions } from '@/data/questions';
import { accumulateWeights, normalizeVector, getDominantDimensions } from '@/utils/riasecCalculator';
import { extractUserDomains } from '@/services/domainSpecificMatching';
import { validateAnswers } from '@/utils/matchingValidator';

export function buildUserVector(testAnswers = []) {
  console.group('=== USER VECTOR DEBUG ===');
  console.log('Input selectedAnswers:', JSON.parse(JSON.stringify(testAnswers)));
  
  // Validation
  validateAnswers(testAnswers);

  // Accumulate weights using the riasecCalculator
  const rawVector = accumulateWeights(testAnswers, questions);
  
  console.log('Accumulated rawVector:', rawVector);

  // Apply L2 normalization
  const normalizedVector = normalizeVector(rawVector);
  
  console.log('Final normalized userVector:', normalizedVector);

  // Get dominant dimensions
  const dominantDimensions = getDominantDimensions(normalizedVector, 3);
  
  // Extract user selected domains
  const userDomains = extractUserDomains(testAnswers, questions);
  console.log('Extracted Domains:', userDomains);
  
  console.groupEnd();
  
  return {
    rawVector,
    normalizedVector,
    riasec: normalizedVector, // Alias for compatibility
    dominantDimensions,
    userDomains,
    metadata: {
      answersCount: testAnswers.length,
      timestamp: new Date().toISOString()
    }
  };
}