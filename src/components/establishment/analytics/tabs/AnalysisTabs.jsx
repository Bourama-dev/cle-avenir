import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TabPlaceholder = ({ name }) => (
  <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">{name}</p></CardContent></Card>
);

export const LevelAnalysisTab = () => <TabPlaceholder name="Analyse par niveau" />;
export const ProfileAnalysisTab = () => <TabPlaceholder name="Analyse des profils" />;
export const TrendAnalysisTab = () => <TabPlaceholder name="Tendances" />;
export const DiversityAnalysisTab = () => <TabPlaceholder name="Diversité" />;
export const EngagementAnalysisTab = () => <TabPlaceholder name="Engagement" />;
export const PedagogicalAnalysisTab = () => <TabPlaceholder name="Analyse pédagogique" />;
export const CareerFamilyAnalysisTab = () => <TabPlaceholder name="Familles de métiers" />;
export const CareerRecommendationsTab = () => <TabPlaceholder name="Recommandations métiers" />;
export const CareerExplorationTab = () => <TabPlaceholder name="Exploration carrière" />;
export const TestPerformanceTab = () => <TabPlaceholder name="Performance des tests" />;
