import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, DollarSign, TrendingUp, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const CareerDetail = () => {
  const { careerSlug } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // In a real app, fetch from DB based on slug
    // For now, we'll simulate or fetch if possible
    const fetchCareer = async () => {
      setLoading(true);
      try {
        // Mock data for fallback if DB fetch fails or isn't set up for slugs yet
        const mockCareer = {
          title: careerSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: "Description détaillée du métier...",
          salary: "35k - 45k €",
          outlook: "Très favorable",
          education: "Bac +3/5",
          skills: ["Compétence 1", "Compétence 2", "Compétence 3"]
        };
        setCareer(mockCareer);
      } catch (error) {
        console.error("Error fetching career:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [careerSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-slate-50">
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Métier non trouvé</h1>
          <Button onClick={() => navigate('/metiers')} className="mt-4">Retour aux métiers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{career.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{career.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {career.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Détails du poste</h2>
                <p className="text-slate-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Salaire Moyen</p>
                    <p className="text-lg font-bold text-slate-900">{career.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Débouchés</p>
                    <p className="text-lg font-bold text-slate-900">{career.outlook}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Formation</p>
                    <p className="text-lg font-bold text-slate-900">{career.education}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white border-none">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Intéressé par ce métier ?</h3>
                <p className="text-slate-300 mb-6 text-sm">Trouvez la formation idéale pour y accéder.</p>
                <Button 
                  onClick={() => navigate('/formations', { state: { searchQuery: career.title } })}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100"
                >
                  Voir les formations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerDetail;