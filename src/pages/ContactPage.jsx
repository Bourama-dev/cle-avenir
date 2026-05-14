import React, { useState } from 'react';
import PageHelmet from '@/components/SEO/PageHelmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import MagneticButton from '@/components/ui/MagneticButton';

const ContactPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('contacts').insert([formData]);

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        className: "bg-green-50"
      });
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <PageHelmet
        title="Contactez CléAvenir - Support & Questions"
        description="Besoin d'aide ? Contactez l'équipe CléAvenir pour toute question sur l'orientation, nos formations, vos offres d'emploi ou votre compte."
        keywords="contact CléAvenir, support, aide orientation, question offres emploi, question formation, assistance, service client"
        breadcrumbs={[{ name: 'Accueil', url: '/' }, { name: 'Contact', url: '/contact' }]}
      />
      <AnimatedSection>
        <AnimatedItem>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Contactez-nous</h1>
            <p className="text-slate-600">
              Une question ? Une suggestion ? Notre équipe est à votre écoute.
            </p>
          </div>
        </AnimatedItem>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Info Cards */}
        <AnimatedSection className="md:col-span-1 space-y-4">
          <AnimatedItem>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-500" /> Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-1">Pour tout support :</p>
                <a href="mailto:dpo@cleavenir.com" className="text-rose-600 hover:underline font-medium">dpo@cleavenir.com</a>
                <p className="text-sm text-slate-600 mt-4 mb-1">Partenariats :</p>
                <a href="mailto:contact@cleavenir.com" className="text-rose-600 hover:underline font-medium">contact@cleavenir.com</a>
              </CardContent>
            </Card>
          </AnimatedItem>

          <AnimatedItem>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" /> FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Consultez notre foire aux questions pour des réponses immédiates.
                </p>
                <Button variant="outline" className="w-full text-xs" onClick={() => window.location.href='/faq'}>
                  Voir la FAQ
                </Button>
              </CardContent>
            </Card>
          </AnimatedItem>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection className="md:col-span-2">
          <AnimatedItem className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Envoyer un message</CardTitle>
                <CardDescription>Remplissez le formulaire ci-dessous.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Sujet</Label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="general">Question générale</option>
                        <option value="support">Support technique</option>
                        <option value="billing">Facturation</option>
                        <option value="partnership">Partenariat</option>
                        <option value="data">Données personnelles</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="min-h-[150px]"
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <MagneticButton className="w-full">
                    <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                      {isLoading ? 'Envoi...' : <><Send className="mr-2 h-4 w-4" /> Envoyer le message</>}
                    </Button>
                  </MagneticButton>
                </form>
              </CardContent>
            </Card>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactPage;
