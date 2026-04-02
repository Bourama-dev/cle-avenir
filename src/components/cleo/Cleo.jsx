import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cleoService } from '@/services/cleoService';
import { gamificationService } from '@/services/gamificationService';
import { cleoResponseService } from '@/services/cleoResponseService';
import { MessageSquare, X, Send, User, Trash2, Bot, Sparkles, Trophy, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Interactive Components
import MetierCards from '../cleo/responses/MetierCards';
import FormationCards from '../cleo/responses/FormationCards';
import CTACard from '../cleo/responses/CTACard';
import QuickActions from '../cleo/responses/QuickActions';
import Timeline from '../cleo/responses/Timeline';

const InteractiveResponse = ({ components, onAction }) => {
  return (
    <div className="space-y-3 mt-2 w-full max-w-full overflow-hidden">
      {components.map((comp, idx) => {
        switch (comp.type) {
          case 'metier_cards': return <MetierCards key={idx} data={comp.data} />;
          case 'formation_cards': return <FormationCards key={idx} data={comp.data} />;
          case 'cta_card': return <CTACard key={idx} data={comp.data} onAction={onAction} />;
          case 'quick_actions': return <QuickActions key={idx} data={comp.data} onAction={onAction} />;
          case 'timeline': return <Timeline key={idx} data={comp.data} />;
          case 'info_box': 
            return (
              <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                <strong className="block mb-1 font-semibold">{comp.data.title}</strong>
                {comp.data.content}
              </div>
            );
          default: return null;
        }
      })}
    </div>
  );
};

const Cleo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, streak: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize data
  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    } else if (isOpen && !user && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Bonjour ! 👋 Je suis Cléo, ton assistant d'orientation. Comment puis-je t'aider ?`,
        components: [
          { type: 'quick_actions', data: { actions: [
            { label: "🔍 Trouver un métier", query: "trouver un métier" },
            { label: "🎓 Chercher une formation", query: "chercher formation" }
          ]}}
        ]
      }]);
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load Profile & Stats
      const stats = await gamificationService.getUserProfile(user.id);
      if (stats) setUserStats(stats);

      // Load History
      const history = await cleoService.getConversationHistory(user.id);
      const formattedHistory = history.reverse().flatMap(item => [
        { id: item.id + '-user', role: 'user', content: item.user_message },
        { 
          id: item.id + '-cleo', 
          role: 'assistant', 
          content: item.cleo_response?.text || (typeof item.cleo_response === 'string' ? item.cleo_response : ''),
          components: item.cleo_response?.components || []
        }
      ]);

      if (formattedHistory.length === 0) {
        // Generate welcome with context
        const response = await cleoResponseService.generateResponse('general_question', '', { userName: user.user_metadata?.first_name });
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: response.text,
          components: response.components
        }]);
      } else {
        setMessages(formattedHistory);
      }
    } catch (err) {
      console.error("Error loading Cleo data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleAction = (payload, type) => {
    if (type === 'action') {
      // Handle navigation actions
      if (payload === 'start_test') {
        setIsOpen(false);
        navigate('/test-orientation');
      } else if (payload === 'explore_sectors') {
        setIsOpen(false);
        navigate('/metiers');
      }
    } else {
      // Handle text queries
      processUserMessage(payload);
    }
  };

  const processUserMessage = async (text) => {
    // Add user message
    const newMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setInputMessage('');

    try {
      // Analyze Intent
      const intent = cleoService.analyzeIntent(text);
      
      // Build Context
      const context = user ? await cleoService.buildContext(user.id) : {};
      
      // Generate Rich Response
      const response = await cleoResponseService.generateResponse(intent, text, context);
      
      // Add bot response
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.text,
        components: response.components
      }]);

      // Gamification: Award XP
      if (user && response.xpReward > 0) {
        const result = await gamificationService.addXP(user.id, response.xpReward, response.skillDeveloped);
        if (result) {
          setUserStats(prev => ({ ...prev, level: result.level, xp: result.xp }));
          await gamificationService.logActivity(user.id, 'chat_interaction', response.xpReward);
          
          if (result.leveledUp) {
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
          }
        }
      }

      // Persist
      if (user) {
        await cleoService.saveConversation(user.id, text, { text: response.text, components: response.components });
      }

    } catch (error) {
      console.error("Cleo processing error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: "Désolé, j'ai eu un petit souci de connexion. Peux-tu répéter ?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    processUserMessage(inputMessage);
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Conversation effacée. On repart à zéro ! Qu'est-ce qui t'intéresse ?",
      components: [
        { type: 'quick_actions', data: { actions: [
          { label: "🔍 Trouver un métier", query: "trouver un métier" },
          { label: "🧩 Passer le test", action: "start_test" }
        ]}}
      ]
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none font-sans">
      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-[620px] right-0 pointer-events-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50"
          >
            <Trophy className="animate-bounce" />
            <span className="font-bold">Niveau Supérieur ! Niveau {userStats.level} atteint 🚀</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] flex flex-col border border-slate-200 overflow-hidden mb-4 relative"
          >
            {/* Header with Stats */}
            <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/30">
                     <Bot className="h-6 w-6 text-white" />
                  </div>
                  {user && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[10px] font-bold text-slate-900 w-5 h-5 rounded-full flex items-center justify-center border-2 border-indigo-600">
                      {userStats.level}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Cléo Assistant</h3>
                  {user ? (
                    <div className="flex items-center gap-2 text-xs text-indigo-100">
                      <span className="flex items-center gap-1"><Star size={10} className="fill-yellow-300 text-yellow-300" /> {userStats.xp} XP</span>
                      {userStats.streak > 0 && <span className="flex items-center gap-1">🔥 {userStats.streak}j</span>}
                    </div>
                  ) : (
                    <p className="text-xs text-indigo-200">Mode visiteur</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClearChat}
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  title="Effacer la conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex max-w-[90%] items-end gap-2",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                      msg.role === 'user' ? "bg-indigo-100 border-indigo-200" : "bg-white border-slate-200"
                    )}>
                      {msg.role === 'user' ? <User className="h-4 w-4 text-indigo-600" /> : <Sparkles className="h-4 w-4 text-violet-600" />}
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-sm shadow-sm",
                          msg.role === 'user' 
                            ? "bg-indigo-600 text-white rounded-br-none" 
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        )}
                      >
                        <div 
                          className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-inherit"
                          dangerouslySetInnerHTML={{ __html: msg.content }} 
                        />
                      </div>
                      
                      {/* Interactive Components Rendering */}
                      {msg.components && msg.components.length > 0 && (
                        <InteractiveResponse components={msg.components} onAction={handleAction} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="flex max-w-[85%] items-end gap-2 flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm bg-white border-slate-200">
                      <Loader2 className="h-4 w-4 text-violet-600 animate-spin" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 z-10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose ta question..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-slate-800 placeholder:text-slate-400"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!inputMessage.trim() || isLoading}
                  className={cn(
                    "absolute right-1 top-1 h-9 w-9 rounded-full transition-all shadow-sm",
                    inputMessage.trim() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 hover:bg-slate-300 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="text-center mt-2 flex justify-between items-center px-2">
                 <p className="text-[10px] text-slate-400">Cléo v2.0 (Beta)</p>
                 {user && (
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(userStats.xp / userStats.xp_next_level) * 100}%` }}
                      />
                    </div>
                 )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all border-4 border-white flex items-center justify-center relative group z-50"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform translate-x-2 group-hover:translate-x-0">
             Besoin d'aide ? Demande à Cléo ! ✨
             <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default Cleo;