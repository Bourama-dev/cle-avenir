import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillsRadarChart } from './AnalyticsCharts';

const StudentDetailAnalysis = () => {
  const radarData = [
    { subject: 'Logique', A: 120, B: 110, fullMark: 150 },
    { subject: 'Créativité', A: 98, B: 130, fullMark: 150 },
    { subject: 'Social', A: 86, B: 130, fullMark: 150 },
    { subject: 'Rigueur', A: 99, B: 100, fullMark: 150 },
    { subject: 'Leadership', A: 85, B: 90, fullMark: 150 },
    { subject: 'Autonomie', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse Individuelle: Jean Dupont</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-4">Profil de Compétences</h4>
            <SkillsRadarChart data={radarData} />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Forces identifiées</h4>
            <ul className="list-disc pl-5 text-sm text-slate-600">
              <li>Excellente capacité d'analyse logique</li>
              <li>Forte rigueur dans l'exécution</li>
            </ul>
            <h4 className="text-sm font-semibold mt-4">Carrières recommandées</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Ingénieur Logiciel</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Analyste de Données</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDetailAnalysis;