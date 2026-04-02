import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { AICoachService } from '@/services/aiCoachService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AICoachWidget = ({ compact = false, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const initializeChat = async () => {
    try {
      const session = await AICoachService.getOrCreateSession(user.id);
      setSessionId(session.id);
      const history = await AICoachService.getMessages(session.id);
      
      if (history.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `Bonjour ${user.user_metadata?.first_name || ''} ! Je suis votre coach IA CléAvenir. Comment puis-je vous aider dans votre progression aujourd'hui ?`
        }]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to init chat', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, id: Date.now().toString() }]);
    setLoading(true);

    try {
      // Prepare history for API (exclude local IDs and system messages if any)
      const apiHistory = messages.filter(m => m.role !== 'system').slice(-6); // Last 6 messages for context
      
      const reply = await AICoachService.sendMessage(user.id, sessionId, userMsg, apiHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply, id: (Date.now() + 1).toString() }]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Je n'ai pas pu joindre le service de coaching. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col h-full shadow-xl border-violet-100", compact ? "h-[500px] w-[350px]" : "h-[600px]")}>
      <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-t-xl shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            Coach IA CléAvenir
          </CardTitle>
          {compact && onClose && (
             <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8">
                <span className="sr-only">Fermer</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden relative bg-slate-50">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-violet-600 text-white" : "bg-white text-violet-600 border border-violet-100"
                )}>
                  {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-violet-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                )}>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                 <div className="h-8 w-8 rounded-full bg-white text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="h-5 w-5" />
                 </div>
                 <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                    <span className="text-xs text-slate-500">Analyse de votre profil...</span>
                 </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à votre coach..."
            className="flex-1 focus-visible:ring-violet-500"
            disabled={loading}
          />
          <Button type="submit" size="icon" className="bg-violet-600 hover:bg-violet-700" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AICoachWidget;