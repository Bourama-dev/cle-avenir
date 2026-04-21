import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronRight, Brain, TrendingUp } from 'lucide-react';
import { adaptiveTestEngine } from '@/services/adaptiveTestEngine';

const AdaptiveTestInterface = ({ onComplete }) => {
  const [state, setState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalProfile, setFinalProfile] = useState(null);

  // Initialize test
  useEffect(() => {
    const initialState = adaptiveTestEngine.initializeTest();
    setState(initialState);
    setCurrentQuestion(initialState.asked[0]);
  }, []);

  // Handle answer submission
  const handleAnswer = async (answerValue) => {
    if (!currentQuestion || isLoading) return;

    setIsLoading(true);
    setSelectedAnswer(null);

    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const result = adaptiveTestEngine.recordAnswerAndGetNext(
        state,
        currentQuestion.id,
        answerValue
      );

      if (result.testComplete) {
        // Test finished
        const finalResult = adaptiveTestEngine.finalizeTest(state);
        setFinalProfile(finalResult);
        setShowResults(true);
      } else {
        // Next question
        setCurrentQuestion(result.nextQuestion);
        setState({ ...state }); // Trigger re-render
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (finalProfile) {
      onComplete(finalProfile);
    }
  };

  if (!state || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const progress = (state.asked.length / 27) * 100;
  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto pt-8"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-4">
                <Brain className="w-7 h-7 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                Test RIASEC Adaptatif
              </h1>
              <p className="text-slate-600 text-lg">
                Questions intelligentes qui s'adaptent à vos réponses
              </p>
            </div>

            {/* Progress */}
            <Card className="mb-8 border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700">
                    Progression du Test
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {state.asked.length} / 27
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-slate-500 mt-2">
                  {state.asked.length < 15
                    ? '⏱️ Commençons par les bases...'
                    : state.asked.length < 20
                    ? '🎯 Affinage du profil en cours...'
                    : '✨ Derniers ajustements...'}
                </p>
              </CardContent>
            </Card>

            {/* Question Card */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start gap-3 mb-6">
                <span className="text-4xl">{currentQuestion.emoji}</span>
                <div className="flex-1">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {currentQuestion.sector}
                  </Badge>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {currentQuestion.text}
                  </h2>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    variants={optionVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleAnswer(option.value)}
                    disabled={isLoading}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                      selectedAnswer === option.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Category Scores Sidebar */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-600 uppercase mb-3 tracking-wider">
                  Scores actuels
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(state.scores || {}).map(([cat, score]) => (
                    <div key={cat} className="text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-1">
                        <span className="font-bold text-indigo-600 text-sm">{score || 0}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-900">
                💡 Le test choisit les questions suivantes en fonction de vos réponses
              </p>
            </div>
          </motion.div>
        ) : (
          // Results Preview
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto pt-8"
          >
            <Card className="border-slate-200 shadow-xl">
              <CardContent className="p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4"
                  >
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                    Test Complété !
                  </h2>
                  <p className="text-slate-600">
                    {finalProfile.questionsAsked} questions adaptatives analysées
                  </p>
                </div>

                {/* Profile Code */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex flex-col items-center bg-indigo-600 text-white rounded-2xl px-8 py-6 shadow-lg">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">
                      Votre code RIASEC
                    </span>
                    <span className="text-5xl font-black tracking-widest">
                      {finalProfile.profileCode}
                    </span>
                  </div>
                </div>

                {/* Scores */}
                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">Scores par dimension</h3>
                  <div className="space-y-3">
                    {Object.entries(finalProfile.profile)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, score]) => (
                        <div key={cat}>
                          <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-slate-700">{cat}</span>
                            <span className="text-indigo-600">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Sector Coverage */}
                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">Secteurs explorés</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(finalProfile.coverageBySector)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([sector]) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  onClick={handleComplete}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12"
                >
                  Voir mes recommandations de métiers
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdaptiveTestInterface;
