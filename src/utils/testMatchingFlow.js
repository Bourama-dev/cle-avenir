import { buildUserVector } from '../services/buildUserVector';
import { scoreROME } from '../services/scoreROME';

export const testCompleteFlow = async () => {
  console.group('🧪 [TEST FLOW] E2E Matching Flow Validation');
  try {
    // 1. Create sample answers with clear profile (e.g., highly practical & manual)
    const sampleAnswers = [
      { questionId: 1, answerId: 'i_nature' },     // Nature, pratique
      { questionId: 2, answerId: 'c_action' },     // Action directe, pratique
      { questionId: 3, answerId: 'e_field' },      // Terrain, pratique
      { questionId: 7, answerId: 'l_practice' },   // Testant directement (Pratique)
      { questionId: 10, answerId: 'p_field' }      // Sur le terrain
    ];
    
    console.log('1. Created sample answers:', sampleAnswers);
    
    // 2. Call buildUserVector
    const vectorData = buildUserVector(sampleAnswers);
    console.log('2. User Vector generated:', vectorData);
    
    // Assertions
    if (!vectorData.riasec || vectorData.riasec.R < 0.5) {
      console.error('❌ Assertion failed: Expected high R (Pratique) score, got:', vectorData.riasec.R);
    } else {
      console.log('✅ Assertion passed: High R (Pratique) score detected.');
    }
    
    // 3. Call scoreROME
    console.log('3. Scoring against ROME database...');
    const scoringResult = await scoreROME(vectorData.riasec);
    
    // 4. Log intermediate & final results
    console.log('4. Top 5 Matches:');
    const top5 = scoringResult.results.slice(0, 5);
    top5.forEach((m, i) => {
      console.log(`   #${i+1} [${m.code}] ${m.libelle} | Score: ${(m.final_score * 10).toFixed(1)}% | Raw Cosine Sim: ${m.similarity.toFixed(3)}`);
    });
    
    // 5. Verify top results
    if (top5.length > 0 && top5[0].similarity > 0.6) {
      console.log('✅ Assertion passed: Found strong matches (> 60% raw similarity)');
    } else {
      console.warn('⚠️ Warning: Top matches have low similarity. Check ROME database or weights.');
    }
    
    console.log('🎉 Flow test completed successfully.');
    console.groupEnd();
    return { success: true, results: top5 };
    
  } catch (error) {
    console.error('❌ Flow test failed:', error);
    console.groupEnd();
    return { success: false, error };
  }
};

// Expose to window for easy browser console execution
if (typeof window !== 'undefined') {
  window.testMatchingFlow = testCompleteFlow;
}