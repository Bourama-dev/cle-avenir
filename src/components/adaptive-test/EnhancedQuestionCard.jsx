import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import '@/styles/questionCardStyles.css';

const EnhancedQuestionCard = ({ question, selectedAnswers = [], onAnswerChange, onConfirm }) => {
  const { toast } = useToast();
  const isMultiple = question.type === 'multi_choice' || question.type === 'multiple';
  const maxAnswers = isMultiple ? (question.maxAnswers || 3) : 1;

  const handleSelection = (choice) => {
    let newSelection = [];

    if (isMultiple) {
      const isSelected = selectedAnswers.some(a => a.id === choice.id);
      
      if (isSelected) {
        newSelection = selectedAnswers.filter(a => a.id !== choice.id);
      } else {
        if (selectedAnswers.length >= maxAnswers) {
          toast({
            title: "Limite atteinte",
            description: `Vous ne pouvez sélectionner que ${maxAnswers} réponses maximum.`,
            variant: "destructive",
            duration: 2000
          });
          return;
        }
        newSelection = [...selectedAnswers, choice];
      }
    } else {
      // Single choice mode
      newSelection = [choice];
    }

    onAnswerChange(newSelection);
  };

  const isSelected = (choiceId) => selectedAnswers.some(a => a.id === choiceId);
  const isDisabled = (choiceId) => isMultiple && selectedAnswers.length >= maxAnswers && !isSelected(choiceId);
  const canContinue = selectedAnswers.length > 0;

  // Use question.answers if it exists, otherwise fallback to question.choices
  const choices = question.answers || question.choices || [];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="mb-6">
        {isMultiple && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block bg-violet-100 text-violet-800 text-xs font-semibold px-3 py-1 rounded-full mb-3"
          >
            {selectedAnswers.length}/{maxAnswers} sélectionné{selectedAnswers.length > 1 ? 's' : ''}
          </motion.div>
        )}
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{question.text}</h2>
        
        {question.description && (
           <p className="text-sm text-slate-500 italic">
             {question.description}
           </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3 max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {choices.map((choice, idx) => {
             const selected = isSelected(choice.id);
             const disabled = isDisabled(choice.id);
             
             return (
               <motion.div
                 key={choice.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.03 }}
               >
                 <div 
                   className={cn(
                     "relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer h-full min-h-[80px]",
                     selected ? "border-violet-600 bg-violet-50/50 ring-1 ring-violet-600 shadow-sm" : 
                     disabled ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" : 
                     "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                   )}
                   onClick={() => !disabled && handleSelection(choice)}
                   role={isMultiple ? "checkbox" : "radio"}
                   aria-checked={selected}
                   aria-disabled={disabled}
                 >
                   <div className="flex items-center flex-1 pr-8">
                     <div 
                       className={cn(
                         "flex-shrink-0 w-6 h-6 mr-4 rounded-full border-2 flex items-center justify-center transition-colors",
                         isMultiple ? "rounded-md" : "rounded-full",
                         selected ? "border-violet-600 bg-violet-600" : "border-slate-300"
                       )}
                       aria-hidden="true"
                     >
                       {selected && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                     </div>
                     <span className={cn(
                       "font-medium text-sm md:text-base leading-snug",
                       selected ? "text-violet-900" : "text-slate-700"
                     )}>
                       {choice.text || choice.label}
                     </span>
                   </div>
                 </div>
               </motion.div>
             );
          })}
        </div>
      </div>

      <div className="pt-6 mt-2 border-t border-slate-100 flex justify-end">
        <Button 
          size="lg"
          onClick={onConfirm}
          disabled={!canContinue}
          className={cn(
            "rounded-xl px-8 transition-all duration-300 font-semibold",
            canContinue ? "bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200/50 text-white" : "bg-slate-100 text-slate-400"
          )}
        >
          Valider et continuer <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedQuestionCard;