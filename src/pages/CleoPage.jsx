import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FEATURES } from '@/constants/subscriptionTiers';
import CleoSidebar from '@/components/cleo/CleoSidebar';
import CleoActivitySystem from '@/components/cleo/CleoActivitySystem'; 
import ContextPanel from '@/components/cleo/ContextPanel';
import { Loader2 } from 'lucide-react';
import CleoUpgradePrompt from '@/components/CleoUpgradePrompt';
import { cleoService } from '@/services/cleoService';
import { cleoEngine } from '@/services/cleoEngine';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy Load Heavy Components
const ChatInterface = lazy(() => import('@/components/cleo/ChatInterface'));
const InterviewSimulation = lazy(() => import('@/components/cleo/InterviewSimulation'));
const CleoProfileBuilder = lazy(() => import('@/components/cleo/CleoProfileBuilder'));

const CleoPage = () => {
  const { hasAccess, loading: subLoading } = useSubscriptionAccess();
  const { userProfile, refreshProfile } = useAuth(); 
  const { toast } = useToast();
  
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [contextPanelOpen, setContextPanelOpen] = useState(true);
  const [currentMode, setCurrentMode] = useState('career_advisor');
  const [isSimulating, setIsSimulating] = useState(false); 
  const [activeTab, setActiveTab] = useState('chat');
  
  // New State for Intelligent System
  const [cleoState, setCleoState] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Engine on Load
  useEffect(() => {
    if (userProfile?.id) {
      cleoEngine.analyzeCoherence(userProfile).then(analysis => {
        if (analysis.issues.length > 0) {
          setCleoState('alert');
        }
      });
    }
  }, [userProfile]);

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setActiveTab('chat');
    setIsLoading(true);
    try {
        const history = await cleoService.getHistory(sessionId);
        setMessages(history);
        setCleoState('neutral');
    } catch (e) {
        toast({variant:"destructive", title: "Erreur", description: "Impossible de charger la discussion"});
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    const content = text || inputValue;
    if (!content.trim()) return;

    // UI Update
    const userMsg = { id: Date.now(), role: 'user', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setCleoState('thinking');

    try {
      let sessionId = activeSessionId;
      if (!sessionId) {
        const session = await cleoService.createSession(userProfile.id);
        sessionId = session.id;
        setActiveSessionId(sessionId);
      }

      // Check for risks in user input
      const risks = cleoEngine.detectRisks([...messages, userMsg]);
      
      // Send to backend
      const response = await cleoService.sendMessage(
        userProfile.id, 
        sessionId, 
        content, 
        messages, 
        { profile: userProfile, risks },
        currentMode
      );

      if (response.didUpdateProfile) {
        await refreshProfile();
        setCleoState('action'); // Profile updated -> Action state
        setTimeout(() => setCleoState('neutral'), 3000);
      } else {
        setCleoState(risks.length > 0 ? 'empathy' : 'neutral');
      }

      // Construct AI Message with rich widgets
      const widgets = response.widgets || [];
      
      // Inject local engine widgets if needed (e.g., if risk detected)
      if (risks.length > 0) {
        widgets.push({ type: 'risk', data: risks[0] });
      }

      // Mocking a Market Reality Check trigger for demonstration
      if (content.toLowerCase().includes('marché') || content.toLowerCase().includes('salaire')) {
        const marketData = await cleoEngine.checkMarketReality(userProfile.job_title || 'Développeur');
        widgets.push({ type: 'reality_check', data: marketData });
      }

      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.reply, 
        widgets: widgets,
        choices: response.suggestions?.map(s => ({ label: s, value: s })) || [],
        created_at: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Cleo Error:", error);
      const errorMsg = { role: 'assistant', content: "Désolée, je rencontre un problème de connexion." };
      setMessages(prev => [...prev, errorMsg]);
      setCleoState('alert');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Interactive Clicks (Buttons, Action Plans)
  const handleInteraction = (type, value) => {
    if (type === 'choice') {
      handleSendMessage(value);
    } else if (type === 'start_plan') {
      toast({ title: "Plan d'action activé", description: "Les tâches ont été ajoutées à votre dashboard." });
      setCleoState('action');
    }
  };

  const handleStartActivity = (activity) => {
    if (activity.type === 'simulation') {
      setIsSimulating(true);
      setCurrentMode('interview_coach');
    } else {
      setActiveTab('chat');
      handleSendMessage(`Je veux commencer l'activité : ${activity.title}`);
    }
  };

  const canAccessCleo = hasAccess(FEATURES.AI_COACH);

  if (subLoading || !userProfile) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="animate-spin" /></div>;
  }

  if (!canAccessCleo) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <CleoUpgradePrompt />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      <Helmet><title>Cléo - Intelligence Carrière - CléAvenir</title></Helmet>

      {!isSimulating && (
        <CleoSidebar 
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={() => { setActiveSessionId(null); setMessages([]); setActiveTab('chat'); }}
        />
      )}

      <main className="flex-1 flex flex-col h-full relative min-w-0">
        {!isSimulating && (
           <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 pt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                 <TabsList className="bg-transparent p-0 gap-6">
                    <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none px-2 pb-3">Discussion & Analyse</TabsTrigger>
                    <TabsTrigger value="activities" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none px-2 pb-3">Plan d'Action</TabsTrigger>
                 </TabsList>
              </Tabs>
           </div>
        )}

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 ${isSimulating ? 'm-0' : 'bg-slate-50 dark:bg-slate-950'} overflow-hidden transition-all duration-300`}>
            
            <Suspense fallback={<LoadingFallback />}>
              {showProfileBuilder ? (
                <CleoProfileBuilder onComplete={() => setShowProfileBuilder(false)} userProfile={userProfile} onUpdate={refreshProfile} />
              ) : isSimulating ? (
                <InterviewSimulation onEnd={() => setIsSimulating(false)} onSendMessage={handleSendMessage} isLoading={isLoading} />
              ) : activeTab === 'activities' ? (
                <CleoActivitySystem onStartActivity={handleStartActivity} />
              ) : (
                <div className="flex-1 flex flex-col h-full m-2 mt-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <ChatInterface 
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onInteraction={handleInteraction}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    userProfile={userProfile}
                    toggleContextPanel={() => setContextPanelOpen(!contextPanelOpen)}
                    isContextPanelOpen={contextPanelOpen}
                    cleoState={cleoState}
                  />
                </div>
              )}
            </Suspense>
          </div>

          {contextPanelOpen && !isSimulating && activeTab === 'chat' && (
            <div className="w-80 hidden 2xl:block border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
              <ContextPanel userProfile={userProfile} isOpen={contextPanelOpen} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CleoPage;