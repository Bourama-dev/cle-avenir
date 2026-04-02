import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, PhoneOff, ChevronRight, 
  Loader2, Award
} from 'lucide-react';
import CleoAvatar from './CleoAvatar';
import InterviewFeedback from './InterviewFeedback';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const InterviewSimulation = ({ onEnd, isLoading: globalLoading }) => {
  const { userProfile } = useAuth();
  
  // States
  const [stage, setStage] = useState('setup'); // setup, active, feedback
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Dynamic Data
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastFeedback, setLastFeedback] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]); // Array of { question, answer, feedback, score }
  
  // Derived Context
  const jobTitle = userProfile?.main_goal || userProfile?.job_title || "ce poste";
  const experienceLevel = userProfile?.experience_level || "Junior";

  // Timer Effect
  useEffect(() => {
    let interval;
    if (stage === 'active') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseAIResponse = (text) => {
    if (!text) return { feedback: "Analyse en cours...", score: 0, question: "Erreur de connexion. Pouvez-vous répéter ?" };
    
    let feedback = "Merci pour votre réponse.";
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
         if (parts.length > 1) {
            question = parts.pop() + "?";
            feedback = parts.join(". ");
         }
      }
    } catch (e) {
      console.error("Error parsing interview response", e);
    }

    return { feedback, score, question };
  };

  const handleStart = async () => {
    setLocalLoading(true);
    setStage('active');
    setTimer(0);
    
    const { cleoService } = await import('@/services/cleoService');
    
    try {
       const session = await cleoService.createSession(userProfile?.id, `Simulation: ${jobTitle}`);
       
       // Enhanced Prompt with User Profile Context
       const startPrompt = `
         CONTEXTE SIMULATION:
         Candidat: ${userProfile?.first_name}
         Niveau: ${experienceLevel}
         Poste visé: ${jobTitle}
         
         INSTRUCTION: Commence l'entretien. Pose une première question adaptée au niveau ${experienceLevel}.
         Si Junior: Question sur la motivation ou formation.
         Si Senior: Question sur une réalisation concrète.
         
         Je suis prêt.
       `;

       const response = await cleoService.sendMessage(
          userProfile?.id,
          session.id,
          startPrompt, 
          [], 
          { profile: userProfile },
          'interview_coach'
       );
       
       const parsed = parseAIResponse(response.reply);
       setCurrentQuestion(parsed.question);
       
    } catch (err) {
       console.error(err);
       setCurrentQuestion(`Bonjour ${userProfile?.first_name}. Prêt à nous parler de votre motivation pour être ${jobTitle} ?`);
    } finally {
       setLocalLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!transcript.trim()) return;
    
    setLocalLoading(true);
    
    try {
       const { cleoService } = await import('@/services/cleoService');
       
       const sessions = await cleoService.getAllSessions(userProfile.id);
       const sessionId = sessions[0]?.id || (await cleoService.createSession(userProfile.id)).id;

       const response = await cleoService.sendMessage(
          userProfile?.id,
          sessionId,
          transcript,
          [], 
          { profile: userProfile },
          'interview_coach'
       );
       
       const parsed = parseAIResponse(response.reply);
       
       setLastFeedback(parsed.feedback);
       setLastScore(parsed.score);
       setCurrentQuestion(parsed.question);
       
       setSessionHistory(prev => [...prev, {
          question: currentQuestion, 
          answer: transcript,
          feedback: parsed.feedback,
          score: parsed.score
       }]);
       
       setTranscript("");
       
    } catch (e) {
       console.error(e);
       setCurrentQuestion("Désolé, une erreur technique est survenue. Pouvez-vous répéter ?");
    } finally {
       setLocalLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setTranscript(prev => prev + (prev ? " " : "") + "Je suis très motivé par ce poste car il correspond parfaitement à mes compétences...");
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="flex h-full bg-slate-900 text-white relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 z-0"></div>
      
      <div className="flex-1 flex flex-col relative z-10 border-r border-white/10">
         
         <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
               {stage === 'active' && (
                  <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10 animate-pulse gap-2 pl-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> EN DIRECT
                  </Badge>
               )}
               <span className="font-mono text-slate-300 tabular-nums">{formatTime(timer)}</span>
            </div>
            
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => onEnd()} className="text-slate-400 hover:text-white hover:bg-white/10">
                  <PhoneOff size={16} className="mr-2" /> Terminer
               </Button>
            </div>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto overflow-y-auto">
            
            <div className="mb-8 relative group">
               <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
               <div className="relative">
                  <CleoAvatar size="xl" className="w-24 h-24 md:w-32 md:h-32 shadow-2xl ring-4 ring-white/10" />
                  {localLoading && (
                     <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-white/10 shadow-lg">
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                     </div>
                  )}
               </div>
            </div>

            <div className="w-full max-w-2xl text-center mb-10 min-h-[120px]">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                     {stage === 'setup' ? (
                        <div className="space-y-2">
                            <h2 className="text-2xl md:text-3xl font-light text-slate-100 leading-tight">
                            Bonjour {userProfile?.first_name}. <br/>
                            Prêt pour votre simulation de {jobTitle} ?
                            </h2>
                            <p className="text-slate-400 text-sm">Niveau détecté : {experienceLevel}</p>
                        </div>
                     ) : (
                        <h2 className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed">
                           "{currentQuestion}"
                        </h2>
                     )}
                  </motion.div>
               </AnimatePresence>
            </div>

            <div className="w-full max-w-2xl">
               {stage === 'setup' ? (
                  <Button onClick={handleStart} size="lg" className="w-full h-14 text-lg bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/20">
                     Démarrer la simulation
                  </Button>
               ) : (
                  <div className="space-y-4">
                     <div className={`
                        relative rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isRecording ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                     `}>
                        <textarea
                           value={transcript}
                           onChange={(e) => setTranscript(e.target.value)}
                           placeholder="Répondez ici..."
                           className="w-full bg-transparent border-none text-white placeholder:text-slate-500 p-4 resize-none focus:ring-0 min-h-[100px] text-lg leading-relaxed"
                           disabled={localLoading}
                           autoFocus
                        />
                        
                        {isRecording && (
                           <div className="absolute bottom-4 left-4 flex gap-1 items-end h-4">
                              {[1,2,3,4,5].map(i => (
                                 <motion.div
                                    key={i}
                                    animate={{ height: [4, 16, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-red-500 rounded-full"
                                 />
                              ))}
                           </div>
                        )}
                        
                        <div className="absolute bottom-3 right-3 flex gap-2">
                           <Button
                              size="icon"
                              variant="ghost"
                              onClick={toggleRecording}
                              className={`rounded-full hover:bg-white/10 ${isRecording ? 'text-red-400' : 'text-slate-400'}`}
                           >
                              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                           </Button>
                        </div>
                     </div>

                     <div className="flex justify-end">
                        <Button 
                           onClick={handleNextStep} 
                           disabled={!transcript.trim() || localLoading}
                           className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-6 rounded-xl font-semibold text-base transition-all active:scale-95"
                        >
                           {localLoading ? 'Analyse...' : 'Valider la réponse'} <ChevronRight size={18} className="ml-2" />
                        </Button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>

      <div className="hidden lg:block w-80 shrink-0 bg-slate-950 border-l border-white/10 relative z-20">
         {stage === 'active' && lastFeedback ? (
            <InterviewFeedback feedback={lastFeedback} score={lastScore} history={sessionHistory} />
         ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-4">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Award size={32} className="opacity-20" />
               </div>
               <div>
                  <h3 className="font-semibold text-slate-400 mb-2">Analyse IA</h3>
                  <p className="text-xs leading-relaxed opacity-60">
                     Vos réponses seront analysées en temps réel. Cléo évaluera la pertinence, la clarté et la structure de vos arguments par rapport à un profil {experienceLevel}.
                  </p>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};

export default InterviewSimulation;