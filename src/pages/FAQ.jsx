import React, { useState } from 'react';
import { ChevronDown, Send, HelpCircle, Search, BookOpen, User, CreditCard, Briefcase, Settings } from 'lucide-react';
import { EmailService } from '@/services/emailService';
import { useToast } from '@/components/ui/use-toast';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normalizedIncludes } from '@/utils/stringUtils';

export default function FAQ() {
  const { toast } = useToast();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const faqSEO = categoryPageSEO({
    title: "FAQ - Questions Fréquemment Posées | CléAvenir",
    description: "Trouvez les réponses à vos questions sur CléAvenir, les tests d'orientation, les formations et l'emploi.",
    keywords: "FAQ, questions, orientation, formations, emploi, CléAvenir",
    category: "FAQ",
    categoryPath: "/faq"
  });

  const faqCategories = {
    general: {
      label: "Général",
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      items: [
        {
          question: "Qu'est-ce que CléAvenir ?",
          answer: "CléAvenir est une plateforme d'orientation professionnelle nouvelle génération qui utilise l'intelligence artificielle pour vous aider à trouver la voie qui vous correspond vraiment. Nous combinons tests de personnalité, analyse de marché et offres de formation pour vous offrir un parcours personnalisé."
        },
        {
          question: "Comment fonctionne l'IA de CléAvenir ?",
          answer: "Notre IA analyse vos réponses aux tests (intérêts, personnalité, compétences) et les compare à une base de données de milliers de profils professionnels réussis et aux tendances actuelles du marché du travail pour vous suggérer des carrières pertinentes."
        },
        {
          question: "La plateforme est-elle adaptée aux étudiants ?",
          answer: "Absolument. CléAvenir est conçu pour aider les lycéens et étudiants à choisir leur orientation, mais aussi les adultes en reconversion professionnelle ou les demandeurs d'emploi."
        }
      ]
    },
    tests: {
      label: "Tests & Orientation",
      icon: <User className="w-4 h-4 mr-2" />,
      items: [
        {
          question: "Combien de temps dure le test d'orientation ?",
          answer: "Le test principal prend environ 15 à 20 minutes. Il est conçu pour être complet tout en restant rapide à passer. Vous n'avez pas besoin de le préparer à l'avance."
        },
        {
          question: "Puis-je refaire le test plusieurs fois ?",
          answer: "Oui, vous pouvez repasser le test si vous estimez que votre situation ou vos envies ont changé. Vos anciens résultats sont conservés dans votre historique pour vous permettre de comparer l'évolution de votre profil."
        },
        {
          question: "Les résultats sont-ils fiables ?",
          answer: "Nos algorithmes sont basés sur des modèles psychométriques reconnus (comme le RIASEC et le Big Five) et enrichis par des données réelles du marché de l'emploi. Bien qu'aucun test ne soit infaillible, nos utilisateurs rapportent un taux de satisfaction de plus de 90% sur la pertinence des suggestions."
        }
      ]
    },
    jobs: {
      label: "Emploi & Formation",
      icon: <Briefcase className="w-4 h-4 mr-2" />,
      items: [
        {
          question: "Les offres d'emploi sont-elles mises à jour ?",
          answer: "Oui, nous actualisons notre base d'offres d'emploi quotidiennement grâce à nos connexions avec France Travail et d'autres partenaires majeurs du recrutement."
        },
        {
          question: "Comment trouver une formation adaptée ?",
          answer: "Une fois votre métier cible identifié, notre moteur de recherche vous propose automatiquement les formations correspondantes (diplômantes, certifiantes, alternance) disponibles près de chez vous ou à distance, éligibles au CPF."
        },
        {
          question: "Proposez-vous des offres d'alternance ?",
          answer: "Tout à fait. Nous avons une section dédiée à la recherche d'alternances et de contrats de professionnalisation, particulièrement utile pour les étudiants."
        }
      ]
    },
    account: {
      label: "Compte & Tarifs",
      icon: <CreditCard className="w-4 h-4 mr-2" />,
      items: [
        {
          question: "Est-ce que CléAvenir est gratuit ?",
          answer: "L'inscription, la passation du test initial et la consultation des résultats de base sont 100% gratuits. Nous proposons des formules Premium pour accéder à des analyses détaillées, au coach IA illimité et à des plans d'action personnalisés."
        },
        {
          question: "Comment supprimer mon compte ?",
          answer: "Vous pouvez supprimer votre compte et toutes vos données personnelles à tout moment depuis les paramètres de votre profil. La suppression est immédiate et irréversible, conformément au RGPD."
        },
        {
          question: "Acceptez-vous le CPF pour le paiement ?",
          answer: "Pour le moment, l'abonnement à la plateforme n'est pas éligible au CPF. Cependant, les formations que vous trouverez via notre moteur de recherche le sont très souvent."
        }
      ]
    },
    support: {
      label: "Support Technique",
      icon: <Settings className="w-4 h-4 mr-2" />,
      items: [
        {
          question: "J'ai oublié mon mot de passe",
          answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec un lien sécurisé pour en créer un nouveau."
        },
        {
          question: "Le site ne s'affiche pas correctement",
          answer: "Essayez de vider le cache de votre navigateur ou d'utiliser un autre navigateur (Chrome, Firefox, Safari). Si le problème persiste, contactez notre support via le formulaire ci-dessous."
        }
      ]
    }
  };

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
        subject: `FAQ - ${formData.subject}`,
        name: formData.name,
        message: formData.message
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast({ title: "Question envoyée", description: "Nous vous répondrons dès que possible." });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Erreur envoi:', error);
      setSubmitStatus('error');
      toast({ title: "Erreur", description: "Impossible d'envoyer la question.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten FAQs for search
  const allFaqs = Object.values(faqCategories).flatMap(cat => cat.items);
  
  const filteredFaqs = searchTerm
    ? allFaqs.filter(item =>
        normalizedIncludes(item.question, searchTerm) ||
        normalizedIncludes(item.answer, searchTerm)
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PageHelmet {...faqSEO} />
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Comment pouvons-nous vous aider ?</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Parcourez nos questions fréquentes ou contactez notre équipe support.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Rechercher une question..." 
              className="pl-12 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Search Results Mode */}
        {searchTerm ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Résultats de recherche ({filteredFaqs.length})</h2>
            {filteredFaqs.length > 0 ? (
              <div className="grid gap-4">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">Aucun résultat trouvé pour "{searchTerm}".</p>
                <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2">Voir toutes les catégories</Button>
              </div>
            )}
          </div>
        ) : (
          /* Categories Mode */
          <div className="mb-16">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 bg-transparent p-0 mb-8">
                {Object.entries(faqCategories).map(([key, category]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm hover:bg-slate-50 transition-all"
                  >
                    {category.icon}
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(faqCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="space-y-4 animate-in fade-in-50 duration-300">
                   {category.items.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === `${key}-${idx}` ? null : `${key}-${idx}`)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="text-lg font-semibold text-slate-900 pr-8">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-primary transition-transform duration-200 flex-shrink-0 ${
                            openFAQ === `${key}-${idx}` ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {openFAQ === `${key}-${idx}` && (
                        <div className="px-6 pb-6 pt-0">
                          <div className="h-px w-full bg-slate-100 mb-4"></div>
                          <p className="text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Contact Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Vous ne trouvez pas votre réponse ?</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Notre équipe est là pour vous aider. Envoyez-nous votre question et nous vous répondrons sous 24h ouvrées.
                </p>
                <div className="space-y-4 text-sm text-slate-500">
                  <p>📧 contact@cleavenir.com</p>
                  <p>📍 Paris, France</p>
                </div>
              </div>

              <div className="md:w-2/3">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      ✅ Message envoyé avec succès ! Nous vous répondrons très vite.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <p className="text-red-700 font-semibold">
                      ❌ Erreur lors de l'envoi. Veuillez réessayer.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nom complet</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Sujet</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="De quoi s'agit-il ?"
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-all resize-none"
                      placeholder="Décrivez votre question en détail..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">Envoi en cours...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Envoyer le message</span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}