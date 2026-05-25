import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FEATURES } from '@/constants/subscriptionTiers';
import { supabase } from '@/lib/customSupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const INITIAL_SUGGESTIONS = [
  'Quel métier me correspond ?',
  'Comment préparer un entretien ?',
  'Quelles formations après le bac ?',
];

const TypingIndicator = () => (
  <div className="flex gap-1 items-center px-4 py-3">
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className="block w-2 h-2 bg-violet-400 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const CleoWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { hasAccess, loading: subLoading } = useSubscriptionAccess();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const canAccessCleo = hasAccess(FEATURES.AI_COACH);
  const firstName = userProfile?.first_name || user?.user_metadata?.first_name;

  // Message de bienvenue à la première ouverture
  useEffect(() => {
    if (!isOpen) return;
    setHasUnread(false);
    if (messages.length === 0 && canAccessCleo) {
      const greeting = firstName
        ? `Bonjour ${firstName} ! Je suis Cléo, ton coach IA. Comment puis-je t'aider aujourd'hui ?`
        : `Bonjour ! Je suis Cléo, ton coach IA. Comment puis-je t'aider aujourd'hui ?`;
      setMessages([{ id: 'welcome', role: 'assistant', content: greeting }]);
    }
    setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new message or loading
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user) return null;

  const sendMessage = async (text) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setInput('');
    const userMsg = { id: Date.now(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('chat-advisor', {
        body: { message: content, history, userId: user?.id, mode: 'career_advisor' },
      });

      if (error) throw error;

      const reply = data?.reply ?? "Je n'ai pas pu générer une réponse. Réessaie dans un instant.";
      const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];

      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: reply, suggestions }]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('[CleoWidget]', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Réessaie dans quelques instants.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    if (!user) { navigate('/login'); return; }
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Fenêtre chat ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-[360px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            style={{ maxHeight: 'min(560px, calc(100dvh - 100px))' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-none">Cléo</p>
                  <p className="text-[10px] text-white/70 mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Coach IA · En ligne
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { navigate('/cleo'); setIsOpen(false); }}
                  className="text-white/70 hover:text-white hover:bg-white/15 p-1.5 rounded-lg transition-colors"
                  title="Interface complète"
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/15 p-1.5 rounded-lg transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {canAccessCleo ? (
              <>
                {/* Zone messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 min-h-0">
                  {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    const isLastBot = !isUser && i === messages.length - 1;
                    return (
                      <div key={msg.id ?? i}>
                        <div className={cn('flex gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
                          {!isUser && (
                            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5 border border-violet-200">
                              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                            </div>
                          )}
                          <div className={cn(
                            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[82%]',
                            isUser
                              ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm',
                          )}>
                            {msg.content}
                          </div>
                        </div>

                        {/* Chips suggestions sur le dernier message bot */}
                        {isLastBot && !isLoading && msg.suggestions?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                            {msg.suggestions.map((s, si) => (
                              <button
                                key={si}
                                onClick={() => sendMessage(s)}
                                disabled={isLoading}
                                className="text-[11px] px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full hover:bg-violet-100 transition-colors disabled:opacity-50"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Suggestions initiales sous le message de bienvenue */}
                  {messages.length === 1 && !isLoading && (
                    <div className="flex flex-wrap gap-1.5 pl-9">
                      {INITIAL_SUGGESTIONS.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="text-[11px] px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full hover:bg-violet-100 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Indicateur de frappe */}
                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 border border-violet-200">
                        <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>

                {/* Barre de saisie */}
                <div className="px-3 pb-3 pt-2 border-t border-slate-100 bg-white shrink-0">
                  <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-violet-200 focus-within:border-violet-300 transition-all">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pose ta question à Cléo…"
                      rows={1}
                      disabled={isLoading}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm placeholder:text-slate-400 max-h-20 py-0.5 leading-relaxed"
                      style={{ scrollbarWidth: 'none' }}
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className={cn(
                        'w-8 h-8 rounded-lg shrink-0 transition-all',
                        input.trim() && !isLoading
                          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200'
                          : 'bg-slate-200 text-slate-400',
                      )}
                    >
                      <Send size={14} />
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-1.5">
                    Entrée pour envoyer · Maj+Entrée pour sauter une ligne
                  </p>
                </div>
              </>
            ) : (
              /* État verrouillé */
              <div className="flex flex-col items-center text-center p-6 gap-4 bg-slate-50 flex-1 justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Fonctionnalité Premium+</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Cléo est disponible 24/7 pour t'accompagner dans ton orientation et ta recherche d'emploi.
                  </p>
                </div>
                <Button
                  onClick={() => { navigate('/tarifs'); setIsOpen(false); }}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                >
                  Découvrir Premium+
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bouton flottant (FAB) ─────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={cn(
          'relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-200',
          isOpen
            ? 'bg-slate-700 text-white shadow-slate-300'
            : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-300',
        )}
        aria-label={isOpen ? 'Fermer Cléo' : 'Ouvrir Cléo'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Point non-lu */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Badge Premium */}
        {!canAccessCleo && !isOpen && !subLoading && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-[9px] font-bold text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-500 leading-none">
            +
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default CleoWidget;
