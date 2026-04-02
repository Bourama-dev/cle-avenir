import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Users, FileKey, Settings, LogOut } from 'lucide-react';

const InstitutionDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [stats, setStats] = useState({ users: 0, codes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('institution_staff_session');
    if (!session) {
      navigate('/institution/staff/login');
      return;
    }
    
    const staff = JSON.parse(session);
    if (staff.institution_id !== id) {
      navigate('/institution/staff/login');
      return;
    }

    fetchDashboardData();
  }, [id, navigate]);

  const fetchDashboardData = async () => {
    try {
      const { data: inst } = await supabase.from('institutions').select('*').eq('id', id).single();
      const { count: userCount } = await supabase.from('user_institution_links').select('*', { count: 'exact' }).eq('institution_id', id);
      const { count: codeCount } = await supabase.from('institution_codes').select('*', { count: 'exact' }).eq('institution_id', id).eq('status', 'active');
      
      setInstitution(inst);
      setStats({ users: userCount, codes: codeCount });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('institution_staff_session');
    navigate('/institution/staff/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{institution?.name}</h1>
          <p className="text-sm text-slate-500">Tableau de bord de gestion</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Étudiants Inscrits</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Codes Actifs</CardTitle>
              <FileKey className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.codes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Configuration</CardTitle>
              <Settings className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500">{institution?.city}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border p-1 rounded-lg">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="codes">Codes d'accès</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  Le graphique d'activité sera disponible prochainement.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des étudiants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  La gestion détaillée des étudiants est en cours de développement.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InstitutionDashboard;