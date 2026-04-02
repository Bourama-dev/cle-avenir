import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, GraduationCap, Compass, BookMarked } from 'lucide-react';

const QuickStats = ({ userId }) => {
  const [stats, setStats] = useState({
    jobs: 0,
    formations: 0,
    metiers: 0,
    tests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      const [
        { count: jobsCount },
        { count: formationsCount },
        { count: metiersCount },
        { count: testsCount }
      ] = await Promise.all([
        supabase.from('saved_jobs').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('saved_formations').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('saved_metiers').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('test_results').select('*', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      setStats({
        jobs: jobsCount || 0,
        formations: formationsCount || 0,
        metiers: metiersCount || 0,
        tests: testsCount || 0
      });
    };

    fetchStats();
  }, [userId]);

  const statItems = [
    { label: 'Offres suivies', value: stats.jobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Formations', value: stats.formations, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Métiers favoris', value: stats.metiers, icon: BookMarked, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tests réalisés', value: stats.tests, icon: Compass, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className={`p-3 rounded-full ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className="text-xs font-medium text-slate-500">{item.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;