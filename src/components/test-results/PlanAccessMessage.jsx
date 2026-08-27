import React from 'react';
import { Sparkles } from 'lucide-react';

// CléAvenir is fully free — every account sees all of its results.
const PlanAccessMessage = () => (
  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3 text-purple-800 animate-fade-in">
    <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
    <div>
      <p className="font-semibold">Accès complet</p>
      <p className="text-sm">Vous avez accès à tous vos résultats d'orientation, gratuitement.</p>
    </div>
  </div>
);

export default PlanAccessMessage;
