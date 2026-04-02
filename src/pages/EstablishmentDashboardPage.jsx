import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { establishmentService } from '@/services/establishmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AnalyticsDashboard from '@/components/establishment/analytics/AnalyticsDashboard';

const EstablishmentDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Aucun identifiant d'établissement fourni.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const estData = await establishmentService.getEstablishmentById(id);
        if (!estData) {
          setError("L'établissement demandé est introuvable.");
          return;
        }
        setEstablishment(estData);
      } catch (err) {
        setError("Erreur lors du chargement des données. Veuillez réessayer plus tard.");
        toast({ variant: "destructive", title: "Erreur", description: err.message || "Erreur de chargement" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [id, user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error || !establishment) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full shadow-lg border-red-100 bg-white">
          <CardHeader className="text-center border-b pb-6">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
               <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-700">Impossible de charger le tableau de bord</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-6 space-y-6">
            <p className="text-slate-600">{error || "Cet établissement n'existe pas ou vous n'y avez pas accès."}</p>
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800" 
              onClick={() => navigate('/admin/establishments')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/establishments')} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-900">
                <Building className="h-6 w-6 text-purple-600" />
                {establishment.name}
              </h1>
              <p className="text-sm text-slate-500">UAI: {establishment.uai || 'Non défini'}</p>
            </div>
          </div>
        </div>

        {/* Integration of the new Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default EstablishmentDashboardPage;