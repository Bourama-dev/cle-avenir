import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Target, Pencil, Save } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const GoalEditor = ({ currentGoal, currentTitle, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState(currentGoal || "");
  const [title, setTitle] = useState(currentTitle || "");
  const [horizon, setHorizon] = useState("medium_term");
  const { userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {
        main_goal: goal,
        job_title: title,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshProfile();
      if (onUpdate) onUpdate();
      
      toast({
        title: "Objectif mis à jour",
        description: "Cléo a pris en compte votre nouvel objectif.",
        className: "bg-green-50 border-green-200 text-green-900",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de sauvegarder." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full">
          <Pencil size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-violet-100 rounded-lg">
                <Target size={20} className="text-violet-600" />
            </div>
            <DialogTitle>Définir votre Cap</DialogTitle>
          </div>
          <DialogDescription>
            Aidez Cléo à mieux vous orienter en précisant votre objectif professionnel actuel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-violet-900">Poste visé (Titre)</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Chef de Projet Digital"
              className="border-violet-200 focus-visible:ring-violet-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal" className="text-violet-900">Description détaillée</Label>
            <Textarea 
              id="goal" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              placeholder="Je souhaite évoluer vers..."
              className="min-h-[100px] border-violet-200 focus-visible:ring-violet-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="horizon">Horizon temporel</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">Court terme (3 mois)</SelectItem>
                <SelectItem value="medium_term">Moyen terme (6-12 mois)</SelectItem>
                <SelectItem value="long_term">Long terme (2+ ans)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-violet-600 hover:bg-violet-700 gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalEditor;