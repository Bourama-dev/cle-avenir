import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, GraduationCap, Building, ArrowRight, Award } from 'lucide-react';
import { cn, isValidUUID } from '@/lib/utils';
import { getSectorById, getSectorIcon, getSectorColor } from '@/utils/sectorUtils';

const FormationCard = ({ formation, source, onViewDetails = null }) => {
  // Determine display values based on source structure
  const title = source === 'parcoursup' ? formation.libelle_formation || formation.intitule : formation.intitule;
  const provider = source === 'parcoursup' ? (formation.etablissement_nom || formation.etablissements?.[0]?.nom) : formation.organisme?.nom;
  const city = source === 'parcoursup' ? (formation.commune || formation.etablissements?.[0]?.ville) : formation.adresse?.libelleCommune;
  const level = source === 'parcoursup' ? formation.niveau : formation.niveauSortie;
  const duration = source === 'parcoursup' ? formation.duree : formation.dureeEnHeures;
  
  const borderColor = source === 'parcoursup' ? 'hover:border-violet-300' : 'hover:border-blue-300';
  const badgeColor = source === 'parcoursup' ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-blue-50 text-blue-700 border-blue-100';

  const sector = formation.sector ? getSectorById(formation.sector) : null;

  const handleViewDetails = () => {
    if (source !== 'parcoursup' && formation.id && !isValidUUID(formation.id)) {
      console.warn(`Invalid UUID for formation: ${formation.id}`);
    }
    if (typeof onViewDetails === 'function') onViewDetails();
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 h-full flex flex-col group border border-slate-200 rounded-xl overflow-hidden", borderColor)}>
      <CardHeader className="pb-3 space-y-3 bg-white relative">
        <div className="flex justify-between items-start gap-3">
          <Badge variant="outline" className={cn("font-medium text-[10px] uppercase tracking-wider", badgeColor)}>
            {source === 'parcoursup' ? 'Parcoursup' : 'France Travail'}
          </Badge>
          <div className="flex gap-2">
            {sector && (
              <Badge variant="secondary" className={cn("text-xs font-medium border flex items-center gap-1", getSectorColor(sector.id))}>
                {getSectorIcon(sector.id, "w-3 h-3")}
                {sector.name}
              </Badge>
            )}
            {formation.matchScore && (
               <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold text-xs border-green-200">
                 {formation.matchScore}% Match
               </Badge>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]" title={title}>
            {title}
          </h3>
          <div className="flex items-center text-sm text-slate-500 mt-2 font-medium">
            <Building className="w-4 h-4 mr-1.5 shrink-0 text-slate-400" />
            <span className="truncate" title={provider}>
              {provider || 'Organisme non spécifié'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-3 pb-4 pt-2">
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
           {city && (
              <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{city}</span>
              </div>
           )}
           {duration && (
              <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span>{duration}{typeof duration === 'number' ? 'h' : ''}</span>
              </div>
           )}
           {level && (
              <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span className="truncate max-w-[150px]">{level}</span>
              </div>
           )}
           {formation.success_rate && (
              <div className="flex items-center bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100 text-emerald-700">
                <Award className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                <span>{formation.success_rate}% réussite</span>
              </div>
           )}
        </div>
      </CardContent>

      {onViewDetails !== null && (
        <CardFooter className="pt-3 pb-4 px-4 border-t bg-slate-50/30 mt-auto">
          <Button
            className={cn("w-full gap-2 shadow-sm group-hover:shadow-md transition-all",
              source === 'parcoursup'
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={handleViewDetails}
          >
            Voir les détails
            <ArrowRight className="w-4 h-4 opacity-90 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FormationCard;