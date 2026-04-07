import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, Download, Trash2, Mail, AlertTriangle } from 'lucide-react';
import RGPDPreferences from '@/components/legal/RGPDPreferences';

const PreferencesRGPDPage = () => {
  const { user } = useAuth();

  return (
    <LegalLayout
      title="Préférences RGPD"
      subtitle="Gérez vos données personnelles et exercez vos droits conformément au RGPD."
      lastUpdated="8 avril 2026"
    >
      {user ? (
        <>
          <div className="legal-section">
            <h2>Vos préférences de traitement</h2>
            <RGPDPreferences />
          </div>

          <div className="legal-section">
            <h2>Exercer vos droits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <Download className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">Exporter mes données</h3>
                <p className="text-sm text-slate-500 mb-3">Télécharger une copie de toutes vos données personnelles au format JSON.</p>
                <Link to="/account">
                  <Button variant="outline" size="sm" className="w-full">Accéder à mon compte</Button>
                </Link>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <Lock className="w-6 h-6 text-amber-600 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">Limiter le traitement</h3>
                <p className="text-sm text-slate-500 mb-3">Demander la suspension temporaire du traitement de vos données.</p>
                <a href="mailto:dpo@cleavenir.com?subject=Demande limitation traitement">
                  <Button variant="outline" size="sm" className="w-full">Contacter le DPO</Button>
                </a>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                <Trash2 className="w-6 h-6 text-red-600 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">Supprimer mon compte</h3>
                <p className="text-sm text-slate-500 mb-3">Effacer définitivement votre compte et toutes vos données personnelles.</p>
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">Paramètres du compte</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="legal-section">
            <h2>Contacter notre DPO</h2>
            <p>
              Pour toute question ou demande concernant vos données personnelles, notre Délégué à la Protection des Données est disponible :
            </p>
            <a
              href="mailto:dpo@cleavenir.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium mt-2"
            >
              <Mail className="w-4 h-4" /> dpo@cleavenir.com
            </a>
            <p className="text-sm text-slate-500 mt-3">
              Nous nous engageons à répondre à toute demande dans un délai de <strong>30 jours</strong> conformément au RGPD.
            </p>
          </div>
        </>
      ) : (
        <div className="legal-section">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Connexion requise</h3>
              <p className="text-amber-700 mb-4">
                Vous devez être connecté pour gérer vos préférences RGPD et exercer vos droits sur vos données personnelles.
              </p>
              <div className="flex gap-3">
                <Link to="/login">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Se connecter</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="sm" className="border-amber-300">Créer un compte</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2>Exercer vos droits sans compte</h2>
            <p>
              Même sans compte CléAvenir, vous pouvez exercer vos droits RGPD en contactant directement notre DPO :
            </p>
            <a
              href="mailto:dpo@cleavenir.com?subject=Demande exercice droits RGPD"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium mt-3"
            >
              <Mail className="w-4 h-4" /> dpo@cleavenir.com
            </a>
          </div>
        </div>
      )}
    </LegalLayout>
  );
};

export default PreferencesRGPDPage;
