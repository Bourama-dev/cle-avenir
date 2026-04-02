import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '@/data/questions';
import AdaptiveQuestion from '@/components/AdaptiveQuestion';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TestOrientationPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  // Scroll to top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const handleAnswer = (answerData) => {
    setError(null);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      ...answerData
    };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers) => {
    try {
      sessionStorage.setItem('test_answers', JSON.stringify(finalAnswers));
      // Auth logic handled exclusively in TestResultsPage now.
      navigate('/test-results');
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Impossible de sauvegarder vos réponses. Veuillez vérifier l\'espace de stockage de votre navigateur.');
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Test d'Orientation</h1>
          <p className="text-slate-600 mb-6">Répondez spontanément pour découvrir votre profil RIASEC.</p>
          
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-400 w-12 text-right">{Math.round(progressPercentage)}%</span>
            <Progress value={progressPercentage} className="h-3 flex-1" />
            <span className="text-sm font-bold text-slate-400 w-12">{currentIndex + 1}/{questions.length}</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AdaptiveQuestion
          question={questions[currentIndex]}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default TestOrientationPage;