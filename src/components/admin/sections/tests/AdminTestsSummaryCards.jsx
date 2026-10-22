import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Trophy, Activity } from 'lucide-react';
import { getTestView, DIM_LABELS } from './testView';

const SummaryCard = ({ title, value, subtext, icon: Icon, color }) => (
  <Card className="border-none shadow-sm bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2 rounded-full ${color.bg}`}>
          <Icon className={`h-4 w-4 ${color.text}`} />
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
    </CardContent>
  </Card>
);

const AdminTestsSummaryCards = ({ data }) => {
  if (!data) return null;

  const views = data.map(getTestView);
  const totalTests = data.length;
  const completed = views.filter((v) => v.completed).length;

  // Only tests that actually have a score count in the statistics.
  const scores = views.map((v) => v.score).filter((n) => n != null);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const maxScore = scores.length ? Math.max(...scores) : null;

  const tally = (values) => {
    const counts = {};
    values.filter(Boolean).forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  };
  const topCareer = tally(views.map((v) => v.topCareer));
  const topProfile = tally(views.map((v) => v.dominant));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <SummaryCard 
        title="Total Tests" 
        value={totalTests} 
        subtext={`${completed} terminé${completed > 1 ? 's' : ''}`}
        icon={Users}
        color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
      />
      <SummaryCard 
        title="Score Moyen" 
        value={avgScore != null ? `${avgScore}%` : '—'} 
        subtext={scores.length ? `Moyenne des scores RIASEC (${scores.length} tests)` : 'Aucun score enregistré'}
        icon={Activity}
        color={{ bg: 'bg-indigo-100', text: 'text-indigo-600' }}
      />
      <SummaryCard 
        title="Meilleur Score" 
        value={maxScore != null ? `${maxScore}%` : '—'} 
        subtext="Score RIASEC le plus élevé"
        icon={Trophy}
        color={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }}
      />
      <SummaryCard 
        title={topCareer ? 'Top Métier' : 'Profil dominant'}
        value={topCareer ? topCareer[0] : topProfile ? DIM_LABELS[topProfile[0]] || topProfile[0] : 'N/A'}
        subtext={topCareer ? `${topCareer[1]} occurrences` : topProfile ? `${topProfile[1]} tests (dimension la plus forte)` : 'Aucune donnée'}
        icon={Target}
        color={{ bg: 'bg-green-100', text: 'text-green-600' }}
      />
    </div>
  );
};

export default AdminTestsSummaryCards;