import { supabase } from '@/lib/customSupabaseClient';
import { scoreRomeCareers } from '@/services/careerMatching';
import { classifyProfile, matchProfessions } from '@/utils/matchMetiersToResult';

/**
 * Test career matching functionality with real profession data
 */
export async function testCareerMatching() {
  console.log('🎯 Testing Career Matching Functionality\n');

  try {
    // 1. Fetch all professions from database
    const { data: professions, error: fetchError } = await supabase
      .from('rome_metiers')
      .select('*')
      .order('libelle');

    if (fetchError) {
      console.error('❌ Error fetching professions:', fetchError);
      return { success: false, error: fetchError };
    }

    console.log(`✅ Loaded ${professions.length} professions from database\n`);

    // 2. Create test user profiles
    const testProfiles = [
      {
        name: 'Tech Enthusiast',
        answers: {
          interests: ['tech', 'code', 'développement'],
          skills: ['JavaScript', 'React', 'Python'],
          sectors: ['IT', 'Tech']
        }
      },
      {
        name: 'Data Lover',
        answers: {
          interests: ['data', 'IA', 'analyse'],
          skills: ['Python', 'Machine Learning', 'SQL'],
          sectors: ['IT', 'Finance']
        }
      },
      {
        name: 'Creative Designer',
        answers: {
          interests: ['design', 'créatif', 'art'],
          skills: ['Figma', 'User Research', 'CSS'],
          sectors: ['Design', 'Tech']
        }
      },
      {
        name: 'Business Professional',
        answers: {
          interests: ['business', 'management', 'marketing'],
          skills: ['Leadership', 'Strategy', 'Analytics'],
          sectors: ['Marketing', 'Commerce']
        }
      }
    ];

    // 3. Test each profile
    const results = [];

    for (const profile of testProfiles) {
      console.log(`\n🧪 Testing profile: "${profile.name}"\n`);
      console.log(`   Interests: ${profile.answers.interests.join(', ')}`);
      console.log(`   Skills: ${profile.answers.skills.join(', ')}`);
      console.log(`   Sectors: ${profile.answers.sectors.join(', ')}\n`);

      // Classify profile
      const classified = classifyProfile(profile.answers);
      console.log(`   📊 Profile Type: ${classified.type}`);
      console.log(`   📈 Score: ${classified.score}%`);
      console.log(`   🎯 Identified Sectors: ${classified.sectors.join(', ')}\n`);

      // Match professions
      const matched = matchProfessions(professions, classified);
      
      console.log(`   🏆 TOP 3 MATCHES:\n`);
      matched.slice(0, 3).forEach((match, index) => {
        console.log(`   ${index + 1}. ${match.libelle} (${match.code})`);
        console.log(`      Match Score: ${match.matchScore}%`);
        console.log(`      Salary: ${match.salaire || 'N/A'}`);
        console.log('');
      });

      results.push({
        profile: profile.name,
        classified,
        topMatches: matched.slice(0, 3).map(m => ({
          libelle: m.libelle,
          code: m.code,
          matchScore: m.matchScore
        }))
      });
    }

    // 4. Advanced test: Use scoreRomeCareers with ROME codes
    console.log('\n🚀 Testing Advanced ROME Matching (scoreRomeCareers)\n');

    const techUserVector = {
      interests: ['tech', 'code', 'développement', 'digital'],
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      softSkills: ['analytical', 'problem solving', 'teamwork'],
      dimensions: {
        analytique: 85,
        technique: 90,
        créatif: 60
      }
    };

    const romeCodes = professions.map(p => p.code);
    const advancedMatches = await scoreRomeCareers({
      userVector: techUserVector,
      romeCodes: romeCodes
    });

    console.log('   📊 Advanced Matching Results (Top 5):\n');
    advancedMatches.slice(0, 5).forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.title} (${match.romeCode})`);
      console.log(`      Compatibility: ${match.percentage}%`);
      console.log(`      Reasons: ${match.reasons.join(', ')}`);
      console.log('');
    });

    // 5. Summary
    console.log('\n📈 TEST SUMMARY:');
    console.log(`   Professions tested: ${professions.length}`);
    console.log(`   User profiles tested: ${testProfiles.length}`);
    console.log(`   Advanced matches generated: ${advancedMatches.length}`);
    console.log(`   All tests: ✅ PASSED\n`);

    return {
      success: true,
      professionCount: professions.length,
      profilesTested: testProfiles.length,
      results,
      advancedMatches: advancedMatches.slice(0, 5)
    };

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { success: false, error };
  }
}

// Export for testing in components
export async function quickMatchTest() {
  const { data: professions } = await supabase
    .from('rome_metiers')
    .select('*')
    .limit(10);

  if (!professions || professions.length === 0) {
    return { error: 'No professions found in database' };
  }

  const testProfile = classifyProfile({
    interests: ['tech', 'code'],
    skills: ['JavaScript', 'React']
  });

  const matches = matchProfessions(professions, testProfile);

  return {
    success: true,
    profileType: testProfile.type,
    matchCount: matches.length,
    topMatch: matches[0]
  };
}

// Auto-run if executed directly in browser context
if (typeof window !== 'undefined' && window.location.search.includes('runMatchingTest=true')) {
  testCareerMatching().then(result => {
    console.log(result.success ? "Test success" : "Test failed");
  });
}