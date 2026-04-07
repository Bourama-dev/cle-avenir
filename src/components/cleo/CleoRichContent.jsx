import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CleoChart = ({ data }) => {
  if (!data) return null;
  return (
    <Card className="my-2">
      <CardContent className="pt-4">
        <p className="text-sm text-slate-500">Graphique : {data.title || 'Données'}</p>
      </CardContent>
    </Card>
  );
};

export const CleoActionPlan = ({ data, onStart }) => {
  if (!data) return null;
  return (
    <Card className="my-2">
      <CardContent className="pt-4">
        <p className="font-medium text-sm mb-2">{data.title || 'Plan d\'action'}</p>
        {onStart && (
          <button onClick={onStart} className="text-xs text-blue-600 hover:underline">
            Démarrer
          </button>
        )}
      </CardContent>
    </Card>
  );
};
