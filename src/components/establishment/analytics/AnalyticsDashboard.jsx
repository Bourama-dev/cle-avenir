import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Layers, UserCheck, TrendingUp, Shield, Clock, BookOpen, Briefcase, Compass, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from './filters/FilterBar';
import { FilterPanel } from './filters/FilterPanel';
import { SearchBar } from './filters/SearchBar';
import { UserFilterComponent } from './filters/UserFilterComponent';
import DetailedStatisticsPanel from './DetailedStatisticsPanel';
import { RecommendationList } from './recommendations/RecommendationComponents';

import { 
  LevelAnalysisTab, ProfileAnalysisTab, TrendAnalysisTab, DiversityAnalysisTab, 
  EngagementAnalysisTab, PedagogicalAnalysisTab, CareerFamilyAnalysisTab,
  CareerRecommendationsTab, CareerExplorationTab, TestPerformanceTab
} from './tabs/AnalysisTabs';
import { AdvancedAnalyticsService } from '@/services/analytics/AdvancedAnalyticsService';
import { RecommendationEngineService } from '@/services/analytics/RecommendationEngineService';
import { UserDetailModal } from './modals/UserDetailModal';

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [kpis, setKpis] = useState(AdvancedAnalyticsService.getEmptyKPIs());
  const [recommendations, setRecommendations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // Initialize Global Filters
  const { filters, addFilter, removeFilter, clearFilters } = useFilters('global_analytics');

  useEffect(() => {
    // Generate mock KPIs on load
    const mockData = Array.from({ length: 100 }, () => ({ score: 75, engaged: true, status: 'active' }));
    setKpis(AdvancedAnalyticsService.calculateKPIs(mockData));
    RecommendationEngineService.getRecommendations().then(setRecommendations);
  }, []);

  const handleExportCSV = () => {
    toast({ title: "Export en cours", description: "Le fichier CSV sera téléchargé dans quelques instants." });
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    if (userId) {
      addFilter('user_id', userId);
      toast({ title: "Filtre utilisateur activé", description: "Analyse centrée sur l'utilisateur sélectionné." });
    } else {
      removeFilter('user_id');
    }
  };

  // Mock fetching user details if selected
  const selectedUserDetails = selectedUserId ? {
    id: selectedUserId,
    first_name: 'Utilisateur',
    last_name: 'Sélectionné',
    email: 'user@example.com',
    institution: 'Lycée Demo'
  } : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Global Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Analytique Avancée</h2>
          <p className="text-sm text-slate-500 mt-1">Outils d'analyse multidimensionnelle et filtrage dynamique</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <UserFilterComponent value={selectedUserId} onChange={handleUserSelect} />
          {selectedUserId && (
            <Button variant="secondary" onClick={() => setIsUserModalOpen(true)} className="whitespace-nowrap">
              Voir Profil Détaillé
            </Button>
          )}
          <SearchBar onSearch={(q) => addFilter('search', q)} className="w-full sm:w-64" />
          <FilterPanel filters={filters} onAddFilter={addFilter} onClear={clearFilters} />
          <Button variant="default" onClick={handleExportCSV} className="shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
        </div>
      </div>

      {/* Global Filter Bar Display */}
      <FilterBar filters={filters} onRemove={removeFilter} onClear={clearFilters} resultCount={1250} />

      {/* KPIs Grid */}
      <DetailedStatisticsPanel kpis={kpis} />

      {/* Strategic Recommendations */}
      {recommendations.length > 0 && !selectedUserId && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Recommandations Stratégiques</h3>
          <RecommendationList recommendations={recommendations} />
        </div>
      )}

      {/* Multidimensional Analysis Tabs */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-2 overflow-hidden">
        <Tabs defaultValue="families" className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto bg-transparent border-b border-slate-200 rounded-none h-auto p-0 pb-px gap-6 px-4 scrollbar-hide">
            <TabsTrigger value="families" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <Briefcase className="h-4 w-4 mr-2"/>Familles de Métiers
            </TabsTrigger>
            <TabsTrigger value="levels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <Layers className="h-4 w-4 mr-2"/>Niveaux
            </TabsTrigger>
            <TabsTrigger value="profiles" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <UserCheck className="h-4 w-4 mr-2"/>Profils
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <CheckCircle className="h-4 w-4 mr-2"/>Recommandations
            </TabsTrigger>
            <TabsTrigger value="exploration" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <Compass className="h-4 w-4 mr-2"/>Exploration
            </TabsTrigger>
            <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <TrendingUp className="h-4 w-4 mr-2"/>Performance Tests
            </TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-4 whitespace-nowrap">
              <Clock className="h-4 w-4 mr-2"/>Engagement
            </TabsTrigger>
          </TabsList>

          <div className="p-6 py-8">
            <TabsContent value="families" className="m-0 animate-in fade-in"><CareerFamilyAnalysisTab /></TabsContent>
            <TabsContent value="levels" className="m-0 animate-in fade-in"><LevelAnalysisTab /></TabsContent>
            <TabsContent value="profiles" className="m-0 animate-in fade-in"><ProfileAnalysisTab /></TabsContent>
            <TabsContent value="recommendations" className="m-0 animate-in fade-in"><CareerRecommendationsTab /></TabsContent>
            <TabsContent value="exploration" className="m-0 animate-in fade-in"><CareerExplorationTab /></TabsContent>
            <TabsContent value="performance" className="m-0 animate-in fade-in"><TestPerformanceTab /></TabsContent>
            <TabsContent value="engagement" className="m-0 animate-in fade-in"><EngagementAnalysisTab /></TabsContent>
          </div>
        </Tabs>
      </div>

      <UserDetailModal 
        user={selectedUserDetails} 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
      />
    </div>
  );
};

export default AnalyticsDashboard;