import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, trend, percentage, alert }) => (
  <Card className={`relative overflow-hidden ${alert ? 'border-amber-300 bg-amber-50/30' : ''}`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        {alert && <AlertTriangle className="h-4 w-4 text-amber-500" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        {trend === 'up' && <span className="text-xs text-green-600 flex items-center font-medium"><TrendingUp className="h-3 w-3 mr-1"/>+{percentage}%</span>}
        {trend === 'down' && <span className="text-xs text-red-600 flex items-center font-medium"><TrendingDown className="h-3 w-3 mr-1"/>-{percentage}%</span>}
        {trend === 'neutral' && <span className="text-xs text-slate-400 flex items-center font-medium"><Minus className="h-3 w-3 mr-1"/>{percentage}%</span>}
      </div>
    </CardContent>
  </Card>
);

const DetailedStatisticsPanel = ({ kpis }) => {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      <StatCard title="Taux de réussite (>70)" value={`${kpis.successRate?.value || 0}%`} trend={kpis.successRate?.trend} percentage={kpis.successRate?.diff} />
      <StatCard title="Engagement" value={`${kpis.engagementRate?.value || 0}%`} trend={kpis.engagementRate?.trend} percentage={kpis.engagementRate?.diff} />
      <StatCard title="Étudiants à risque" value={kpis.atRiskCount?.value || 0} trend={kpis.atRiskCount?.trend} percentage={kpis.atRiskCount?.diff} alert={(kpis.atRiskCount?.value || 0) > 10} />
      <StatCard title="Temps moy. (min)" value={kpis.avgCompletionTime?.value || 0} trend={kpis.avgCompletionTime?.trend} percentage={kpis.avgCompletionTime?.diff} />
      <StatCard title="Diversité Profils" value={kpis.profileDiversityIndex?.value || 0} trend={kpis.profileDiversityIndex?.trend} percentage={kpis.profileDiversityIndex?.diff} />
    </div>
  );
};

export default DetailedStatisticsPanel;