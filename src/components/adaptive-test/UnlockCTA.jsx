import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const UnlockCTA = ({ onUnlock }) => {
  const benefits = [
    "Analyse complète des 5 métiers",
    "Parcours de formation détaillé",
    "Conseils personnalisés",
    "Suivi de votre progression"
  ];

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="unlock-card relative overflow-hidden"
    >
      {/* Background Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          🎯 Débloquez votre profil complet
        </h3>
        <p className="text-slate-600">
          Accédez à tous vos résultats et prenez les meilleures décisions pour votre avenir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-left max-w-sm mx-auto">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            {benefit}
          </div>
        ))}
      </div>

      <Button 
        onClick={onUnlock}
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-200 hover:shadow-xl transition-all rounded-xl group"
      >
        <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
        Passer au plan premium
      </Button>
      
      <p className="mt-4 text-xs text-slate-400">
        Satisfait ou remboursé sous 14 jours • Paiement sécurisé
      </p>
    </motion.div>
  );
};

export default UnlockCTA;