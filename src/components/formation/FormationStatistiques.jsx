import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Euro, Users, PieChart } from 'lucide-react';

const FormationStatistiques = ({ stats, careers }) => {
  if (!stats) {
    return (
      <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none">
        <CardContent className="p-12 text-center text-slate-500">
          <PieChart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">Les statistiques d'insertion ne sont pas encore disponibles.</p>
        </CardContent>
      </Card>
    );
  }

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Euro className="w-16 h-16 text-indigo-600" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Salaire moyen estimé</p>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {formatCurrency(stats.average_salary_min)}
            </div>
            <p className="text-sm text-slate-600 font-medium">à {formatCurrency(stats.average_salary_max)} / an</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16 text-emerald-600" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Taux d'insertion</p>
            <div className="text-3xl font-extrabold text-emerald-600 mb-1">
              {stats.employment_rate}%
            </div>
            <p className="text-sm text-slate-600 font-medium">à 6 mois post-diplôme</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-amber-600" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Perspectives</p>
            <div className="text-3xl font-extrabold text-amber-600 mb-1">
              {stats.prospects}
            </div>
            <p className="text-sm text-slate-600 font-medium">Dynamique du secteur</p>
          </CardContent>
        </Card>
      </div>

      {stats.chartData && stats.chartData.length > 0 && (
        <Card className="border-slate-200 shadow-sm pt-6">
          <CardContent>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
               <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
               Salaire moyen par métier accessible
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `${val/1000}k€`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} €`, 'Salaire Moyen']}
                  />
                  <Bar dataKey="salaireMoyen" radius={[4, 4, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormationStatistiques;