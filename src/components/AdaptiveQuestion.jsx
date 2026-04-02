import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const AdaptiveQuestion = ({ question, onAnswer, disabled, currentIndex, totalQuestions }) => {
  const [selected, setSelected] = useState(question.type === 'multi_choice' ? [] : '');
  const { toast } = useToast();

  const maxLimit = question.maxAnswers || 1;
  const limitText = maxLimit > 1 ? `${maxLimit} réponses maximum` : '1 réponse';

  const handleSubmit = () => {
    if (question.type === 'multi_choice') {
      onAnswer({ answerId: selected });
    } else {
      onAnswer({ answerId: [selected] });
    }
    setSelected(question.type === 'multi_choice' ? [] : '');
  };

  const handleMultiChange = (id, checked) => {
    if (checked) {
      if (selected.length < maxLimit) {
        setSelected(prev => [...prev, id]);
      } else {
        toast({
          title: "Limite atteinte",
          description: `Vous ne pouvez sélectionner que ${maxLimit} réponse(s) pour cette question.`,
          variant: "destructive"
        });
      }
    } else {
      setSelected(prev => prev.filter(x => x !== id));
    }
  };

  const canSubmit = () => {
    if (question.type === 'multi_choice') return selected.length > 0;
    return !!selected;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={question.id}
        className="mb-8"
      >
        <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
          Question {currentIndex + 1} sur {totalQuestions}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {question.text}
          </h2>
          {question.description && (
            <p className="text-slate-500 text-sm">
              {question.description}
            </p>
          )}
          <div className="text-xs font-medium text-indigo-600 mt-2 bg-indigo-50 inline-flex items-center px-3 py-1 rounded-full border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            {limitText}
          </div>
        </div>

        <div className="grid gap-3">
          {question.type === 'choice' && (
            <RadioGroup value={selected} onValueChange={setSelected} className="grid gap-3">
              {question.answers.map((opt) => (
                <div 
                  key={opt.id} 
                  onClick={() => !disabled && setSelected(opt.id)}
                  className={`
                    flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer h-full
                    ${selected === opt.id 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
                    <Label htmlFor={opt.id} className="cursor-pointer font-medium text-slate-800 text-base flex-1">
                      {opt.label}
                    </Label>
                    {selected === opt.id && (
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'multi_choice' && (
            <div className="grid gap-3">
              {question.answers.map((opt) => {
                const isChecked = selected.includes(opt.id);
                // We keep it enabled so they can click and trigger the toast for better UX
                const isMaxReached = !isChecked && selected.length >= maxLimit; 
                
                return (
                  <div 
                    key={opt.id} 
                    onClick={() => {
                      if (!disabled) handleMultiChange(opt.id, !isChecked);
                    }}
                    className={`
                      flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer h-full
                      ${isChecked 
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                        : isMaxReached 
                          ? 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Checkbox 
                        id={opt.id} 
                        checked={isChecked}
                        onCheckedChange={(c) => !disabled && handleMultiChange(opt.id, c)}
                        className="mr-3 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        // Prevent the default internal checkbox action if limit reached, we handle it via the parent div
                        onClick={(e) => {
                          if (isMaxReached && !isChecked) {
                            e.preventDefault(); 
                            handleMultiChange(opt.id, true);
                          }
                        }}
                      />
                      <Label htmlFor={opt.id} className={`cursor-pointer font-medium text-base ${isChecked ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {opt.label}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
        <Button 
          onClick={handleSubmit} 
          disabled={disabled || !canSubmit()}
          size="lg"
          className="px-8 bg-indigo-600 hover:bg-indigo-700"
        >
          {currentIndex === totalQuestions - 1 ? 'Voir mes résultats' : 'Question suivante'}
        </Button>
      </div>
    </div>
  );
};

export default AdaptiveQuestion;