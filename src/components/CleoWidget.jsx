import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FEATURES } from '@/constants/subscriptionTiers';

const CleoWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasAccess, loading } = useSubscriptionAccess();
  
  // Don't show widget if loading or strictly for non-logged in users (optional strategy)
  // For this request, let's show it but lock it if not Premium+
  
  const canAccessCleo = hasAccess(FEATURES.AI_COACH);

  const handleOpen = () => {
    if (!user) {
      // Redirect to login or show auth prompt
      navigate('/login');
      return;
    }
    setIsOpen(true);
  };

  const handleNavigateToCleo = () => {
    navigate('/cleo');
    setIsOpen(false);
  };
  
  const handleUpgrade = () => {
    navigate('/tarifs');
    setIsOpen(false);
  };

  if (!user) return null; // Don't show for unauthenticated users

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Widget Window */}
      {isOpen && (
        <Card className="mb-4 w-80 md:w-96 shadow-2xl border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Cléo (Coach IA)</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 min-h-[200px] max-h-[400px] overflow-y-auto">
            {canAccessCleo ? (
              // Access Granted Content
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 border border-violet-200">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-700">
                    Bonjour {user?.user_metadata?.first_name || "!"} Je suis prête à t'aider. Veux-tu continuer notre dernière discussion ou commencer un nouveau sujet ?
                  </div>
                </div>
                <div className="pt-4 flex justify-center">
                  <Button onClick={handleNavigateToCleo} className="w-full bg-violet-600 hover:bg-violet-700">
                    Ouvrir l'interface complète
                  </Button>
                </div>
              </div>
            ) : (
              // Locked / Premium+ Required Content
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900">Fonctionnalité Premium+</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Cléo est votre coach personnel IA, disponible 24/7 pour vous guider. Passez à Premium+ pour débloquer l'accès.
                </p>
                <Button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md">
                   Découvrir Premium+
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Trigger Button */}
      <Button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 ${
          isOpen ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            {!canAccessCleo && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-[10px] font-bold text-yellow-900 px-1.5 py-0.5 rounded-full border border-yellow-500 shadow-sm">
                +
              </div>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};

export default CleoWidget;