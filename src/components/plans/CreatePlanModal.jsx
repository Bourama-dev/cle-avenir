import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Target, Loader2, Compass } from 'lucide-react';
import { planManagementService } from '@/services/planManagementService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePlanModal = ({ isOpen, onClose, metierCode, metierName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [conflictPlan, setConflictPlan] = useState(null);

  const handleCreate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    const res = await planManagementService.createPlanFromMetier(user.id, metierCode, metierName);
    
    if (res.success) {
      toast({ title: "Plan créé !", description: "Votre plan d'action a été généré." });
      navigate('/personalized-plan');
      onClose();
    } else if (res.error === 'ACTIVE_PLAN_EXISTS') {
      setConflictPlan(res.activePlan);
    } else {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de créer le plan." });
    }
    setLoading(false);
  };

  const handleReplace = async () => {
    setLoading(true);
    const res = await planManagementService.replacePlan(user.id, metierCode, metierName);
    
    if (res.success) {
      toast({ title: "Plan mis à jour", description: "Votre nouveau plan d'action a été activé." });
      navigate('/personalized-plan');
      onClose();
    } else {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de remplacer le plan." });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="w-5 h-5 text-indigo-600" />
            Créer un Plan d'Action
          </DialogTitle>
          <DialogDescription>
            Structurons ensemble votre projet professionnel autour du métier : <strong className="text-slate-900">{metierName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {conflictPlan ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Un plan est déjà actif</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Vous avez déjà un plan en cours pour le métier : <strong>{conflictPlan.selected_metier_name}</strong>. 
                  Voulez-vous l'archiver et le remplacer par ce nouveau projet ?
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConflictPlan(null)} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleReplace} className="bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Remplacer le plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Compass className="w-8 h-8 text-indigo-400 shrink-0" />
              <p className="text-sm text-slate-600">
                Ce plan générera des étapes clés (recherche de formation, CV, candidatures) pour vous accompagner dans votre reconversion ou votre orientation.
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="ghost" onClick={onClose} disabled={loading}>Annuler</Button>
              <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Générer mon plan
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanModal;