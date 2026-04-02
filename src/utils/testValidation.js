export function validateAllAnswered(answers, totalQuestions = 12) {
  if (!answers || !Array.isArray(answers)) return false;
  const answeredQuestionIds = new Set(answers.map(a => a.questionId || a.id));
  return answeredQuestionIds.size === totalQuestions;
}

export function validateMaxAnswers(answers, questions) {
  return answers.every(ans => {
    const qId = ans.questionId || ans.id;
    const q = questions.find(q => String(q.id) === String(qId));
    if (!q) return false;
    
    const ansIds = Array.isArray(ans.answerId) ? ans.answerId : [ans.answerId];
    return ansIds.length <= (q.maxAnswers || 1);
  });
}

export function validateWeights(answers, questions) {
  return answers.every(ans => {
    const qId = ans.questionId || ans.id;
    const q = questions.find(q => String(q.id) === String(qId));
    if (!q) return false;
    
    const ansIds = Array.isArray(ans.answerId) ? ans.answerId : [ans.answerId];
    return ansIds.every(aId => {
      const a = q.answers.find(a => String(a.id) === String(aId));
      return a && a.weights && typeof a.weights === 'object';
    });
  });
}

export function validateNoDuplicates(answers) {
  return answers.every(ans => {
    if (!Array.isArray(ans.answerId)) return true;
    const uniqueAnswers = new Set(ans.answerId);
    return uniqueAnswers.size === ans.answerId.length;
  });
}