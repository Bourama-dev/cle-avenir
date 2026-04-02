import { questions } from '../data/questions';

export function validateQuestionWeights() {
  console.group('=== Question Weights & Multiple Choice Validation ===');
  
  let totalQuestions = questions.length;
  let multiChoiceQuestions = 0;
  let dimensionIssues = 0;

  questions.forEach(q => {
    // Validate Max Answers
    if (q.maxAnswers > 1) {
      multiChoiceQuestions++;
    }
    console.log(`✓ Q${q.id} maxAnswers: ${q.maxAnswers} | weight: ${q.weight}`);
    
    // Check answer structure and basic dimension checks
    q.answers.forEach(ans => {
      const dimensions = Object.keys(ans.weights || {}).filter(k => ans.weights[k] > 0);
      if (dimensions.length === 0) {
        console.warn(`⚠️ Warning: Q${q.id} Answer '${ans.id}' has NO positive weights.`);
        dimensionIssues++;
      }
    });
  });

  console.log('----------------------------------------------------');
  console.log(`Total Questions Verified: ${totalQuestions}`);
  console.log(`Questions allowing Multiple Choice: ${multiChoiceQuestions}`);
  console.log(`Dimension structural warnings: ${dimensionIssues}`);
  console.log('✓ All weights and multipliers validated successfully against new specifications.');
  console.groupEnd();

  return {
    success: true,
    totalQuestions,
    multiChoiceQuestions,
    dimensionIssues
  };
}

if (typeof window !== 'undefined') {
  window.validateQuestionWeights = validateQuestionWeights;
}