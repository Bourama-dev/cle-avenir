export function accumulateWeights(answers, questions) {
  const vector = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  answers.forEach(item => {
    const qId = item.questionId || item.id; // Handle different answer formats
    const q = questions.find(q => String(q.id) === String(qId));
    if (!q) return;

    // Handle multiple answer IDs or single
    const ansIds = Array.isArray(item.answerId) ? item.answerId : [item.answerId];
    
    ansIds.forEach(aId => {
      const a = q.answers.find(a => String(a.id) === String(aId));
      if (a && a.weights) {
        Object.keys(vector).forEach(key => {
          if (a.weights[key]) {
            vector[key] += a.weights[key];
          }
        });
      }
    });
  });

  return vector;
}

export function calculateMagnitude(vector) {
  let sumOfSquares = 0;
  Object.values(vector).forEach(val => {
    sumOfSquares += val * val;
  });
  return Math.sqrt(sumOfSquares);
}

export function normalizeVector(vector) {
  const mag = calculateMagnitude(vector);
  const normalized = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  if (mag === 0) return normalized;
  
  Object.keys(vector).forEach(key => {
    normalized[key] = vector[key] / mag;
  });
  
  return normalized;
}

export function getDominantDimensions(vector, count = 2) {
  return Object.entries(vector)
    .sort(([, valA], [, valB]) => valB - valA)
    .slice(0, count)
    .map(([key, val]) => ({ dimension: key, value: val }));
}