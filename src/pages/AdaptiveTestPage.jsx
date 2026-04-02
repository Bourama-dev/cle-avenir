import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrichedQuestions } from '@/data/enrichedQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const AdaptiveTestPage = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const question = enrichedQuestions[currentIdx];
  const progressPercentage = Math.round((currentIdx / enrichedQuestions.length) * 100);

  const handleSelectOption = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = {
      questionId: question.id,
      category: question.category,
      value: option.value
    };
    setAnswers(newAnswers);

    if (currentIdx < enrichedQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
      }, 300); // small delay for UX
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers) => {
    setIsFinishing(true);
    setTimeout(() => {
      navigate('/test-results', { state: { results: { answers: finalAnswers } } });
    }, 1500);
  };

  const goBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Sparkles className="w-16 h-16 text-indigo-500 animate-bounce mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">Calcul de votre profil...</h2>
        <p className="text-slate-500 max-w-md text-center mb-8">
          Notre algorithme analyse vos réponses pour générer vos correspondances métiers et vos recommandations personnalisées.
        </p>
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-12 pb-24 px-4 sm:px-6">
      
      {/* Header & Progress */}
      <div className="max-w-3xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={goBack}
            disabled={currentIdx === 0}
            className={`flex items-center text-sm font-medium transition-colors ${currentIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Précédent
          </button>
          <span className="text-sm font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            Question {currentIdx + 1} / {enrichedQuestions.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-indigo-600" />
      </div>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white flex-grow flex flex-col">
          <CardContent className="p-0 flex-grow flex flex-col">
            
            {/* Question Area */}
            <div className="bg-indigo-600 p-8 sm:p-12 text-white flex-shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="relative z-10">
                 <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                   {question.text}
                 </h2>
                 <p className="text-indigo-100 text-lg opacity-90">
                   {question.description}
                 </p>
               </div>
            </div>

            {/* Options Area */}
            <div className="p-6 sm:p-8 flex-grow bg-slate-50">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {question.options.map((opt, i) => {
                   const isSelected = answers[currentIdx]?.value === opt.value;
                   return (
                     <button
                       key={i}
                       onClick={() => handleSelectOption(opt)}
                       className={`relative group p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 
                         ${isSelected 
                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-md'
                         }
                       `}
                     >
                        <div className="font-semibold text-slate-800 text-base sm:text-lg mb-1 group-hover:text-indigo-700 transition-colors">
                          {opt.text}
                        </div>
                        <div className="text-xs text-slate-500 italic opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-4">
                          {opt.explanation}
                        </div>
                     </button>
                   );
                 })}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-400">
          Choisissez la réponse qui correspond le mieux à votre nature spontanée, pas ce que vous aimeriez être.
        </div>
      </div>
    </div>
  );
};

export default AdaptiveTestPage;