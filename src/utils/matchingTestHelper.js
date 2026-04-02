import { matchMetiersToAnswers } from '@/services/metierScoringService';

export const getMockAnswersForProfile = (profileType) => {
  switch (profileType) {
    case 'tech_enthusiast':
      return [
        { questionId: 1, answerId: 'i_tech' },
        { questionId: 2, answerId: 'c_analyse' },
        { questionId: 3, answerId: 'e_remote' },
        { questionId: 5, answerId: 'd_geek' }
      ];
    case 'creative_person':
      return [
        { questionId: 1, answerId: 'i_creative' },
        { questionId: 2, answerId: 'c_creative' },
        { questionId: 4, answerId: 'm_passion' },
        { questionId: 5, answerId: 'd_creation' }
      ];
    case 'social_helper':
      return [
        { questionId: 1, answerId: 'i_human' },
        { questionId: 3, answerId: 'e_field' },
        { questionId: 6, answerId: 's_help' },
        { questionId: 9, answerId: 'v_help' }
      ];
    default:
      return [];
  }
};

export const testMatchingConsistency = async (answers) => {
  const run1 = await matchMetiersToAnswers(answers);
  const run2 = await matchMetiersToAnswers(answers);
  
  const isConsistent = JSON.stringify(run1) === JSON.stringify(run2);
  console.log(`Matching consistency check: ${isConsistent ? 'PASSED' : 'FAILED'}`);
  return isConsistent;
};

export const logMatchingDebug = async (answers, results) => {
  console.group('Matching Debug Log');
  console.log('User Answers:', answers);
  console.log(`Found ${results.length} total matches.`);
  console.log('Top 3 Matches:');
  results.slice(0, 3).forEach((r, i) => {
    console.log(`${i+1}. ${r.libelle} (Score: ${r.score}) - ${r.matchReasons.join(', ')}`);
  });
  console.groupEnd();
};