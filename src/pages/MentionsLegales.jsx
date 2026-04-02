import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { EmailService } from '@/services/emailService';
import { useToast } from '@/components/ui/use-toast';

export default function MentionsLegales() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await EmailService.sendEmail({
        to: 'contact@cleavenir.com',
        from: formData.email,
        subject: `Mentions Légales - ${formData.subject}`,
        name: formData.name,
        message: formData.message
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast({ title: "Message envoyé", description: "Votre message légal a bien été transmis." });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Erreur envoi:', error);
      setSubmitStatus('error');
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">⚖️ Mentions Légales</h1>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Éditeur du site</h2>
            <p className="text-slate-600 mb-2">
              <strong>Nom:</strong> CléAvenir
            </p>
            <p className="text-slate-600 mb-2">
              <strong>Email:</strong> contact@cleavenir.com
            </p>
            <p className="text-slate-600 mb-2">
              <strong>Adresse:</strong> Paris, France
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Hébergement</h2>
            <p className="text-slate-600">
              Ce site est hébergé par Hostinger, un fournisseur de services d'hébergement web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-slate-600">
              Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété 
              exclusive de CléAvenir ou de ses partenaires. Toute reproduction sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Responsabilité</h2>
            <p className="text-slate-600">
              CléAvenir s'efforce de fournir des informations exactes et à jour. Cependant, nous ne 
              pouvons pas garantir l'exactitude complète de tous les contenus. L'utilisation du site 
              se fait à vos risques et périls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Liens externes</h2>
            <p className="text-slate-600">
              Ce site peut contenir des liens vers des sites externes. CléAvenir n'est pas responsable 
              du contenu de ces sites externes.
            </p>
          </section>
        </div>

        {/* Formulaire Contact */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Nous contacter</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">✅ Message envoyé avec succès!</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold">❌ Erreur lors de l'envoi. Veuillez réessayer.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:border-purple-600 focus:outline-none transition"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:border-purple-600 focus:outline-none transition"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Sujet
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:border-purple-600 focus:outline-none transition"
                placeholder="Sujet de votre message"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2 focus:border-purple-600 focus:outline-none transition resize-none"
                placeholder="Votre message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}