import React from 'react';
import { Lock } from 'lucide-react';
import UnlockCTA from './UnlockCTA';

const BlurredMatches = ({ matches = [], onUnlock }) => {
  // Take next 3 matches or fill with placeholders
  const displayMatches = matches.length > 0 
    ? matches.slice(0, 3) 
    : [1, 2, 3].map(i => ({ title: "Métier Mystère", description: "Contenu flouté", score: 85 }));

  return (
    <div className="blurred-section">
       {/* The Overlay Call to Action */}
       <div className="unlock-overlay">
          <UnlockCTA onUnlock={onUnlock} />
       </div>

       {/* The Blurred Content */}
       <div className="blurred-matches space-y-4">
          {displayMatches.map((match, idx) => (
             <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                   <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                   <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                   <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
                <div className="w-20 h-8 bg-slate-100 rounded"></div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default BlurredMatches;