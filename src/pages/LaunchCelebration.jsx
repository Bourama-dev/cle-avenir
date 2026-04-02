import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trophy, Rocket } from 'lucide-react';

const Achievement = ({ title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white"
  >
    <div className="p-3 bg-yellow-400 rounded-full text-yellow-900 shadow-lg shadow-yellow-400/20">
      <Trophy size={24} />
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-slate-200">{desc}</p>
    </div>
  </motion.div>
);

const LaunchCelebration = ({ onNavigate }) => {
  const navigate = useNavigate();
  // No internal state needed for count unless used for visual loading bar
  
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600 rounded-full blur-[150px] opacity-30"></div>
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-30"></div>

       <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
             <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl shadow-emerald-500/40 mb-6">
                <Rocket size={64} className="text-white" />
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                LANCEMENT RÉUSSI !
             </h1>
             <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                CléAvenir est officiellement en ligne. Félicitations à toute l'équipe pour ce déploiement exceptionnel.
             </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl w-full mb-12">
             <Achievement title="Sécurité Maximale" desc="Score de conformité ISO atteint à 100%" delay={0.5} />
             <Achievement title="Performance Optimale" desc="Temps de réponse API < 150ms global" delay={0.8} />
             <Achievement title="RGPD Compliant" desc="Protection des données certifiée par le DPO" delay={1.1} />
             <Achievement title="Infrastructure Élastique" desc="Auto-scaling configuré sur 3 régions" delay={1.4} />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="h-16 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full"
             >
                Aller au Dashboard
             </Button>
             <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="h-16 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-full"
             >
                Retour Console Admin
             </Button>
          </div>
       </div>
    </div>
  );
};

export default LaunchCelebration;