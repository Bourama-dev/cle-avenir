import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============ SWIPE CARDS ============
export const SwipeCard = ({ items = [], onSwipe = () => {} }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const isFirst = current === 0;
  const isLast = current === items.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setDirection(1);
      setCurrent(current + 1);
      onSwipe({ direction: 'next', index: current + 1, item: items[current + 1] });
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setDirection(-1);
      setCurrent(current - 1);
      onSwipe({ direction: 'prev', index: current - 1, item: items[current - 1] });
    }
  };

  return (
    <Card className="w-full border-slate-200 overflow-hidden">
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: direction * 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-700 mb-4">{item.description}</p>
                {item.highlights && (
                  <div className="space-y-2 mb-4">
                    {item.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white">
                <span className="text-xs font-medium text-slate-500">
                  {current + 1} sur {items.length}
                </span>
                <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${((current + 1) / items.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6 justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={isFirst}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={isLast}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============ INTERACTIVE QUIZ ============
export const CleoQuiz = ({ questions = [], onComplete = () => {}, title = "Quiz" }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) return null;

  const question = questions[current];
  const isLast = current === questions.length - 1;
  const answered = answers.length > current;

  const handleAnswer = (answerIndex, isCorrect) => {
    const newAnswers = [...answers];
    newAnswers[current] = { index: answerIndex, isCorrect };
    setAnswers(newAnswers);

    if (isLast) {
      setTimeout(() => setShowResults(true), 500);
    } else {
      setTimeout(() => setCurrent(current + 1), 500);
    }
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  if (showResults) {
    return (
      <Card className="w-full border-slate-200">
        <CardContent className="pt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz terminé !</h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">{score}%</p>
            <p className="text-slate-700 mb-6">
              {correctCount} sur {questions.length} bonnes réponses
            </p>

            {score >= 80 && <p className="text-green-600 font-medium mb-4">🎉 Excellente performance !</p>}
            {score >= 60 && score < 80 && <p className="text-blue-600 font-medium mb-4">✨ Bon travail !</p>}
            {score < 60 && <p className="text-orange-600 font-medium mb-4">📚 À travailler un peu plus</p>}

            <Button
              onClick={() => {
                setCurrent(0);
                setAnswers([]);
                setShowResults(false);
                onComplete({ score, correctCount, totalQuestions: questions.length });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retour à la conversation
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="mt-3 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">
            Question {current + 1} sur {questions.length}
          </p>
          <h3 className="text-lg font-bold text-slate-900">{question.question}</h3>
        </div>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(idx, option.correct)}
              disabled={answered}
              className={cn(
                "w-full px-4 py-3 rounded-lg text-left font-medium transition-all border-2 flex items-center justify-between",
                answered && option.correct
                  ? "bg-green-100 border-green-500 text-green-900"
                  : answered && idx === answers[current]?.index && !option.correct
                  ? "bg-red-100 border-red-500 text-red-900"
                  : "border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50",
                answered && "cursor-default"
              )}
            >
              <span>{option.text}</span>
              {answered && (
                <div>
                  {option.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : idx === answers[current]?.index ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : null}
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {answered && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3"
          >
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">{question.explanation}</p>
          </motion.div>
        )}

        {answered && (
          <Button
            onClick={() => {
              if (isLast) {
                setShowResults(true);
              } else {
                setCurrent(current + 1);
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLast ? "Voir les résultats" : "Question suivante"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ============ RECOMMENDATION CAROUSEL ============
export const RecommendationCarousel = ({ recommendations = [], onSelect = () => {} }) => {
  const [current, setCurrent] = useState(0);

  if (!recommendations || recommendations.length === 0) return null;

  const item = recommendations[current];

  return (
    <Card className="w-full border-slate-200">
      <CardContent className="pt-6">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              {item.subtitle && <p className="text-sm text-slate-600 mt-1">{item.subtitle}</p>}
            </div>
            {item.icon && <div className="text-2xl">{item.icon}</div>}
          </div>

          <p className="text-slate-700 mb-4">{item.description}</p>

          {item.stats && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {item.stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-lg p-2">
                  <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                  <p className="text-base font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {item.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="flex-1"
          >
            ← Précédent
          </Button>

          <Button
            onClick={() => {
              onSelect(item);
            }}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
          >
            Détails
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrent(Math.min(recommendations.length - 1, current + 1))}
            disabled={current === recommendations.length - 1}
            className="flex-1"
          >
            Suivant →
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          {current + 1} sur {recommendations.length}
        </p>
      </CardContent>
    </Card>
  );
};

// ============ INTERACTIVE COMPARISON TABLE ============
export const InteractiveComparison = ({ items = [], categories = [] }) => {
  const [selectedItems, setSelectedItems] = useState(items.slice(0, 2).map((_, i) => i));

  if (!items || items.length === 0) return null;

  const compareItems = selectedItems.map((idx) => items[idx]).filter(Boolean);

  return (
    <Card className="w-full border-slate-200">
      <CardHeader>
        <CardTitle className="text-base">Comparaison détaillée</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selector */}
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((position) => (
            <select
              key={position}
              value={selectedItems[position]}
              onChange={(e) => {
                const newSelected = [...selectedItems];
                newSelected[position] = parseInt(e.target.value);
                setSelectedItems(newSelected);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {items.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.name}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {categories.map((category, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-3 font-medium text-slate-700 w-32 bg-slate-50">{category}</td>
                  {compareItems.map((item, itemIdx) => (
                    <td key={itemIdx} className="py-3 px-3 text-slate-700">
                      {item[category.toLowerCase().replace(/\s+/g, '_')] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
