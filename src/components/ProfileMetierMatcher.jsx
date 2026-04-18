import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatSalary } from '@/utils/salaryUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const MetierMatchCard = ({ metier, isLocked, onClick }) => {
  if (isLocked) {
    return (
      <Card className="relative overflow-hidden group border-slate-200">
        <div className="p-6 filter blur-md opacity-60 pointer-events-none select-none transition-all duration-300">
          <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 p-6 text-center z-10">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-3 text-violet-600 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Match Premium</h4>
          <p className="text-sm text-slate-600 mb-4 font-medium">
            Débloquez pour voir ce métier compatible
          </p>
          <Button 
            onClick={(e) => { e.stopPropagation(); onClick('upgrade'); }}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-md rounded-xl"
            size="sm"
          >
            Débloquer Premium
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200 flex flex-col h-full bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{metier.libelle}</h3>
          {metier.code && <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">ROME {metier.code}</span>}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-emerald-600">{metier.match_score}%</span>
          <span className="text-xs text-slate-500 font-medium">Compatibilité</span>
        </div>
      </div>
      
      <Progress value={metier.match_score} className="h-2 mb-4 bg-slate-100" indicatorClassName="bg-emerald-500" />
      
      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
        {metier.description || "Découvrez ce métier correspondant à votre profil et vos compétences."}
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {metier.salaire && (
          <div className="bg-slate-50 p-2 rounded text-xs">
            <span className="block text-slate-500 mb-1">Salaire</span>
            <strong className="text-slate-700">{formatSalary(metier.salaire) || '—'}</strong>
          </div>
        )}
        {metier.niveau_etudes && (
          <div className="bg-slate-50 p-2 rounded text-xs">
            <span className="block text-slate-500 mb-1">Niveau</span>
            <strong className="text-slate-700">{metier.niveau_etudes}</strong>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full mt-auto group-hover:bg-slate-50 border-slate-200" onClick={() => onClick(metier.code)}>
        Voir la fiche métier <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
};

const ProfileMetierMatcher = ({ metiers = [], userPlan = 'discovery', loading = false, error = null }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 h-64 flex flex-col justify-between animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded w-full"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        <p className="font-semibold mb-2">Une erreur est survenue lors du calcul de vos correspondances.</p>
        <p className="text-sm">{error.message || "Veuillez réessayer plus tard."}</p>
      </div>
    );
  }

  if (!metiers || metiers.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 text-slate-700 p-8 rounded-xl text-center">
        <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Aucun métier correspondant trouvé</h3>
        <p>Essayez de revoir vos préférences ou d'élargir vos critères de recherche.</p>
      </div>
    );
  }

  const handleCardClick = (action) => {
    if (action === 'upgrade') {
      navigate('/tarifs');
    } else {
      navigate(`/metier/${action}`);
    }
  };

  const limit = userPlan === 'premium' ? metiers.length : 3;
  const displayMetiers = metiers.slice(0, limit + 3); // Show 3 blurred ones if free

  return (
    <div className="space-y-8">
      {userPlan === 'discovery' && metiers.length > 3 && (
        <div className="bg-violet-50 border border-violet-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-violet-800 font-medium">Débloquez Premium pour voir toutes vos correspondances ({(metiers.length - 3)} métiers cachés)</span>
          <Button onClick={() => navigate('/tarifs')} className="bg-violet-600 hover:bg-violet-700 text-white shrink-0">
            Débloquer Premium
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayMetiers.map((metier, index) => {
          const isLocked = userPlan === 'discovery' && index >= 3;
          return (
            <MetierMatchCard 
              key={`${metier.code}-${index}`} 
              metier={metier} 
              isLocked={isLocked}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMetierMatcher;