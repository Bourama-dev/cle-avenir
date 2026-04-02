import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const LevelDetailModal = ({ isOpen, onClose, levelData }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Détails du niveau : {levelData?.level}</DialogTitle>
        <DialogDescription>Statistiques approfondies pour ce niveau.</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p>Étudiants: {levelData?.studentCount}</p>
        <p>Score Moyen: {levelData?.avgScore}</p>
        <p>Taux de réussite: {levelData?.successRate}%</p>
      </div>
    </DialogContent>
  </Dialog>
);