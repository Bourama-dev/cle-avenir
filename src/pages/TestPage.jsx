import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, LayoutDashboard } from 'lucide-react';
import { optimizedQuestions, RIASEC_MAX_POSSIBLE, RIASEC_META } from '@/data/optimizedQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import PageHelmet from '@/components/SEO/PageHelmet';
import { testPageSEO } from '@/components/SEO/seoPresets';

/* ─── Scoring helpers ────────────────────────────────────────────────────── */

/**
 * Compute normalised RIASEC profile (0-100 per dimension) from answers map.
 * Uses RIASEC_MAX_POSSIBLE which is derived dynamically from the questions file,
 * so it stays correct even if the number of questions changes.
 */
function computeProfile(answers) {
  const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.values(answers).forEach(({ category, value }) => {
    // Ignore sector-specific questions (category 'SECTOR') from RIASEC scoring
    if (category !== 'SECTOR') {
      rawScores[category] = (rawScores[category] || 0) + value;
    }
  });

  const profile = {};
  Object.entries(rawScores).forEach(([cat, raw]) => {
    const max = RIASEC_MAX_POSSIBLE[cat] || 1;
    profile[cat] = Math.round((raw / max) * 100);
  });

  return profile;
}

/** Returns top-3 RIASEC letters sorted by score, e.g. "ISA" */
function computeProfileCode(profile) {
  return Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([letter]) => letter)
    .join('');
}

/* ─── Sub-component: results shown immediately after the last question ──── */

const ResultsPreview = ({ profile, profileCode, onViewResults }) => {
  const sortedEntries = Object.entries(profile).sort(([, a], [, b]) => b - a);
  const [topLetter] = profileCode;
  const topMeta = RIASEC_META[topLetter] || RIASEC_META.R;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-2xl"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Test complété !</h2>
        <p className="text-slate-500">Voici un aperçu de ton profil RIASEC</p>
      </div>

      {/* Profile code badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex flex-col items-center bg-indigo-600 text-white rounded-2xl px-8 py-5 shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">
            Ton code RIASEC
          </span>
          <span className="text-5xl font-black tracking-widest">{profileCode}</span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3 mb-8">
        {sortedEntries.map(([letter, score], idx) => {
          const meta = RIASEC_META[letter] || {};
          const isTop3 = idx < 3;
          return (
            <div key={letter}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold w-28 ${isTop3 ? meta.textColor : 'text-slate-400'}`}>
                    {meta.label}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                      Dominant
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold tabular-nums ${isTop3 ? 'text-slate-800' : 'text-slate-400'}`}>
                  {score}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isTop3 ? meta.color : 'bg-slate-300'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dominant type description */}
      <div className={`p-4 rounded-xl border ${topMeta.bgLight} ${topMeta.borderLight} mb-8`}>
        <p className={`text-sm font-semibold ${topMeta.textColor} mb-1`}>
          Profil dominant : {topMeta.label}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">{topMeta.description}</p>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base py-6 font-semibold"
        onClick={onViewResults}
      >
        Voir mes métiers
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
};

/* ─── Dot navigation — shows answered/unanswered questions ─────────────── */

const QuestionDots = ({ total, current, answers, onJump }) => (
  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
    {Array.from({ length: total }).map((_, i) => {
      const q = optimizedQuestions[i];
      const answered = answers[q.id] !== undefined;
      const isCurrent = i === current;
      return (
        <button
          key={i}
          title={`Question ${i + 1}${answered ? ' ✓' : ' — sans réponse'}`}
          onClick={() => onJump(i)}
          className={`w-4 h-4 rounded-full transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            isCurrent
              ? 'bg-indigo-600 border-indigo-600 scale-125'
              : answered
              ? 'bg-indigo-200 border-indigo-300'
              : 'bg-white border-slate-300 hover:border-indigo-300'
          }`}
        />
      );
    })}
  </div>
);

