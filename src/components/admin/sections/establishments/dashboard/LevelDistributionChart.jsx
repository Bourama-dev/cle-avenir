import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const LevelDistributionChart = ({ data }) => {
  // Task 1: Handle undefined data and provide default empty array
  const safeData = Array.isArray(data) ? data : [];
  
  // Safe reduce operation with null checks for values
  const total = safeData.reduce((acc, curr) => acc + (curr?.value || 0), 0);
  
  // Safe calculation for mainLevel
  let mainLevel = 'N/A';
  if (safeData.length > 0) {
    const maxEntry = safeData.reduce((prev, current) => 
      ((prev?.value || 0) > (current?.value || 0)) ? prev : current
    , safeData[0]);
    mainLevel = maxEntry?.name || 'N/A';
  }

  if (safeData.length === 0) {
    return (
      <div className="est-card h-[350px]">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-lg font-semibold text-slate-800">Répartition par Niveau</h3>
        </div>
        <div className="h-[280px] flex items-center justify-center text-slate-400">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="est-card h-[350px]">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-semibold text-slate-800">Répartition par Niveau</h3>
      </div>
      
      <div className="flex items-center h-[280px]">
        <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={safeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                >
                {safeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center items-center border-l border-slate-100 pl-4">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Formations</span>
            <span className="text-3xl font-bold text-slate-800 my-1">{total}</span>
            <span className="text-xs text-slate-500 mt-2">Niveau Principal</span>
            <span className="text-sm font-medium text-indigo-600">{mainLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default LevelDistributionChart;