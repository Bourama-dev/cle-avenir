import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Zap, Briefcase, Loader2, Edit, BarChart2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { TIERS } from '@/constants/subscriptionTiers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { EmailService } from '@/services/emailService';

const DashboardRightSidebar = ({ userProfile, user, onOpenProfile }) => {
  const { currentTier } = useSubscriptionAccess();
  const isFree = currentTier === TIERS.FREE;
  const navigate = useNavigate();

  // Real test count
  const [testCount, setTestCount] = useState(null);
  const fetchTestCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { count } = await supabase
        .from('test_results')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setTestCount(count ?? 0);
    } catch {
      setTestCount(0);
    }
  }, [user?.id]);
  useEffect(() => { fetchTestCount(); }, [fetchTestCount]);

  // Support Form State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const { toast } = useToast();

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare data
      const name = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Utilisateur';
      const email = userProfile?.email || '';
      const userId = userProfile?.id;

      if (!formData.subject || !formData.message) {
        throw new Error("Veuillez remplir tous les champs");
      }

      // 2. Save to database
      const { data: ticket, error: dbError } = await supabase
        .from('support_requests')
        .insert({
          user_id: userId,
          name,
          email,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Send email notification (fire and forget to not block UI if slow)
      EmailService.sendSupportNotification({
        id: ticket.id,
        name,
        email,
        subject: formData.subject,
        message: formData.message
      });

      // 4. Success feedback
      toast({
        title: "Message envoyé !",
        description: "Notre équipe vous répondra dans les plus brefs délais.",
        variant: "default"
      });
      
      setIsOpen(false);
      setFormData({ subject: '', message: '' });

    } catch (error) {
      console.error('Error sending support request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer votre message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="bg-gradient-to-br from-violet-600 to-purple-700 text-white border-none shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-2 text-violet-100 text-sm font-medium mb-1">
            <Zap className="h-4 w-4" />
            Plan Actuel
          </div>
          <CardTitle className="text-2xl font-bold">
            {isFree ? "Freemium" : currentTier === TIERS.PREMIUM ? "Premium" : "Premium+"}
          </CardTitle>
          <p className="text-violet-100 text-sm mt-1 opacity-90">
            {isFree ? "Accès limité aux résultats." : "Accès complet activé."}
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          {isFree ? (
            <Button asChild className="w-full bg-cyan-400 hover:bg-cyan-500 text-cyan-950 font-semibold border-none shadow-md transition-all">
              <Link to="/plans">Mettre à jour ↗</Link>
            </Button>
          ) : (
             <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-none" onClick={() => navigate('/manage-subscription')}>
                   Gérer
                </Button>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Profile Actions */}
      <div>
         <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Actions Rapides</h3>
         <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-white dark:bg-slate-800" onClick={onOpenProfile}>
               <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
               Mettre à jour profil
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-white dark:bg-slate-800" onClick={() => navigate('/formations')}>
               <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />
               Voir formations
            </Button>
         </div>
      </div>

      {/* Quick Stats — real test count */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Activité</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="bg-white dark:bg-slate-800 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BarChart2 className="w-5 h-5 text-indigo-400 mb-1" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {testCount === null ? <Loader2 className="w-4 h-4 animate-spin text-slate-400 mx-auto" /> : testCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tests</span>
            </CardContent>
          </Card>
          <Card
            className="bg-white dark:bg-slate-800 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => navigate('/offres-emploi')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Briefcase className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                <span className="text-slate-300 dark:text-slate-500 text-base font-normal">Voir</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Offres</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Besoin d'aide ?</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 h-12">
              <MessageCircle className="h-4 w-4" />
              Support Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contacter le support</DialogTitle>
              <DialogDescription>
                Remplissez ce formulaire pour nous envoyer une demande. Nous vous répondrons par email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSupportSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}` : ''}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userProfile?.email || ''}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input 
                  id="subject" 
                  placeholder="Ex: Problème de connexion, Question sur mon abonnement..." 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Décrivez votre problème ou votre question en détail..." 
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardRightSidebar;