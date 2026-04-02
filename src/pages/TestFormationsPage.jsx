import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, GraduationCap, MapPin, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestFormationsPage = () => {
  const [searchParams] = useSearchParams();
  const careerCode = searchParams.get('career');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careerInfo, setCareerInfo] = useState(null);

  useEffect(() => {
    const fetchFormations = async () => {
      if (!careerCode) {
        setLoading(false);
        return;
      }

      try {
        // Fetch career info
        const { data: careerData } = await supabase
          .from('rome_metiers')
          .select('libelle')
          .eq('code', careerCode)
          .single();
          
        if (careerData) setCareerInfo(careerData);

        // Fetch formations (Mock filter as direct relation might not exist in standard db structure, 
        // using ILIKE on accessible_professions or just fetching a generic list if empty for demo)
        let { data: formationsData, error } = await supabase
          .from('formations_enriched')
          .select('*')
          .limit(10); // Adjust query based on actual schema relation

        if (error) throw error;
        setFormations(formationsData || []);
      } catch (error) {
        console.error('Error fetching formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, [careerCode]);

  const handleActionPlan = () => {
    if (!careerCode) {
       toast({
         title: "Code métier manquant",
         description: "Impossible de générer le plan d'action.",
         variant: "destructive"
       });
       return;
    }
    navigate(`/test-plan?career=${careerCode}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-600">Recherche des formations correspondantes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux résultats
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Formations Recommandées</h1>
          <p className="text-slate-600 text-lg">
            Pour devenir <span className="font-semibold text-indigo-600">{careerInfo?.libelle || 'Professionnel'}</span>
          </p>
        </div>
        <Button onClick={handleActionPlan} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          Voir mon plan d'action
        </Button>
      </div>

      {formations.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-dashed">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune formation trouvée</h3>
          <p className="text-slate-500">Nous n'avons pas pu trouver de formations spécifiques pour ce métier dans notre base de données actuelle.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {formations.map((formation) => (
            <Card key={formation.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                        {formation.required_education_level || 'Tous niveaux'}
                      </Badge>
                      <Badge variant="outline">{formation.modality || 'Présentiel'}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{formation.title}</h3>
                    <p className="text-slate-600 font-medium mb-4">{formation.provider_name}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{formation.location_city || 'Multiple'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{formation.duration_hours ? `${formation.duration_hours}h` : formation.total_duration || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formation.rhythm || 'Temps plein'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-6 min-w-[200px]">
                    <div className="text-right w-full mb-4">
                      <div className="text-2xl font-bold text-slate-900">
                        {formation.cost ? `${formation.cost}€` : 'Gratuit/Financé'}
                      </div>
                      <div className="text-xs text-slate-500">Frais de scolarité</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => {
                        toast({
                            title: "Demande d'information",
                            description: "Cette fonctionnalité sera bientôt disponible.",
                        });
                    }}>
                      En savoir plus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestFormationsPage;