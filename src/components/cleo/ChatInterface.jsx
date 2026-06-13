import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Send, Sparkles, Loader2,
  PanelRightClose, PanelRightOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import CleoAvatar from './CleoAvatar';
import CleoStateVisualizer from './CleoStateVisualizer';
import { CleoChart, CleoActionPlan } from './CleoRichContent';
import { ChoiceGroup, ComparisonCard, RealityCheck, RiskAlert } from './CleoInteractives';
import MetierCards from './responses/MetierCards';
import FormationCards from './responses/FormationCards';
import CTACard from './responses/CTACard';
import QuickActions from './responses/QuickActions';
import Timeline from './responses/Timeline';
import { renderMarkdown } from '@/utils/markdownUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const MessageBubble = ({ message, isLast, onInteraction, widgets }) => {
  const isUser = message.role === 'user';
  const { userProfile } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 mb-8 group w-full max-w-4xl mx-auto px-4 md:px-0",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
        {isUser ? (
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
             <span className="font-bold text-xs">
                {userProfile?.first_name?.substring(0,2).toUpperCase() || "MOI"}
             </span>
          </div>
        ) : (
          <CleoAvatar size="md" />
        )}
      </div>

      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "flex items-center gap-2 mb-2 px-1 text-[10px] md:text-xs text-slate-400 uppercase tracking-wide font-bold",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span>{isUser ? 'Vous' : 'Cléo'}</span>
        </div>

        <div className={cn(
          "relative px-6 py-5 md:px-7 md:py-6 text-[15px] leading-relaxed shadow-sm w-full transition-all",
          isUser 
            ? "bg-slate-900 text-slate-50 rounded-2xl rounded-tr-sm shadow-xl shadow-slate-200" 
            : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm shadow-lg shadow-slate-100"
        )}>
          {isUser ? (
             <div className="whitespace-pre-wrap font-medium">{message.content}</div>
          ) : (
             <div className="markdown-content">
                {renderMarkdown(message.content)}
             </div>
          )}

          {/* Interactive Widgets */}
          {!isUser && widgets && widgets.length > 0 && (
             <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 w-full">
                {widgets.map((widget, i) => (
                   <div key={i}>
                      {widget.type === 'chart' && <CleoChart data={widget.data} />}
                      {widget.type === 'action_plan' && <CleoActionPlan data={widget.data} onStart={() => onInteraction('start_plan', widget.data.id)} />}
                      {widget.type === 'comparison' && <ComparisonCard {...widget.data} />}
                      {widget.type === 'reality_check' && <RealityCheck {...widget.data} />}
                      {widget.type === 'risk' && <RiskAlert risk={widget.data} />}
                      {widget.type === 'metier_cards' && <MetierCards data={widget.data} />}
                      {widget.type === 'formation_cards' && <FormationCards data={widget.data} />}
                      {widget.type === 'cta_card' && <CTACard data={widget.data} onAction={() => onInteraction('action', widget.data.action)} />}
                      {widget.type === 'quick_actions' && <QuickActions data={widget.data} onAction={(payload, type) => onInteraction(type || 'choice', payload)} />}
                      {widget.type === 'timeline' && <Timeline data={widget.data} />}
                   </div>
                ))}
             </div>
          )}
        </div>
        
        {/* Quick Choice Buttons */}
        {!isUser && isLast && message.choices && (
           <ChoiceGroup 
             options={message.choices} 
             onSelect={(val) => onInteraction('choice', val)} 
           />
        )}
      </div>
    </motion.div>
  );
};

const ChatInterface = ({
  messages = [],
  isLoading = false,
  onSendMessage = () => {},
  onInteraction = () => {},
  inputValue = "",
  setInputValue = () => {},
  toggleContextPanel,
  isContextPanelOpen,
  cleoState = 'neutral'
}) => {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputValue, autoResize]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 relative">
      {/* Intelligent Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-4">
           <CleoAvatar size="sm" />
           <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
           <CleoStateVisualizer mode={isLoading ? 'thinking' : cleoState} />
        </div>
        
        <div className="flex items-center gap-2">
           {toggleContextPanel && (
             <Button variant="ghost" size="icon" onClick={toggleContextPanel} className="text-slate-400 hover:text-slate-700">
                {isContextPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
             </Button>
           )}
        </div>
      </div>

      <ScrollArea className="flex-1 bg-slate-50/30">
        <div className="py-8 min-h-full max-w-5xl mx-auto w-full">
          {messages.length === 0 && !isLoading ? (
             <div className="h-full flex flex-col items-center justify-center mt-16 gap-6 px-6 text-center">
               <CleoAvatar size="lg" />
               <div>
                 <p className="font-semibold text-slate-700 text-lg">Bonjour, je suis Cléo !</p>
                 <p className="text-sm text-slate-400 max-w-xs leading-relaxed mt-1">
                   Votre coach IA spécialisée en orientation professionnelle.
                 </p>
               </div>
               <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2">
                 {[
                   { icon: '🎯', label: 'Explorer des métiers', query: 'Quels métiers correspondent à mon profil ?' },
                   { icon: '🎓', label: 'Trouver une formation', query: 'Je cherche une formation adaptée à mon projet.' },
                   { icon: '💼', label: 'Préparer un entretien', query: "Aide-moi à préparer un entretien d'embauche." },
                   { icon: '💰', label: 'Comprendre les salaires', query: 'Quels sont les salaires dans mon domaine ?' },
                 ].map((s) => (
                   <button
                     key={s.label}
                     onClick={() => onSendMessage(s.query)}
                     className="flex flex-col items-start gap-2 p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-violet-300 hover:shadow-md transition-all group"
                   >
                     <span className="text-2xl">{s.icon}</span>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700 leading-tight">{s.label}</span>
                   </button>
                 ))}
               </div>
             </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble 
                key={msg.id || i} 
                message={msg} 
                isLast={i === messages.length - 1} 
                onInteraction={onInteraction}
                widgets={msg.widgets}
              />
            ))
          )}

          {isLoading && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex gap-4 mb-6 w-full max-w-4xl mx-auto px-4 md:px-0"
             >
                <div className="shrink-0 flex flex-col items-center mt-1">
                   <CleoAvatar size="md" />
                </div>
                <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                   <Loader2 size={16} className="text-violet-500 animate-spin" />
                   <span className="text-xs font-medium text-slate-500">Analyse en cours...</span>
                </div>
             </motion.div>
          )}
          <div ref={scrollRef} className="h-6"/>
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-100 z-20">
         <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-300 transition-all">
               <textarea
                 ref={inputRef}
                 value={inputValue}
                 onChange={(e) => { setInputValue(e.target.value); }}
                 onKeyDown={handleKeyDown}
                 placeholder="Décrivez votre situation ou posez une question…"
                 className="flex-1 bg-transparent border-none focus:ring-0 resize-none min-h-[44px] py-1 text-sm placeholder:text-slate-400 leading-relaxed"
                 style={{ scrollbarWidth: 'none' }}
                 rows={1}
                 disabled={isLoading}
               />
               <Button
                 onClick={() => onSendMessage()}
                 disabled={!inputValue.trim() || isLoading}
                 size="icon"
                 className={cn(
                   "rounded-xl transition-all w-10 h-10 shrink-0",
                   inputValue.trim() ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200" : "bg-slate-200 text-slate-400"
                 )}
               >
                 {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={18} />}
               </Button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Entrée pour envoyer · Maj+Entrée pour sauter une ligne
            </p>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;