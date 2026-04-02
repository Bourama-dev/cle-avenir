import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstitutionCard = ({ institution, onSelect, showActions = true }) => {
  if (!institution) return null;

  return (
    <Card className="p-4 hover:shadow-md transition-all border-l-4 border-l-purple-500">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-slate-900">{institution.name}</h3>
              {institution.type && (
                 <Badge variant="outline" className="text-xs font-normal">
                    {institution.type}
                 </Badge>
              )}
           </div>
           
           <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                 <MapPin className="h-3.5 w-3.5 text-slate-400" />
                 <span>{institution.city} {institution.postal_code && `(${institution.postal_code})`}</span>
              </div>
              {institution.region && (
                 <div className="text-xs text-slate-500 ml-5.5">{institution.region}</div>
              )}
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${institution.sector === 'Privé' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                {institution.sector || 'Secteur inconnu'}
            </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3">
         {institution.website && (
            <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
               <ExternalLink className="h-3 w-3" /> Site web
            </a>
         )}
         {institution.email && (
            <a href={`mailto:${institution.email}`} className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900">
               <Mail className="h-3 w-3" /> {institution.email}
            </a>
         )}
         {institution.phone && (
             <span className="text-xs flex items-center gap-1 text-slate-500">
               <Phone className="h-3 w-3" /> {institution.phone}
             </span>
         )}
      </div>

      {showActions && onSelect && (
         <Button 
           size="sm" 
           variant="secondary" 
           className="w-full mt-3 bg-purple-50 text-purple-700 hover:bg-purple-100"
           onClick={() => onSelect(institution)}
         >
           Voir les détails
         </Button>
      )}
    </Card>
  );
};

export default InstitutionCard;