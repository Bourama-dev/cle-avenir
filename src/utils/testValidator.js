import { questions } from '@/data/questions';

export const validateQuestions = () => {
  const issues = [];
  let totalAnswers = 0;
  const answerIds = new Set();
  const coveredDomains = new Set();

  questions.forEach((q, qIndex) => {
    if (!q.answers || q.answers.length === 0) {
      issues.push(`Question ${q.id} has no answers`);
    }
    
    q.answers.forEach((a) => {
      totalAnswers++;
      
      // Duplicate check
      if (answerIds.has(a.id)) {
        issues.push(`Duplicate answer ID found: ${a.id}`);
      }
      answerIds.add(a.id);

      // Weight validation
      if (!a.weights || typeof a.weights !== 'object') {
        issues.push(`Answer ${a.id} has invalid weights`);
      } else {
        const requiredKeys = ['R', 'I', 'A', 'S', 'E', 'C'];
        requiredKeys.forEach(k => {
          if (typeof a.weights[k] !== 'number') {
            issues.push(`Answer ${a.id} missing or invalid weight for ${k}`);
          }
        });
      }

      // Domain tracking
      if (a.domainId) {
        coveredDomains.add(a.domainId);
      }
    });
  });

  const targetDomains = ['sport', 'tourism', 'events', 'environment'];
  targetDomains.forEach(d => {
    if (!coveredDomains.has(d)) {
      issues.push(`Domain ${d} is not covered in the answers`);
    }
  });

  return {
    isValid: issues.length === 0 && totalAnswers === 101,
    totalAnswers,
    issues
  };
};

export const runTestValidation = () => {
  const result = validateQuestions();
  console.log(`Validation completed. Total Answers: ${result.totalAnswers}. Valid: ${result.isValid}`);
  if (result.issues.length > 0) {
    console.error("Validation Issues:", result.issues);
  }
  return result;
};