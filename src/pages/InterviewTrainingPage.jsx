import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Zap, Trophy, Mic, Square, Volume2, Lightbulb, RefreshCw, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { interviewPracticeService, dateKey } from '@/services/interviewPracticeService';
import { speechRecognitionService } from '@/services/speechRecognitionService';
import { textToSpeechService } from '@/services/textToSpeechService';

const MAX_ANSWER_CHARS = 3000;

const ProgressBar = ({ value, className = 'bg-violet-500' }) => (
  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
    <div className={`h-full rounded-full transition-all ${className}`} style={{ width: `${value}%` }} />
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
    {icon}
    <div>
      <div className="text-xl font-bold leading-tight">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  </div>
);

const InterviewTrainingPage = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const today = dateKey();

  const [progress, setProgress] = useState(() => interviewPracticeService.getProgress(user.id, today));
  const [question, setQuestion] = useState(null); // null = home view
  const [answer, setAnswer] = useState('');
  const [interim, setInterim] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const sttAvailable = useMemo(() => speechRecognitionService.isAvailable(), []);
  const daily = useMemo(() => interviewPracticeService.questionOfTheDay(user.id, today), [user.id, today]);
  const dailyDone = progress.dailyDoneDate === today;
  const xpToday = progress.xpByDate[today] || 0;
  const overall = interviewPracticeService.overallMastery(progress);

  useEffect(() => () => {
    speechRecognitionService.stopListening();
    textToSpeechService.stop();
  }, []);

  const stopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
    setInterim('');
  };

  const openQuestion = (q) => {
    stopListening();
    textToSpeechService.stop();
    setQuestion(q);
    setAnswer('');
    setResult(null);
    setShowTip(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backHome = () => {
    stopListening();
    textToSpeechService.stop();
    setQuestion(null);
    setResult(null);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }
    textToSpeechService.stop();
    speechRecognitionService.startListening(
      ({ final, interim: partial }) => {
        if (final) setAnswer((prev) => `${prev} ${final}`.trim().slice(0, MAX_ANSWER_CHARS));
        setInterim(partial);
      },
      () => { setIsListening(false); setInterim(''); },
      () => { setIsListening(false); setInterim(''); },
    );
    setIsListening(true);
  };

  const handleEvaluate = async () => {
    stopListening();
    const text = `${answer} ${interim}`.trim();
    if (text.split(/\s+/).length < 3) {
      toast({ title: 'Réponse trop courte', description: 'Développe un peu ta réponse avant de la faire évaluer.', variant: 'destructive' });
      return;
    }
    setAnswer(text);
    setEvaluating(true);
    try {
      const evaluation = await interviewPracticeService.evaluateAnswer(question, text, {
        userId: user.id,
        jobTitle: userProfile?.main_goal || userProfile?.job_title || '',
      });
      const recorded = interviewPracticeService.recordAttempt(user.id, question.id, evaluation.score, today);
      setProgress(recorded.progress);
      setResult({ ...evaluation, ...recorded });
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    const next = interviewPracticeService.nextInCategory(progress, question.category, question.id);
    if (next) openQuestion(next);
    else backHome();
  };

  const category = question ? interviewPracticeService.getCategory(question.category) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 px-4 py-6 sm:px-8 sm:py-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {question ? (
            <button onClick={backHome} className="flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100">
              <ArrowLeft size={18} /> Retour à l'entraînement
            </button>
          ) : (
            <Link to="/interview" className="flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100">
              <ArrowLeft size={18} /> Simulateur d'entretien
            </Link>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Entraînement quotidien</h1>
        <p className="text-base sm:text-lg opacity-90 mb-6">5 minutes par jour pour muscler tes réponses.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <StatCard icon={<Flame className="text-orange-300" size={28} />} label={`Série en cours · record ${progress.bestStreak} j`} value={`${progress.streak} jour${progress.streak > 1 ? 's' : ''}`} />
          <StatCard icon={<Zap className="text-yellow-300" size={28} />} label="XP gagnés aujourd'hui" value={`+${xpToday} XP`} />
          <StatCard icon={<Trophy className="text-emerald-300" size={28} />} label={`Maîtrise globale · ${interviewPracticeService.masteryLabel(overall)}`} value={`${overall}%`} />
        </div>

        {!question && (
          <>
            {/* Question of the day */}
            <div className="mb-10 rounded-2xl bg-white p-6 text-slate-800 shadow-xl">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Question du jour · XP x2</span>
                {dailyDone && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <CheckCircle2 size={16} /> Faite aujourd'hui
                  </span>
                )}
              </div>
              <p className="mb-4 text-xl sm:text-2xl font-bold">« {daily.text} »</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {interviewPracticeService.getCategory(daily.category).emoji} {interviewPracticeService.getCategory(daily.category).label}
                  </span>
                  <span className="flex items-center gap-1"><Clock size={14} /> ~2 min</span>
                </div>
                <button
                  onClick={() => openQuestion(daily)}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-semibold text-white hover:opacity-90"
                >
                  {dailyDone ? 'Refaire' : 'Répondre'}
                </button>
              </div>
            </div>

            {/* Categories */}
            <h2 className="mb-4 text-xl font-bold">Choisis une catégorie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interviewPracticeService.categories.map((cat) => {
                const mastery = interviewPracticeService.masteryOf(progress, cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => openQuestion(interviewPracticeService.nextInCategory(progress, cat.key))}
                    className="rounded-2xl bg-white p-5 text-left text-slate-800 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-lg font-bold">{cat.emoji} {cat.label}</span>
                      <span className="text-sm font-semibold text-violet-600">{mastery}%</span>
                    </div>
                    <p className="mb-3 text-sm text-slate-500">{cat.description}</p>
                    <ProgressBar value={mastery} />
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Niveau : {interviewPracticeService.masteryLabel(mastery)}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {question && (
          <div className="rounded-2xl bg-white p-6 text-slate-800 shadow-xl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{category.emoji} {category.label}</span>
              {question.id === daily.id && (
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Question du jour</span>
              )}
            </div>
            <p className="mb-4 text-xl sm:text-2xl font-bold">« {question.text} »</p>

            <div className="mb-5 flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => textToSpeechService.speak(question.text).catch(() => {})}
                className="flex items-center gap-1 font-medium text-violet-600 hover:underline"
              >
                <Volume2 size={16} /> Écouter
              </button>
              <button onClick={() => setShowTip((v) => !v)} className="flex items-center gap-1 font-medium text-violet-600 hover:underline">
                <Lightbulb size={16} /> {showTip ? 'Masquer le conseil' : 'Voir le conseil'}
              </button>
            </div>
            {showTip && <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{question.tip}</p>}

            {!result && (
              <>
                <label htmlFor="practice-answer" className="mb-2 block text-sm font-semibold text-slate-600">
                  Ta réponse {sttAvailable ? '(parle ou écris)' : '(écris)'}
                </label>
                <textarea
                  id="practice-answer"
                  value={isListening && interim ? `${answer} ${interim}` : answer}
                  onChange={(e) => setAnswer(e.target.value.slice(0, MAX_ANSWER_CHARS))}
                  readOnly={isListening}
                  rows={6}
                  placeholder="Réponds comme si tu étais face au recruteur..."
                  className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex flex-wrap gap-3">
                  {sttAvailable && (
                    <button
                      onClick={toggleListening}
                      disabled={evaluating}
                      className={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                    >
                      {isListening ? <><Square size={18} /> Arrêter</> : <><Mic size={18} /> Parler</>}
                    </button>
                  )}
                  <button
                    onClick={handleEvaluate}
                    disabled={evaluating || !(answer || interim).trim()}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {evaluating ? <><Loader2 size={18} className="animate-spin" /> Cléo analyse...</> : 'Évaluer ma réponse'}
                  </button>
                </div>
              </>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <span className="text-2xl font-extrabold leading-none">{result.score}</span>
                    <span className="text-[10px] uppercase tracking-wide">/100</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-emerald-600">+{result.xp} XP{result.newBest ? ' · nouveau record 🎉' : ''}</p>
                    {result.streakExtended && (
                      <p className="text-orange-600 font-semibold">🔥 Série : {result.progress.streak} jour{result.progress.streak > 1 ? 's' : ''}</p>
                    )}
                    {!result.aiPowered && <p className="text-xs text-amber-600">Analyse simplifiée (IA indisponible)</p>}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-100 p-3 text-sm italic text-slate-600">"{answer}"</div>
                {result.feedback && <p className="text-slate-700">{result.feedback}</p>}
                {result.betterAnswer && (
                  <div className="flex gap-2 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
                    <Lightbulb size={16} className="mt-0.5 shrink-0" />
                    <span><strong>Exemple de réponse améliorée :</strong> {result.betterAnswer}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => openQuestion(question)} className="flex items-center gap-2 rounded-lg border-2 border-indigo-500 px-5 py-2.5 font-semibold text-indigo-600 hover:bg-indigo-50">
                    <RefreshCw size={18} /> Réessayer
                  </button>
                  <button onClick={nextQuestion} className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600">
                    Question suivante <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTrainingPage;
