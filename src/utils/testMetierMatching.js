import { matchProfileToMetiers } from '@/services/profileMetierMatchingService';

export const runMatchingTest = async () => {
  console.log("🧪 Starting Metier Matching Test...");

  const testProfile = "Créatif & Innovant";
  const testSectors = ["Design", "Arts", "Construction"];
  const testCompetencies = ["Créativité", "Innovation"];

  try {
    const results = await matchProfileToMetiers(testProfile, testSectors, testCompetencies);
    
    console.log(`📊 Found ${results.length} matches for ${testProfile}`);
    
    let passed = true;
    
    results.forEach((m, idx) => {
      const text = `${m.libelle} ${m.description}`.toLowerCase();
      const isSupplyChain = text.includes('supply chain') || text.includes('logistique') || text.includes('routier');
      
      console.log(`${idx + 1}. [${m.match_score}%] ${m.libelle}`);
      
      if (isSupplyChain) {
        console.error(`   ❌ FAILED: Found unrelated sector in results!`);
        passed = false;
      }
    });

    if (passed) {
      console.log("✅ ALL TESTS PASSED: Results are coherent and properly filtered.");
    } else {
      console.error("❌ TESTS FAILED: Incoherent results found.");
    }

    return { success: passed, results };
  } catch (error) {
    console.error("Test failed with error:", error);
    return { success: false, error };
  }
};

// Auto-expose to window for easy console testing
if (typeof window !== 'undefined') {
  window.testMetierMatching = runMatchingTest;
}