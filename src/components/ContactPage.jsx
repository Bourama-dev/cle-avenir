import React, { useState } from 'react';
import { Mail, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { EmailService } from '@/services/emailService';

const ContactPage = ({ onNavigate }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await EmailService.sendEmail({
        to: 'contact@cleavenir.com',
        from: formData.email,
        subject: `Contact Form - ${formData.subject}`,
        name: formData.name,
        message: formData.message
      });
      toast({ title: "Message envoyé !", description: "Nous vous répondrons sous 24h." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer le message." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SEOHead title="Contactez-nous - CléAvenir" description="Besoin d'aide ? Notre équipe est à votre écoute pour toute question sur votre orientation." />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Parlons de votre avenir.</h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Une question sur nos tests ? Besoin d'un partenariat ? Ou simplement envie de dire bonjour ?
                Notre équipe est là pour vous répondre.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
               <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Mail className="w-6 h-6"/></div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">Email</h3>
                     <p className="text-slate-500 mb-1">Notre équipe répond généralement en moins de 24h.</p>
                     <a href="mailto:contact@cleavenir.com" className="text-primary font-semibold hover:underline">contact@cleavenir.com</a>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><MapPin className="w-6 h-6"/></div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">Bureaux</h3>
                     <p className="text-slate-500">
                        123 Avenue des Champs-Élysées<br/>
                        75008 Paris, France
                     </p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600"><Clock className="w-6 h-6"/></div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">Horaires</h3>
                     <p className="text-slate-500">
                        Lundi - Vendredi : 9h00 - 18h00<br/>
                        Samedi : 10h00 - 14h00
                     </p>
                  </div>
               </div>
            </div>

             {/* FAQ Link */}
             <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
                <div>
                   <h3 className="font-bold mb-1">Une question fréquente ?</h3>
                   <p className="text-slate-400 text-sm">La réponse s'y trouve peut-être déjà.</p>
                </div>
                <Button onClick={() => onNavigate('/faq')} variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                   Consulter la FAQ
                </Button>
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100">
             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary"/> Envoyez-nous un message
             </h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nom complet</label>
                      <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Jean Dupont" className="bg-slate-50 h-12"/>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="jean@exemple.com" className="bg-slate-50 h-12"/>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Sujet</label>
                   <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder="Demande d'information..." className="bg-slate-50 h-12"/>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Message</label>
                   <Textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Comment pouvons-nous vous aider ?" className="bg-slate-50 min-h-[150px] resize-none"/>
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
                   {isSubmitting ? "Envoi..." : "Envoyer le message"} <Send className="ml-2 w-4 h-4"/>
                </Button>
                
                <p className="text-xs text-slate-400 text-center mt-4">
                   En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
                </p>
             </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;