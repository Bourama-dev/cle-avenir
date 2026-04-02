import React from 'react';
import { motion } from 'framer-motion';
import ProfileSummaryWidget from '@/components/dashboard/ProfileSummaryWidget';
import StatsGrid from '@/components/dashboard/StatsGrid';
import MetierMatcher from '@/components/dashboard/MetierMatcher';
import Goals from '@/components/dashboard/Goals';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const OverviewSection = ({ userProfile, onNavigate }) => {
  // 1. Data Initialization & Fallback
  // Calculate stats dynamically from the profile data or default to 0
  // Note: userProfile might not have joined tables like saved_jobs, so we default to 0 safely.
  const statsData = {
    savedJobs: userProfile?.saved_jobs?.length || 0,
    savedFormations: userProfile?.saved_formations?.length || 0,
    savedMetiers: userProfile?.saved_metiers?.length || 0,
    goalsCompleted: userProfile?.goals?.filter(g => g.completed === true)?.length || 0
  };

  // Calculate progress for the progress bar (mock logic based on profile completion)
  const calculateProgress = () => {
     let steps = 0;
     if (userProfile?.first_name) steps++;
     if (userProfile?.subscription_tier) steps++;
     if (statsData.savedMetiers > 0) steps++;
     if (statsData.goalsCompleted > 0) steps++;
     // Max 5 steps
     return Math.min(100, (steps / 5) * 100);
  };

  const progressPercent = calculateProgress();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileSummaryWidget userProfile={userProfile} onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-1">
           {/* Quick Stats or Next Steps */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col justify-center">
              <h3 className="font-bold text-slate-800 mb-2">Votre progression</h3>
              <p className="text-sm text-slate-500 mb-4">
                Vous avez complété {Math.round(progressPercent / 20)} étapes sur 5 pour votre orientation.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
              </div>
              <Button onClick={() => onNavigate('plan')} variant="outline" className="w-full justify-between group">
                  Continuer mon plan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
              </Button>
           </div>
        </div>
      </div>

      {/* 2. Pass computed stats to avoid undefined errors */}
      <StatsGrid stats={statsData} />

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Careers & Matches */}
        <div className="lg:col-span-2 space-y-6">
           <MetierMatcher userProfile={userProfile} />
        </div>

        {/* Right: Goals & Actions */}
        <div className="lg:col-span-1 space-y-6">
           {/* Pass userProfile to Goals so it can fetch data */}
           <Goals userProfile={userProfile} />
           
           {/* Promo Box */}
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
               <div className="relative z-10">
                   <h4 className="font-bold mb-2">Passez Premium</h4>
                   <p className="text-slate-300 text-sm mb-4">Obtenez des analyses IA illimitées et contactez des mentors.</p>
                   <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 border-none w-full" onClick={() => onNavigate('/plans')}>
                       Voir les offres
                   </Button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;