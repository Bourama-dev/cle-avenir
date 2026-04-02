import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, DollarSign, MapPin, Briefcase, GraduationCap, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SavedItems = ({ savedItems, onNavigate }) => {
  const { jobs = [], formations = [], metiers = [] } = savedItems;

  const EmptyState = ({ type }) => (
    <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-muted">
        <Heart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Aucun {type} sauvegardé</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center">
          <Heart className="w-6 h-6 mr-2 text-primary" />
          Collection
        </h2>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {jobs.length + formations.length + metiers.length} éléments
        </span>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="jobs">Offres</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="metiers">Métiers</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-3 min-h-[200px]">
           {jobs.length > 0 ? jobs.map((item) => (
                <div key={item.id} className="bg-muted/30 rounded-xl p-3 border border-border/50 cursor-pointer hover:bg-muted hover:border-primary/30 transition-all group" onClick={() => onNavigate(`/job/${item.job_id}`)}>
                  <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.job_details.title}</p>
                        <div className="flex items-center text-muted-foreground text-xs space-x-3 mt-1">
                            <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" />{item.job_details.company || 'Entreprise confidentielle'}</span>
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{item.job_details.location}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                      </Button>
                  </div>
                </div>
           )) : <EmptyState type="offre" />}
           {jobs.length > 0 && <Button variant="link" onClick={() => onNavigate('/offres-emploi')} className="w-full text-xs">Voir tout</Button>}
        </TabsContent>

        <TabsContent value="formations" className="space-y-3 min-h-[200px]">
            {formations.length > 0 ? formations.map((item) => (
                <div key={item.id} className="bg-muted/30 rounded-xl p-3 border border-border/50 cursor-pointer hover:bg-muted hover:border-accent/30 transition-all" onClick={() => onNavigate(`/formation/${item.formation_id}`)}>
                  <p className="font-semibold text-foreground">{item.formation_details.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.formation_details.provider}</p>
                </div>
            )) : <EmptyState type="formation" />}
            {formations.length > 0 && <Button variant="link" onClick={() => onNavigate('/formations')} className="w-full text-xs">Voir tout</Button>}
        </TabsContent>

        <TabsContent value="metiers" className="space-y-3 min-h-[200px]">
            {metiers.length > 0 ? metiers.map((item) => (
                <div key={item.id} className="bg-muted/30 rounded-xl p-3 border border-border/50 cursor-pointer hover:bg-muted hover:border-secondary/30 transition-all" onClick={() => onNavigate(`/metier/${item.metier_code}`)}>
                    <p className="font-semibold text-foreground">{item.metier_details.libelle || item.metier_code}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.metier_details.domaine || 'Secteur inconnu'}</p>
                </div>
            )) : <EmptyState type="métier" />}
            {metiers.length > 0 && <Button variant="link" onClick={() => onNavigate('/metiers')} className="w-full text-xs">Voir tout</Button>}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SavedItems;