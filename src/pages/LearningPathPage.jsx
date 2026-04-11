import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles, Star, Zap, Clock, BookOpen, Trophy, CheckCircle2,
  Play, Lock, RotateCcw, ChevronRight, Brain, Target, TrendingUp,
  Award, Layers, ArrowLeft, AlertCircle, Loader2, BarChart3,
  Mic, MicOff, Volume2, VolumeX, MessageSquare, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { learningPathService } from '@/services/learningPathService';
import { activityService } from '@/services/activityService';
import { textToSpeechService } from '@/services/textToSpeechService';
import { speechRecognitionService } from '@/services/speechRecognitionService';
import { supabase } from '@/lib/customSupabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// Cleo Avatar — animée selon l'état
// ─────────────────────────────────────────────────────────────────────────────
const CleoAvatar = ({ speaking, listening, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl';
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={
          speaking
            ? { scale: [1, 1.06, 1], boxShadow: ['0 0 0px #7c3aed', '0 0 20px #7c3aed', '0 0 0px #7c3aed'] }
            : listening
            ? { scale: [1, 1.04, 1], boxShadow: ['0 0 0px #059669', '0 0 20px #059669', '0 0 0px #059669'] }
            : { scale: 1, boxShadow: '0 0 0px transparent' }
        }
        transition={{ repeat: Infinity, duration: speaking ? 1.2 : 1.5 }}
        className={cn(
          sizeClass,
          'rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg select-none',
        )}
      >
        ✨
      </motion.div>

      {/* Sound wave bars when speaking */}
      {speaking && (
        <div className="flex items-end gap-0.5 mt-2 h-5">
          {[3, 6, 9, 6, 3, 8, 4].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-violet-500"
              animate={{ height: [h, h * 2.5, h] }}
              transition={{ repeat: Infinity, duration: 0.5 + i * 0.07, ease: 'easeInOut' }}
              style={{ height: h }}
            />
          ))}
        </div>
      )}

      {/* Ripple when listening */}
      {listening && !speaking && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CleoVoiceStep — étape "interview" ou "simulation"
//
// Structure d'une étape interview :
//   { type: 'interview', question: string, hint?: string, auto_listen?: boolean }
//
// Structure d'une étape simulation :
//   { type: 'simulation', context?: string, cleo_line: string,
//     user_role?: string, hint?: string, auto_listen?: boolean }
// ─────────────────────────────────────────────────────────────────────────────
const CleoVoiceStep = ({ step, onReady }) => {
  const [phase, setPhase] = useState('speaking'); // speaking | waiting | listening | done
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [ttsError, setTtsError] = useState(false);
  const [sttUnsupported, setSttUnsupported] = useState(false);
  const stoppedRef = useRef(false);

  const textToSpeak = step.type === 'simulation' ? step.cleo_line : step.question;
  const hint = step.hint || null;
  const context = step.context || null;

  // ── TTS on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    stoppedRef.current = false;
    setPhase('speaking');
    setTranscript('');
    setInterimTranscript('');

    if (!textToSpeechService.isAvailable()) {
      setTtsError(true);
      setPhase('waiting');
      return;
    }

    textToSpeechService
      .speak(textToSpeak, {
        onEnd: () => {
          if (!stoppedRef.current) {
            setPhase('waiting');
            // Auto-start listening if configured
            if (step.auto_listen) startListening();
          }
        },
      })
      .catch(() => {
        setTtsError(true);
        setPhase('waiting');
      });

    return () => {
      stoppedRef.current = true;
      textToSpeechService.stop();
      speechRecognitionService.stopListening();
    };
  }, [step]);

  // ── STT ───────────────────────────────────────────────────────────────────
  const startListening = () => {
    if (!speechRecognitionService.isAvailable()) {
      setSttUnsupported(true);
      return;
    }
    setPhase('listening');
    speechRecognitionService.startListening(
      ({ final, interim }) => {
        if (final) setTranscript(prev => (prev + ' ' + final).trim());
        setInterimTranscript(interim);
      },
      (err) => {
        console.error('STT error', err);
        setPhase('waiting');
      },
      () => setPhase(p => (p === 'listening' ? 'waiting' : p)),
    );
  };

  const stopListening = () => {
    speechRecognitionService.stopListening();
    setPhase(transcript ? 'done' : 'waiting');
  };

  const resetTranscript = () => {
    speechRecognitionService.stopListening();
    setTranscript('');
    setInterimTranscript('');
    setPhase('waiting');
  };

  const replayTTS = () => {
    setPhase('speaking');
    setTranscript('');
    setInterimTranscript('');
    textToSpeechService.speak(textToSpeak, {
      onEnd: () => setPhase('waiting'),
    });
  };

  // Expose readiness to parent (ActivityPlayer)
  useEffect(() => {
    onReady(phase === 'done' || (phase === 'waiting' && !!transcript));
  }, [phase, transcript]);

  const fullText = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {/* Context banner */}
      {context && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-800">
          <strong>Contexte :</strong> {context}
        </div>
      )}

      {/* Cleo avatar */}
      <CleoAvatar
        speaking={phase === 'speaking'}
        listening={phase === 'listening'}
        size="lg"
      />

      {/* Status label */}
      <p className={cn(
        'text-sm font-medium',
        phase === 'speaking'  && 'text-violet-600',
        phase === 'listening' && 'text-emerald-600',
        phase === 'waiting'   && 'text-slate-500',
        phase === 'done'      && 'text-emerald-700',
      )}>
        {phase === 'speaking'  && 'Cléo parle…'}
        {phase === 'listening' && 'Écoute en cours…'}
        {phase === 'waiting'   && (transcript ? 'Réponse enregistrée ✓' : 'En attente de votre réponse')}
        {phase === 'done'      && 'Réponse enregistrée ✓'}
      </p>

      {/* Cleo's text */}
      <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5 text-sm">✨</div>
          <p className="text-slate-800 leading-relaxed text-sm">{textToSpeak}</p>
        </div>
        {ttsError && (
          <p className="text-xs text-amber-600 mt-2 ml-10">
            (La synthèse vocale n'est pas disponible — lisez la question ci-dessus)
          </p>
        )}
      </div>

      {/* Hint */}
      {hint && (
        <div className="w-full flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-xs text-blue-700">
          <MessageSquare size={13} className="shrink-0 mt-0.5" />
          <span><strong>Conseil :</strong> {hint}</span>
        </div>
      )}

      {/* Transcript area */}
      {(transcript || interimTranscript || phase === 'listening') && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white border-2 border-emerald-200 rounded-2xl p-4 min-h-[80px]"
        >
          <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
            <Mic size={12} /> Votre réponse
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-slate-400 italic"> {interimTranscript}</span>
            )}
            {!fullText && phase === 'listening' && (
              <span className="text-slate-400 italic animate-pulse">Parlez maintenant…</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Replay TTS */}
        {phase !== 'speaking' && (
          <button
            onClick={replayTTS}
            className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <Volume2 size={14} /> Réécouter
          </button>
        )}

        {/* STT unsupported fallback */}
        {sttUnsupported && (
          <p className="text-xs text-amber-600">
            Votre navigateur ne supporte pas la reconnaissance vocale (utilisez Chrome).
          </p>
        )}

        {/* Mic controls */}
        {!sttUnsupported && (
          <>
            {phase === 'waiting' && (
              <Button
                onClick={startListening}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                size="sm"
              >
                <Mic size={16} /> Parler
              </Button>
            )}

            {phase === 'listening' && (
              <Button
                onClick={stopListening}
                className="bg-red-500 hover:bg-red-600 text-white gap-2 animate-pulse"
                size="sm"
              >
                <MicOff size={16} /> Arrêter
              </Button>
            )}

            {(phase === 'done' || (phase === 'waiting' && transcript)) && (
              <button
                onClick={resetTranscript}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RefreshCw size={13} /> Recommencer
              </button>
            )}
          </>
        )}

        {/* Text fallback input */}
        {sttUnsupported && phase !== 'speaking' && !transcript && (
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-violet-300 outline-none"
            rows={3}
            placeholder="Tapez votre réponse ici…"
            onBlur={(e) => {
              if (e.target.value.trim()) {
                setTranscript(e.target.value.trim());
                setPhase('done');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Activity Player Modal
// ─────────────────────────────────────────────────────────────────────────────
const ActivityPlayer = ({ activity, onComplete, onClose }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false); // for interview/simulation steps
  const { toast } = useToast();

  const steps = activity?.content?.steps || [];
  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  // Reset voice state on step change
  useEffect(() => {
    setVoiceReady(false);
    setSelected(null);
    setAnswered(false);
  }, [step]);

  // Stop TTS/STT when modal closes
  useEffect(() => {
    return () => {
      textToSpeechService.stop();
      speechRecognitionService.stopListening();
    };
  }, []);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === currentStep.correct) {
      setCorrectAnswers(c => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const quizSteps = steps.filter(s => s.type === 'quiz');
      const score = quizSteps.length
        ? Math.round((correctAnswers / quizSteps.length) * 100)
        : 100;
      onComplete(score);
    } else {
      setStep(s => s + 1);
    }
  };

  const canProceed = () => {
    if (!currentStep) return false;
    if (currentStep.type === 'quiz') return answered;
    if (currentStep.type === 'interview' || currentStep.type === 'simulation') return voiceReady;
    return true; // text step
  };

  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-2 text-xs">{activity.type}</Badge>
              <h2 className="text-xl font-bold">{activity.title}</h2>
            </div>
            <button
              onClick={() => {
                textToSpeechService.stop();
                speechRecognitionService.stopListening();
                onClose();
              }}
              className="text-white/60 hover:text-white ml-4 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><Clock size={14} /> {activity.duration_minutes} min</span>
            <span className="flex items-center gap-1"><Star size={14} /> {activity.xp_reward} XP</span>
            <span>Étape {step + 1} / {steps.length}</span>
          </div>
          <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px] flex flex-col overflow-y-auto max-h-[60vh]">
          {/* ── TEXT step ───────────────────────────────────────────────── */}
          {currentStep?.type === 'text' && (
            <div className="flex-1">
              {currentStep.title && (
                <h3 className="text-lg font-bold text-slate-900 mb-3">{currentStep.title}</h3>
              )}
              <p className="text-slate-600 leading-relaxed text-base">{currentStep.content}</p>
            </div>
          )}

          {/* ── QUIZ step ───────────────────────────────────────────────── */}
          {currentStep?.type === 'quiz' && (
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-lg mb-5">{currentStep.question}</p>
              <div className="space-y-3">
                {currentStep.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm',
                      !answered && 'border-slate-200 hover:border-violet-300 hover:bg-violet-50',
                      answered && idx === currentStep.correct && 'border-green-500 bg-green-50 text-green-800',
                      answered && idx === selected && idx !== currentStep.correct && 'border-red-400 bg-red-50 text-red-800',
                      answered && idx !== selected && idx !== currentStep.correct && 'border-slate-100 bg-slate-50 text-slate-400',
                    )}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        answered && idx === currentStep.correct ? 'bg-green-500 text-white' :
                        answered && idx === selected && idx !== currentStep.correct ? 'bg-red-400 text-white' :
                        'bg-slate-100 text-slate-500',
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {choice}
                    </span>
                  </button>
                ))}
              </div>
              {answered && currentStep.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <p className="text-blue-800 text-sm">
                    <strong>Explication :</strong> {currentStep.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* ── INTERVIEW step ──────────────────────────────────────────── */}
          {(currentStep?.type === 'interview' || currentStep?.type === 'simulation') && (
            <CleoVoiceStep
              key={step} // remount on step change to re-trigger TTS
              step={currentStep}
              onReady={setVoiceReady}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-between items-center border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              textToSpeechService.stop();
              speechRecognitionService.stopListening();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            Abandonner
          </button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
          >
            {isLast ? (
              <><Trophy size={16} className="mr-2" /> Terminer & Gagner {activity.xp_reward} XP</>
            ) : (
              <>Suivant <ChevronRight size={16} className="ml-1" /></>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Activity Card
// ─────────────────────────────────────────────────────────────────────────────
const ActivityCard = ({ activity, index, onStart, isLocked }) => {
  const isCompleted = activity.status === 'completed';
  const isStarted   = activity.status === 'started';

  const difficultyColor = {
    'Débutant':      'bg-green-100 text-green-700',
    'Intermédiaire': 'bg-amber-100 text-amber-700',
    'Avancé':        'bg-orange-100 text-orange-700',
    'Expert':        'bg-red-100 text-red-700',
  }[activity.difficulty] || 'bg-slate-100 text-slate-600';

  const typeIcon = {
    simulation: '🎭',
    quiz:       '🧩',
    workshop:   '🛠️',
    challenge:  '⚡',
    project:    '🚀',
    interview:  '🎤',
  }[activity.type] || '📖';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'relative bg-white rounded-2xl border-2 p-5 transition-all group',
        isCompleted ? 'border-green-200 bg-green-50/30' :
        isStarted   ? 'border-violet-300' :
        isLocked    ? 'border-slate-100 opacity-60' :
        'border-slate-200 hover:border-violet-300 hover:shadow-lg',
      )}
    >
      <div className={cn(
        'absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-white',
        isCompleted ? 'bg-green-500 text-white' :
        isStarted   ? 'bg-violet-500 text-white' :
        'bg-slate-200 text-slate-500',
      )}>
        {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
      </div>

      <div className="flex items-start gap-4 ml-3">
        <div className="text-2xl shrink-0">{typeIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="outline" className={cn('text-[10px] border-0 font-semibold', difficultyColor)}>
              {activity.difficulty}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">
              {activity.type}
            </Badge>
            {isStarted && (
              <Badge className="text-[10px] bg-violet-100 text-violet-700 border-0">En cours</Badge>
            )}
          </div>
          <h3 className="font-bold text-slate-900 leading-tight mb-1">{activity.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{activity.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock size={10} /> {activity.duration_minutes} min</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star size={10} fill="currentColor" /> {activity.xp_reward} XP</span>
            {activity.category?.name && (
              <span className="text-slate-300">• {activity.category.name}</span>
            )}
          </div>
        </div>

        <div className="shrink-0 ml-2">
          {isCompleted ? (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
          ) : isLocked ? (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock size={16} className="text-slate-400" />
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => onStart(activity)}
              className={cn(
                'w-10 h-10 p-0 rounded-full',
                isStarted ? 'bg-violet-600 hover:bg-violet-700' : 'bg-slate-900 hover:bg-violet-600',
              )}
            >
              <Play size={14} className="ml-0.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const LearningPathPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading,        setLoading]        = useState(true);
  const [generating,     setGenerating]     = useState(false);
  const [pathData,       setPathData]       = useState(null);
  const [stats,          setStats]          = useState({ total_xp: 0, current_streak: 0 });
  const [activeActivity, setActiveActivity] = useState(null);
  const [view,           setView]           = useState('path');
  const [catalog,        setCatalog]        = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  const loadPath = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [savedPath, userStats] = await Promise.all([
        learningPathService.getPathWithActivities(user.id),
        activityService.getUserStats(user.id),
      ]);
      setPathData(savedPath);
      setStats(userStats || { total_xp: 0, current_streak: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadPath(); }, [loadPath]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await learningPathService.generatePersonalizedPath(user.id, userProfile);
      if (result.success) {
        setPathData({ path: result.path, activities: result.activities, meta: result.meta });
        toast({ title: '✨ Parcours généré !', description: `${result.activities.length} activités sélectionnées pour votre profil.` });
      } else throw new Error(result.error);
    } catch {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de générer le parcours.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleStartActivity = (activity) => {
    if (!activity.content?.steps?.length) {
      toast({ title: 'Activité en préparation', description: 'Le contenu de cette activité sera disponible prochainement.' });
      return;
    }
    setActiveActivity(activity);
    activityService.startActivity(user.id, activity.id).catch(console.error);
  };

  const handleCompleteActivity = async (score) => {
    if (!activeActivity) return;
    try {
      const result = await activityService.completeActivity(user.id, activeActivity.id, score);
      setActiveActivity(null);
      toast({
        title: `🎉 +${result.xpGained || activeActivity.xp_reward} XP gagnés !`,
        description: `Score : ${score}%. ${score >= 80 ? 'Excellent travail !' : 'Continuez comme ça !'}`,
      });
      await loadPath();
    } catch {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de valider l'activité." });
      setActiveActivity(null);
    }
  };

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const acts = await activityService.getActivities(user.id);
      setCatalog(acts);
    } catch (e) {
      console.error(e);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'catalog' && catalog.length === 0) loadCatalog();
  }, [view]);

  const completed = pathData?.activities?.filter(a => a.status === 'completed') || [];
  const total     = pathData?.activities?.length || 0;
  const progress  = total > 0 ? Math.round((completed.length / total) * 100) : 0;
  const level     = Math.floor((stats.total_xp || 0) / 1000) + 1;
  const xpInLevel = (stats.total_xp || 0) % 1000;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-violet-500 mx-auto mb-3" />
          <p className="text-slate-500">Chargement de votre parcours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet><title>Parcours d'apprentissage – CléAvenir</title></Helmet>

      <AnimatePresence>
        {activeActivity && (
          <ActivityPlayer
            activity={activeActivity}
            onComplete={handleCompleteActivity}
            onClose={() => {
              setActiveActivity(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-slate-500">
              <ArrowLeft size={16} className="mr-1" /> Dashboard
            </Button>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="font-bold text-slate-900 flex items-center gap-2">
              <Brain size={20} className="text-violet-600" /> Développement de compétences
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Niv. {level}</span>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${(xpInLevel / 1000) * 100}%` }} />
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold">
                <Star size={12} fill="currentColor" /> {stats.total_xp || 0} XP
              </div>
            </div>
            {stats.current_streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs font-bold">
                🔥 {stats.current_streak} jours
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-6 text-sm font-medium border-t border-slate-100">
            {[
              { id: 'path',    label: 'Mon Parcours', icon: Target },
              { id: 'catalog', label: 'Catalogue',    icon: Layers },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-3 border-b-2 transition-colors',
                  view === tab.id
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700',
                )}
              >
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ═══ MON PARCOURS ═══════════════════════════════════════════════ */}
        {view === 'path' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!pathData ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <Sparkles className="w-14 h-14 text-violet-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Votre parcours personnalisé</h2>
                  <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Cléo va analyser votre profil RIASEC, vos compétences actuelles et votre objectif professionnel
                    pour créer un parcours d'apprentissage sur-mesure.
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    size="lg"
                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 px-8"
                  >
                    {generating ? (
                      <><Loader2 size={18} className="animate-spin mr-2" /> Génération en cours…</>
                    ) : (
                      <><Sparkles size={18} className="mr-2" /> Générer mon parcours IA</>
                    )}
                  </Button>
                  {!userProfile?.riasec_profile?.length && (
                    <p className="text-xs text-slate-400 mt-4">
                      💡 Passez d'abord le{' '}
                      <button onClick={() => navigate('/test')} className="text-violet-600 underline">test d'orientation</button>
                      {' '}pour un parcours encore plus précis.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{pathData.path?.title}</h2>
                      <p className="text-slate-500 text-sm mt-1">{pathData.path?.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={generating}
                      className="shrink-0 ml-4"
                    >
                      {generating ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} className="mr-1" />}
                      Regénérer
                    </Button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-slate-700">Progression globale</span>
                      <span className="text-sm font-bold text-violet-700">{completed.length}/{total} activités</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>{progress}% complété</span>
                      <span>~{pathData.path?.estimated_weeks || 4} semaines estimées</span>
                    </div>
                  </div>

                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-slate-200" />
                    {pathData.activities.map((activity, idx) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        index={idx}
                        onStart={handleStartActivity}
                        isLocked={false}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <Card className="border-0 shadow-md bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={18} className="text-amber-300" />
                    <span className="font-bold text-lg">Niveau {level}</span>
                  </div>
                  <div className="text-4xl font-extrabold mb-3">{stats.total_xp || 0} XP</div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${(xpInLevel / 1000) * 100}%` }} />
                  </div>
                  <p className="text-white/70 text-xs mt-2">{1000 - xpInLevel} XP pour le niveau {level + 1}</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <div className="text-3xl mb-1">🔥</div>
                  <div className="text-3xl font-bold text-slate-900">{stats.current_streak || 0}</div>
                  <p className="text-sm text-slate-500">Jours consécutifs</p>
                  <p className="text-xs text-slate-400 mt-2">Apprenez chaque jour pour maintenir votre série !</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span className="font-semibold text-slate-800">Activités complétées</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{completed.length}</div>
                  <p className="text-xs text-slate-400 mt-1">sur {total} dans ce parcours</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-violet-100 bg-violet-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-violet-600" />
                    <span className="font-semibold text-violet-900 text-sm">Conseil du jour</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "La régularité bat l'intensité. 15 minutes d'apprentissage par jour surpassent 2 heures le dimanche."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ CATALOGUE ══════════════════════════════════════════════════ */}
        {view === 'catalog' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Catalogue complet</h2>
              <p className="text-slate-500 text-sm mt-1">Explorez toutes les activités disponibles et lancez-en une quand vous le souhaitez.</p>
            </div>

            {catalogLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-violet-500 w-8 h-8" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {catalog.map((activity, idx) => {
                  const isCompleted = activity.status === 'completed';
                  const typeIcon = { simulation: '🎭', quiz: '🧩', workshop: '🛠️', challenge: '⚡', project: '🚀', interview: '🎤' }[activity.type] || '📖';
                  const diffColor = { 'Débutant': 'text-green-600 bg-green-50', 'Intermédiaire': 'text-amber-600 bg-amber-50', 'Avancé': 'text-orange-600 bg-orange-50', 'Expert': 'text-red-600 bg-red-50' }[activity.difficulty] || '';

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        'bg-white rounded-2xl border-2 p-5 flex flex-col group transition-all hover:shadow-lg',
                        isCompleted ? 'border-green-200' : 'border-slate-200 hover:border-violet-300',
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{typeIcon}</span>
                        {isCompleted && <CheckCircle2 size={18} className="text-green-500" />}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className={cn('text-[10px] border-0 font-semibold', diffColor)}>
                          {activity.difficulty}
                        </Badge>
                        {activity.category?.name && (
                          <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">
                            {activity.category.name}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-violet-700 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed mb-4">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={10} /> {activity.duration_minutes}m</span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold"><Star size={10} fill="currentColor" /> {activity.xp_reward}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleStartActivity(activity)}
                          className={cn(
                            'text-xs h-8 px-3',
                            isCompleted ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-violet-600 hover:bg-violet-700 text-white',
                          )}
                        >
                          {isCompleted ? 'Refaire' : 'Commencer'}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathPage;
