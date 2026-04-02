import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Clock, Award, Info, MapPin, Building, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const FormationPathSection = ({ formations, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-600" />
          Parcours de Formation
        </h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden border-slate-200">
              <CardContent className="p-0 flex flex-col md:flex-row">
                 <div className="bg-slate-50 p-6 md:w-1/4 flex flex-col justify-center items-center">
                    <Skeleton className="w-12 h-12 rounded-full mb-2" />
                    <Skeleton className="h-4 w-20 mb-1" />
                 </div>
                 <div className="p-6 flex-1 flex flex-col justify-center">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-6" />
                    <Skeleton className="h-9 w-32" />
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!formations || formations.length === 0) {
    return (
      <div className="mb-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-600" />
          Parcours de Formation Suggérés
        </h2>
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="p-8 text-center flex flex-col items-center">
             <Info className="w-10 h-10 text-slate-400 mb-3" />
             <p className="text-slate-600 font-medium mb-2">Sélectionnez un métier cible ou explorez les formations.</p>
             <p className="text-slate-500 text-sm mb-6 max-w-md">Découvrez les parcours académiques et professionnels qui mènent aux métiers recommandés pour votre profil.</p>
             <Button variant="default" onClick={() => navigate('/formations')} className="bg-pink-600 hover:bg-pink-700 text-white">
               Rechercher des formations
             </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-pink-600" />
        Parcours de Formation Suggérés
      </h2>
      <div className="space-y-4">
        {formations.slice(0, 4).map((form, idx) => (
          <Card key={form.id || idx} className="overflow-hidden border-slate-200 hover-lift shadow-sm">
            <CardContent className="p-0 flex flex-col md:flex-row">
               <div className="bg-pink-50/70 p-6 md:w-1/4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-pink-100">
                  <Award className="w-8 h-8 text-pink-600 mb-3" />
                  <span className="text-sm font-bold text-pink-900 uppercase tracking-wider text-center md:text-left">
                    {form.level || form.required_education_level || 'Diplôme'}
                  </span>
                  <span className="text-xs text-pink-700 mt-2 flex items-center font-medium">
                    <Clock className="w-3 h-3 mr-1"/> {form.duration || form.total_duration || form.duration_hours ? `${form.duration_hours}h` : 'Durée variable'}
                  </span>
               </div>
               <div className="p-6 flex-1 flex flex-col justify-center bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{form.title || form.name || 'Formation'}</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600 mb-5">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{form.provider || form.provider_name || 'Institut de formation'}</span>
                    </div>
                    {form.location_city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{form.location_city}</span>
                      </div>
                    )}
                  </div>
                  
                  {form.description && (
                     <p className="text-sm text-slate-500 mb-5 line-clamp-2">{form.description}</p>
                  )}
                  
                  <div className="mt-auto self-start">
                     <Button 
                       variant="outline" 
                       onClick={() => navigate(form.id ? `/formation/${form.id}` : '/formations')} 
                       className="text-sm border-pink-200 bg-pink-50/50 hover:bg-pink-100 text-pink-800 shadow-sm"
                     >
                        Voir la formation <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormationPathSection;