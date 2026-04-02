import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, User, Mail, Calendar, ExternalLink } from 'lucide-react';

/**
 * AccountPage Component
 * Displays user profile information and provides admin access if applicable.
 */
const AccountPage = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const { navigateToAdmin } = useAdminNavigation();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mon Compte</h1>
      </div>
      
      {/* Admin Access Section */}
      {isAdmin && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
               <CardTitle className="text-purple-900 flex items-center gap-2">
                 <ShieldCheck className="h-5 w-5" />
                 Espace Administrateur
               </CardTitle>
               <CardDescription className="text-purple-700">
                 Vous avez des privilèges d'administrateur sur cette plateforme.
               </CardDescription>
            </div>
            <Button 
               onClick={navigateToAdmin}
               className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            >
               Accéder au portail <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      )}

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />
            Informations Personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Prénom</label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-900">
                   {userProfile?.first_name || 'Non renseigné'}
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Nom</label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-900">
                   {userProfile?.last_name || 'Non renseigné'}
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                   <Mail className="h-3 w-3" /> Email
                </label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-900">
                   {user.email}
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                   <Calendar className="h-3 w-3" /> Membre depuis
                </label>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-900">
                   {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;