import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ArrowLeft, 
  BookOpen, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Lock, 
  Clock, 
  CheckCircle, 
  Target, 
  Zap, 
  Users 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestPlanPage = () => {
  const [searchParams] = useSearchParams();
  const careerCode = searchParams.get('career');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [careerInfo, setCareerInfo] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      if (!careerCode) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('rome_metiers')
          .select('libelle, description, niveau_etudes')
          .eq('code', careerCode)
          .single();
        if (data) setCareerInfo(data);
      } catch (error) {
        console.error('Error fetching career:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [careerCode]);

  const handlePremiumClick = () => {
    toast({
        title: "Plan Premium",
        description: "🚧 Cette fonctionnalité de coaching premium sera bientôt disponible ! 🚀",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-600">Génération de votre plan d'action...</p>
      </div>
    );
  }

  const planSteps = [
    {
      id: 1,
      icon: BookOpen,
      title: "Formation Initiale",
      duration: "1 à 3 ans",
      description: "Acquérir les bases théoriques et pratiques nécessaires.",
      details: [
        `Niveau visé : ${careerInfo?.niveau_etudes || 'Bac+2 minimum'}`,
        "Rechercher des établissements reconnus",
        "Préparer les dossiers d'admission"
      ]
    },
    {
      id: 2,
      icon: Briefcase,
      title: "Expérience Pratique",
      duration: "6 mois à 1 an",
      description: "Mettre en pratique les connaissances sur le terrain.",
      details: [
        "Rechercher des stages ou une alternance",
        "Développer son réseau professionnel",
        "Participer à des projets concrets"
      ]
    },
    {
      id: 3,
      icon: Award,
      title: "Spécialisation",
      duration: "Continu",
      description: "Se démarquer par des compétences spécifiques.",
      details: [
        "Obtenir des certifications reconnues",
        "Maîtriser les outils clés du secteur",
        "Suivre les tendances du marché"
      ]
    },
    {
      id: 4,
      icon: TrendingUp,
      title: "Évolution de Carrière",
      duration: "3 à 5 ans",
      description: "Progresser vers des postes à responsabilités.",
      details: [
        "Viser des postes de management",
        "Mettre à jour régulièrement son CV",
        "Développer son leadership"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      <div className="text-center mb-12">
        <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Votre Feuille de Route</Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Plan d'action pour devenir <span className="text-indigo-600 block mt-2">{careerInfo?.libelle || 'Professionnel'}</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Voici les étapes clés recommandées pour atteindre cet objectif professionnel, basées sur les standards du marché.
        </p>
      </div>

      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-8 space-y-12 mb-16">
        {planSteps.map((step, index) => (
          <div key={step.id} className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 bg-white border-4 border-indigo-100 rounded-full p-2">
              <step.icon className="w-5 h-5 text-indigo-600" />
            </div>
            
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Étape {index + 1} : {step.title}</h3>
                  </div>
                  <Badge variant="outline" className="w-fit flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {step.duration}
                  </Badge>
                </div>
                
                <p className="text-slate-600 mb-4">{step.description}</p>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Actions à réaliser :</h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl">
        <CardContent className="p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold flex items-center gap-2 justify-center sm:justify-start">
              <Lock className="w-5 h-5 text-amber-400" /> Accompagnement Premium
            </h3>
            <p className="text-indigo-200">Bénéficiez d'un suivi personnalisé avec nos coachs et IA pour sécuriser votre parcours.</p>
          </div>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold whitespace-nowrap" onClick={handlePremiumClick}>
            Débloquer le plan Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPlanPage;