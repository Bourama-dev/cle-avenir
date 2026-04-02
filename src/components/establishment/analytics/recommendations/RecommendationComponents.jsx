import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  const isHigh = recommendation.urgency === 'high';
  return (
    <Card className={`border-l-4 ${isHigh ? 'border-l-red-500' : 'border-l-amber-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold flex items-center gap-2">
            {isHigh ? <AlertTriangle className="h-4 w-4 text-red-500"/> : <Lightbulb className="h-4 w-4 text-amber-500"/>}
            {recommendation.title}
          </CardTitle>
          <Badge variant={isHigh ? "destructive" : "secondary"}>
            {isHigh ? 'Urgent' : 'Recommandé'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{recommendation.description}</p>
      </CardContent>
    </Card>
  );
};

export const RecommendationList = ({ recommendations = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {recommendations.map(r => <RecommendationCard key={r.id} recommendation={r} />)}
  </div>
);