import { supabase } from '@/lib/customSupabaseClient';
import { questions } from '../data/questions';
import { CAREERS } from '../data/careers';

// Helper to normalize vectors
const normalizeVector = (vector) => {
  const normalized = { ...vector };
  const maxVal = Math.max(...Object.values(vector), 1); // Avoid division by zero
  if (maxVal > 0) {
    Object.keys(normalized).forEach(key => {
      normalized[key] = Math.round((normalized[key] / maxVal) * 100);
    });
  }
  return normalized;
};

// Helper to create empty vector with all possible dimensions
const createEmptyVector = () => ({
  tech: 0,
  art: 0,
  sante: 0,
  commerce: 0,
  environnement: 0,
  relationnel: 0,
  innovation: 0,
  rigueur: 0,
  pratique: 0,
  analytique: 0,
  leadership: 0,
  autonomie: 0,
  equipe: 0,
  droit: 0,
  construction: 0,
  sport: 0,
  education: 0,
  media: 0,
  tourisme: 0,
  rh: 0,
  etudes_longues: 0,
  risque: 0
});

export class TestResultsService {
  /**
   * Generates complete results from user answers (Legacy method)
   */
  static generateResults(userAnswers) {
    // 1. Initialize vector
    let rawVector = createEmptyVector();
    let answersCount = 0;
    let answerIds = [];

    // 2. Normalize input to array of IDs
    if (Array.isArray(userAnswers)) {
      if (userAnswers.length > 0) {
        if (typeof userAnswers[0] === 'string') {
          answerIds = userAnswers;
        } else if (typeof userAnswers[0] === 'object') {
          answerIds = userAnswers.map(a => a.answerId || a.id).filter(Boolean);
        }
      }
    } else if (typeof userAnswers === 'object' && userAnswers !== null) {
      answerIds = Object.values(userAnswers);
    }

    // 3. Calculate scores based on weights
    answerIds.forEach(aId => {
      // Find answer in questions
      for (const q of questions) {
        const answer = q.answers.find(a => a.id === aId);
        if (answer) {
          answersCount++;
          // Add weights to vector
          if (answer.weights) {
            Object.entries(answer.weights).forEach(([dim, val]) => {
              // Only accumulate if we track this dimension
              if (rawVector.hasOwnProperty(dim)) {
                 // Weighted by question importance if available, default to 1.0
                 const weight = q.weight || 1.0;
                 rawVector[dim] += (val * weight);
              }
            });
          }
          break;
        }
      }
    });

    // 4. Normalize vector (0-100 scale)
    const normalizedVector = normalizeVector(rawVector);

    // 5. Match Careers with Fallback
    const matchedCareers = this.matchCareers(normalizedVector);

    return {
      userVector: {
        dimensions: normalizedVector
      },
      matchedCareers,
      features: {
        answersCount
      }
    };
  }

  /**
   * Matches user dimensions against career database using Cosine Similarity AND strict thresholds
   */
  static matchCareers(userDims) {
    if (!CAREERS || CAREERS.length === 0) {
      console.warn("CAREERS database is empty or not loaded.");
      return [];
    }

    let allScoredCareers = CAREERS.map(career => {
      const careerDims = career.vector || {};
      
      let dotProduct = 0;
      let userMagnitude = 0;
      let careerMagnitude = 0;
      
      const allKeys = new Set([...Object.keys(userDims), ...Object.keys(careerDims)]);
      
      allKeys.forEach(key => {
        const uVal = userDims[key] || 0;
        const cVal = careerDims[key] || 0;
        
        dotProduct += uVal * cVal;
        userMagnitude += uVal * uVal;
        careerMagnitude += cVal * cVal;
      });
      
      userMagnitude = Math.sqrt(userMagnitude);
      careerMagnitude = Math.sqrt(careerMagnitude);
      
      let similarity = 0;
      if (userMagnitude > 0 && careerMagnitude > 0) {
        similarity = dotProduct / (userMagnitude * careerMagnitude);
      }

      // Penalty logic for required fields
      if (career.required) {
        for (const [reqDim, minScore] of Object.entries(career.required)) {
           const userScore = userDims[reqDim] || 0;
           if (userScore < minScore) {
              similarity *= 0.8; 
           }
        }
      }
      
      const adjustedScore = Math.pow(similarity, 0.65); 
      const percentage = Math.round(Math.min(100, Math.max(0, adjustedScore * 100)));
      
      return {
        career: {
          ...career,
          name: career.title 
        },
        percentage,
        matchScore: similarity
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

    // 1. Strict Filtering (Preferred)
    const strictMatches = allScoredCareers.filter(match => match.percentage >= 60);

    // 2. Fallback: If 0 strict matches, return top 10 regardless of score (so user never sees empty state)
    if (strictMatches.length === 0) {
        return allScoredCareers.slice(0, 10).map(m => ({ ...m, isFallback: true }));
    }

    return strictMatches;
  }

  /**
   * Task 10: Save test results with new semantic matches
   */
  static async saveTestResultsWithMatches(userId, testId, answers, topCareers) {
    if (!userId) return null;
    if (!topCareers || topCareers.length === 0) {
        console.warn("No top careers to save");
        return null;
    }

    try {
        const { data, error } = await supabase.from('test_results').insert({
            user_id: userId,
            // If testId is null, DB generates it or we assume new test
            id: testId, 
            answers: answers,
            top_3_careers: topCareers.slice(0, 3), // Ensure only 3
            results: { top_careers: topCareers }, // Legacy format compatibility
            created_at: new Date().toISOString()
        }).select();

        if (error) throw error;
        return data ? data[0] : null;

    } catch (err) {
        console.error("Failed to save semantic test results:", err);
        return null;
    }
  }
}