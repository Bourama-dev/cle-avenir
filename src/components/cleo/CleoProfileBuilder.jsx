import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Send, Check, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CleoAvatar from './CleoAvatar';
import { profilingService } from '@/services/profilingService';
import { useToast } from '@/components/ui/use-toast';

const CleoProfileBuilder = ({ userProfile, isOpen, onClose, onUpdate }) => {
  const [step, setStep] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && userProfile) {
      const missing = profilingService.getMissingFields(userProfile);
      setMissingFields(missing);
      if (missing.length > 0) {
        loadQuestion(missing[0]);
      } else {
        setStep('complete');
      }
    }
  }, [isOpen, userProfile]);

  const loadQuestion = (field) => {
    setIsThinking(true);
    setTimeout(() => {
      const q = profilingService.getNextQuestion(field);
      setCurrentQuestion(q);
      setAnswer('');
      setIsThinking(false);
    }, 800);
  };

  const handleNext = async () => {
    if (!answer && currentQuestion.type !== 'multi-select') return;

    // Prepare update object
    let updates = {};
    const fieldPath = currentQuestion.field.split('.');
    
    if (fieldPath.length === 2) {
      // Nested update (e.g., constraints.salary)
      const parent = fieldPath[0];
      const child = fieldPath[1];
      updates = { 
        [parent]: { 
          ...(userProfile[parent] || {}), 
          [child]: answer 
        } 
      };
    } else {
      updates = { [currentQuestion.field]: answer };
    }

    try {
      await onUpdate(updates, `Mise à jour via Cléo: ${currentQuestion.label}`);
      
      const remaining = missingFields.slice(1);
      setMissingFields(remaining);

      if (remaining.length > 0) {
        loadQuestion(remaining[0]);
        setStep(prev => prev + 1);
      } else {
        setStep('complete');
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de sauvegarder la réponse." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 flex justify-between items-start text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4 blur-2xl"></div>
          <div className="relative z-10 flex gap-4">
             <CleoAvatar size="lg" className="border-4 border-white/20" />
             <div>
               <h2 className="text-2xl font-bold">Profil Intelligent</h2>
               <p className="text-violet-100 text-sm opacity-90">Je complète votre dossier pour vous.</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
           {step === 'complete' ? (
              <div className="text-center py-8">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                    <Check size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Profil optimisé !</h3>
                 <p className="text-slate-600 mb-6">Merci pour ces informations. Je peux maintenant vous proposer des opportunités beaucoup plus pertinentes.</p>
                 <Button onClick={onClose} className="w-full bg-violet-600 hover:bg-violet-700">Retour au dashboard</Button>
              </div>
           ) : (
              <div className="space-y-6">
                 {/* Cléo Message */}
                 <div className="flex gap-4">
                    <div className="w-2 bg-violet-200 rounded-full"></div>
                    <div>
                       <div className="text-sm font-bold text-violet-600 mb-1">CLÉO</div>
                       {isThinking ? (
                          <div className="flex gap-1 h-6 items-center">
                             <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                             <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                             <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                          </div>
                       ) : (
                          <p className="text-lg text-slate-800 font-medium leading-relaxed">
                             {currentQuestion?.context} <br/>
                             <span className="text-slate-600 font-normal text-base">{currentQuestion?.label}</span>
                          </p>
                       )}
                    </div>
                 </div>

                 {/* Input Area */}
                 {!isThinking && currentQuestion && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 ml-6"
                    >
                       {currentQuestion.type === 'text' && (
                          <Input 
                            value={answer} 
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Votre réponse..."
                            className="bg-slate-50 border-slate-200"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          />
                       )}

                       {currentQuestion.type === 'select' && (
                          <div className="space-y-2">
                             {currentQuestion.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => setAnswer(opt)}
                                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                    answer === opt 
                                      ? 'bg-violet-50 text-violet-700 border border-violet-200 font-medium' 
                                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                                  }`}
                                >
                                  {opt}
                                </button>
                             ))}
                          </div>
                       )}

                       {currentQuestion.type === 'multi-select' && (
                          <div className="space-y-3">
                             <div className="flex flex-wrap gap-2 mb-3">
                                {currentQuestion.options.map((opt) => {
                                   const selected = Array.isArray(answer) && answer.includes(opt);
                                   return (
                                      <Badge 
                                        key={opt}
                                        onClick={() => {
                                           const current = Array.isArray(answer) ? answer : [];
                                           if (selected) setAnswer(current.filter(x => x !== opt));
                                           else setAnswer([...current, opt]);
                                        }}
                                        variant={selected ? "default" : "outline"}
                                        className={`cursor-pointer px-3 py-1.5 ${selected ? 'bg-violet-600 hover:bg-violet-700' : 'hover:bg-slate-100'}`}
                                      >
                                         {opt}
                                      </Badge>
                                   );
                                })}
                             </div>
                             <p className="text-xs text-slate-400">Sélectionnez plusieurs options</p>
                          </div>
                       )}
                    </motion.div>
                 )}
              </div>
           )}
        </div>

        {/* Footer Actions */}
        {step !== 'complete' && (
           <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose} className="text-slate-400">Passer</Button>
              <Button 
                onClick={handleNext} 
                disabled={!answer && currentQuestion?.type !== 'multi-select'}
                className="bg-violet-600 hover:bg-violet-700 gap-2"
              >
                 Valider <Send size={16} />
              </Button>
           </div>
        )}
      </motion.div>
    </div>
  );
};

export default CleoProfileBuilder;