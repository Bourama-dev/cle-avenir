import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from '@/components/SEOHead';
import { Play, AlertTriangle, Lightbulb } from 'lucide-react';
const AcquisitionPage = ({
  onNavigate
}) => {
  const arguments_list = [{
    title: "Arrêtez de choisir au hasard",
    text: "L'intuition ne suffit pas. Notre IA analyse 50+ critères pour matcher votre profil avec la réalité du marché."
  }, {
    title: "Gagnez 10 ans de carrière",
    text: "Évitez les mauvaises orientations qui coûtent des années. Visez juste dès le départ."
  }, {
    title: "Le marché a changé, et vous ?",
    text: "Les métiers de 2025 ne sont pas ceux de 2010. CléAvenir est connecté en temps réel aux tendances."
  }, {
    title: "Plus qu'un test, un plan",
    text: "Savoir quoi faire c'est bien. Savoir comment y arriver (formations, financements), c'est mieux."
  }, {
    title: "Accessible à tous",
    text: "L'orientation de luxe réservée à une élite, c'est fini. CléAvenir démocratise le coaching de carrière."
  }];
  const mistakes = ["Choisir un métier uniquement pour le salaire 💸", "Suivre la voie de ses parents par défaut 👨‍👩‍👧", "Ignorer la réalité du marché de l'emploi 📉", "Choisir une formation sans regarder les débouchés 🚫"];
  const faqs = [{
    q: "Est-ce vraiment gratuit ?",
    a: "Oui, le test initial et les premiers résultats sont 100% gratuits. Les options avancées sont payantes."
  }, {
    q: "Combien de temps ça prend ?",
    a: "Le test dure environ 10 minutes. L'analyse est instantanée."
  }, {
    q: "Est-ce adapté aux reconversions ?",
    a: "Absolument. 40% de nos utilisateurs sont des adultes en transition professionnelle."
  }, {
    q: "Comment fonctionne l'IA ?",
    a: "Elle croise vos réponses (soft skills, intérêts) avec la base de données ROME et les offres actuelles."
  }, {
    q: "Mes données sont-elles privées ?",
    a: "Oui, nous respectons strictement le RGPD. Vos données ne sont jamais vendues."
  }];
  return <div className="min-h-screen bg-white">
      <SEOHead title="Découvrir CléAvenir - Pourquoi utiliser notre IA ?" description="Comprenez comment CléAvenir révolutionne l'orientation. Arguments, FAQ et vidéo de présentation." />
      {/* Header removed */}

      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Pourquoi vous avez besoin de CléAvenir</h1>
            <p className="text-xl text-slate-300 mb-8">Découvrez la méthode qui a déjà aidé 500+ personnes à trouver leur voie.</p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8" onClick={() => onNavigate('/test')}>
              Lancer mon analyse gratuite
            </Button>
          </div>
        </section>

        {/* Video Arguments Grid */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">5 Raisons de passer à l'action</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arguments_list.map((arg, i) => <motion.div key={i} whileHover={{
            scale: 1.02
          }} className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">{arg.title}</h3>
                <p className="text-slate-600">{arg.text}</p>
              </motion.div>)}
            {/* Fake Video Card */}
            <div className="p-6 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group" onClick={() => alert("Lecture vidéo (Simulation)")}>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary ml-1" />
              </div>
              <h3 className="font-bold text-lg">Voir la démo (1 min)</h3>
            </div>
          </div>
        </section>

        {/* Mistakes */}
        <section className="py-20 bg-red-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-red-900">Les erreurs fatales en orientation</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mistakes.map((m, i) => <div key={i} className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex items-center">
                  <span className="font-medium text-slate-800">{m}</span>
                </div>)}
            </div>
            <div className="mt-8 text-center">
              <p className="text-red-800 mb-4">CléAvenir vous protège de ces pièges grâce à la data.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">Questions Fréquentes</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600">{faq.a}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </section>

        {/* Freemium Popup Simulation (Inline for MVP) */}
        <section className="py-12 bg-blue-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Envie d'essayer sans engagement ?</h2>
            <p className="mb-6 opacity-90">Accédez à l'analyse de base gratuitement. Aucune carte bancaire requise.</p>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('/test')}>C'est parti !</Button>
          </div>
        </section>
      </main>
    </div>;
};
export default AcquisitionPage;