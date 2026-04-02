import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, LogIn, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => {
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white group overflow-hidden relative">
      <div className={cn("absolute right-0 top-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-110", color)}></div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn("p-3 rounded-xl bg-opacity-10 text-white", color.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-'))}> 
             <div className={cn("p-2 rounded-lg", color.replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-'))}>
                <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
             </div>
          </div>
          {trend && (
            <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full", trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
              {trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const EstablishmentStats = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Étudiants Inscrits"
        value={stats?.studentCount || 0}
        icon={Users}
        color="bg-blue-600"
        trend="up"
        trendValue="+12%"
        loading={loading}
      />
      <StatCard
        title="Formations"
        value={stats?.formationCount || 0}
        icon={GraduationCap}
        color="bg-purple-600"
        loading={loading}
      />
      <StatCard
        title="Connexions (30j)"
        value={stats?.loginCount || 0}
        icon={LogIn}
        color="bg-emerald-600"
        trend="up"
        trendValue="+5%"
        loading={loading}
      />
      <StatCard
        title="Taux d'Activation"
        value={`${stats?.activationRate || 0}%`}
        icon={Award}
        color="bg-amber-500"
        loading={loading}
      />
    </div>
  );
};

export default EstablishmentStats;