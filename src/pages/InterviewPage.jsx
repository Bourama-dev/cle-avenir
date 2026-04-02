import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { interviewService } from '@/services/interviewService';
import { speechRecognitionService } from '@/services/speechRecognitionService';
import { textToSpeechService } from '@/services/textToSpeechService';
import { useToast } from '@/components/ui/use-toast';

import InterviewSetup from '@/components/Interview/InterviewSetup';
import LiveInterview from '@/components/Interview/LiveInterview';
import InterviewResults from '@/components/Interview/InterviewResults';
import LoadingFallback from '@/components/LoadingFallback';

const InterviewPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Stages: 'setup', 'live', 'results'
  const [stage, setStage] = useState('setup');
  const [loading, setLoading] = useState(false);
  
  // Session State
  const [session, setSession] = useState(null);
  const [interviewType, setInterviewType] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Live Interaction State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 mins per question default

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
    if (stage === 'live' && !isSpeaking && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && stage === 'live') {
      // Auto-submit if time runs out? 
      // For now, let's just stop timer and maybe alert user
    }
    return () => clearInterval(interval);
  }, [stage, isSpeaking, timeLeft]);

  const handleStartInterview = async (typeKey) => {
    try {
      setLoading(true);
      const typeConfig = interviewService.types[typeKey];
      setInterviewType(typeConfig);
      
      // Check capabilities
      if (!speechRecognitionService.isAvailable()) {
        toast({ title: "Erreur", description: "Reconnaissance vocale non supportée par votre navigateur.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Create Session
      const newSession = await interviewService.createInterviewSession(user.id, typeKey);
      setSession(newSession);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setStage('live');
      
      // Start First Question
      setTimeout(() => speakQuestion(typeConfig.questions[0]), 500);

    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de démarrer l'entretien.", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const speakQuestion = (text) => {
    setIsSpeaking(true);
    setTranscript('');
    setInterimTranscript('');
    setTimeLeft(120); // Reset timer

    textToSpeechService.speak(text, {
      onEnd: () => {
        setIsSpeaking(false);
        // Automatically start listening after question? 
        // Better to let user click start to be ready
      }
    });
  };

  const startListening = () => {
    if (isSpeaking) return;
    
    setTranscript('');
    setInterimTranscript('');
    
    speechRecognitionService.startListening(
      ({ final, interim }) => {
        // Accumulate final transcript
        if (final) setTranscript(prev => prev + ' ' + final);
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

    try {
      setLoading(true);
      // Save Answer
      await interviewService.saveAnswer(session.id, currentQuestionIndex, fullAnswer);
      
      // Store locally for results view
      const analysis = interviewService.analyzeAnswer(fullAnswer);
      setAnswers(prev => [...prev, {
        question_index: currentQuestionIndex,
        user_answer: fullAnswer,
        clarity_score: analysis.clarity,
        confidence_score: analysis.confidence
      }]);

      // Next Question or Finish
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < interviewType.questions.length) {
        setCurrentQuestionIndex(nextIndex);
        speakQuestion(interviewType.questions[nextIndex]);
      } else {
        await completeInterview();
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    try {
      await interviewService.completeInterviewSession(session.id, user.id);
      setStage('results');
      toast({ title: "Félicitations !", description: "Entretien terminé avec succès. +200 XP", className: "bg-green-600 text-white" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRetry = () => {
    setStage('setup');
    setSession(null);
    setAnswers([]);
  };

  if (loading) return <LoadingFallback />;

  return (
    <>
      {stage === 'setup' && <InterviewSetup onStart={handleStartInterview} />}
      
      {stage === 'live' && interviewType && (
        <LiveInterview 
          currentQuestion={interviewType.questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={interviewType.questions.length}
          isSpeaking={isSpeaking}
          isListening={isListening}
          transcript={transcript}
          interimTranscript={interimTranscript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmitAnswer={handleSubmitAnswer}
          timeLeft={timeLeft}
        />
      )}

      {stage === 'results' && (
        <InterviewResults 
          sessionData={{ session, answers }} 
          onRetry={handleRetry} 
        />
      )}
    </>
  );
};

export default InterviewPage;