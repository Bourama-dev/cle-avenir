import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, FileText, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Components
import FAQHero from '@/components/faq/FAQHero';
import FAQSearch from '@/components/faq/FAQSearch';
import FAQCategories from '@/components/faq/FAQCategories';
import FAQAccordion from '@/components/faq/FAQAccordion';

// Styles
import './FAQPage.css';

// FAQ Data
const faqData = [
  // General
  { id: 1, category: 'general', question: "Qu'est-ce que CléAvenir ?", answer: "CléAvenir est une plateforme d'orientation professionnelle nouvelle génération. Nous utilisons l'intelligence artificielle et les données du marché du travail en temps réel pour vous aider à trouver les métiers et formations qui vous correspondent vraiment." },
  { id: 2, category: 'general', question: "À qui s'adresse CléAvenir ?", answer: "CléAvenir s'adresse à tous : lycéens cherchant leur voie, étudiants en réorientation, professionnels en reconversion, ou demandeurs d'emploi souhaitant rebondir vers des secteurs porteurs." },
  { id: 3, category: 'general', question: "Est-ce que le service est gratuit ?", answer: "Oui, la première analyse et la découverte de vos 5 métiers principaux sont entièrement gratuites. Nous proposons également des offres Premium pour un accompagnement plus poussé." },
  { id: 4, category: 'general', question: "Comment fonctionne l'algorithme ?", answer: "Notre algorithme croise votre profil psychométrique (intérêts, personnalité) avec une base de données de 11 000 métiers et les réalités économiques actuelles (offres d'emploi, salaires)." },
  { id: 5, category: 'general', question: "Puis-je utiliser CléAvenir sur mobile ?", answer: "Absolument. Notre plateforme est entièrement responsive et optimisée pour une utilisation sur smartphone, tablette et ordinateur." },
  { id: 6, category: 'general', question: "Avez-vous une application mobile ?", answer: "Pas pour le moment, mais notre site web fonctionne comme une application sur votre navigateur mobile. Vous pouvez l'ajouter à votre écran d'accueil." },
  { id: 7, category: 'general', question: "Comment contacter le support ?", answer: "Vous pouvez nous contacter via le formulaire de contact, par email à support@cleavenir.com, ou via le chat en direct disponible sur votre tableau de bord." },
  { id: 8, category: 'general', question: "Proposez-vous des partenariats ?", answer: "Oui, nous collaborons avec des écoles, des organismes de formation et des entreprises. Consultez notre page Partenaires pour en savoir plus." },

  // Test
  { id: 9, category: 'test', question: "Combien de temps dure le test ?", answer: "Grâce à notre technologie adaptative, le test dure en moyenne entre 7 et 10 minutes. Il va droit à l'essentiel en s'adaptant à vos réponses." },
  { id: 10, category: 'test', question: "Puis-je interrompre le test et le reprendre plus tard ?", answer: "Oui, vos progrès sont sauvegardés automatiquement si vous avez créé un compte. Vous pourrez reprendre exactement là où vous vous êtes arrêté." },
  { id: 11, category: 'test', question: "Sur quel modèle psychologique est basé le test ?", answer: "Nous utilisons principalement le modèle RIASEC (Holland Codes) enrichi par l'analyse des soft skills et des Big Five pour une précision maximale." },
  { id: 12, category: 'test', question: "Faut-il se préparer avant le test ?", answer: "Non, aucune préparation n'est nécessaire. Répondez simplement de manière spontanée et honnête. Il n'y a pas de bonnes ou de mauvaises réponses." },
  { id: 13, category: 'test', question: "Puis-je refaire le test ?", answer: "Oui, vous pouvez repasser le test. Cependant, nous recommandons d'attendre quelques mois entre deux tests car votre personnalité profonde change peu sur le court terme." },
  { id: 14, category: 'test', question: "Le test est-il adapté aux personnes en situation de handicap ?", answer: "Nous nous efforçons de rendre notre plateforme accessible (normes WCAG). Le test est textuel et compatible avec les lecteurs d'écran." },
  { id: 15, category: 'test', question: "Pourquoi me demande-t-on mon âge ?", answer: "L'âge nous permet de contextualiser les résultats (formation initiale vs continue, reconversion, etc.) et de proposer des pistes adaptées à votre étape de vie." },

  // Results
  { id: 16, category: 'results', question: "Mes résultats sont-ils fiables ?", answer: "Nos résultats sont basés sur des méthodes psychométriques éprouvées et des données marché réelles. Ils offrent une excellente base de réflexion, validée par des milliers d'utilisateurs." },
  { id: 17, category: 'results', question: "Je ne suis pas d'accord avec mes résultats, que faire ?", answer: "C'est possible ! Le test est un outil d'aide à la décision. Discutez-en avec Cléo, notre coach IA, pour affiner les suggestions ou explorer d'autres pistes." },
  { id: 18, category: 'results', question: "Comment accéder à mes résultats passés ?", answer: "Tous vos résultats sont archivés dans votre espace personnel, rubrique 'Mes résultats'. Vous pouvez les consulter et les comparer à tout moment." },
  { id: 19, category: 'results', question: "Puis-je télécharger mes résultats ?", answer: "Oui, vous pouvez télécharger une synthèse complète de votre profil et de vos pistes métiers au format PDF depuis votre tableau de bord." },
  { id: 20, category: 'results', question: "Les salaires indiqués sont-ils bruts ou nets ?", answer: "Sauf mention contraire, les salaires affichés sont des salaires bruts annuels moyens, basés sur les données du marché français." },
  { id: 21, category: 'results', question: "Comment sont sélectionnées les formations suggérées ?", answer: "Nous vous proposons les formations les plus pertinentes en fonction du métier visé, de votre niveau d'études actuel et de votre localisation géographique." },

  // Account
  { id: 22, category: 'account', question: "Comment créer un compte ?", answer: "Cliquez sur 'S'inscrire' en haut à droite. Vous pouvez utiliser votre email ou vous connecter via Google pour gagner du temps." },
  { id: 23, category: 'account', question: "J'ai oublié mon mot de passe", answer: "Pas de panique. Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un lien par email pour le réinitialiser." },
  { id: 24, category: 'account', question: "Comment modifier mes informations personnelles ?", answer: "Rendez-vous dans la rubrique 'Profil' de votre espace personnel pour modifier votre nom, email, ou niveau d'études." },
  { id: 25, category: 'account', question: "Comment supprimer mon compte ?", answer: "Vous pouvez demander la suppression de votre compte et de toutes vos données depuis les paramètres de votre profil, conformément au RGPD." },
  { id: 26, category: 'account', question: "Puis-je avoir plusieurs profils ?", answer: "Un compte est lié à une personne physique unique. Si vous êtes un professionnel accompagnant plusieurs personnes, contactez-nous pour une offre Pro." },
  { id: 27, category: 'account', question: "Mes données sont-elles publiques ?", answer: "Non, votre profil est strictement privé par défaut. Vous seul décidez si vous souhaitez le partager avec des écoles ou des recruteurs." },
  { id: 28, category: 'account', question: "Je ne reçois pas vos emails", answer: "Vérifiez votre dossier spam. Si le problème persiste, ajoutez contact@cleavenir.com à votre carnet d'adresses ou contactez le support." },
  { id: 29, category: 'account', question: "Comment changer mon adresse email ?", answer: "Cette fonctionnalité est disponible dans les paramètres de votre compte. Une validation sera envoyée à votre nouvelle adresse." },

  // Pricing
  { id: 30, category: 'pricing', question: "Quels sont les moyens de paiement acceptés ?", answer: "Nous acceptons les cartes bancaires (Visa, Mastercard) via notre partenaire sécurisé Stripe." },
  { id: 31, category: 'pricing', question: "L'abonnement est-il avec engagement ?", answer: "Nos offres sont sans engagement de durée. Vous pouvez résilier votre abonnement mensuel à tout moment depuis votre compte." },
  { id: 32, category: 'pricing', question: "Comment obtenir une facture ?", answer: "Vos factures sont disponibles et téléchargeables dans la rubrique 'Abonnement' de votre espace personnel." },
  { id: 33, category: 'pricing', question: "Proposez-vous un remboursement ?", answer: "Nous offrons une garantie 'satisfait ou remboursé' de 14 jours pour toute première souscription à une offre Premium." },
  { id: 34, category: 'pricing', question: "Y a-t-il des tarifs étudiants ?", answer: "Notre offre de base est gratuite et couvre 80% des besoins. L'offre Premium est déjà calculée au plus juste pour rester accessible." },

  // Security
  { id: 35, category: 'security', question: "Mes données sont-elles sécurisées ?", answer: "Oui, nous utilisons le chiffrement SSL/TLS pour toutes les communications. Vos données sont stockées sur des serveurs sécurisés en Europe." },
  { id: 36, category: 'security', question: "Revendez-vous mes données ?", answer: "Jamais. Nous ne vendons pas vos données personnelles à des tiers. Notre modèle économique repose sur nos services Premium, pas sur vos données." },
  { id: 37, category: 'security', question: "Êtes-vous conformes au RGPD ?", answer: "Oui, nous respectons scrupuleusement le Règlement Général sur la Protection des Données. Vous gardez le contrôle total sur vos informations." },
  { id: 38, category: 'security', question: "Comment gérer mes cookies ?", answer: "Vous pouvez modifier vos préférences de cookies à tout moment via le lien 'Gestion des cookies' en bas de page." },
  { id: 39, category: 'security', question: "Qui a accès à mes résultats ?", answer: "Seulement vous et les services techniques de CléAvenir (pour la maintenance). Personne d'autre ne peut voir vos résultats sans votre accord." }
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  // Filter Logic
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by Category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(lowerTerm) || 
        item.answer.toLowerCase().includes(lowerTerm)
      );
    }

    return filtered;
  }, [searchTerm, activeCategory]);

  return (
    <div className="faq-page-container">
      <Helmet>
        <title>Centre d'aide & FAQ - CléAvenir</title>
        <meta name="description" content="Trouvez des réponses à vos questions sur l'orientation, le test CléAvenir, la gestion de compte et nos services." />
      </Helmet>

      <FAQHero />
      
      <FAQSearch 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
      />

      <div className="container mx-auto px-4 mt-8">
        <FAQCategories 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeCategory === 'all' 
              ? 'Toutes les questions' 
              : `Questions : ${faqData.find(d => d.category === activeCategory)?.category === 'pricing' ? 'Tarifs' : 
                 faqData.find(d => d.category === activeCategory)?.category === 'test' ? 'Le Test' :
                 faqData.find(d => d.category === activeCategory)?.category === 'results' ? 'Résultats' :
                 faqData.find(d => d.category === activeCategory)?.category === 'account' ? 'Mon Compte' :
                 faqData.find(d => d.category === activeCategory)?.category === 'security' ? 'Sécurité' : 'Général'
                }`
            }
          </h2>
          <p className="text-slate-500 mt-2">
            {filteredFAQs.length} réponse{filteredFAQs.length > 1 ? 's' : ''} trouvée{filteredFAQs.length > 1 ? 's' : ''}
          </p>
        </div>

        <FAQAccordion items={filteredFAQs} searchTerm={searchTerm} />
      </div>

      {/* Contact Support Section */}
      <section className="faq-contact-section bg-white rounded-3xl my-8">
        <h2 className="faq-section-title">Vous ne trouvez pas votre réponse ?</h2>
        <div className="faq-contact-grid">
          {/* Chat Cléo */}
          <div className="faq-contact-card primary">
            <div className="faq-contact-icon-wrapper">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="faq-contact-title">Demander à Cléo</h3>
            <p className="faq-contact-desc">Notre IA experte en orientation vous répond 24h/24 et 7j/7.</p>
            <Button onClick={() => navigate('/cleo')} className="w-full bg-blue-600 hover:bg-blue-700">Discuter avec Cléo</Button>
          </div>

          {/* Email */}
          <div className="faq-contact-card">
            <div className="faq-contact-icon-wrapper">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="faq-contact-title">Email</h3>
            <p className="faq-contact-desc">Envoyez-nous un message, nous répondons sous 24h ouvrées.</p>
            <Button onClick={() => navigate('/contact')} variant="outline" className="w-full">Formulaire de contact</Button>
          </div>

          {/* Phone (Placeholder style) */}
          <div className="faq-contact-card">
            <div className="faq-contact-icon-wrapper">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="faq-contact-title">Téléphone</h3>
            <p className="faq-contact-desc">Disponible pour les abonnés Premium du lundi au vendredi.</p>
            <Button variant="outline" className="w-full" disabled>Réservé Premium</Button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="faq-related-section">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-800">Articles populaires</h2>
          <div className="faq-related-grid">
            <div className="faq-article-card" onClick={() => navigate('/comment-ca-marche')}>
              <div className="faq-article-icon"><Zap /></div>
              <h3 className="faq-article-title">Bien démarrer</h3>
              <p className="faq-article-desc">Tout ce qu'il faut savoir pour commencer votre bilan d'orientation.</p>
              <span className="faq-article-link">Lire l'article <ArrowRight className="w-4 h-4" /></span>
            </div>

            <div className="faq-article-card" onClick={() => navigate('/test-results')}>
              <div className="faq-article-icon"><FileText /></div>
              <h3 className="faq-article-title">Comprendre vos résultats</h3>
              <p className="faq-article-desc">Comment interpréter votre profil RIASEC et vos suggestions métiers.</p>
              <span className="faq-article-link">Lire l'article <ArrowRight className="w-4 h-4" /></span>
            </div>

            <div className="faq-article-card" onClick={() => navigate('/cleo')}>
              <div className="faq-article-icon"><Sparkles /></div>
              <h3 className="faq-article-title">Utiliser Cléo efficacement</h3>
              <p className="faq-article-desc">Les meilleures questions à poser à votre coach IA pour avancer.</p>
              <span className="faq-article-link">Lire l'article <ArrowRight className="w-4 h-4" /></span>
            </div>

            <div className="faq-article-card" onClick={() => navigate('/politique-confidentialite')}>
              <div className="faq-article-icon"><Shield /></div>
              <h3 className="faq-article-title">Sécurité & Confidentialité</h3>
              <p className="faq-article-desc">Comment nous protégeons vos données personnelles et vos droits.</p>
              <span className="faq-article-link">Lire l'article <ArrowRight className="w-4 h-4" /></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;