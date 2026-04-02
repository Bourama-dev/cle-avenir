import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, BookOpen, Target, Award, Briefcase, Clock } from 'lucide-react';

export const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-2xl">{user.first_name} {user.last_name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <span>{user.email}</span> • 
              <Badge variant="outline">{user.institution || 'Non spécifié'}</Badge>
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
            <TabsTrigger value="overview"><Activity className="h-4 w-4 mr-2 hidden sm:inline" />Vue</TabsTrigger>
            <TabsTrigger value="history"><Clock className="h-4 w-4 mr-2 hidden sm:inline" />Activité</TabsTrigger>
            <TabsTrigger value="careers"><Briefcase className="h-4 w-4 mr-2 hidden sm:inline" />Métiers</TabsTrigger>
            <TabsTrigger value="resources"><BookOpen className="h-4 w-4 mr-2 hidden sm:inline" />Ressources</TabsTrigger>
            <TabsTrigger value="performance"><Award className="h-4 w-4 mr-2 hidden sm:inline" />Scores</TabsTrigger>
            <TabsTrigger value="progression"><Target className="h-4 w-4 mr-2 hidden sm:inline" />Progression</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold mb-2 text-slate-800">Familles de Métiers Dominantes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-sm">Informatique</span><Badge>85%</Badge></div>
                  <div className="flex justify-between items-center"><span className="text-sm">Ingénierie</span><Badge>72%</Badge></div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold mb-2 text-slate-800">Statut Actuel</h4>
                <p className="text-sm text-slate-600">Niveau de maturité : <strong className="text-primary">Exploration active</strong></p>
                <p className="text-sm text-slate-600 mt-1">Tests complétés : <strong>3/4</strong></p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
               Historique d'activité détaillé en cours de développement.
             </div>
          </TabsContent>

          <TabsContent value="careers">
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
               Analyse des métiers recommandés, acceptés et refusés en cours de développement.
             </div>
          </TabsContent>

          <TabsContent value="resources">
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
               Ressources consultées en cours de développement.
             </div>
          </TabsContent>

          <TabsContent value="performance">
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
               Scores et performances aux tests en cours de développement.
             </div>
          </TabsContent>

          <TabsContent value="progression">
             <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border">
               Suivi de progression en cours de développement.
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};