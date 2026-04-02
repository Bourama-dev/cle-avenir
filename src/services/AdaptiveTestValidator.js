import { adaptiveTestQuestions } from '../data/adaptiveTestQuestions';

export const AdaptiveTestValidator = {
  validateTestStructure() {
    const errors = [];
    
    // 1. Check Question Count
    if (adaptiveTestQuestions.length < 13) {
      errors.push("Insufficient questions (less than 13)");
    }

    adaptiveTestQuestions.forEach((q, idx) => {
      // 2. Check Choice Count
      if (!q.choices || q.choices.length !== 8) {
        errors.push(`Question ${q.id} does not have exactly 8 choices.`);
      }

      // 3. Check Distinctness (simple text check)
      const texts = q.choices.map(c => c.text);
      const uniqueTexts = new Set(texts);
      if (uniqueTexts.size !== texts.length) {
        errors.push(`Question ${q.id} has duplicate choice texts.`);
      }

      // 4. Check Sector Tags
      q.choices.forEach(c => {
        if (!c.sector_tags || c.sector_tags.length === 0) {
          errors.push(`Choice ${c.id} in Question ${q.id} has no sector tags.`);
        }
      });
      
      // 5. Check Type and MaxAnswers
      if (!q.type || !['single', 'multiple'].includes(q.type)) {
        errors.push(`Question ${q.id} has invalid or missing type.`);
      }
      if (q.type === 'multiple' && (!q.maxAnswers || q.maxAnswers < 1)) {
        errors.push(`Question ${q.id} is multiple but missing valid maxAnswers.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateAnswerType(question, answers) {
    if (!Array.isArray(answers)) return { isValid: false, error: "Answers must be an array" };
    
    if (question.type === 'single' && answers.length > 1) {
      return { isValid: false, error: "Multiple answers provided for single-choice question" };
    }
    
    if (question.type === 'multiple' && answers.length > (question.maxAnswers || 3)) {
      return { isValid: false, error: "Too many answers selected" };
    }

    return { isValid: true };
  },

  validateAllAnswers(fullHistory) {
    // Basic structural check
    if (!Array.isArray(fullHistory)) return { isValid: false, error: "Invalid history format" };
    
    for (const entry of fullHistory) {
      if (!entry.questionId || !entry.choices || !Array.isArray(entry.choices)) {
        return { isValid: false, error: `Invalid entry for question ${entry.questionId || 'unknown'}` };
      }
    }
    
    return { isValid: true };
  }
};