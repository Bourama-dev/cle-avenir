import React, { useState } from 'react';
import { Bug } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import '@/styles/BugReportButton.css';

const BugReportButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, showBugReportButton } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    severity: 'low',
    email: user?.email || ''
  });

  if (!showBugReportButton) return null;

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
        className: "bg-green-50 border-green-200"
      });
      setOpen(false);
      setFormData({ title: '', description: '', steps: '', severity: 'low', email: user?.email || '' });
    } catch (error) {
      console.error('Error submitting bug:', error);
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
    <>
      <button 
        className="bug-report-btn"
        onClick={() => setOpen(true)}
        aria-label="Signaler un bug"
      >
        <Bug />
        <span>Signaler un bug</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Signaler un problème</DialogTitle>
            <DialogDescription>
              Une fonctionnalité ne marche pas comme prévu ? Dites-nous tout !
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre du problème</Label>
              <Input 
                id="title" 
                placeholder="Ex: Le bouton de connexion ne répond pas" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="severity">Impact</Label>
              <select 
                id="severity" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.severity}
                onChange={e => setFormData({...formData, severity: e.target.value})}
              >
                <option value="low">Faible - Gêne mineure</option>
                <option value="medium">Moyen - Fonctionnalité partielle</option>
                <option value="high">Élevé - Bloquant</option>
                <option value="critical">Critique - Crash application</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea 
                id="description" 
                placeholder="Décrivez ce qui s'est passé..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="steps">Étapes pour reproduire (Optionnel)</Label>
              <Textarea 
                id="steps" 
                placeholder="1. Aller sur la page... 2. Cliquer sur..." 
                value={formData.steps}
                onChange={e => setFormData({...formData, steps: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Votre email (pour le suivi)</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="exemple@email.com"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700">
                 {loading ? "Envoi en cours..." : "Envoyer le rapport"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BugReportButton;