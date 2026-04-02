import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bug } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const BugReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    severity: 'low',
    email: user?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        steps_to_reproduce: formData.steps,
        severity: formData.severity,
        contact_email: formData.email,
        system_info: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          screen: `${window.screen.width}x${window.screen.height}`
        }
      });

      if (error) throw error;

      toast({
        title: "Rapport envoyé",
        description: "Merci de nous aider à améliorer la plateforme !",
        className: "bg-green-50"
      });
      setOpen(false);
      setFormData({ title: '', description: '', steps: '', severity: 'low', email: user?.email || '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le rapport pour le moment."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
           variant="outline" 
           size="sm" 
           className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-white hover:bg-slate-50 gap-2 border-rose-200 text-rose-600"
        >
          <Bug className="h-4 w-4" /> Signaler un bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Signaler un problème</DialogTitle>
          <DialogDescription>
            Décrivez le bug rencontré. Vos retours sont essentiels.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              placeholder="Ex: Bouton inactif sur la page profil" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="severity">Sévérité</Label>
            <select 
              id="severity" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.severity}
              onChange={e => setFormData({...formData, severity: e.target.value})}
            >
              <option value="low">Faible - Gêne mineure</option>
              <option value="medium">Moyenne - Fonctionnalité partielle</option>
              <option value="high">Haute - Bloquant</option>
              <option value="critical">Critique - Crash application</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Que s'est-il passé ?" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="steps">Étapes pour reproduire (optionnel)</Label>
            <Textarea 
              id="steps" 
              placeholder="1. Aller sur... 2. Cliquer sur..." 
              value={formData.steps}
              onChange={e => setFormData({...formData, steps: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email de contact</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
               {loading ? "Envoi..." : "Envoyer le rapport"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BugReportDialog;