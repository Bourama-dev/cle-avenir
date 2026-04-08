import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { paymentHistoryService } from '@/services/paymentHistoryService';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import SubscriptionErrorBoundary from '@/components/SubscriptionErrorBoundary';
import { stripePortalService } from '@/services/stripePortalService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CreditCard, Download, Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';

const ManageSubscriptionContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Use our new safe hook with .maybeSingle() built-in
  const { subscription, loading: subLoading, error: subError, refetch } = useUserSubscription();

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      try {
        const history = await paymentHistoryService.fetchPaymentHistory(user.id);
        setPayments(history || []);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setPaymentsLoading(false);
      }
    };
    fetchPayments();
  }, [user]);

  const handleManagePortal = async () => {
    setPortalLoading(true);
    try {
      await stripePortalService.createPortalSession();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ouvrir le portail de gestion.",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const loading = subLoading || paymentsLoading;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
        <p className="text-slate-500">Chargement de votre abonnement...</p>
      </div>
    );
  }

  if (subError) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur de chargement</h2>
            <p className="text-slate-600 mb-6">{subError}</p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle No Active Subscription state cleanly
  if (!subscription) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
          </Button>

          <h1 className="text-3xl font-bold text-slate-900">Gérer mon abonnement</h1>

          <Card className="border-slate-200 shadow-sm overflow-hidden text-center">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun abonnement actif</h2>
              <p className="text-slate-600 max-w-md mx-auto mb-8">
                Vous utilisez actuellement la version gratuite de CléAvenir. Passez à un plan Premium pour débloquer toutes les fonctionnalités.
              </p>
              <Button onClick={() => navigate('/upgrade-plan')} className="bg-purple-600 hover:bg-purple-700 h-12 px-8 text-lg">
                Voir les offres Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </Button>

        <h1 className="text-3xl font-bold text-slate-900">Gérer mon abonnement</h1>

        {/* Current Plan Card matching visual reference */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
           <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
             <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">PLAN ACTUEL</p>
                <h2 className="text-3xl font-bold">{subscription?.plan_type || 'Plan Découverte'}</h2>
             </div>
             <div className="text-right">
                <div className="text-3xl font-bold">{subscription?.price || 0}€ <span className="text-lg text-slate-400 font-normal">/mois</span></div>
                {subscription?.end_date && <p className="text-slate-400 text-sm">Renouvellement: {new Date(subscription.end_date).toLocaleDateString()}</p>}
             </div>
           </div>
           
           <CardContent className="p-6 grid md:grid-cols-2 gap-8">
              <div>
                 <h3 className="font-semibold text-lg mb-4">Fonctionnalités incluses</h3>
                 <ul className="space-y-3">
                    {['Accès illimité aux tests', 'Export PDF', 'Support prioritaire'].map((feat, i) => (
                       <li key={i} className="flex items-center gap-3 text-slate-600">
                          <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                             <Check className="h-3 w-3" />
                          </div>
                          {feat}
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                 <Button onClick={() => navigate('/upgrade-plan')} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg">
                    Mettre à jour mon plan
                 </Button>
                 {subscription?.plan_type !== 'Free' && (
                    <Button
                       variant="outline"
                       className="w-full border-red-200 text-red-600 hover:bg-red-50"
                       onClick={handleManagePortal}
                       disabled={portalLoading}
                    >
                       {portalLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                       Annuler l'abonnement
                    </Button>
                 )}
              </div>
           </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <CreditCard className="h-5 w-5 text-slate-500" /> Historique des paiements
              </CardTitle>
           </CardHeader>
           <CardContent>
              {payments.length > 0 ? (
                <Table>
                   <TableHeader>
                      <TableRow>
                         <TableHead>Date</TableHead>
                         <TableHead>Montant</TableHead>
                         <TableHead>Statut</TableHead>
                         <TableHead className="text-right">Facture</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {payments.map((payment) => (
                         <TableRow key={payment.id}>
                            <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                            <TableCell>{payment.amount}€</TableCell>
                            <TableCell><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Payé</Badge></TableCell>
                            <TableCell className="text-right">
                               <Button variant="ghost" size="sm" onClick={async () => {
                                  const url = await paymentHistoryService.generateInvoiceUrl(payment.id);
                                  if (url) window.open(url, '_blank');
                                  else toast({ variant: 'destructive', title: 'Facture indisponible', description: 'Impossible de générer la facture pour ce paiement.' });
                               }}>
                                  <Download className="h-4 w-4" />
                               </Button>
                            </TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-slate-500">Aucun historique de paiement disponible.</div>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ManageSubscriptionPage = () => (
  <SubscriptionErrorBoundary>
    <ManageSubscriptionContent />
  </SubscriptionErrorBoundary>
);

export default ManageSubscriptionPage;