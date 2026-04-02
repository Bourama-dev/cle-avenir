import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedMetierCard from './EnhancedMetierCard';
import BlurredMetierCard from './BlurredMetierCard';
import MetierCardSkeleton from './MetierCardSkeleton';
import { extractRomeCode } from '@/utils/metierHelper';

const RecommendedMetiersSection = ({ 
  metiers = [], 
  loading = false, 
  userPlan = 'discovery', 
  profileType = 'Explorateur'
}) => {
  const navigate = useNavigate();

  const handleDetailClick = (metier) => {
    const romeCode = extractRomeCode(metier, 'RecommendedMetiersSection');
    
    if (!romeCode) {
      console.error("[RecommendedMetiersSection] Tentative de navigation échouée : code ROME manquant.", metier);
      return;
    }
    
    // Check if the code looks like literally ":code" due to a previous bug
    if (romeCode === ':code') {
      console.error("[RecommendedMetiersSection] Invalid ROME code value ':code'.");
      return;
    }

    console.log(`[RecommendedMetiersSection] Navigation vers: /metier/${romeCode}`);
    navigate(`/metier/${romeCode}`);
  };

  const handleUpgrade = () => {
    navigate('/tarifs');
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-10">
            <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-96 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <MetierCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (!metiers || metiers.length === 0) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Aucune recommandation immédiate</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              Nous n'avons pas pu trouver de correspondances exactes dans la base de données. Vous pouvez explorer notre catalogue complet.
            </p>
            <Button onClick={() => navigate('/metiers')} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Explorer le catalogue complet
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Ensure items have proper matchScore and code fields mapped
  const normalizedMetiers = metiers.map(m => ({
    ...m,
    code: m.code || m.code_rome || m.metierCode, // Normalize ROME code property
    matchScore: m.match_score || m.matchScore || m.score || 50
  }));

  // Define limits based on plan
  const visibleCount = userPlan === 'premium' || userPlan === 'premium_plus' ? normalizedMetiers.length : 3;
  const blurredCount = userPlan === 'premium' || userPlan === 'premium_plus' ? 0 : Math.min(3, normalizedMetiers.length - visibleCount);
  
  const visibleMetiers = normalizedMetiers.slice(0, visibleCount);
  const blurredMetiers = normalizedMetiers.slice(visibleCount, visibleCount + blurredCount);

  return (
    <section className="py-16 relative overflow-hidden bg-slate-50/50">
      {/* Decorative background gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Métiers Recommandés <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                pour votre profil
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              Basé sur votre profil <span className="font-semibold text-slate-800">{profileType}</span>, notre algorithme a sélectionné ces voies professionnelles qui matchent avec vos compétences et aspirations.
            </p>
          </div>
          
          <div className="shrink-0 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/metiers')} className="bg-white">
              Voir tout le catalogue
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Render Visible Full Cards */}
          {visibleMetiers.map((metier, index) => (
            <EnhancedMetierCard 
              key={`visible-${metier.code || index}`} 
              metier={metier} 
              onClick={() => handleDetailClick(metier)}
            />
          ))}

          {/* Render Blurred Cards for Freemium */}
          {blurredMetiers.map((metier, index) => (
            <BlurredMetierCard 
              key={`blurred-${metier.code || index}`} 
              metier={metier} 
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>

        {/* Upgrade CTA Banner at the bottom if Free Plan */}
        {(userPlan === 'discovery' || userPlan === 'free') && normalizedMetiers.length > 3 && (
          <div className="mt-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Débloquez {normalizedMetiers.length - 3} autres recommandations</h3>
                <p className="text-violet-100 text-sm">Passez à la version Premium pour accéder à l'intégralité de vos correspondances sur-mesure.</p>
              </div>
            </div>
            <Button size="lg" className="bg-white text-violet-700 hover:bg-slate-50 shrink-0 w-full md:w-auto" onClick={handleUpgrade}>
              Passer Premium <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedMetiersSection;