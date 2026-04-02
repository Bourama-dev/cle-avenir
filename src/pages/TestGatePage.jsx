import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Lock, ArrowRight } from 'lucide-react';
import TestGateModal from '@/components/auth/TestGateModal';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TestGatePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Test Terminé !</h1>
          <p className="text-slate-600">
            Votre profil RIASEC et vos recommandations de métiers sont prêts à être découverts.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-full mt-0.5 shrink-0">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Analyse Algorithmique</h3>
                  <p className="text-sm text-slate-500">Profil RIASEC détaillé basé sur vos réponses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-full mt-0.5 shrink-0">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Métiers Compatibles</h3>
                  <p className="text-sm text-slate-500">Top 10 des métiers qui vous correspondent</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg" 
              onClick={() => setIsModalOpen(true)}
            >
              Débloquer mes résultats
            </Button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Création de compte 100% gratuite et sécurisée.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-800" onClick={() => navigate('/')}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Retour à l'accueil
          </Button>
        </div>
      </div>

      <TestGateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccessRedirect="/test-results"
      />
    </div>
  );
};

export default TestGatePage;