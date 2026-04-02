import React, { useState, useRef } from 'react';
import { Send, CheckCircle, Target, DollarSign, Heart } from 'lucide-react';
import { trackEvent } from '@/services/trackingService';
import { useToast } from '@/components/ui/use-toast';

export default function PartnershipPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    organizationName: '',
    website: '',
    email: '',
    partnershipType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { toast } = useToast();
  const sendingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;

    setIsLoading(true);
    setSubmitStatus(null);

    // Validation stricte
    if (!formData.organizationName.trim() || formData.organizationName.length < 2) {
      toast({ title: 'Nom de l\'organisation invalide', description: 'Veuillez entrer un nom complet.' });
      sendingRef.current = false;
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({ title: 'Email invalide', description: 'Veuillez entrer un email valide.' });
      sendingRef.current = false;
      setIsLoading(false);
      return;
    }

    if (formData.partnershipType.trim().length < 3) {
      toast({ title: 'Type de partenariat invalide', description: 'Veuillez sélectionner un type de partenariat valide.' });
      sendingRef.current = false;
      setIsLoading(false);
      return;
    }

    try {
      // Créer l'objet partenariat
      const partnership = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString(),
        type: 'partnership'
      };

      // Sauvegarder dans localStorage
      const existingPartnerships = localStorage.getItem('partnerships');
      const partnerships = existingPartnerships ? JSON.parse(existingPartnerships) : [];

      partnerships.push(partnership);
      localStorage.setItem('partnerships', JSON.stringify(partnerships));

      // Tracking événement "demande de partenariat"
      trackEvent('partnership_request', {
        organizationName: formData.organizationName,
        partnershipType: formData.partnershipType
      });

      // Afficher succès
      setSubmitStatus({
        type: 'success',
        message: 'Votre demande de partenariat a été envoyée avec succès ! Nous vous répondrons bientôt.'
      });

      // Réinitialiser le formulaire
      setFormData({
        organizationName: '',
        website: '',
        email: '',
        partnershipType: ''
      });

      // Masquer après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Erreur envoi partenariat:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.'
      });
    } finally {
      sendingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header removed */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              🤝 Programme Partenaires & Affiliation
            </h1>
            <p className="text-xl text-slate-600">
              Connectez vos formations directement aux jeunes qui cherchent leur voie
            </p>
          </div>

          {/* CTA Principal */}
          <div className="text-center mb-16">
            <button
              onClick={() => document.getElementById('partnership-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold px-8 py-3 rounded-full transition inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Devenir Partenaire
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Avantages */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Pourquoi rejoindre le réseau ?
              </h2>

              <div className="space-y-6">
                {/* Audience */}
                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100">
                      <Target size={24} className="text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Audience Ultra-Qualifiée
                    </h3>
                    <p className="text-slate-600 mt-1">
                      Nos utilisateurs ont passé des tests IA : nous savons exactement ce qu'ils cherchent.
                    </p>
                  </div>
                </div>

                {/* Modèle */}
                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <DollarSign size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Modèle au Résultat
                    </h3>
                    <p className="text-slate-600 mt-1">
                      Payez uniquement pour les leads qualifiés ou les inscriptions (CPA/CPL).
                    </p>
                  </div>
                </div>

                {/* Intégration */}
                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                      <Heart size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Intégration Native
                    </h3>
                    <p className="text-slate-600 mt-1">
                      Vos formations apparaissent naturellement dans les résultats de matching.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div id="partnership-form" className="bg-white rounded-xl shadow-xl p-8 border border-slate-200 h-fit sticky top-24">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Demande de partenariat
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom organisation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Nom de l'organisme
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-pink-600"
                    placeholder="Votre organisme"
                  />
                </div>

                {/* Site web */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-pink-600"
                    placeholder="https://..."
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Contact email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-pink-600"
                    placeholder="contact@organisme.com"
                  />
                </div>

                {/* Type partenariat */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Type de partenariat souhaité
                  </label>
                  <select
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-pink-600"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="affiliation">Affiliation (CPA/CPL)</option>
                    <option value="integration">Intégration directe</option>
                    <option value="white-label">White Label</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {/* Status */}
                {submitStatus && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {submitStatus.type === 'success' && <CheckCircle size={20} />}
                    {submitStatus.message}
                  </div>
                )}

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}