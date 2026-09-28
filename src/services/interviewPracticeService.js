import { PRACTICE_CATEGORIES, PRACTICE_QUESTIONS } from '@/data/interviewPracticeQuestions';
import { callAdvisor, clampScore } from './aiInterviewService';
import { interviewService } from './interviewService';
import { gamificationService } from './gamificationService';

// Daily interview practice: question of the day, practice streak, per-category
// mastery. Progress is kept in localStorage per user (same approach as
// localActivityProgress) — no table needed; XP is also credited to the
// server-side gamification profile so it counts toward the user's level.

const storageKey = (userId) => `cleavenir_interview_practice_${userId}`;

const EMPTY_PROGRESS = {
  streak: 0,
  bestStreak: 0,
  lastPracticeDate: null,
  xpByDate: {},
  best: {},
  attempts: 0,
};

export const MASTERY_LEVELS = [
  { min: 80, label: 'Expert' },
  { min: 50, label: 'Avancé' },
  { min: 20, label: 'Intermédiaire' },
  { min: 0, label: 'Débutant' },
];

// Local calendar date (YYYY-MM-DD) so the day changes at the user's midnight.
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function previousDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d - 1));
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function read(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? { ...EMPTY_PROGRESS, ...JSON.parse(raw) } : { ...EMPTY_PROGRESS };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function write(userId, progress) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private mode, quota) — progress just won't persist
  }
}

export const interviewPracticeService = {
  categories: PRACTICE_CATEGORIES,
  questions: PRACTICE_QUESTIONS,

  getQuestion(id) {
    return PRACTICE_QUESTIONS.find((q) => q.id === id) || null;
  },

  getCategory(key) {
    return PRACTICE_CATEGORIES.find((c) => c.key === key) || null;
  },

  questionsFor(category) {
    return PRACTICE_QUESTIONS.filter((q) => q.category === category);
  },

  /** Same question all day for a given user, different from one day to the next. */
  questionOfTheDay(userId, today = dateKey()) {
    return PRACTICE_QUESTIONS[hash(`${userId}|${today}`) % PRACTICE_QUESTIONS.length];
  },

  /** Next question to practice in a category: the least mastered one. */
  nextInCategory(progress, category, excludeId = null) {
    const candidates = this.questionsFor(category).filter((q) => q.id !== excludeId);
    const ranked = [...candidates].sort((a, b) => (progress.best[a.id] ?? -1) - (progress.best[b.id] ?? -1));
    const lowest = progress.best[ranked[0]?.id] ?? -1;
    const tied = ranked.filter((q) => (progress.best[q.id] ?? -1) === lowest);
    return tied[Math.floor(Math.random() * tied.length)] || null;
  },

  /**
   * Progress with the streak already reset if the user missed a day, so the
   * UI never shows a stale streak.
   */
  getProgress(userId, today = dateKey()) {
    const progress = read(userId);
    const last = progress.lastPracticeDate;
    if (last && last !== today && last !== previousDateKey(today)) {
      progress.streak = 0;
    }
    return progress;
  },

  masteryOf(progress, category) {
    const qs = this.questionsFor(category);
    if (!qs.length) return 0;
    const total = qs.reduce((acc, q) => acc + (progress.best[q.id] || 0), 0);
    return Math.round(total / qs.length);
  },

  overallMastery(progress) {
    const total = PRACTICE_QUESTIONS.reduce((acc, q) => acc + (progress.best[q.id] || 0), 0);
    return Math.round(total / PRACTICE_QUESTIONS.length);
  },

  masteryLabel(score) {
    return MASTERY_LEVELS.find((l) => score >= l.min).label;
  },

  /**
   * Scores an answer with the AI coach; falls back to the local heuristic.
   * @returns {Promise<{score:number, feedback:string, betterAnswer:string, aiPowered:boolean}>}
   */
  async evaluateAnswer(question, answer, { userId, jobTitle } = {}) {
    const category = this.getCategory(question.category);
    const systemInstruction = `RÔLE: Tu es Cléo, coach en entretien d'embauche. Tu évalues UNE réponse d'entraînement, de façon honnête et bienveillante.
LANGUE: FRANÇAIS UNIQUEMENT. Tutoie le candidat. N'utilise aucun outil de recherche.
${jobTitle ? `Poste visé par le candidat: ${jobTitle}.` : ''}
Catégorie: ${category?.label || question.category}. Conseil attendu pour cette question: ${question.tip}

Réponds UNIQUEMENT avec un objet JSON valide (sans bloc de code, sans texte autour):
{"score": <entier 0-100>, "feedback": "<2 phrases: ce qui marche, ce qui manque>", "better_answer": "<exemple de réponse améliorée, 2-3 phrases, à la première personne>"}
Sois exigeant: une réponse vague, très courte ou sans exemple concret ne dépasse pas 55.`;

    try {
      const reply = await callAdvisor({
        message: `Question: ${question.text}\nMa réponse: ${answer}`,
        systemInstruction,
        userId,
      });
      const parsed = JSON.parse(reply.slice(reply.indexOf('{'), reply.lastIndexOf('}') + 1));
      return {
        score: clampScore(parsed.score),
        feedback: parsed.feedback || '',
        betterAnswer: parsed.better_answer || '',
        aiPowered: true,
      };
    } catch (error) {
      console.warn('[interviewPractice] evaluation fallback:', error);
      const local = interviewService.analyzeAnswer(answer);
      return {
        score: Math.round((local.clarity + local.confidence) / 2),
        feedback: `${local.feedback} Conseil : ${question.tip}`,
        betterAnswer: '',
        aiPowered: false,
      };
    }
  },

  /**
   * Records a scored attempt: best score, streak and XP.
   * XP = 10 + score/10, doubled for the first answer to the question of the day.
   * @returns {{progress: object, xp: number, streakExtended: boolean, newBest: boolean}}
   */
  recordAttempt(userId, questionId, score, today = dateKey()) {
    const progress = this.getProgress(userId, today);
    const isDaily = this.questionOfTheDay(userId, today).id === questionId;
    const dailyAlreadyDone = !!progress.dailyDoneDate && progress.dailyDoneDate === today;

    let xp = 10 + Math.round(score / 10);
    if (isDaily && !dailyAlreadyDone) {
      xp *= 2;
      progress.dailyDoneDate = today;
    }

    const newBest = score > (progress.best[questionId] ?? -1);
    if (newBest) progress.best = { ...progress.best, [questionId]: score };

    let streakExtended = false;
    if (progress.lastPracticeDate !== today) {
      progress.streak = progress.lastPracticeDate === previousDateKey(today) ? progress.streak + 1 : 1;
      progress.lastPracticeDate = today;
      streakExtended = true;
    }
    progress.bestStreak = Math.max(progress.bestStreak, progress.streak);
    // Only today's total is displayed; keep a short history to bound storage.
    const recentDays = Object.keys(progress.xpByDate).sort().slice(-29);
    progress.xpByDate = Object.fromEntries(recentDays.map((d) => [d, progress.xpByDate[d]]));
    progress.xpByDate[today] = (progress.xpByDate[today] || 0) + xp;
    progress.attempts += 1;

    write(userId, progress);

    // Server-side XP / global streak: best effort, never blocks the practice.
    gamificationService.addXP(userId, xp, 'interview').catch(() => {});
    gamificationService.updateStreak(userId).catch(() => {});

    return { progress, xp, streakExtended, newBest };
  },
};
