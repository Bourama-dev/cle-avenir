import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const RecommendationList = ({ recommendations = [] }) => {
  if (!recommendations.length) return (
    <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Aucune recommandation disponible.</p></CardContent></Card>
  );
  return (
    <div className="space-y-2">
      {recommendations.map((rec, i) => (
        <Card key={i}><CardContent className="pt-4"><p className="text-sm">{rec.label || rec.title || rec}</p></CardContent></Card>
      ))}
    </div>
  );
};
