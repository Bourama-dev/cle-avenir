import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronRight, Brain, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { adaptiveTestEngine } from '@/services/adaptiveTestEngine';
import { adaptiveQuestionPool } from '@/data/adaptiveQuestions';

const AdaptiveTestInterface = ({ onComplete }) => {
  const [state, setState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalProfile, setFinalProfile] = useState(null);
  const [skippedSectors, setSkippedSectors] = useState(new Set());

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
    setSelectedAnswer(answerValue);

    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const updatedState = { ...state };
      const result = adaptiveTestEngine.recordAnswerAndGetNext(
        updatedState,
        currentQuestion.id,
        answerValue
      );

      // Update skipped sectors from engine state
      setSkippedSectors(new Set(updatedState.skippedSectors));

      if (result.testComplete) {
        const finalResult = adaptiveTestEngine.finalizeTest(updatedState);
        setFinalProfile(finalResult);
        setShowResults(true);
      } else {
        setCurrentQuestion(result.nextQuestion);
        setState(updatedState);
      }
    } catch (error) {
      console.error('Test error:', error);
      console.error('Error stack:', error.stack);
      console.error('Current state:', state);
      console.error('Updated state:', updatedState);
      // Show error to user if test fails
      alert('Erreur lors du test: ' + error.message + '\n\nVérifiez la console pour les détails (F12)');
    } finally {
      setIsLoading(false);
      setSelectedAnswer(null);
    }
  };

  const handleComplete = () => {
    if (finalProfile) {
      onComplete(finalProfile);
    }
  };

  if (!state || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  const currentQuestionIndex = state.asked.findIndex(q => q.id === currentQuestion.id) + 1;
  const progress = (state.asked.length / 27) * 100;
  const estimatedRemaining = Math.max(3, Math.ceil(27 - state.asked.length));

  const answerLabels = ['Pas du tout', 'Un peu', 'Beaucoup', 'Passionnément'];
  const answerColors = ['bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-600'];
  const answerEmojis = ['😞', '😐', '🙂', '🚀'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 p-4">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            {/* Compact Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  <h1 className="text-2xl font-black text-slate-900">Test RIASEC Adaptatif</h1>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Temps estimé</p>
                  <p className="text-lg font-bold text-indigo-600">~{estimatedRemaining} min</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">Question {currentQuestionIndex} / ~27</span>
                  <span className="text-xs font-bold text-slate-500">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2.5 rounded-full" />
              </div>
            </div>

            {/* Main Question Card */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-slate-100"
            >
              {/* Question Header */}
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {currentQuestion.emoji}
                  </motion.span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        {currentQuestion.sector}
                      </Badge>
                      {skippedSectors.has(currentQuestion.sector) && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                      {currentQuestion.text}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Enhanced Slider Answer */}
              <div className="mb-8 space-y-6">
                {/* Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Votre réponse</label>
                    {selectedAnswer !== null && (
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        selectedAnswer === 0 ? 'bg-red-100 text-red-700' :
                        selectedAnswer === 33 ? 'bg-orange-100 text-orange-700' :
                        selectedAnswer === 66 ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {answerLabels[selectedAnswer / 33]}
                      </span>
                    )}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="33"
                    value={selectedAnswer !== null ? selectedAnswer : 50}
                    onChange={(e) => setSelectedAnswer(Math.round(Number(e.target.value) / 33) * 33)}
                    disabled={isLoading}
                    className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Pas du tout</span>
                    <span>Un peu</span>
                    <span>Beaucoup</span>
                    <span>Passionnément</span>
                  </div>
                </div>

                {/* Quick Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[0, 33, 66, 100].map((value, idx) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(value)}
                      disabled={isLoading}
                      className={`py-3 px-3 rounded-2xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                        selectedAnswer === value
                          ? `${answerColors[idx]} text-white border-transparent shadow-lg`
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-xl">{answerEmojis[idx]}</span>
                      <span className="hidden sm:inline">{answerLabels[idx]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

            </motion.div>

            {/* Skipped Sectors Warning */}
            {skippedSectors.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 mb-6"
              >
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-orange-900 text-sm">Secteurs exclus</p>
                    <p className="text-xs text-orange-700 mt-1">
                      {Array.from(skippedSectors).join(', ')} • Pas de questions supplémentaires dans ces domaines
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Footer */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                💡 Les questions suivantes s'ajustent selon vos réponses pour plus de précision
              </p>
            </div>
          </motion.div>
        ) : (
          // Results Preview
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-slate-200 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                {/* Success Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-6"
                  >
                    <TrendingUp className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">Test Réussi !</h2>
                  <p className="text-slate-600 text-lg">
                    {finalProfile.questionsAsked} questions adaptatives • Analyse en 3-5 minutes
                  </p>
                </div>

                {/* Profile Code */}
                <div className="flex justify-center mb-10">
                  <motion.div
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl px-10 py-8 shadow-xl"
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 block mb-2">
                      Votre Profil RIASEC
                    </span>
                    <span className="text-6xl font-black tracking-wider block">{finalProfile.profileCode}</span>
                  </motion.div>
                </div>

                {/* Scores */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 mb-8">
                  <h3 className="font-bold text-slate-900 mb-6 text-lg">Scores par dimension</h3>
                  <div className="space-y-4">
                    {Object.entries(finalProfile.profile)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, score], idx) => (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-700">{cat}</span>
                            <span className="text-lg font-black text-indigo-600">{score}%</span>
                          </div>
                          <Progress value={score} className="h-3 rounded-full" />
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Sector Coverage */}
                <div className="mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">Secteurs explorés</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(finalProfile.coverageBySector)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 10)
                      .map(([sector]) => (
                        <Badge
                          key={sector}
                          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs py-1.5 px-3"
                        >
                          {sector}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold h-14 rounded-xl text-lg"
                  >
                    Découvrir mes métiers recommandés
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdaptiveTestInterface;
