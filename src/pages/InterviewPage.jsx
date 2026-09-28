import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { interviewService } from '@/services/interviewService';
import { aiInterviewService } from '@/services/aiInterviewService';
import { speechRecognitionService } from '@/services/speechRecognitionService';
import { textToSpeechService } from '@/services/textToSpeechService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

import InterviewSetup from '@/components/Interview/InterviewSetup';
import LiveInterview from '@/components/Interview/LiveInterview';
import InterviewResults from '@/components/Interview/InterviewResults';
import LoadingFallback from '@/components/LoadingFallback';

const QUESTION_TIME = 120; // seconds per question

const InterviewPage = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Stages: 'setup', 'live', 'report', 'results'
  const [stage, setStage] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  // Session State
  const [session, setSession] = useState(null);
  const [config, setConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [turns, setTurns] = useState([]);
  const [report, setReport] = useState(null);
  const aiPoweredRef = useRef(true);

  // Live Interaction State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.stopListening();
      textToSpeechService.stop();
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (stage === 'live' && !isSpeaking && !thinking && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, isSpeaking, thinking, timeLeft]);

  const handleStartInterview = async (interviewConfig) => {
    if (!speechRecognitionService.isAvailable()) {
      toast({ title: "Erreur", description: "Reconnaissance vocale non supportée par votre navigateur. Essaie avec Chrome ou Edge.", variant: "destructive" });
      return;
    }

    const cfg = { ...interviewConfig, firstName: userProfile?.first_name || '' };
    try {
      setLoading(true);
      setConfig(cfg);
      setTurns([]);
      setReport(null);

      // Persisting the session is best effort: the interview still runs if it fails.
      const typeKey = interviewService.types[cfg.focus] ? cfg.focus : 'recruiter';
      try {
        setSession(await interviewService.createInterviewSession(user.id, typeKey, cfg.questionCount));
      } catch (error) {
        console.warn('Interview session not persisted:', error);
        setSession(null);
      }

      const { question, aiPowered } = await aiInterviewService.startInterview(cfg, user.id);
      aiPoweredRef.current = aiPowered;
      setStage('live');
      setTimeout(() => speakQuestion(question), 300);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de démarrer l'entretien.", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const speakQuestion = (text, { onDone } = {}) => {
    setCurrentQuestion(text);
    setIsSpeaking(true);
    setTranscript('');
    setInterimTranscript('');
    setTimeLeft(QUESTION_TIME);

    textToSpeechService.speak(text, {
      onEnd: () => {
        setIsSpeaking(false);
        onDone?.();
      }
    }).catch(() => {
      setIsSpeaking(false);
      onDone?.();
    });
  };

  const startListening = () => {
    if (isSpeaking || thinking) return;

    speechRecognitionService.startListening(
      ({ final, interim }) => {
        // Accumulate final transcript
        if (final) setTranscript(prev => (prev + ' ' + final).trim());
        setInterimTranscript(interim);
      },
      (error) => {
        console.error("Speech error", error);
        setIsListening(false);
      },
      () => {
        // On end (silence or stop)
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  const stopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
  };

  const handleSubmitAnswer = async () => {
    stopListening();
    const fullAnswer = (transcript + ' ' + interimTranscript).trim();

    if (!fullAnswer) {
      toast({ title: "Réponse vide", description: "Veuillez parler avant de valider.", variant: "destructive" });
      return;
    }

    const questionIndex = turns.length;
    const answeredTurns = [...turns, { question: currentQuestion, answer: fullAnswer }];
    setTurns(answeredTurns);
    setTranscript('');
    setInterimTranscript('');
    setThinking(true);

    if (session) {
      interviewService.saveAnswer(session.id, questionIndex, fullAnswer)
        .catch((error) => console.warn('Answer not persisted:', error));
    }

    try {
      const next = await aiInterviewService.nextTurn(config, answeredTurns, user.id, aiPoweredRef.current);
      aiPoweredRef.current = next.aiPowered;
      const scoredTurns = answeredTurns.map((t, i) => (
        i === questionIndex ? { ...t, analysis: next.analysis, score: next.score } : t
      ));
      setTurns(scoredTurns);
      setThinking(false);

      if (next.question) {
        speakQuestion(next.question);
      } else if (next.closing) {
        speakQuestion(next.closing);
        await completeInterview(scoredTurns);
      } else {
        await completeInterview(scoredTurns);
      }
    } catch (error) {
      console.error(error);
      setThinking(false);
      toast({ title: "Erreur", description: "Erreur lors de l'analyse de ta réponse.", variant: "destructive" });
    }
  };

  const completeInterview = async (finalTurns) => {
    setStage('report');
    const fullReport = await aiInterviewService.generateReport(config, finalTurns, user.id);
    setReport(fullReport);
    setStage('results');

    if (session) {
      try {
        await interviewService.completeInterviewSession(session.id, user.id);
      } catch (error) {
        console.error(error);
      }
    }
    toast({ title: "Félicitations !", description: "Entretien terminé avec succès. +200 XP", className: "bg-green-600 text-white" });
  };

  const handleRetry = () => {
    textToSpeechService.stop();
    setStage('setup');
    setSession(null);
    setTurns([]);
    setReport(null);
  };

  if (loading) return <LoadingFallback />;

  return (
    <>
      {stage === 'setup' && (
        <InterviewSetup
          onStart={handleStartInterview}
          defaultJobTitle={userProfile?.main_goal || userProfile?.job_title || ''}
        />
      )}

      {stage === 'live' && config && (
        <LiveInterview
          currentQuestion={currentQuestion}
          currentQuestionIndex={turns.length}
          totalQuestions={config.questionCount}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isThinking={thinking}
          transcript={transcript}
          interimTranscript={interimTranscript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmitAnswer={handleSubmitAnswer}
          timeLeft={timeLeft}
        />
      )}

      {stage === 'report' && (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 px-4 text-center">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
          <p className="text-lg font-semibold text-slate-700">Cléo prépare ton rapport détaillé...</p>
          <p className="text-sm text-slate-500">Analyse de tes réponses, compétence par compétence.</p>
        </div>
      )}

      {stage === 'results' && report && (
        <InterviewResults
          report={report}
          config={config}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

export default InterviewPage;
