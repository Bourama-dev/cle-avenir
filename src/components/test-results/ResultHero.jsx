import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ResultHero = ({ profileName, score, description }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setDisplayScore(Math.min(Math.round((score / steps) * currentStep), score));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1623141629340-4686d65d60bc?q=80&w=2500&auto=format&fit=crop" 
          alt="Abstract colorful gradient background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-50"></div>
      </div>

      <div className="container relative z-10 px-4 py-20 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto backdrop-blur-md bg-white/10 p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl"
        >
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Résultats de l'analyse
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Profil <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{profileName}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl flex items-center gap-6 shadow-xl"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-3xl font-bold text-white">{displayScore}%</span>
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" /> Score de Fiabilité
                </h3>
                <p className="text-emerald-100 text-sm">Basé sur la cohérence de vos réponses</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultHero;