import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CleoUpgradePrompt = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto border-violet-200 shadow-xl relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <CardHeader className="text-center relative z-10 pb-2">
        <div className="mx-auto bg-violet-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-violet-200">
          <Sparkles className="h-8 w-8 text-violet-600 animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
          {title || "Cléo est réservée aux membres Premium+"}
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          {description || "Profitez d'un coaching personnalisé par IA disponible 24/7 pour accélérer votre réussite professionnelle."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">Réponses instantanées et personnalisées sur votre orientation.</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">Analyse approfondie de votre profil et suggestions de stratégies.</p>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">Accompagnement continu pour rester motivé et sur la bonne voie.</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-2">
        <Button 
          onClick={() => navigate('/tarifs')} 
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200"
          size="lg"
        >
          Débloquer Cléo avec Premium+ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CleoUpgradePrompt;