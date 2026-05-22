import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';

const ParentalConsentPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState(null); // 'approved' | 'rejected'
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('parental_consent_requests')
          .select('*, profiles(first_name, last_name)')
          .eq('token', token)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Lien invalide ou expiré.');

        // Already processed
        if (data.status !== 'pending') setDecision(data.status);
        setRequest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [token]);

  const handleDecision = async (choice) => {
    setProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from('parental_consent_requests')
        .update({ status: choice, decided_at: new Date().toISOString() })
        .eq('token', token);

      if (updateError) throw updateError;

      await supabase
        .from('profiles')
        .update({ parental_consent_status: choice })
        .eq('id', request.user_id);

      setDecision(choice);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Lien invalide</h2>
          <p className="text-slate-600">{error}</p>
          <p className="text-sm text-slate-400">
            Pour toute aide : <a href="mailto:dpo@cleavenir.com" className="text-indigo-600">dpo@cleavenir.com</a>
          </p>
        </div>
      </div>
    );
  }

  const childName = request?.profiles?.first_name
    ? `${request.profiles.first_name} ${request.profiles.last_name || ''}`.trim()
    : 'votre enfant';

  if (decision === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Autorisation accordée</h2>
          <p className="text-slate-600 leading-relaxed">
            Vous avez approuvé la création du compte de <strong>{childName}</strong>.
            Il peut maintenant accéder à CléAvenir.
          </p>
          <p className="text-xs text-slate-400">
            Vous pouvez demander la suppression des données à tout moment :{' '}
            <a href="mailto:dpo@cleavenir.com" className="text-indigo-600">dpo@cleavenir.com</a>
          </p>
        </div>
      </div>
    );
  }

  if (decision === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Autorisation refusée</h2>
          <p className="text-slate-600 leading-relaxed">
            Le compte de <strong>{childName}</strong> a été suspendu conformément à votre décision.
            Aucune donnée ne sera conservée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 px-8 py-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">Autorisation parentale — RGPD Art. 8</span>
          </div>
          <h1 className="text-2xl font-bold">Demande d'autorisation</h1>
          <p className="text-indigo-200 text-sm mt-1">CléAvenir — Orientation professionnelle</p>
        </div>

        <div className="p-8 space-y-6">

          {/* Child info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-1">
            <p className="text-sm text-slate-500">Demandeur</p>
            <p className="font-bold text-slate-900 text-lg">{childName}</p>
            <p className="text-sm text-slate-500">souhaite créer un compte sur CléAvenir</p>
          </div>

          {/* What is CléAvenir */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900">Qu'est-ce que CléAvenir ?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              CléAvenir est une plateforme d'orientation professionnelle qui aide les jeunes
              à découvrir les métiers, formations et opportunités adaptés à leur profil.
              Aucune publicité, aucune revente de données.
            </p>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900">Données traitées</h3>
            <ul className="text-sm text-slate-600 space-y-1.5">
              {[
                'Prénom, nom, date de naissance',
                'Région et ville',
                "Niveau d'études et intérêts",
                "Résultats du test d'orientation",
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              Ces données ne sont jamais vendues. Vous pouvez demander leur suppression à tout
              moment :{' '}
              <a href="mailto:dpo@cleavenir.com" className="text-indigo-600">dpo@cleavenir.com</a>
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => handleDecision('rejected')}
              disabled={processing}
              className="border-red-200 text-red-600 hover:bg-red-50 h-12"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Je refuse
            </Button>
            <Button
              onClick={() => handleDecision('approved')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white h-12"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              J'approuve
            </Button>
          </div>

          <p className="text-xs text-center text-slate-400 leading-relaxed">
            En approuvant, vous confirmez être le parent ou tuteur légal de {childName} et
            consentez au traitement de ses données.{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentalConsentPage;
