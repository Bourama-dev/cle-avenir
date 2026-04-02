import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LevelComparisonChart, EvolutionChart, ProfileDistributionChart } from '../charts/SharedCharts';
import { InteractiveChart } from '../charts/InteractiveChart';
import { FilterBar } from '../filters/FilterBar';
import { EnhancedDataTable } from '@/components/ui/EnhancedDataTable';

import { LevelAnalysisService } from '@/services/analytics/LevelAnalysisService';
import { ProfileAnalysisService } from '@/services/analytics/ProfileAnalysisService';
import { TrendAnalysisService } from '@/services/analytics/TrendAnalysisService';
import { DiversityAnalysisService } from '@/services/analytics/DiversityAnalysisService';
import { EngagementAnalysisService } from '@/services/analytics/EngagementAnalysisService';
import { PedagogicalAnalysisService } from '@/services/analytics/PedagogicalAnalysisService';
import { CareerFamilyAnalysisService } from '@/services/analytics/CareerFamilyAnalysisService';

import { CareerFamilyDetailModal } from '../modals/CareerFamilyDetailModal';
import { UserDetailModal } from '../modals/UserDetailModal';

export const LevelAnalysisTab = () => {
  const [data, setData] = useState([]);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    LevelAnalysisService.getLevelMetrics().then(setData);
    LevelAnalysisService.getLevelEvolution().then(setEvolution);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Comparaison des Niveaux</CardTitle></CardHeader>
          <CardContent><LevelComparisonChart data={data} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Évolution par Niveau</CardTitle></CardHeader>
          <CardContent><EvolutionChart data={evolution} lines={['Seconde', 'Première', 'Terminale']} /></CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ProfileAnalysisTab = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    ProfileAnalysisService.getProfileDistribution().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Distribution des Profils Dominants</CardTitle></CardHeader>
          <CardContent>
            <ProfileDistributionChart data={data.map(d => ({ name: d.profile, value: d.count }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Analyse Familles par Profil</CardTitle></CardHeader>
          <CardContent>
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg h-[300px] flex items-center justify-center">
               Graphique d'association Profil / Familles de métiers
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const CareerFamilyAnalysisTab = () => {
  const [families, setFamilies] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    CareerFamilyAnalysisService.getFamilyDistribution().then(setFamilies);
    CareerFamilyAnalysisService.getFamilyEvolution().then(setEvolution);
  }, []);

  const columns = [
    { key: 'name', label: 'Famille de Métiers', className: 'font-semibold' },
    { key: 'count', label: 'Utilisateurs' },
    { key: 'percentage', label: 'Pourcentage (%)', render: (val) => `${val}%` },
    { key: 'avgScore', label: 'Score Moyen' },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedFamily(row)}>Voir détails</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart 
          type="pie" 
          title="Répartition par Famille" 
          data={families.map(f => ({ name: f.name, value: f.count }))} 
        />
        <InteractiveChart 
          type="bar" 
          title="Scores par Famille" 
          data={families} 
          dataKeys={['avgScore']} 
          colors={['#10b981']}
        />
      </div>
      
      <Card>
        <CardHeader><CardTitle>Détails des Familles de Métiers</CardTitle></CardHeader>
        <CardContent>
          <EnhancedDataTable data={families} columns={columns} />
        </CardContent>
      </Card>

      <InteractiveChart 
        type="line" 
        title="Évolution de l'intérêt" 
        data={evolution} 
        dataKeys={['Informatique & Numérique', 'Santé & Social']} 
      />

      <CareerFamilyDetailModal 
        family={selectedFamily} 
        isOpen={!!selectedFamily} 
        onClose={() => setSelectedFamily(null)} 
      />
    </div>
  );
};

export const CareerRecommendationsTab = () => (
  <Card>
    <CardHeader><CardTitle>Recommandations & Acceptation</CardTitle></CardHeader>
    <CardContent>
      <div className="p-8 text-center text-slate-500">Filtrage par famille de métiers et taux d'acceptation/rejet.</div>
    </CardContent>
  </Card>
);

export const CareerExplorationTab = () => (
  <Card>
    <CardHeader><CardTitle>Exploration des Métiers</CardTitle></CardHeader>
    <CardContent>
      <div className="p-8 text-center text-slate-500">Temps d'exploration et parcours de recherche par famille.</div>
    </CardContent>
  </Card>
);

export const TestPerformanceTab = () => (
  <Card>
    <CardHeader><CardTitle>Performance aux Tests</CardTitle></CardHeader>
    <CardContent>
      <div className="p-8 text-center text-slate-500">Scores, compétences et domaines filtrés par famille.</div>
    </CardContent>
  </Card>
);

export const TrendAnalysisTab = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    TrendAnalysisService.getTrends().then(setTrends);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Tendances Générales</CardTitle></CardHeader>
        <CardContent><EvolutionChart data={trends} lines={['value', 'expected']} /></CardContent>
      </Card>
    </div>
  );
};

export const DiversityAnalysisTab = () => {
  const [metrics, setMetrics] = useState({ gender: [], age: [] });

  useEffect(() => {
    DiversityAnalysisService.getDiversityMetrics().then(setMetrics);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Répartition par Genre</CardTitle></CardHeader>
        <CardContent><ProfileDistributionChart data={metrics.gender} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Répartition par Âge</CardTitle></CardHeader>
        <CardContent><ProfileDistributionChart data={metrics.age.map(a => ({ name: a.range, value: a.value }))} /></CardContent>
      </Card>
    </div>
  );
};

export const EngagementAnalysisTab = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    EngagementAnalysisService.getEngagementMetrics().then(setData);
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Métriques d'Engagement</CardTitle></CardHeader>
      <CardContent>
         <div className="space-y-4">
           {data.map(d => (
             <div key={d.class} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
               <span className="font-medium">{d.class}</span>
               <span>Complétion: {d.completionRate}%</span>
               <span>Participation: {d.participation}%</span>
             </div>
           ))}
         </div>
      </CardContent>
    </Card>
  );
};

export const PedagogicalAnalysisTab = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    PedagogicalAnalysisService.getTeacherMetrics().then(setData);
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Efficacité Pédagogique</CardTitle></CardHeader>
      <CardContent>
         <div className="space-y-4">
           {data.map(t => (
             <div key={t.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-l-4 border-l-primary">
               <div>
                 <p className="font-bold">{t.name}</p>
                 <p className="text-sm text-slate-500">{t.subject}</p>
               </div>
               <div className="text-right">
                 <p className="font-medium text-green-600">Efficacité: {t.effectiveness}%</p>
                 <p className="text-sm">Satisfaction: {t.satisfaction}/5</p>
               </div>
             </div>
           ))}
         </div>
      </CardContent>
    </Card>
  );
};