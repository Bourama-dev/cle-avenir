import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { semanticInsightsGenerator } from '@/services/semanticInsightsGenerator';
import { Radar } from 'recharts'; // Assuming Recharts usage for complex viz, but implementing simple bars for now as per constraints

const ResultsVisualization = ({ matches, insights }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Analyse Sémantique des Carrières
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {matches.slice(0, 5).map((match, idx) => {
            const confidence = semanticInsightsGenerator.getConfidenceLabel(match.score);
            const percentage = Math.round(match.score * 100);
            
            let colorClass = "bg-red-500";
            if (percentage >= 50) colorClass = "bg-yellow-500";
            if (percentage >= 75) colorClass = "bg-green-500";

            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{match.libelle}</span>
                  <Badge variant="outline" className={`text-xs ${
                     confidence.label === 'Élevée' ? 'text-green-600 border-green-200 bg-green-50' : 
                     confidence.label === 'Moyenne' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 
                     'text-red-600 border-red-200 bg-red-50'
                  }`}>
                    {confidence.label} ({percentage}%)
                  </Badge>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
                     style={{ width: `${percentage}%` }}
                   />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {insights && insights.length > 0 && (
        <Card className="bg-violet-50 border-violet-100">
           <CardContent className="pt-6">
              <h4 className="font-bold text-violet-900 mb-2">💡 Insights IA</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-violet-800">
                {insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
           </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsVisualization;