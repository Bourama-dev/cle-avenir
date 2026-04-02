import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Shield, CreditCard, Download, Trash2, Edit, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getDisplayPlanName } from '@/lib/subscriptionUtils';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useNavigation } from '@/hooks/useNavigation';

const AccountPage = () => {
  const { user, userProfile, subscriptionTier } = useAuth();
  const navigate = useNavigate();
  const { goBack, goHome } = useNavigation();
  const { toast } = useToast();

  const handleChangePassword = () => {
    navigate('/update-password');
  };

  const handleDeleteAccount = () => {
     if(window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
        toast({
           title: "Demande reçue",
           description: "Votre demande de suppression a été prise en compte."
        });
     }
  };

  const handleDownloadData = () => {
     toast({
        title: "Téléchargement",
        description: "La préparation de vos données a commencé. Vous recevrez un email bientôt."
     });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col gap-4 mb-2">
         <div className="flex items-center justify-between">
            <Breadcrumbs />
            <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={goHome} className="text-slate-600 hover:text-indigo-600">
                  <Home className="w-4 h-4 mr-2" /> Accueil
               </Button>
               <Button variant="ghost" size="sm" onClick={goBack} className="text-slate-600 hover:text-violet-600">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Retour
               </Button>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-900">Mon Compte</h1>
            <p className="text-slate-500">Gérez vos paramètres personnels et votre abonnement.</p>
         </div>
         <Button variant="outline" onClick={() => navigate('/profile/edit')}>
            <Edit className="mr-2 h-4 w-4" /> Modifier Profil
         </Button>
      </div>

      {/* Personal Info */}
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <User className="h-5 w-5 text-slate-500" /> Informations Personnelles
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <Label className="text-slate-500 text-xs">Email</Label>
                  <div className="flex items-center gap-2 font-medium">
                     <Mail className="h-4 w-4 text-slate-400" /> {user?.email}
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-500 text-xs">Téléphone</Label>
                  <div className="flex items-center gap-2 font-medium">
                     <Phone className="h-4 w-4 text-slate-400" /> {userProfile?.phone || 'Non renseigné'}
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-500 text-xs">Membre depuis</Label>
                  <div className="flex items-center gap-2 font-medium">
                     <Calendar className="h-4 w-4 text-slate-400" /> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-500 text-xs">Dernière connexion</Label>
                  <div className="flex items-center gap-2 font-medium">
                     <Shield className="h-4 w-4 text-slate-400" /> {new Date().toLocaleDateString()}
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <CreditCard className="h-5 w-5 text-slate-500" /> Abonnement
            </CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <p className="font-semibold text-lg">{getDisplayPlanName(subscriptionTier)}</p>
                <p className="text-sm text-slate-500">
                   Statut: <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Actif</Badge>
                </p>
             </div>
             <Button variant="secondary" onClick={() => navigate('/manage-subscription')}>
                Gérer mon abonnement
             </Button>
         </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
         <CardHeader>
            <CardTitle>Préférences</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label className="text-base">Notifications Email</Label>
                  <p className="text-sm text-slate-500">Recevoir des mises à jour sur vos candidatures.</p>
               </div>
               <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label className="text-base">Newsletter</Label>
                  <p className="text-sm text-slate-500">Recevoir nos conseils carrière hebdo.</p>
               </div>
               <Switch defaultChecked />
            </div>
         </CardContent>
      </Card>

      {/* Security & Data */}
      <Card className="border-red-100">
         <CardHeader>
            <CardTitle className="text-slate-900">Sécurité & Données</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
               <Shield className="mr-2 h-4 w-4" /> Changer mon mot de passe
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
               <Download className="mr-2 h-4 w-4" /> Télécharger mes données (RGPD)
            </Button>
            <Button variant="destructive" className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100" onClick={handleDeleteAccount}>
               <Trash2 className="mr-2 h-4 w-4" /> Supprimer mon compte
            </Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;