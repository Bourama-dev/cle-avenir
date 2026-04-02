import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, BrainCircuit, Target } from 'lucide-react';
import AICoachWidget from '@/components/dashboard/AICoachWidget';

const AICoachPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="-ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retour
              </Button>
              <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <Sparkles className="h-5 w-5 text-violet-600" />
                Coach IA Personnel
              </h1>
           </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Context & Tips */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-violet-900 text-white rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-violet-300" />
              Comment ça marche ?
            </h2>
            <p className="text-violet-100 text-sm leading-relaxed mb-4">
              Votre coach IA analyse en temps réel votre profil, vos objectifs et vos derniers résultats pour vous donner des conseils ultra-personnalisés.
            </p>
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-sm bg-white/10 p-2 rounded-lg">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Réponses instantanées</span>
               </div>
               <div className="flex items-center gap-3 text-sm bg-white/10 p-2 rounded-lg">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span>Aligné avec vos objectifs</span>
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-medium text-slate-900 mb-4">Questions suggérées</h3>
            <div className="space-y-2">
              {[
                "Comment améliorer mon CV pour le secteur tech ?",
                "Quelles compétences me manquent pour mon objectif ?",
                "Prépare-moi à un entretien d'embauche.",
                "Analyse mes progrès ce mois-ci."
              ].map((q, i) => (
                <button 
                  key={i} 
                  className="w-full text-left text-sm p-3 rounded-lg bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-colors"
                  onClick={() => {
                    // Logic to populate chat would go here via context or prop drilling if needed
                    // For now, simpler to just let user type
                  }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 h-[600px] lg:h-[700px]">
           <AICoachWidget />
        </div>

      </main>
    </div>
  );
};

export default AICoachPage;