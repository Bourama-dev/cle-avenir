export function validateAnswers(answers) {
  if (!answers || !Array.isArray(answers)) {
    throw new Error('Validation Error: answers must be an array');
  }
  if (answers.length === 0) {
    throw new Error('Validation Error: answers array is empty');
  }
  
  answers.forEach((ans, index) => {
    if (!ans.questionId || !ans.answerId) {
      console.warn(`[Validator] Answer at index ${index} is missing questionId or answerId`, ans);
    }
  });
  
  return true;
}

export function validateUserVector(vector) {
  if (!vector || typeof vector !== 'object') {
    throw new Error('Validation Error: user vector must be an object');
  }
  
  let hasValidDimensions = false;
  let sumSquares = 0;
  
  Object.entries(vector).forEach(([dim, val]) => {
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error(`Validation Error: dimension ${dim} is not a valid number`);
    }
    hasValidDimensions = true;
    sumSquares += val * val;
  });
  
  if (!hasValidDimensions) {
    throw new Error('Validation Error: user vector has no dimensions');
  }
  
  const norm = Math.sqrt(sumSquares);
  if (norm === 0) {
    throw new Error('Validation Error: user vector norm is 0');
  }
  
  return true;
}

export function validateMetierProfile(metier, profileVector) {
  if (!metier.code || !metier.libelle) {
    console.warn(`[Validator] Metier is missing code or libelle:`, metier);
    return false;
  }
  
  if (!profileVector || typeof profileVector !== 'object') {
    console.warn(`[Validator] Metier ${metier.code} has invalid profile vector`);
    return false;
  }
  
  let sumSquares = 0;
  Object.values(profileVector).forEach(val => {
    if (typeof val === 'number' && !isNaN(val)) {
      sumSquares += val * val;
    }
  });
  
  const norm = Math.sqrt(sumSquares);
  if (norm === 0) {
    console.warn(`[Validator] Metier ${metier.code} (${metier.libelle}) has zero norm profile`);
    return false;
  }
  
  return true;
}