import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { EnhancedDataTable } from '@/components/ui/EnhancedDataTable';

export const CareerFamilyDetailModal = ({ family, isOpen, onClose }) => {
  if (!family) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            {family.name}
          </DialogTitle>
          <DialogDescription>
            Analyse détaillée de la famille de métiers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stats" className="mt-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="stats"><BarChart2 className="h-4 w-4 mr-2" />Statistiques</TabsTrigger>
            <TabsTrigger value="careers"><Briefcase className="h-4 w-4 mr-2" />Métiers Associés</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Utilisateurs</TabsTrigger>
            <TabsTrigger value="performance"><Award className="h-4 w-4 mr-2" />Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border text-center">
                <p className="text-sm text-slate-500">Utilisateurs intéressés</p>
                <p className="text-2xl font-bold text-primary">{family.count}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border text-center">
                <p className="text-sm text-slate-500">Score Moyen</p>
                <p className="text-2xl font-bold text-emerald-600">{family.avgScore}/100</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border text-center">
                <p className="text-sm text-slate-500">Taux d'acceptation</p>
                <p className="text-2xl font-bold text-blue-600">68%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border text-center">
                <p className="text-sm text-slate-500">Taux de rejet</p>
                <p className="text-2xl font-bold text-red-500">15%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="careers">
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
              Liste des métiers avec taux d'exploration en cours de développement.
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
              Répartition des utilisateurs en cours de développement.
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
              Données de performance spécifiques à la famille en cours de développement.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};