import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const AdminTestsVisualization = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[300px]">
         {[1, 2, 3].map((i) => (
           <Card key={i} className="flex items-center justify-center bg-slate-50/50">
             <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
           </Card>
         ))}
      </div>
    );
  }

  // Process data for charts
  
  // 1. Score Distribution
  const scoreBuckets = [
    { name: '0-20', count: 0 },
    { name: '21-40', count: 0 },
    { name: '41-60', count: 0 },
    { name: '61-80', count: 0 },
    { name: '81-100', count: 0 },
  ];

  // 2. Careers Distribution
  const careersCount = {};

  // 3. Trends (Tests per day)
  const trendsMap = {};

  data.forEach(test => {
    // Score
    const score = test.results?.baseResults?.confidence || 0;
    if (score <= 20) scoreBuckets[0].count++;
    else if (score <= 40) scoreBuckets[1].count++;
    else if (score <= 60) scoreBuckets[2].count++;
    else if (score <= 80) scoreBuckets[3].count++;
    else scoreBuckets[4].count++;

    // Career
    const topCareer = test.results?.baseResults?.matchedCareers?.[0]?.career?.name;
    if (topCareer) {
      careersCount[topCareer] = (careersCount[topCareer] || 0) + 1;
    }

    // Trend
    const date = new Date(test.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    trendsMap[date] = (trendsMap[date] || 0) + 1;
  });

  const topCareersData = Object.entries(careersCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const trendsData = Object.entries(trendsMap)
    .slice(-14) // Last 14 days
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {/* Score Distribution */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Distribution des Scores</CardTitle>
          <CardDescription>Répartition par tranches de confiance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBuckets}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Career Matches */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Top Métiers Identifiés</CardTitle>
          <CardDescription>Métiers les plus fréquemment suggérés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCareersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topCareersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Completion Trends */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 lg:col-span-2 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Volume de Tests</CardTitle>
          <CardDescription>Tendance sur les 14 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestsVisualization;