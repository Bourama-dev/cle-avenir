import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

const RiasecProfile = ({ riasecData }) => {
  if (!riasecData) return null;

  const mapping = [
    { key: 'R', label: 'Réaliste', color: 'bg-red-500' },
    { key: 'I', label: 'Investigateur', color: 'bg-blue-500' },
    { key: 'A', label: 'Artistique', color: 'bg-purple-500' },
    { key: 'S', label: 'Social', color: 'bg-green-500' },
    { key: 'E', label: 'Entreprenant', color: 'bg-orange-500' },
    { key: 'C', label: 'Conventionnel', color: 'bg-slate-500' },
  ];

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" />
          Votre Profil RIASEC
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {mapping.map(item => {
            const value = (riasecData[item.key] || 0) * 100;
            return (
              <div key={item.key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700">{item.label} ({item.key})</span>
                  <span className="text-slate-500 font-mono">{value.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${value}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiasecProfile;