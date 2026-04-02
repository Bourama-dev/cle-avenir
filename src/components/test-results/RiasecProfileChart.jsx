import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RIASEC_DESCRIPTIONS } from '@/data/riasecDescriptions';
import { getTopDimensions } from '@/utils/riasecMatchingAlgorithm';
import { Target } from 'lucide-react';

const RiasecProfileChart = ({ userProfile }) => {
  if (!userProfile) return null;

  const topDims = getTopDimensions(userProfile, 2);
  const profileName = topDims.map(d => RIASEC_DESCRIPTIONS[d]?.name).join('-');

  const order = ['R', 'I', 'A', 'S', 'E', 'C'];

  return (
    <Card className="shadow-md border-slate-200 bg-white overflow-hidden w-full">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-indigo-600" />
            Votre ADN Professionnel
          </div>
          <span className="text-sm font-semibold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {profileName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {order.map(key => {
            const val = userProfile[key] || 0;
            const desc = RIASEC_DESCRIPTIONS[key];
            const isDominant = topDims.includes(key);

            return (
              <div key={key} className="relative">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-bold ${isDominant ? 'text-slate-900' : 'text-slate-600'}`}>
                    {desc.name} ({key})
                  </span>
                  <span className="text-slate-500 font-mono font-bold">{val}%</span>
                </div>
                <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${val}%`, backgroundColor: desc.color }} 
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

export default RiasecProfileChart;