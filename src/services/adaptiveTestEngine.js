/**
 * Adaptive RIASEC Test Engine — Intelligent Question Selection with Logical Flow
 *
 * Phase 1 (Questions 1-6): Baseline Discovery
 * - One basic question per category (R, I, A, S, E, C)
 * - Establish initial scores for all dimensions
 *
 * Phase 2 (Questions 7-16): Category Refinement
 * - Focus on categories with mid-range scores (40-60%)
 * - Clarify uncertain dimensions
 * - Use intermediate difficulty questions
 *
 * Phase 3 (Questions 17-27): Advanced Profiling & Sector Coverage
 * - Use advanced questions for dominant categories
 * - Explore sector coverage for all dimensions
 * - Skip sectors user has rejected (2+ "Pas du tout")
 */

import { adaptiveQuestionPool, getAdaptiveMaxPossible } from '@/data/adaptiveQuestions';

const CATEGORIES = ['R', 'I', 'A', 'S', 'E', 'C'];
const TARGET_QUESTIONS = 27;
const MIN_QUESTIONS = 15;
const CONFIDENCE_THRESHOLD = 0.25;

const TestPhases = {
  BASELINE: 1,    // Questions 1-6
  REFINEMENT: 2,  // Questions 7-16
  ADVANCED: 3,    // Questions 17-27
};

export const adaptiveTestEngine = {
  /**
   * Initialize: Start with the FIRST basic question only (Réaliste)
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
      phase: TestPhases.BASELINE,
      baselineQuestionsAsked: 1, // Track baseline progress
      skippedSectors: new Set(),
    };
  },

  /**
   * Record answer and intelligently select next question
   */
  recordAnswerAndGetNext(state, questionId, answerValue) {
    const question = adaptiveQuestionPool.find(q => q.id === questionId);
    if (!question) throw new Error('Question not found');

    state.answers[questionId] = {
      category: question.category,
      value: answerValue,
      sector: question.sector,
    };

    this._updateScores(state);
    this._detectSkippedSectors(state);
    this._updatePhase(state);

    if (this._shouldStop(state)) {
      return { nextQuestion: null, testComplete: true };
    }

    const nextQuestion = this._selectNextQuestionLogical(state);
    return { nextQuestion, testComplete: false };
  },

  /**
   * Logical question selection with clear phases
   */
  _selectNextQuestionLogical(state) {
    const unused = adaptiveQuestionPool.filter(q => !state.askedIds.has(q.id));
    if (unused.length === 0) return null;

    // PHASE 1: BASELINE (Complete the 6 basic questions)
    if (state.phase === TestPhases.BASELINE) {
      const basicsAsked = Object.values(state.answers).filter(a =>
        adaptiveQuestionPool.find(q => q.id && q.difficulty === 'basic')?.category === a.category
      ).length;

      if (basicsAsked < 6) {
        // Find the next category that needs a basic question
        const basicCategories = {};
        Object.values(state.answers).forEach(a => {
          const q = adaptiveQuestionPool.find(q => q.id);
          if (q?.difficulty === 'basic') basicCategories[a.category] = true;
        });

        for (const cat of CATEGORIES) {
          if (!basicCategories[cat]) {
            const basicQuestion = unused.find(
              q => q.category === cat && q.difficulty === 'basic'
            );
            if (basicQuestion) {
              state.asked.push(basicQuestion);
              state.askedIds.add(basicQuestion.id);
              state.baselineQuestionsAsked++;
              return basicQuestion;
            }
          }
        }
      }
    }

    // PHASE 2: REFINEMENT (Questions 7-16)
    if (state.phase === TestPhases.REFINEMENT) {
      const questionsAvailable = unused.filter(q => !state.skippedSectors.has(q.sector));

      // Priority: Mid-range scores (40-60%) — need clarification
      for (const cat of CATEGORIES) {
        const score = state.scores[cat] || 50;
        if (score >= 40 && score <= 60) {
          const refinementQ = questionsAvailable.find(
            q => q.category === cat && q.difficulty === 'intermediate'
          );
          if (refinementQ) {
            state.asked.push(refinementQ);
            state.askedIds.add(refinementQ.id);
            return refinementQ;
          }
        }
      }

      // Fallback: Any intermediate question from available list
      const intermediateQ = questionsAvailable.find(q => q.difficulty === 'intermediate');
      if (intermediateQ) {
        state.asked.push(intermediateQ);
        state.askedIds.add(intermediateQ.id);
        return intermediateQ;
      }
    }

    // PHASE 3: ADVANCED (Questions 17-27)
    if (state.phase === TestPhases.ADVANCED) {
      const questionsAvailable = unused.filter(q => !state.skippedSectors.has(q.sector));

      // Priority: Advanced questions for dominant categories
      const topCategories = Object.entries(state.scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([cat]) => cat);

      for (const cat of topCategories) {
        const advancedQ = questionsAvailable.find(
          q => q.category === cat && q.difficulty === 'advanced'
        );
        if (advancedQ) {
          state.asked.push(advancedQ);
          state.askedIds.add(advancedQ.id);
          return advancedQ;
        }
      }

      // Fill in sector coverage
      const coveredSectors = new Set(Object.values(state.answers).map(a => a.sector));
      const uncoveredQ = questionsAvailable.find(
        q => !coveredSectors.has(q.sector)
      );
      if (uncoveredQ) {
        state.asked.push(uncoveredQ);
        state.askedIds.add(uncoveredQ.id);
        return uncoveredQ;
      }

      // Random remaining
      if (questionsAvailable.length > 0) {
        const random = questionsAvailable[Math.floor(Math.random() * questionsAvailable.length)];
        state.asked.push(random);
        state.askedIds.add(random.id);
        return random;
      }
    }

    return null;
  },

  /**
   * Update test phase based on questions answered
   */
  _updatePhase(state) {
    const questionsAsked = state.asked.length;

    if (questionsAsked <= 6) {
      state.phase = TestPhases.BASELINE;
    } else if (questionsAsked <= 16) {
      state.phase = TestPhases.REFINEMENT;
    } else {
      state.phase = TestPhases.ADVANCED;
    }
  },

  /**
   * Calculate normalized RIASEC scores
   */
  _updateScores(state) {
    const maxPossible = getAdaptiveMaxPossible();
    const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.values(state.answers).forEach(({ category, value }) => {
      rawScores[category] = (rawScores[category] || 0) + value;
    });

    state.scores = {};
    CATEGORIES.forEach(cat => {
      const max = maxPossible[cat] || 100;
      state.scores[cat] = Math.round((rawScores[cat] / max) * 100);
    });

    this._updateConfidences(state);
  },

  /**
   * Update confidence for each category
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
      const count = answersPerCategory[cat];
      state.confidences[cat] = Math.min(count / 5, 1);
    });
  },

  /**
   * Detect sectors to skip (2+ "Pas du tout" = 0)
   */
  _detectSkippedSectors(state) {
    const sectorResponses = {};

    Object.values(state.answers).forEach(({ sector, value }) => {
      sectorResponses[sector] = [...(sectorResponses[sector] || []), value];
    });

    Object.entries(sectorResponses).forEach(([sector, responses]) => {
      const zeroCount = responses.filter(v => v === 0).length;
      if (zeroCount >= 2) {
        state.skippedSectors.add(sector);
      }
    });
  },

  /**
   * Determine if test should stop
   */
  _shouldStop(state) {
    const questionsAsked = state.asked.length;

    if (questionsAsked >= TARGET_QUESTIONS) return true;
    if (questionsAsked < MIN_QUESTIONS) return false;

    const avgConfidence = CATEGORIES.reduce((sum, cat) => sum + state.confidences[cat], 0) / CATEGORIES.length;
    const stdDev = this._calculateStdDev(Object.values(state.scores));

    if (avgConfidence >= 0.8 && stdDev <= CONFIDENCE_THRESHOLD) return true;
    return false;
  },

  /**
   * Calculate standard deviation
   */
  _calculateStdDev(scores) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  },

  /**
   * Finalize test and return profile
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
   * Get sector coverage
   */
  _getSectorCoverage(state) {
    const sectors = {};
    Object.values(state.answers).forEach(({ sector }) => {
      sectors[sector] = (sectors[sector] || 0) + 1;
    });
    return sectors;
  },
};
