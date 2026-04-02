import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EmailService } from '@/services/emailService';

const DataDeletionRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) return;
    
    // If user is not logged in, we can't process authenticated deletion
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer cette demande.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create support request specifically for deletion
      // We reuse support_requests to avoid creating new tables, but use 'data_deletion' type
      const { data, error } = await supabase.from('support_requests').insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || 'Utilisateur',
        subject: 'DEMANDE DE SUPPRESSION DE DONNÉES (RGPD)',
        message: `Motif de suppression : ${reason || 'Non spécifié'}`,
        type: 'data_deletion',
        status: 'open'
      }).select().single();

      if (error) throw error;
      
      setReferenceId(data.id.slice(0, 8).toUpperCase());

      // 2. Attempt to send email confirmation if EmailService is configured
      try {
        await EmailService.sendEmail(
          user.email,
          'account_deletion_request', 
          {
            name: user.user_metadata?.full_name,
            reference: data.id,
            date: new Date().toLocaleDateString('fr-FR')
          }
        );
      } catch (emailErr) {
        console.warn("Could not send confirmation email", emailErr);
      }

      setSubmitted(true);
      toast({
        title: "Demande enregistrée",
        description: "Nous traiterons votre demande de suppression sous 30 jours.",
      });

    } catch (err) {
      console.error("Deletion request error:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Veuillez nous contacter à dpo@cleavenir.com.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/50 backdrop-blur-sm shadow-sm">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Demande Reçue</h3>
            <p className="text-green-800 mt-2">
              Votre demande de suppression a été enregistrée avec succès. <br/>
              Référence : <span className="font-mono font-bold">{referenceId}</span>
            </p>
            <p className="text-sm text-green-700 mt-4 max-w-md mx-auto">
              Conformément au RGPD, vos données seront intégralement supprimées dans un délai de 30 jours.
              Vous recevrez une confirmation finale par email une fois l'opération terminée.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-100 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="h-1 w-full bg-red-500" />
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5" />
          Suppression du compte
        </CardTitle>
        <CardDescription>
          Exercer votre droit à l'oubli (Art. 17 RGPD). Cette action est irréversible.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deletion-reason">Pourquoi souhaitez-vous supprimer votre compte ? (Optionnel)</Label>
            <Textarea
              id="deletion-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vos retours nous aident à améliorer nos services..."
              className="bg-white resize-none h-24"
            />
          </div>
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100 transition-colors hover:bg-red-100/50">
            <Checkbox 
              id="confirm-delete" 
              checked={confirmed}
              onCheckedChange={setConfirmed}
              className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <Label htmlFor="confirm-delete" className="text-sm font-medium text-red-900 cursor-pointer leading-tight">
              Je comprends que cette action est permanente. Je perdrai l'accès à mon compte, mon historique de tests, mes candidatures et toutes mes données personnelles.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            variant="destructive" 
            disabled={!confirmed || loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Demander la suppression définitive
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DataDeletionRequest;