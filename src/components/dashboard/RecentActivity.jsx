import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, Star, FileText, CheckCircle } from 'lucide-react';

const RecentActivity = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userId) return;

      try {
        // Fetch most recent items from different tables
        const [tests, jobs, metiers] = await Promise.all([
          supabase.from('test_results').select('created_at, id').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
          supabase.from('saved_jobs').select('created_at, job_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
          supabase.from('saved_metiers').select('created_at, metier_code').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
        ]);

        const formatActivity = (items, type, icon, labelFn) => 
          (items.data || []).map(item => ({
            id: item.id || item.created_at,
            date: new Date(item.created_at),
            type,
            icon,
            label: labelFn(item)
          }));

        const allActivities = [
          ...formatActivity(tests, 'test', FileText, () => 'Test d\'orientation complété'),
          ...formatActivity(jobs, 'job', Star, (i) => `Offre sauvegardée`),
          ...formatActivity(metiers, 'metier', CheckCircle, () => 'Métier ajouté aux favoris')
        ].sort((a, b) => b.date - a.date).slice(0, 5);

        setActivities(allActivities);
      } catch (e) {
        console.error("Error fetching activities", e);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-50 rounded animate-pulse" />)}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 relative pb-4 last:pb-0">
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-100" />
                )}
                <div className="relative z-10 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                  <activity.icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{activity.label}</p>
                  <p className="text-xs text-slate-400 capitalize">
                    {format(activity.date, 'dd MMMM, HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Aucune activité récente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;