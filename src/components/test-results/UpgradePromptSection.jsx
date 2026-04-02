import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpgradePromptSection = () => {
  const navigate = useNavigate();

  const benefits = [
    "Accès à tous les résultats de métiers compatibles",
    "Plans d'action personnalisés illimités",
    "Suivi de progression détaillé",
    "Conseils personnalisés par notre IA"
  ];

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden relative animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-sm">
            <LockKeyhole className="w-4 h-4" />
            <span>Contenu verrouillé</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            💎 Débloquez <span className="text-premium-gradient">plus de résultats</span>
          </h3>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            Vous voyez actuellement vos 3 meilleures correspondances. Passez à Premium pour explorer l'ensemble des métiers recommandés pour votre profil et créer des plans personnalisés sans limites.
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-4 shrink-0 bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-inner">
          <div className="text-center mb-2">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Passez à la vitesse supérieure</p>
            <p className="text-3xl font-extrabold text-slate-900">Premium</p>
          </div>
          
          <Button
            size="lg"
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white shadow-premium transition-all duration-300 transform hover:-translate-y-1 h-14 text-lg font-bold"
            onClick={() => navigate('/plans')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Passer à Premium
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 h-14"
            onClick={() => navigate('/plans')}
          >
            Voir tous les plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePromptSection;