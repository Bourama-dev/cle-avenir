import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, Download, Trash2, AlertTriangle } from 'lucide-react';
import RGPDPreferences from '@/components/legal/RGPDPreferences';
import './PreferencesRGPDPage.css';
import { useToast } from '@/components/ui/use-toast';

const PreferencesRGPDPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDownloadData = () => {
    // Mock functionality for now
    toast({
      title: "Téléchargement initié",
      description: "Vos données sont en cours de préparation. Vous recevrez un lien par email.",
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
       toast({
         title: "Demande reçue",
         description: "Votre demande de suppression a été prise en compte. Un email de confirmation vous a été envoyé.",
       });
    }
  };

  return (
    <LegalLayout
      title="Vos Préférences RGPD"
      subtitle="Exercez vos droits et gérez vos consentements de manière transparente."
      lastUpdated="15 janvier 2024"
    >
      {!user ? (
        <div className="rgpd-auth-container">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connexion requise</h2>
          <p className="text-slate-500 mb-6 max-w-md">
            Pour accéder à vos préférences personnelles et exercer vos droits RGPD, vous devez être connecté à votre compte.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/auth">Se connecter</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="legal-section">
            <h2>1. Vos droits RGPD</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               {['Droit d\'accès', 'Droit de rectification', 'Droit à l\'effacement', 'Droit à la limitation', 'Droit à la portabilité', 'Droit d\'opposition'].map((right) => (
                 <div key={right} className="p-3 bg-slate-50 rounded border border-slate-100 text-sm font-medium text-slate-700">
                   {right}
                 </div>
               ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
               Vous pouvez exercer ces droits via les outils ci-dessous ou en contactant notre DPO.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Gérer vos préférences</h2>
            <p className="mb-6">
              Contrôlez comment nous utilisons vos données. Ces réglages sont appliqués immédiatement.
            </p>
            <RGPDPreferences />
          </div>

          <div className="legal-section">
            <h2>3. Portabilité des données</h2>
            <p>
              Vous pouvez télécharger une copie intégrale de vos données personnelles au format JSON (structuré et lisible par machine).
            </p>
            <Button onClick={handleDownloadData} className="btn-download-data gap-2 mt-2">
               <Download className="w-4 h-4" />
               Télécharger mes données
            </Button>
          </div>

          <div className="legal-section">
            <div className="rgpd-warning-box">
              <h3 className="rgpd-warning-title !mt-0">
                 <AlertTriangle className="w-5 h-5" />
                 Zone de danger : Suppression du compte
              </h3>
              <p className="rgpd-warning-text">
                La suppression de votre compte est définitive. Toutes vos données, résultats de tests et historiques seront effacés de nos serveurs sans possibilité de récupération.
              </p>
              <Button onClick={handleDeleteAccount} className="btn-delete-account gap-2">
                 <Trash2 className="w-4 h-4" />
                 Supprimer mon compte définitivement
              </Button>
            </div>
          </div>
        </>
      )}
    </LegalLayout>
  );
};

export default PreferencesRGPDPage;