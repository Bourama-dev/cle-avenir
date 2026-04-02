import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Trophy, Activity } from 'lucide-react';

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

  const totalTests = data.length;
  
  // Calculate Avg Score
  const scores = data.map(d => d.results?.baseResults?.confidence || 0);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  
  // Highest Score
  const maxScore = scores.length ? Math.max(...scores) : 0;

  // Most Common Career
  const careerCounts = {};
  data.forEach(d => {
    const career = d.results?.baseResults?.matchedCareers?.[0]?.career?.name;
    if (career) careerCounts[career] = (careerCounts[career] || 0) + 1;
  });
  const topCareer = Object.entries(careerCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <SummaryCard 
        title="Total Tests" 
        value={totalTests} 
        subtext="+12% vs mois dernier"
        icon={Users}
        color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
      />
      <SummaryCard 
        title="Score Moyen" 
        value={`${avgScore}%`} 
        subtext="Indice de confiance"
        icon={Activity}
        color={{ bg: 'bg-indigo-100', text: 'text-indigo-600' }}
      />
      <SummaryCard 
        title="Meilleur Score" 
        value={`${maxScore}%`} 
        subtext="Confiance maximale"
        icon={Trophy}
        color={{ bg: 'bg-yellow-100', text: 'text-yellow-600' }}
      />
      <SummaryCard 
        title="Top Métier" 
        value={topCareer ? topCareer[0] : 'N/A'} 
        subtext={topCareer ? `${topCareer[1]} occurrences` : 'Aucune donnée'}
        icon={Target}
        color={{ bg: 'bg-green-100', text: 'text-green-600' }}
      />
    </div>
  );
};

export default AdminTestsSummaryCards;