import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Child Components
import DashboardStats from './dashboard/DashboardStats';
import ConnectionActivityChart from './dashboard/ConnectionActivityChart';
import InscriptionGrowthChart from './dashboard/InscriptionGrowthChart';
import LevelDistributionChart from './dashboard/LevelDistributionChart';
import EstablishmentInfo from './dashboard/EstablishmentInfo';
import QuickActions from './dashboard/QuickActions';

// Styles
import '@/styles/establishment-dashboard.css';

const AdminEstablishmentDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    studentCount: 0,
    formationsCount: 0,
    connectionsCount: 0,
    activityRate: 0
  });

  // Data fetching function
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Establishment Details
      const { data: estData, error: estError } = await supabase
        .from('educational_institutions') // Using consistent table name
        .select('*')
        .eq('id', id)
        .single();
      
      if (estError) throw estError;
      setEstablishment(estData);

      // 2. Fetch Stats (Mock logic for now as detailed aggregation might need complex queries)
      // In real scenario: count from 'profiles' where establishment_id = id
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('establishment_id', id);

      // Mock other stats for display if tables don't exist yet or are empty
      setStats({
        studentCount: studentCount || 0,
        formationsCount: 12, // Placeholder
        connectionsCount: 1450, // Placeholder
        activityRate: 78 // Placeholder
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError("Impossible de charger les données de l'établissement.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec du chargement des données."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error || !establishment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-slate-600 mb-6">{error || "Établissement introuvable"}</p>
          <Button onClick={() => navigate('/admin/establishments')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="est-dashboard-container">
      {/* Header */}
      <header className="est-header">
        <Button 
            variant="ghost" 
            className="mb-4 pl-0 hover:bg-transparent hover:text-indigo-600 transition-colors"
            onClick={() => navigate('/admin/establishments')}
        >
            <ArrowLeft className="mr-2 h-5 w-5" /> Retour à la liste
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{establishment.name}</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                    ID: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{establishment.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${establishment.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {establishment.status === 'paused' ? 'En pause' : 'Actif'}
                    </span>
                </p>
            </div>
            <div className="text-sm text-slate-400">
                Dernière mise à jour: {new Date(establishment.updated_at).toLocaleDateString()}
            </div>
        </div>
      </header>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="est-chart-card">
                    <h3 className="est-card-title">Activité de connexion</h3>
                    <ConnectionActivityChart establishmentId={id} />
                </div>
                <div className="est-chart-card">
                    <h3 className="est-card-title">Répartition par niveau</h3>
                    <LevelDistributionChart establishmentId={id} />
                </div>
            </div>
            
            <div className="est-chart-card">
                <h3 className="est-card-title">Croissance des inscriptions</h3>
                <InscriptionGrowthChart establishmentId={id} />
            </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-8">
            <EstablishmentInfo establishment={establishment} />
            <QuickActions 
                establishmentId={id} 
                establishmentData={establishment} 
                onRefresh={fetchData}
            />
        </div>
      </div>
    </div>
  );
};

export default AdminEstablishmentDashboard;