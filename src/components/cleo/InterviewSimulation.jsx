import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic, MicOff, PhoneOff, ChevronRight,
  Loader2, Award, Volume2, VolumeX, RefreshCw, RotateCcw,
} from 'lucide-react';
import CleoAvatar from './CleoAvatar';
import InterviewFeedback from './InterviewFeedback';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { textToSpeechService } from '@/services/textToSpeechService';
import { speechRecognitionService } from '@/services/speechRecognitionService';

const InterviewSimulation = ({ onEnd, isLoading: globalLoading }) => {
  const { userProfile } = useAuth();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [stage, setStage] = useState('setup'); // setup | active | feedback
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // ── Dynamic data ────────────────────────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [lastFeedback, setLastFeedback] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);

  // ── Audio state ─────────────────────────────────────────────────────────────
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sttUnsupported, setSttUnsupported] = useState(false);
  const [ttsUnavailable, setTtsUnavailable] = useState(false);
  const stoppedRef = useRef(false);

  // ── Derived context ─────────────────────────────────────────────────────────
  const jobTitle = userProfile?.main_goal || userProfile?.job_title || 'ce poste';
  const experienceLevel = userProfile?.experience_level || 'Junior';

  // ── Detect capabilities once ────────────────────────────────────────────────
  useEffect(() => {
    if (!speechRecognitionService.isAvailable()) setSttUnsupported(true);
    if (!textToSpeechService.isAvailable()) setTtsUnavailable(true);
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (stage === 'active') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      textToSpeechService.stop();
      speechRecognitionService.stopListening();
    };
  }, []);

  // ── Speak question whenever it changes (active stage only) ──────────────────
  useEffect(() => {
    if (!currentQuestion || stage !== 'active' || !ttsEnabled) return;
    if (ttsUnavailable) return;

    stoppedRef.current = false;
    setIsSpeaking(true);

    textToSpeechService
      .speak(currentQuestion, {
        onEnd: () => {
          if (!stoppedRef.current) setIsSpeaking(false);
        },
      })
      .catch(() => setIsSpeaking(false));

    return () => {
      textToSpeechService.stop();
      setIsSpeaking(false);
    };
  }, [currentQuestion, stage, ttsEnabled, ttsUnavailable]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseAIResponse = (text) => {
    if (!text) return { feedback: 'Analyse en cours…', score: 0, question: 'Erreur de connexion. Pouvez-vous répéter ?' };
    let feedback = 'Merci pour votre réponse.';
    let score = 50;
    let question = text;
    try {
      const feedbackMatch = text.match(/<ANALYSIS>([\s\S]*?)<\/ANALYSIS>/i);
      const scoreMatch = text.match(/<SCORE>([\s\S]*?)<\/SCORE>/i);
      const questionMatch = text.match(/<QUESTION>([\s\S]*?)<\/QUESTION>/i);
      if (feedbackMatch) feedback = feedbackMatch[1].trim();
      if (scoreMatch) score = parseInt(scoreMatch[1].trim()) || 50;
      if (questionMatch) question = questionMatch[1].trim();
      if (!feedbackMatch && !questionMatch) {
        const parts = text.split(/[.!?]\s/);
        if (parts.length > 1) { question = parts.pop() + '?'; feedback = parts.join('. '); }
      }
    } catch (e) { console.error('parse error', e); }
    return { feedback, score, question };
  };

  const speakQuestion = useCallback((text) => {
    if (!ttsEnabled || ttsUnavailable || !text) return;
    stoppedRef.current = false;
    setIsSpeaking(true);
    textToSpeechService.speak(text, { onEnd: () => { if (!stoppedRef.current) setIsSpeaking(false); } })
      .catch(() => setIsSpeaking(false));
  }, [ttsEnabled, ttsUnavailable]);

  const replayQuestion = () => {
    if (!currentQuestion) return;
    speakQuestion(currentQuestion);
  };

  const handleStart = async () => {
    setLocalLoading(true);
    setStage('active');
    setTimer(0);
    const { cleoService } = await import('@/services/cleoService');
    try {
      const session = await cleoService.createSession(userProfile?.id, `Simulation: ${jobTitle}`);
      const startPrompt = `CONTEXTE SIMULATION:\nCandidat: ${userProfile?.first_name}\nNiveau: ${experienceLevel}\nPoste visé: ${jobTitle}\n\nINSTRUCTION: Commence l'entretien. Pose une première question adaptée au niveau ${experienceLevel}.\nSi Junior: Question sur la motivation ou formation.\nSi Senior: Question sur une réalisation concrète.\n\nRéponds UNIQUEMENT au format:\n<QUESTION>Ta question ici</QUESTION>`;
      const response = await cleoService.sendMessage(userProfile?.id, session.id, startPrompt, [], { profile: userProfile }, 'interview_coach');
      const parsed = parseAIResponse(response.reply);
      setCurrentQuestion(parsed.question);
    } catch (err) {
      console.error(err);
      const fallback = `Bonjour ${userProfile?.first_name || ''}. Parlez-moi de votre motivation pour le poste de ${jobTitle}.`;
      setCurrentQuestion(fallback);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!transcript.trim()) return;
    setLocalLoading(true);
    stopListeningNow();
    try {
      const { cleoService } = await import('@/services/cleoService');
      const sessions = await cleoService.getAllSessions(userProfile.id);
      const sessionId = sessions[0]?.id || (await cleoService.createSession(userProfile.id)).id;
      const response = await cleoService.sendMessage(
        userProfile?.id, sessionId,
        `Ma réponse: "${transcript}"\n\nInstructions: Analyse brièvement ma réponse (1-2 phrases), donne un score /100, puis pose la question suivante.\nFormat OBLIGATOIRE:\n<ANALYSIS>Ton analyse</ANALYSIS>\n<SCORE>score numérique</SCORE>\n<QUESTION>Prochaine question</QUESTION>`,
        [], { profile: userProfile }, 'interview_coach'
      );
      const parsed = parseAIResponse(response.reply);
      setLastFeedback(parsed.feedback);
      setLastScore(parsed.score);
      setSessionHistory(prev => [...prev, { question: currentQuestion, answer: transcript, feedback: parsed.feedback, score: parsed.score }]);
      setTranscript('');
      setInterimTranscript('');
      setCurrentQuestion(parsed.question);
    } catch (e) {
      console.error(e);
      setCurrentQuestion('Désolé, une erreur technique est survenue. Pouvez-vous répéter votre réponse ?');
    } finally {
      setLocalLoading(false);
    }
  };

  // ── STT ─────────────────────────────────────────────────────────────────────
  const stopListeningNow = () => {
    speechRecognitionService.stopListening();
    setIsRecording(false);
    setInterimTranscript('');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListeningNow();
      return;
    }
    if (sttUnsupported) return; // fallback: user types

    // Stop TTS before listening
    textToSpeechService.stop();
    setIsSpeaking(false);

    setIsRecording(true);
    setInterimTranscript('');

    speechRecognitionService.startListening(
      ({ final, interim }) => {
        if (final) setTranscript(prev => (prev + ' ' + final).trim());
        setInterimTranscript(interim);
      },
      (err) => { console.error('STT error', err); stopListeningNow(); },
      () => stopListeningNow(),
    );
  };

  const resetAnswer = () => {
    stopListeningNow();
    setTranscript('');
    setInterimTranscript('');
  };

  const fullText = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

  return (
    <div className="flex h-full bg-slate-900 text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 z-0" />

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative z-10 border-r border-white/10">

        {/* Top bar */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {stage === 'active' && (
              <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10 animate-pulse gap-2 pl-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> EN DIRECT
              </Badge>
            )}
            <span className="font-mono text-slate-300 tabular-nums">{formatTime(timer)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* TTS mute toggle */}
            {!ttsUnavailable && (
              <Button
                variant="ghost" size="sm"
                onClick={() => { setTtsEnabled(e => !e); if (isSpeaking) { textToSpeechService.stop(); setIsSpeaking(false); } }}
                className="text-slate-400 hover:text-white hover:bg-white/10"
                title={ttsEnabled ? 'Désactiver la voix' : 'Activer la voix'}
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { textToSpeechService.stop(); speechRecognitionService.stopListening(); onEnd(); }} className="text-slate-400 hover:text-white hover:bg-white/10">
              <PhoneOff size={16} className="mr-2" /> Terminer
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto overflow-y-auto">

          {/* Avatar */}
          <div className="mb-8 relative group">
            <div className={`absolute -inset-4 rounded-full blur-xl opacity-50 transition-all duration-500 ${isSpeaking ? 'bg-violet-500/30 opacity-75' : isRecording ? 'bg-emerald-500/30 opacity-75' : 'bg-violet-500/10'}`} />
            <div className="relative">
              <CleoAvatar size="xl" className="w-24 h-24 md:w-32 md:h-32 shadow-2xl ring-4 ring-white/10" />
              {/* Speaking waves */}
              {isSpeaking && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                  {[3,6,9,6,3,8,4].map((h, i) => (
                    <motion.div key={i} className="w-1 rounded-full bg-violet-400"
                      animate={{ height: [h, h * 2.5, h] }}
                      transition={{ repeat: Infinity, duration: 0.4 + i * 0.07 }}
                      style={{ height: h }}
                    />
                  ))}
                </div>
              )}
              {/* Recording ripple */}
              {isRecording && !isSpeaking && (
                <motion.div className="absolute inset-0 rounded-full border-2 border-emerald-400"
                  animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
              {localLoading && (
                <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-white/10">
                  <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Status label */}
          <p className={`text-xs font-semibold tracking-wider uppercase mb-4 transition-colors ${isSpeaking ? 'text-violet-400' : isRecording ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isSpeaking ? '🔊 Cléo parle…' : isRecording ? '🎙 Écoute en cours…' : stage === 'active' ? '💬 Votre tour de parler' : ''}
          </p>

          {/* Question bubble */}
          <div className="w-full max-w-2xl text-center mb-6 min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {stage === 'setup' ? (
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-light text-slate-100 leading-tight">
                      Bonjour {userProfile?.first_name}.<br />
                      Prêt pour votre simulation de <span className="text-violet-300">{jobTitle}</span> ?
                    </h2>
                    <p className="text-slate-400 text-sm">Niveau détecté : <strong>{experienceLevel}</strong></p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed">
                      "{currentQuestion}"
                    </h2>
                    {/* Replay TTS */}
                    {!isSpeaking && ttsEnabled && !ttsUnavailable && currentQuestion && (
                      <button onClick={replayQuestion}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-200 px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
                        <Volume2 size={13} /> Réécouter la question
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="w-full max-w-2xl">
            {stage === 'setup' ? (
              <Button onClick={handleStart} size="lg" disabled={localLoading}
                className="w-full h-14 text-lg bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/20">
                {localLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Démarrer la simulation
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Answer area */}
                <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${isRecording ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                  <textarea
                    value={fullText}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder={sttUnsupported ? 'Tapez votre réponse ici…' : 'Cliquez sur le micro ou tapez votre réponse…'}
                    className="w-full bg-transparent border-none text-white placeholder:text-slate-500 p-4 resize-none focus:ring-0 min-h-[100px] text-lg leading-relaxed"
                    disabled={localLoading}
                  />

                  {/* Recording animation */}
                  {isRecording && (
                    <div className="absolute bottom-4 left-4 flex gap-1 items-end h-4">
                      {[1,2,3,4,5].map(i => (
                        <motion.div key={i} animate={{ height: [4, 16, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 bg-emerald-400 rounded-full" />
                      ))}
                    </div>
                  )}

                  {/* Mic button */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    {transcript && (
                      <Button size="icon" variant="ghost" onClick={resetAnswer}
                        className="rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-300" title="Recommencer">
                        <RotateCcw size={16} />
                      </Button>
                    )}
                    {!sttUnsupported && (
                      <Button size="icon" variant="ghost" onClick={toggleRecording}
                        className={`rounded-full hover:bg-white/10 transition-colors ${isRecording ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
                        title={isRecording ? 'Arrêter l\'enregistrement' : 'Parler'}>
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      </Button>
                    )}
                  </div>
                </div>

                {sttUnsupported && (
                  <p className="text-xs text-amber-400 text-center">
                    Reconnaissance vocale non disponible — utilisez Chrome ou Edge pour parler.
                  </p>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!transcript.trim() || localLoading}
                    className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-6 rounded-xl font-semibold text-base transition-all active:scale-95"
                  >
                    {localLoading ? <><Loader2 size={16} className="animate-spin mr-2" />Analyse…</> : <>Valider la réponse <ChevronRight size={18} className="ml-2" /></>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-80 shrink-0 bg-slate-950 border-l border-white/10 relative z-20">
        {stage === 'active' && lastFeedback ? (
          <InterviewFeedback feedback={lastFeedback} score={lastScore} history={sessionHistory} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <Award size={32} className="opacity-20" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-400 mb-2">Analyse IA en temps réel</h3>
              <p className="text-xs leading-relaxed opacity-60">
                Vos réponses seront analysées sur la pertinence, la clarté et la structure. Cléo évaluera chaque réponse selon le profil <strong className="text-slate-400">{experienceLevel}</strong>.
              </p>
            </div>
            {!ttsUnavailable && (
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Volume2 size={12} /> Voix activée — Cléo lit les questions
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulation;
