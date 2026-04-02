import { supabase } from '@/lib/customSupabaseClient';
import { calculateRiasecMatch } from '@/utils/riasecMatchingAlgorithm';
import { calculateDomainBonus } from '@/services/domainSpecificMatching';

function buildRawCareerVectorFromROME(career) {
  const vector = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  if (career.riasecMajeur && vector[career.riasecMajeur] !== undefined) {
    vector[career.riasecMajeur] += 1.0;
  }
  if (career.riasecMineur && vector[career.riasecMineur] !== undefined) {
    vector[career.riasecMineur] += 0.5;
  }
  
  // Fallback to adjusted weights if available
  if (career.adjusted_weights && Object.keys(career.adjusted_weights).some(k => vector[k] !== undefined)) {
    for (const [key, value] of Object.entries(career.adjusted_weights)) {
      if (vector[key] !== undefined) {
        vector[key] += Number(value);
      }
    }
  }
  return vector;
}

export async function scoreROME(userProfileContext) {
  console.group('=== ROME MATCHING ALGORITHM V2 ===');
  
  try {
    const rawUserVector = userProfileContext.rawVector || userProfileContext.riasec || userProfileContext; 
    const userDomains = userProfileContext.userDomains || [];

    const { data: careers, error } = await supabase
      .from('rome_metiers')
      .select('code, libelle, description, riasecMajeur, riasecMineur, adjusted_weights, niveau_etudes');

    if (error) throw error;
    if (!careers || careers.length === 0) {
      console.warn('No ROME metiers fetched.');
      console.groupEnd();
      return { results: [], metadata: {} };
    }

    const scoredCareers = careers.map(career => {
      const rawMetierVec = buildRawCareerVectorFromROME(career);
      
      // Calculate match using the new algorithm
      const matchData = calculateRiasecMatch(rawUserVector, rawMetierVec);
      let finalScore = matchData.matchScore;
      
      // Apply domain specific matching bonus (Max +15 in this context to not break the 0-100 scale drastically)
      const domainBonus = calculateDomainBonus(career.code, userDomains);
      finalScore += Math.round(domainBonus * 50); // Scale down the raw bonus to fit percentage
      
      finalScore = Math.min(100, Math.max(0, finalScore));

      return {
        ...career,
        matchScore: finalScore,
        userProfile: matchData.userProfile,
        romeProfile: matchData.romeProfile,
        domainBonusApplied: domainBonus > 0
      };
    }).filter(c => c.matchScore > 40); // Filter out extremely low matches

    // Sort descending by match score
    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top 15 matching careers (User wants top 5-10, we provide 15 for safety)
    const topResults = scoredCareers.slice(0, 15);

    console.log(`Matched ${topResults.length} careers. Top Match:`, topResults[0]);
    console.groupEnd();

    return {
      results: topResults,
      metadata: { count: careers.length, appliedDomains: userDomains }
    };
  } catch (err) {
    console.error('Error in scoreROME V2:', err);
    console.groupEnd();
    throw err;
  }
}