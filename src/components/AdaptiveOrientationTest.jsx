import React, { useState } from 'react';
import { questions } from '@/data/questions';
import AdaptiveQuestion from '@/components/AdaptiveQuestion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdaptiveOrientationTest = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = questions[currentIndex];

  const handleReturnHome = () => {
    const hasStarted = currentIndex > 0 || answers.length > 0;
    if (hasStarted) {
      if (window.confirm("Êtes-vous sûr ? Vos réponses seront perdues.")) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleAnswer = ({ answerId }) => {
    const newAnswer = {
      questionId: question.id,
      answerId: answerId
    };

    const newAnswers = [...answers.filter(a => a.questionId !== question.id), newAnswer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Test complete
      sessionStorage.setItem('test_answers', JSON.stringify(newAnswers));
      navigate('/test-gate');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={handleReturnHome}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Retour à l'accueil</span>
        </button>

        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        <AdaptiveQuestion 
          question={question} 
          onAnswer={handleAnswer} 
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
};

export default AdaptiveOrientationTest;