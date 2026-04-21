/**
 * Adaptive Test Engine — Intelligent Question Selection
 *
 * Algorithm:
 * 1. Start with one basic question per category (6 questions)
 * 2. Based on responses, select next question from:
 *    - Highest uncertainty categories (affine the scores)
 *    - Categories with mid-range scores (to find exact profile)
 *    - Sectors not yet covered
 * 3. Stop when:
 *    - Total questions = 27 (target), OR
 *    - Confidence is high (std dev low, profile stable)
 */

import { adaptiveQuestionPool, getAdaptiveMaxPossible } from '@/data/adaptiveQuestions';

const CATEGORIES = ['R', 'I', 'A', 'S', 'E', 'C'];
const TARGET_QUESTIONS = 27;
const MIN_QUESTIONS = 15;
const CONFIDENCE_THRESHOLD = 0.25; // Std dev threshold

export const adaptiveTestEngine = {
  /**
   * Initialize: Start with the FIRST basic question only
   * Next questions will be selected adaptively
   */
  initializeTest() {
    const firstQuestion = adaptiveQuestionPool.find(
      q => q.category === 'R' && q.difficulty === 'basic'
    );

    return {
      asked: [firstQuestion],
      askedIds: new Set([firstQuestion.id]),
      remaining: adaptiveQuestionPool.filter(q => q.id !== firstQuestion.id),
      answers: {},
      scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
      confidences: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    };
  },

  /**
   * Record an answer and return the next question
   */
  recordAnswerAndGetNext(state, questionId, answerValue) {
    // 1. Record answer
    const question = adaptiveQuestionPool.find(q => q.id === questionId);
    if (!question) throw new Error('Question not found');

    state.answers[questionId] = {
      category: question.category,
      value: answerValue,
      sector: question.sector,
    };

    // 2. Update scores
    this._updateScores(state);

    // 3. Check stop conditions
    if (this._shouldStop(state)) {
      return { nextQuestion: null, testComplete: true, stats: this._getStats(state) };
    }

    // 4. Select next question
    const nextQuestion = this._selectNextQuestion(state);

    return { nextQuestion, testComplete: false };
  },

  /**
   * Calculate RIASEC scores from answers
   */
  _updateScores(state) {
    const maxPossible = getAdaptiveMaxPossible();
    const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.values(state.answers).forEach(({ category, value }) => {
      rawScores[category] = (rawScores[category] || 0) + value;
    });

    // Normalize to 0-100
    state.scores = {};
    CATEGORIES.forEach(cat => {
      const max = maxPossible[cat] || 100;
      state.scores[cat] = Math.round((rawScores[cat] / max) * 100);
    });

    // Calculate confidence (inverse of standard deviation)
    this._updateConfidences(state);
  },

  /**
   * Update confidence for each category
   * (Simplified: based on number of questions answered)
   */
  _updateConfidences(state) {
    const answersPerCategory = {};
    CATEGORIES.forEach(cat => {
      answersPerCategory[cat] = Object.values(state.answers).filter(
        a => a.category === cat
      ).length;
    });

    state.confidences = {};
    CATEGORIES.forEach(cat => {
      // More questions = higher confidence
      // Formula: confidence = (questions_answered / max_questions) * 100
      const count = answersPerCategory[cat];
      state.confidences[cat] = Math.min(count / 5, 1); // 5 = optimal for this category
    });
  },

  /**
   * Determine if test should stop
   */
  _shouldStop(state) {
    const questionsAsked = state.asked.length;

    // Stop if at target
    if (questionsAsked >= TARGET_QUESTIONS) return true;

    // Continue if below minimum
    if (questionsAsked < MIN_QUESTIONS) return false;

    // Check if confident enough
    const avgConfidence = CATEGORIES.reduce((sum, cat) => sum + state.confidences[cat], 0) / CATEGORIES.length;
    const stdDev = this._calculateStdDev(Object.values(state.scores));

    // Stop if high confidence and stable scores
    if (avgConfidence >= 0.8 && stdDev <= CONFIDENCE_THRESHOLD) return true;

    return false;
  },

  /**
   * Select next question intelligently
   */
  _selectNextQuestion(state) {
    // Strategy: Priority order
    // 1. Categories with mid-range scores (45-55) — need clarification
    // 2. Categories with lowest confidence
    // 3. Sectors not yet covered
    // 4. Any remaining

    const unused = adaptiveQuestionPool.filter(q => !state.askedIds.has(q.id));

    if (unused.length === 0) return null;

    // Priority 1: Mid-range scores (need clarification)
    const midRangeQuestion = unused.find(q => {
      const score = state.scores[q.category] || 50;
      return score >= 40 && score <= 60;
    });
    if (midRangeQuestion) {
      state.asked.push(midRangeQuestion);
      state.askedIds.add(midRangeQuestion.id);
      return midRangeQuestion;
    }

    // Priority 2: Low confidence categories
    const lowestConfCat = CATEGORIES.reduce((lowest, cat) =>
      (state.confidences[cat] || 0) < (state.confidences[lowest] || 0) ? cat : lowest
    );
    const lowConfQuestion = unused.find(q => q.category === lowestConfCat);
    if (lowConfQuestion) {
      state.asked.push(lowConfQuestion);
      state.askedIds.add(lowConfQuestion.id);
      return lowConfQuestion;
    }

    // Priority 3: Sector coverage — pick a sector not yet asked
    const coveredSectors = new Set(Object.values(state.answers).map(a => a.sector));
    const uncoveredQuestion = unused.find(q => !coveredSectors.has(q.sector));
    if (uncoveredQuestion) {
      state.asked.push(uncoveredQuestion);
      state.askedIds.add(uncoveredQuestion.id);
      return uncoveredQuestion;
    }

    // Fallback: Random remaining
    const random = unused[Math.floor(Math.random() * unused.length)];
    state.asked.push(random);
    state.askedIds.add(random.id);
    return random;
  },

  /**
   * Calculate standard deviation of scores
   */
  _calculateStdDev(scores) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  },

  /**
   * Finalize test and return RIASEC profile
   */
  finalizeTest(state) {
    const profileCode = Object.entries(state.scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([letter]) => letter)
      .join('');

    return {
      profile: state.scores,
      profileCode,
      questionsAsked: state.asked.length,
      coverageBySector: this._getSectorCoverage(state),
    };
  },

  /**
   * Get test statistics
   */
  _getStats(state) {
    return {
      totalQuestionsAsked: state.asked.length,
      scoresByCategory: state.scores,
      confidencesByCategory: state.confidences,
    };
  },

  /**
   * Track which sectors have been covered
   */
  _getSectorCoverage(state) {
    const sectors = {};
    Object.values(state.answers).forEach(({ sector }) => {
      sectors[sector] = (sectors[sector] || 0) + 1;
    });
    return sectors;
  },
};
