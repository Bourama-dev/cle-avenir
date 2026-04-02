import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormationOffres = ({ offers }) => {
  const navigate = useNavigate();

  if (!offers || offers.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none">
        <CardContent className="p-12 text-center text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">Aucune offre d'emploi directe trouvée via notre flux pour le moment.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/offres-emploi')}>
            Explorer le marché de l'emploi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-600 font-medium">
          <span className="font-bold text-indigo-600 text-lg">{offers.length}</span> offres récemment publiées liées à cette formation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-md transition-shadow border-slate-200">
            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-lg text-slate-900">{offer.title}</h4>
                  {offer.contract_type && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {offer.contract_type}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{offer.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{offer.location}</span>
                  </div>
                  {offer.salary_range && offer.salary_range !== "Non précisé" && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-md font-medium border border-green-100">
                      {offer.salary_range}
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => offer.url ? window.open(offer.url, '_blank') : navigate(`/job/${offer.id}`)}
                className="w-full md:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700"
              >
                Voir l'offre <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
         <Button variant="outline" size="lg" onClick={() => navigate('/offres-emploi')} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            Voir plus d'offres similaires <ArrowRight className="w-4 h-4 ml-2" />
         </Button>
      </div>
    </div>
  );
};

export default FormationOffres;