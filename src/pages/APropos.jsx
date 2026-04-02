import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Heart, Users, Target, ShieldCheck, Lightbulb, Zap, Globe, Clock, Award, ArrowRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/styles/AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const missions = [{
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovation",
    desc: "Nous repoussons les limites de l'orientation grâce à une IA éthique et performante."
  }, {
    icon: <Heart className="w-6 h-6" />,
    title: "Empathie",
    desc: "Chaque parcours est unique. Nous écoutons et comprenons avant de conseiller."
  }, {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Confiance",
    desc: "Vos données sont sacrées. Transparence et sécurité sont nos priorités absolues."
  }, {
    icon: <Target className="w-6 h-6" />,
    title: "Impact",
    desc: "Nous mesurons notre succès au nombre de carrières épanouissantes lancées."
  }, {
    icon: <Globe className="w-6 h-6" />,
    title: "Accessibilité",
    desc: "L'orientation de qualité ne doit pas être un luxe, mais un droit pour tous."
  }, {
    icon: <Users className="w-6 h-6" />,
    title: "Communauté",
    desc: "Ensemble, nous construisons un réseau d'entraide pour l'avenir professionnel."
  }];
  
  const whyChooseUs = [{
    icon: <BrainCircuit className="w-8 h-8 text-indigo-600 mb-4" />,
    title: "IA de Pointe",
    desc: "Notre algorithme Cléo analyse des milliers de points de données pour un matching ultra-précis."
  }, {
    icon: <Award className="w-8 h-8 text-indigo-600 mb-4" />,
    title: "Expertise RH",
    desc: "Développé avec des experts en ressources humaines et des psychologues du travail."
  }, {
    icon: <Clock className="w-8 h-8 text-indigo-600 mb-4" />,
    title: "Support 24/7",
    desc: "Des questions à 2h du matin ? Notre coach IA est toujours là pour vous guider."
  }];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container mx-auto px-4">
          <h1>Réinventer l'Orientation Professionnelle</h1>
          <p>
            Nous utilisons la puissance de l'intelligence artificielle pour permettre à chacun 
            de révéler son potentiel et de trouver sa véritable vocation.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="story-container">
          <div className="story-content">
            <h2>Notre Histoire</h2>
            <p>
              Tout a commencé par un constat simple : l'orientation traditionnelle est souvent dépassée, 
              coûteuse et déconnectée de la réalité du marché du travail actuel.
            </p>
            <p>En 2025, nous avons décidé de changer la donne. En combinant les dernières avancées en intelligence artificielle avec une expertise approfondie en psychologie du travail, nous avons créé CléAvenir.</p>
            <p>Aujourd'hui, nous sommes fiers d'aider des centaines de personnes à naviguer dans leur carrière avec confiance, clarté et ambition.</p>
          </div>
          <div className="story-image">
            <div className="image-placeholder">
              🚀
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="about-founder">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Le Fondateur</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Une vision portée par l'expérience et la passion de l'innovation.
            </p>
          </div>

          <div className="founder-card">
            <div className="founder-sidebar">
              <div className="founder-avatar">
                👨‍💼
              </div>
              <h3 className="text-xl font-bold">Bourama Diarra</h3>
              <p className="text-indigo-200 mt-2">Fondateur & CEO</p>
            </div>
            
            <div className="founder-details">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Expertise & Vision</h3>
              <p className="text-slate-600 leading-relaxed">Passionné par l'intersection entre technologie et développement humain, Bourama a consacré sa carrière à comprendre les mécanismes de la réussite professionnelle.</p>
              
              <div className="founder-grid">
                <div className="detail-item">
                  <h4>Formation</h4>
                  <p>Master Management IA</p>
                </div>
                <div className="detail-item">
                  <h4>Spécialité</h4>
                  <p>Stratégie Digitale</p>
                </div>
                <div className="detail-item">
                  <h4>Vision</h4>
                  <p>Orientation pour tous</p>
                </div>
                <div className="detail-item">
                  <h4>Mission</h4>
                  <p>Débloquer les potentiels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-mission">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Nos Valeurs</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Les principes qui guident chacune de nos actions et décisions.
          </p>

          <div className="mission-grid">
            {missions.map((mission, index) => (
              <div key={index} className="mission-card">
                <div className="mission-icon">
                  {mission.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{mission.title}</h3>
                <p className="text-slate-600">{mission.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Pourquoi CléAvenir ?</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Des avantages concrets pour accélérer votre réussite professionnelle.
          </p>

          <div className="why-grid">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="why-card">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>200+</h3>
            <p>Utilisateurs Guidés</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Fiches Métiers</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Satisfaction Client</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Disponible</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Prêt à trouver votre voie ?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Rejoignez la communauté CléAvenir et commencez dès aujourd'hui à construire 
            la carrière qui vous correspond vraiment.
          </p>
          
          <div className="cta-buttons">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/test-orientation')}>
              Faire le test gratuit <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 px-8 py-6 rounded-full text-lg transition-all" onClick={() => navigate('/contact')}>
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;