/* ─── Main TestPage component ───────────────────────────────────────────── */

const TestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed profile — only set after handleSubmit
  const [computedProfile, setComputedProfile] = useState(null);
  const [profileCode, setProfileCode] = useState('');

  /* ── Timer ── */
  useEffect(() => {
    if (computedProfile) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [computedProfile]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  /* ── Answer tracking ── */
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = optimizedQuestions.length;
  const allAnswered = answeredCount === totalQuestions;
  const unansweredCount = totalQuestions - answeredCount;

  /* ── Navigation ── */
  const handleSelect = (value) => {
    const question = optimizedQuestions[currentIdx];

    // Handle multi-choice questions (sectors)
    if (question.type === 'multi_choice' && question.isSectorQuestion) {
      setAnswers(prev => {
        const current = prev[question.id]?.values || [];
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return {
          ...prev,
          [question.id]: { category: question.category, values: updated },
        };
      });
      return; // Don't auto-advance for multi-choice
    }

    // Handle single-choice RIASEC questions
    setAnswers(prev => ({
      ...prev,
      [question.id]: { category: question.category, value },
    }));
    // Auto-advance to next unanswered question
    if (currentIdx < totalQuestions - 1) {
      setTimeout(() => {
        // Find the next question that hasn't been answered yet
        const nextUnanswered = optimizedQuestions.findIndex(
          (q, i) => i > currentIdx && answers[q.id] === undefined
        );
        if (nextUnanswered !== -1) {
          setCurrentIdx(nextUnanswered);
        } else {
          setCurrentIdx(prev => Math.min(prev + 1, totalQuestions - 1));
        }
      }, 280);
    }
  };

  const handlePrevious = () => { if (currentIdx > 0) setCurrentIdx(p => p - 1); };
  const handleNext = () => { if (currentIdx < totalQuestions - 1) setCurrentIdx(p => p + 1); };

  /* ── Jump to first unanswered (for "Répondre" prompt) ── */
  const jumpToFirstUnanswered = () => {
    const idx = optimizedQuestions.findIndex(q => answers[q.id] === undefined);
    if (idx !== -1) setCurrentIdx(idx);
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!allAnswered) {
      jumpToFirstUnanswered();
      return;
    }

    setIsSubmitting(true);

    const profile = computeProfile(answers);
    const code = computeProfileCode(profile);

    // Extract sector preferences from answers (category 'SECTOR')
    const sectorsAnswer = Object.values(answers).find(a => a.category === 'SECTOR');
    const selectedSectors = sectorsAnswer?.values || [];

    // Persist to localStorage for TestResultsPage and ProfilePage
    localStorage.setItem('test_riasec_profile',      JSON.stringify(profile));
    localStorage.setItem('test_riasec_profile_code', code);
    localStorage.setItem('temp_test_answers',        JSON.stringify(answers));
    localStorage.setItem('temp_test_scores',         JSON.stringify(profile));
    localStorage.setItem('test_selected_sectors',    JSON.stringify(selectedSectors));

    setComputedProfile(profile);
    setProfileCode(code);
    setIsSubmitting(false);
  };

  /* ── View results (after profile preview) ── */
  const handleViewResults = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/test-orientation' } });
      return;
    }

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, education_level, user_status')
        .eq('id', user.id)
        .maybeSingle();

      const profileComplete = !!(
        profileData?.first_name &&
        profileData?.education_level &&
        profileData?.user_status
      );

      if (profileComplete) {
        // Save test result to DB (non-blocking)
        const profile = computedProfile || computeProfile(answers);
        const testScore = Math.round(
          Object.values(profile).reduce((a, b) => a + b, 0) /
          Math.max(Object.keys(profile).length, 1)
        );

        // Extract sector preferences from answers (category 'SECTOR')
        const sectorsAnswer = Object.values(answers).find(a => a.category === 'SECTOR');
        const selectedSectors = sectorsAnswer?.values || [];

        supabase.from('test_results').insert({
          user_id: user.id,
          riasec_profile: profile,
          answers: answers,
          test_score: testScore,
          selected_sectors: selectedSectors,
        }).then(({ error }) => {
          if (error) console.warn('[TestPage] Sauvegarde test_results non critique :', error.message);
        });

        localStorage.removeItem('temp_test_answers');
        localStorage.removeItem('temp_test_scores');
        navigate('/results');
      } else {
        // Profile incomplete — go fill it (test_riasec_profile stays in localStorage)
        navigate('/profile/edit');
      }
    } catch {
      // Network error — navigate anyway, localStorage has the profile
      navigate('/results');
    }
  };

  /* ── Completed screen ── */
  if (computedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
        <ResultsPreview
          profile={computedProfile}
          profileCode={profileCode}
          onViewResults={handleViewResults}
        />
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" /> Retour au tableau de bord
        </button>
      </div>
    );
  }

  /* ── Test in progress ── */
  const currentQuestion = optimizedQuestions[currentIdx];
  const progress = (answeredCount / totalQuestions) * 100;
  const isAnswered = answers[currentQuestion?.id] !== undefined;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  if (!currentQuestion) return null;

  // Category color for the current question
  const catMeta = RIASEC_META[currentQuestion.category] || {};

  return (
    <>
      <PageHelmet {...testPageSEO()} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl space-y-5">

          {/* ── Header bar ── */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <Timer className="w-5 h-5" />
              </div>
              <span className="font-mono font-medium text-slate-700">{formatTime(elapsedSeconds)}</span>
            </div>

            <div className="text-center">
              <div className="text-sm font-bold text-slate-700">
                {currentIdx + 1} / {totalQuestions}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {answeredCount} répondues
              </div>
            </div>

            {unansweredCount > 0 ? (
              <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {unansweredCount} restante{unansweredCount > 1 ? 's' : ''}
              </div>
            ) : (
              <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Toutes répondues
              </div>
            )}
          </div>

          {/* ── Progress bar ── */}
          <div>
            <Progress value={progress} className="h-2 bg-slate-100" indicatorClassName="bg-indigo-600" />
          </div>

          {/* ── Dot navigation ── */}
          <QuestionDots
            total={totalQuestions}
            current={currentIdx}
            answers={answers}
            onJump={setCurrentIdx}
          />

          {/* ── Question card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12 text-center space-y-8">
                  {/* Category badge */}
                  <div className="flex justify-center">
                    <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${catMeta.bgLight} ${catMeta.textColor}`}>
                      {catMeta.label}
                    </span>
                  </div>

                  <div className="text-6xl">{currentQuestion.emoji}</div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed">
                    {currentQuestion.text}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {currentQuestion.options.map((opt, i) => {
                      const isSelected = answers[currentQuestion.id]?.value === opt.value;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(opt.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium text-left
                            ${isSelected
                              ? `border-indigo-600 ${catMeta.bgLight} ${catMeta.textColor} shadow-md`
                              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                        >
                          <span className="mr-2 text-slate-400 text-sm tabular-nums">{i + 1}.</span>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIdx === 0}
              className="border-slate-200 text-slate-600 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
            </Button>

            {isLastQuestion ? (
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`font-semibold min-w-[160px] ${
                    allAnswered
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isSubmitting
                    ? 'Calcul en cours…'
                    : allAnswered
                    ? <>Voir mes résultats <CheckCircle2 className="w-4 h-4 ml-2" /></>
                    : <>{unansweredCount} question{unansweredCount > 1 ? 's' : ''} restante{unansweredCount > 1 ? 's' : ''} <AlertCircle className="w-4 h-4 ml-2" /></>
                  }
                </Button>
                {!allAnswered && (
                  <span className="text-xs text-amber-600 font-medium">
                    Cliquer pour aller à la première question sans réponse
                  </span>
                )}
              </div>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Suivant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;
