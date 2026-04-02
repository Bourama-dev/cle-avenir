import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResultsSummary = ({ totalResults, filteredResults, filters, onClearRadius }) => {
  const hasRadiusFilter = filters.location && filters.radius !== null;
  const hasLocation = !!filters.location;
  
  // Don't show anything if loading state usually handles this, but for this component, 
  // we assume data is ready or empty.
  // If no results at all (totalResults === 0), we might let the parent handle the "No results found" generic state,
  // but if we have total results but 0 filtered results, we definitely want to show that here.

  if (totalResults === 0 && !hasRadiusFilter) return null;

  return (
    <div className="bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] border-l-4 border-sky-500 rounded-lg p-4 mb-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
                {/* Total Results Badge */}
                <div className="flex items-center gap-2">
                    <Badge className="bg-[#ec4899] hover:bg-[#ec4899]/90 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">
                        {totalResults}
                    </Badge>
                    <span className="font-semibold text-slate-800">
                        offres trouvées
                    </span>
                </div>

                {/* Arrow separator if filtering is active */}
                {hasRadiusFilter && (
                    <span className="hidden sm:inline-block text-slate-400 font-bold">→</span>
                )}

                {/* Filtered Results Badge */}
                {hasRadiusFilter && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <Badge className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            {filteredResults}
                        </Badge>
                        <span className="font-medium text-slate-700">
                             à moins de <strong className="text-slate-900">{filters.radius} km</strong>
                             {filters.location?.name && (
                                 <> de <span className="font-bold text-[#0f172a] inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{filters.location.name}</span></>
                             )}
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* Action button if radius filtering is too strict */}
        {hasRadiusFilter && filteredResults === 0 && totalResults > 0 && (
            <div className="flex-shrink-0">
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onClearRadius}
                    className="bg-white hover:bg-white text-slate-700 border-slate-200 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors shadow-sm"
                 >
                    Élargir la recherche
                 </Button>
            </div>
        )}
      </div>

      {/* Helper text when 0 filtered results */}
      {hasRadiusFilter && filteredResults === 0 && totalResults > 0 && (
         <p className="text-sm text-slate-500 mt-3 pl-1 border-t border-slate-200/60 pt-2">
            Aucune offre ne correspond à votre rayon de recherche, mais <strong>{totalResults}</strong> offres correspondent à vos autres critères.
         </p>
      )}
    </div>
  );
};

export default ResultsSummary;