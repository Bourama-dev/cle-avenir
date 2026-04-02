import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { rgpdService } from '@/services/rgpdService';
import RgpdDataExport from '@/components/RgpdDataExport';
import { Shield, Clock, FileText, UserCircle, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RgpdPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const summary = await rgpdService.getUserDataSummary(user.id);
          setData(summary);
        } catch (error) {
          console.error("Failed to fetch RGPD summary", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Confidentialité & Données</h1>
          <p className="text-slate-600">Gérez vos données personnelles, vos préférences et consultez votre historique.</p>
        </div>

        <RgpdDataExport />

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <UserCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Résumé de vos données</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Nom complet</span>
                <span className="font-medium text-slate-900">{data?.profile?.first_name} {data?.profile?.last_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900">{data?.profile?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Date d'inscription</span>
                <span className="font-medium text-slate-900">
                  {data?.profile?.created_at ? format(new Date(data?.profile?.created_at), 'dd MMMM yyyy', { locale: fr }) : '-'}
                </span>
              </div>
              <div className="pt-4">
                 <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center"><Shield className="w-4 h-4 mr-2" /> Préférences Cookies</h4>
                 <div className="flex flex-wrap gap-2">
                    <Badge variant={data?.cookiePrefs?.essential ? 'default' : 'outline'}>Essentiels</Badge>
                    <Badge variant={data?.cookiePrefs?.analytics ? 'default' : 'outline'}>Analytiques</Badge>
                    <Badge variant={data?.cookiePrefs?.marketing ? 'default' : 'outline'}>Marketing</Badge>
                 </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Activité récente</h3>
            </div>
            
            {data?.recentActivities?.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {data.recentActivities.map((activity, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm capitalize">{activity.event_type}</span>
                      </div>
                      <time className="text-xs text-slate-400 font-medium">{format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm')}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                Aucune activité récente enregistrée.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RgpdPage;