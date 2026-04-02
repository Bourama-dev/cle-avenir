/**
 * Validates the user's answers against the question constraints.
 * 
 * @param {Array} answers - The array of selected answer objects.
 * @param {Object} question - The question object containing validation rules.
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateTestAnswers(answers, question) {
  const errors = [];
  
  // 1. Check at least one answer
  if (!answers || answers.length === 0) {
    errors.push("Veuillez sélectionner au moins une réponse.");
    return { isValid: false, errors };
  }

  // 2. Check max answers for multiple choice
  if (question.type === 'multiple') {
    const max = question.maxAnswers || 3;
    if (answers.length > max) {
      errors.push(`Vous ne pouvez pas sélectionner plus de ${max} réponses.`);
    }
  }

  // 3. Check strictly one answer for single choice
  if (question.type === 'single') {
    if (answers.length !== 1) {
      errors.push("Veuillez sélectionner une seule réponse pour cette question.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}