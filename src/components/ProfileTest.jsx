import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, Users, Zap, BookOpen, Target, Heart, Shield, Globe } from 'lucide-react';
import { questions } from '@/data/questions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const questionIcons = {
  1: Globe,
  2: Briefcase,
  3: Target,
  4: BookOpen,
  5: Zap,
  6: Users,
  7: Shield,
  8: Users
};

const ProfileTest = ({ onProfileComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: [answerId] }));
  };

  const canProceed = () => {
    const question = questions[currentStep];
    const currentAnswers = answers[question.id] || [];
    return currentAnswers.length > 0;
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSaving(true);
      try {
        const formattedAnswers = Object.entries(answers).map(([qId, aIds]) => {
             const question = questions.find(q => q.id === parseInt(qId));
             const selectedAnswer = question?.answers.find(a => a.id === aIds[0]);
             return {
                 questionId: parseInt(qId),
                 answerId: aIds[0],
                 answerText: selectedAnswer ? selectedAnswer.text : ""
             };
        });

        const resultsPayload = {
            answers: formattedAnswers,
            timestamp: Date.now()
        };

        navigate('/test-results', { state: resultsPayload });
      } catch (error) {
        console.error("Error processing results:", error);
        setIsSaving(false);
      } 
    }
  };

  const handleBack = () => {
    if (isNavigating) return;
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsNavigating(true);
      navigate(-1);
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswers = answers[currentQuestion.id] || [];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const remainingTime = Math.ceil((questions.length - currentStep) * 0.3); 
  
  const IconComponent = questionIcons[currentQuestion.id] || Briefcase;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
       <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-5xl">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-xl font-bold text-slate-900">CléAvenir</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
               <span className="hidden sm:inline-block bg-slate-100 px-2 py-1 rounded text-xs">~ {remainingTime} min restantes</span>
               <span>Question {currentStep + 1}/{questions.length}</span>
            </div>
        </div>
        <div className="w-full bg-slate-100 h-1">
          <motion.div
            className="bg-indigo-600 h-1"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      <div className="flex-grow flex items-center py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm border border-blue-100">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3">
                  {currentQuestion.text || currentQuestion.question}
                </h2>
                <p className="text-slate-500 text-lg">
                  {currentQuestion.description}
                </p>
              </div>

              <div className={`grid gap-4 ${currentQuestion.answers.length > 3 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {currentQuestion.answers.map((answer) => {
                  const isSelected = currentAnswers.includes(answer.id);
                  return (
                    <motion.button
                      key={answer.id}
                      onClick={() => handleAnswer(currentQuestion.id, answer.id)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-center space-x-4 group ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-1">
                        <p className={`font-bold text-lg ${isSelected ? 'text-indigo-600' : 'text-slate-800'}`}>{answer.text}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-indigo-600 fill-current bg-white rounded-full" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center">
            <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-slate-400 hover:text-slate-600"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              {isSaving ? 'Analyse en cours...' : currentStep === questions.length - 1 ? 'Voir mes résultats' : 'Suivant'}
              {currentStep !== questions.length - 1 && !isSaving && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTest;