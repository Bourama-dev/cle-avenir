import { supabase } from '../lib/customSupabaseClient';
import { metierService } from '../services/metierService';
import { calculateAdvancedMatching } from '../services/matchingAlgorithm';

/**
 * Utility script to verify the matching algorithm logic.
 * Fetches 10 random metiers, applies a mock user profile,
 * and logs the advanced matching results to verify discrimination and correct scoring.
 */
export const runMatchingVerification = async () => {
  console.log("🚀 Starting Matching Algorithm Verification...");

  try {
    // 1. Mock User Profile
    const testUserProfile = {
      R: 80,
      I: 20,
      A: 10,
      S: 90,
      E: 60,
      C: 40
    };
    
    console.log("👤 Test User Profile:", testUserProfile);

    // 2. Fetch 10 random metiers
    const { data: randomMetiersRaw, error } = await supabase
      .from('rome_metiers')
      .select('code, libelle, description, definition, riasecMajeur, riasecMineur, adjusted_weights, riasec_vector, salaire, debouches, niveau_etudes')
      .limit(10);

    if (error) {
      throw error;
    }

    console.log(`📦 Fetched ${randomMetiersRaw.length} raw metiers.`);

    // 3. Format and Calculate
    const results = randomMetiersRaw.map(rawMetier => {
      const formattedMetier = metierService.formatMetierForMatching(rawMetier);
      return calculateAdvancedMatching(testUserProfile, formattedMetier);
    }).filter(r => r !== null);

    // Sort by final score descending
    results.sort((a, b) => b.finalScore - a.finalScore);

    // 4. Log results
    console.log("\n📊 Verification Results:");
    results.forEach((res, index) => {
      console.log(`\n--- Match ${index + 1}: ${res.name} (${res.metierCode}) ---`);
      console.log(`🎯 Final Score: ${res.finalScore}% | Confidence: ${res.confidence.label}`);
      console.log(`   - RIASEC Score (50%): ${res.riasecScore}%`);
      console.log(`   - Hybrid Score (20%): ${res.hybridScore}%`);
      console.log(`   - Stability (10%):    ${res.stabilityScore}%`);
      console.log(`   - Growth (10%):       ${res.growthScore}%`);
      console.log(`   - Demand (10%):       ${res.demandScore}%`);
      console.log(`💬 Recommendation: ${res.recommendation}`);
    });

    // 5. Verify discrimination (check if all scores are identical)
    const uniqueScores = new Set(results.map(r => r.finalScore));
    if (uniqueScores.size <= 1 && results.length > 1) {
      console.warn("\n⚠️ WARNING: Algorithm lacks discrimination! All tested metiers returned the exact same final score.");
    } else {
      console.log(`\n✅ SUCCESS: Algorithm shows good discrimination with ${uniqueScores.size} unique scores out of ${results.length} metiers.`);
    }

    // 6. Display Top 3 recommendations details
    console.log("\n🏆 TOP 3 MATCHES DEEP DIVE:");
    results.slice(0, 3).forEach((res, idx) => {
      console.log(`\n#${idx + 1} - ${res.name}`);
      console.log("Advice:");
      res.advice.forEach(a => console.log(`  > ${a}`));
      console.log("Next Steps:");
      res.nextSteps.forEach(s => console.log(`  > ${s}`));
    });

    return results;

  } catch (err) {
    console.error("❌ Verification failed:", err);
  }
};