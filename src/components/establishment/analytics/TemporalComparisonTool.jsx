import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonBarChart } from './AnalyticsCharts';

const TemporalComparisonTool = () => {
  const data = [
    { name: 'Jan', current: 400, previous: 240 },
    { name: 'Fév', current: 300, previous: 139 },
    { name: 'Mar', current: 200, previous: 980 },
    { name: 'Avr', current: 278, previous: 390 },
    { name: 'Mai', current: 189, previous: 480 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison Temporelle</CardTitle>
      </CardHeader>
      <CardContent>
        <ComparisonBarChart data={data} />
      </CardContent>
    </Card>
  );
};

export default TemporalComparisonTool;