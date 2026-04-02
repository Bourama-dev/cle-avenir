import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConnectionActivityChart = ({ data }) => {
  // Task 4: Add null/undefined checks for data
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="est-card h-[350px]">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Activité de Connexion (Semaine)</h3>
        <div className="h-[280px] w-full flex items-center justify-center text-slate-400">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="est-card h-[350px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Activité de Connexion (Semaine)</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="connections" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConnectionActivityChart;