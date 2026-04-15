import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { optimizedQuestions } from '@/data/optimizedQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import PageHelmet from '@/components/SEO/PageHelmet';
import { testPageSEO } from '@/components/SEO/seoPresets';

const TestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    if (testCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [testCompleted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (value) => {
    const question = optimizedQuestions[currentIdx];
    setAnswers(prev => ({
      ...prev,
      [question.id]: { category: question.category, value }
    }));

    if (currentIdx < optimizedQuestions.length - 1) {
      setTimeout(() => setCurrentIdx(prev => prev + 1), 300);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIdx < optimizedQuestions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const maxPossible = { R: 500, I: 500, A: 400, S: 500, E: 400, C: 400 };

    Object.values(answers).forEach(ans => {
      rawScores[ans.category] += ans.value;
    });

    const normalizedProfile = {};
    Object.keys(rawScores).forEach(cat => {
      normalizedProfile[cat] = Math.round((rawScores[cat] / maxPossible[cat]) * 100);
    });

    // test_riasec_profile → clé lue par TestResultsPage (/results)
    // temp_test_scores + temp_test_answers → clés lues par ProfilePage et handleViewResults
    localStorage.setItem('test_riasec_profile', JSON.stringify(normalizedProfile));
    localStorage.setItem('temp_test_answers', JSON.stringify(answers));
    localStorage.setItem('temp_test_scores', JSON.stringify(normalizedProfile));

    setTestCompleted(true);
    setIsSubmitting(false);
  };

  const handleViewResults = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/test' } });
      return;
    }

    try {
      // Vérifier si le profil est déjà complet (table: profiles, colonne: id)
      const { data } = await supabase
        .from('profiles')
        .select('first_name, education_level, user_status')
        .eq('id', user.id)
        .maybeSingle();

      const profileComplete = !!(data?.first_name && data?.education_level && data?.user_status);

      const tempAnswers = JSON.parse(localStorage.getItem('temp_test_answers') || '{}');
      const tempScores = JSON.parse(localStorage.getItem('temp_test_scores') || '{}');

      if (profileComplete) {
        // Profil complet → sauvegarder en base avec les bonnes colonnes puis afficher résultats
        const testScore = Math.round(
          Object.values(tempScores).reduce((a, b) => a + b, 0) /
          Math.max(Object.keys(tempScores).length, 1)
        );
        try {
          await supabase.from('test_results').insert({
            user_id: user.id,
            riasec_profile: tempScores,  // colonne réelle dans test_results
            answers: tempAnswers,        // colonne réelle dans test_results
            test_score: testScore,
          });
        } catch (saveErr) {
          // Non-bloquant : on affiche quand même les résultats
          console.warn('Sauvegarde test non critique :', saveErr?.message);
        }
        localStorage.removeItem('temp_test_answers');
        localStorage.removeItem('temp_test_scores');
        navigate('/results');
      } else {
        // Profil incomplet → rediriger vers le formulaire d'édition du profil
        // (test_riasec_profile reste en localStorage, ProfilePage le sauvegarde)
        navigate('/profile/edit');
      }
    } catch {
      // En cas d'erreur réseau on navigue quand même (test_riasec_profile est déjà en localStorage)
      navigate('/results');
    }
  };

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Test Terminé !</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Bravo ! Nous avons analysé vos réponses. Pour découvrir les métiers qui vous correspondent vraiment, nous avons besoin de quelques informations supplémentaires.
          </p>
          <Button 
            size="lg" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6"
            onClick={handleViewResults}
          >
            Voir mes résultats personnalisés <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = optimizedQuestions[currentIdx];
  const progress = ((currentIdx + 1) / optimizedQuestions.length) * 100;
  const isAnswered = answers[currentQuestion?.id] !== undefined;
  const isLastQuestion = currentIdx === optimizedQuestions.length - 1;

  if (!currentQuestion) return null;

  return (
    <>
      <PageHelmet {...testPageSEO()} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <Timer className="w-5 h-5" />
            </div>
            <span className="font-mono font-medium text-slate-700">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Question {currentIdx + 1} / {optimizedQuestions.length}
          </div>
        </div>

        <Progress value={progress} className="h-2 bg-slate-100" indicatorClassName="bg-indigo-600" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12 text-center space-y-10">
                <div className="text-6xl mb-6">{currentQuestion.emoji}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed">
                  {currentQuestion.text}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = answers[currentQuestion.id]?.value === opt.value;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium
                          ${isSelected 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                          }
                        `}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentIdx === 0}
            className="border-slate-200 text-slate-600 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
          </Button>

          {isLastQuestion ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!isAnswered || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
            >
              {isSubmitting ? 'Analyse...' : 'Terminer'} 
              {!isSubmitting && <CheckCircle2 className="w-4 h-4 ml-2" />}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!isAnswered}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default TestPage;