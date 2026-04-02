import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2 } from 'lucide-react';

const SuggestedFormations = ({ formations, isLoading, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
        <GraduationCap className="w-6 h-6 mr-2 text-secondary" />
        Formations suggérées
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      ) : formations.length > 0 ? (
        <div className="space-y-4">
          {formations.map((formation) => (
            <div 
              key={formation.id} 
              className="bg-muted/50 rounded-xl p-4 border border-border cursor-pointer hover:bg-muted"
              onClick={() => onNavigate(`/formation/${formation.id}`, { state: { formation }})}
            >
              <h3 className="font-semibold text-foreground">{formation.intitule}</h3>
              <p className="text-muted-foreground text-sm">{formation.organisme?.nom}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune suggestion pour le moment.</p>
          <p className="text-muted-foreground text-sm">Sauvegardez des métiers pour voir des suggestions.</p>
        </div>
      )}
       <Button onClick={() => onNavigate('/formations')} variant="link" className="w-full mt-4">
          Voir toutes les formations
        </Button>
    </motion.div>
  );
};

export default SuggestedFormations;