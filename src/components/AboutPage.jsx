import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Rocket, ShieldCheck, Globe, CheckCircle, TrendingUp, Award, BookOpen, Zap, MessageSquare } from 'lucide-react';
import PageHelmet from '@/components/SEO/PageHelmet';
import { categoryPageSEO } from '@/components/SEO/seoPresets';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const AboutPage = ({ onNavigate }) => {
  const [stats, setStats] = useState({ users: null, tests: null, metiers: null, formations: null });

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, testsRes, metiersRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('test_results').select('*', { count: 'exact', head: true }),
        supabase.from('rome_metiers').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        users: usersRes.count ?? 0,
        tests: testsRes.count ?? 0,
        metiers: metiersRes.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const values = [
    { icon: <Heart className="w-6 h-6" />, title: "Empathie", desc: "Nous mettons l'humain au cœur de notre technologie. L'orientation est avant tout une histoire de personnes." },
    { icon: <Target className="w-6 h-6" />, title: "Précision", desc: "Nos algorithmes sont basés sur des données réelles et vérifiées pour offrir des conseils justes et pertinents." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Transparence", desc: "Pas de boite noire. Nous expliquons toujours pourquoi nous vous recommandons un métier ou une formation." },
    { icon: <Globe className="w-6 h-6" />, title: "Accessibilité", desc: "Nous croyons que chacun mérite de trouver sa voie, quel que soit son parcours ou ses moyens." }
  ];

  const milestones = [
    { year: "2023", label: "Idée & Conception", desc: "Naissance du projet CléAvenir, une ambition : démocratiser l'orientation professionnelle en France." },
    { year: "2024", label: "Développement", desc: "Construction de la plateforme, intégration du référentiel ROME complet et de l'IA Cléo." },
    { year: "2025", label: "Lancement Beta", desc: "Ouverture aux premiers utilisateurs. Premiers retours, premières histoires de succès." },
    { year: "2026", label: "Aujourd'hui", desc: "Élargissement de l'offre, partenariats, et amélioration continue basée sur les feedbacks utilisateurs.", current: true },
  ];

  const testimonials = [
    { quote: "Grâce à CléAvenir, j'ai découvert le métier de UX Designer — je ne savais même pas que ça existait. Aujourd'hui je suis en formation.", author: "Camille R.", role: "Reconversion professionnelle" },
    { quote: "Le test RIASEC est bluffant de précision. En 10 minutes j'avais une liste de métiers qui me correspondaient vraiment.", author: "Alexandre T.", role: "Étudiant en terminale" },
    { quote: "L'assistant Cléo m'a aidé à préparer mes entretiens et à rédiger un CV qui se démarque vraiment.", author: "Yasmine B.", role: "Recherche d'emploi" },
  ];

  const formatStat = (val) => val === null ? '…' : val > 1000 ? `${Math.floor(val / 100) * 100}+` : `${val}+`;

  const aboutSEO = categoryPageSEO({
    title: "À propos de nous - CléAvenir",
    description: "Découvrez l'équipe et la mission derrière CléAvenir, la plateforme d'orientation nouvelle génération qui démocratise l'accès au conseil de carrière.",
    keywords: "à propos, mission, équipe, orientation, CléAvenir",
    category: "À propos",
    categoryPath: "/about"
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PageHelmet {...aboutSEO} />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Notre Histoire
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Réinventer l'orientation <span className="text-primary">pour tous.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Nous utilisons l'intelligence artificielle pour démocratiser l'accès au conseil de carrière de haute qualité,
              autrefois réservé à quelques privilégiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: formatStat(stats.users), label: "Utilisateurs accompagnés", icon: <Users className="w-5 h-5" /> },
              { value: formatStat(stats.tests), label: "Tests d'orientation réalisés", icon: <CheckCircle className="w-5 h-5" /> },
              { value: formatStat(stats.metiers), label: "Métiers dans le catalogue ROME", icon: <BookOpen className="w-5 h-5" /> },
              { value: "95%", label: "Taux de satisfaction", icon: <TrendingUp className="w-5 h-5" /> },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="text-4xl font-extrabold text-slate-900">{s.value}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 text-center">
                  <span className="text-primary">{s.icon}</span>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">Notre Mission</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-2">Votre avenir professionnel, entre vos mains.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Trop de personnes subissent leur vie professionnelle par manque d'information ou de confiance.
                  L'orientation scolaire et professionnelle traditionnelle est souvent coûteuse, déconnectée de la réalité du marché, ou trop générique.
                </p>
                <p>
                  Chez CléAvenir, nous avons bâti une technologie capable d'analyser des millions de données
                  pour offrir à chacun un <strong className="text-slate-900">GPS de carrière personnalisé</strong>, précis et actionnable.
                </p>
                <p>
                  Notre IA Cléo combine votre profil RIASEC, vos aspirations, et les données du marché du travail en temps réel
                  pour vous proposer des pistes concrètes — pas des généralités.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Test RIASEC", "Catalogue ROME", "Offres d'emploi", "Formations CPF", "IA Cléo"].map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Équipe travaillant ensemble"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600"><Rocket className="w-6 h-6"/></div>
                  <div>
                    <div className="font-bold text-slate-900">{formatStat(stats.users)}</div>
                    <div className="text-sm text-slate-500">Utilisateurs accompagnés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Notre Parcours</h2>
            <p className="text-slate-500 mt-3">De l'idée à la plateforme — une aventure en cours.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10 ${m.current ? 'bg-primary text-white' : 'bg-white border-2 border-slate-200 text-slate-600'}`}>
                    {m.year}
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900">{m.label}</h3>
                      {m.current && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">En cours</span>}
                    </div>
                    <p className="text-slate-600 text-sm">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Nos Valeurs</h2>
            <p className="text-slate-500 mt-4">Ce qui guide nos décisions au quotidien.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-md transition-all text-center hover:border-primary/20">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Ce qu'ils en pensent</h2>
            <p className="text-slate-500 mt-3">Des histoires réelles, des transformations concrètes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <MessageSquare className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-slate-700 italic flex-1 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">L'équipe fondatrice</h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto">Une équipe passionnée par l'éducation, la technologie et l'impact social.</p>
          <div className="flex justify-center">
            <div className="group flex flex-col items-center max-w-sm">
              <div className="relative w-44 h-44 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/20 to-violet-200">
                <span className="text-5xl font-extrabold text-primary">BD</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Bourama Diarra</h3>
              <p className="text-primary text-sm font-medium mt-1">CEO & Fondateur</p>
              <p className="text-slate-500 text-sm mt-3 max-w-xs text-center">
                Passionné par l'IA et l'accessibilité de l'éducation, Bourama a fondé CléAvenir avec la conviction que chacun mérite un accompagnement de qualité pour construire son avenir.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">IA & Machine Learning</span>
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">EdTech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir votre voie ?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'utilisateurs qui ont transformé leur rapport à leur carrière grâce à CléAvenir.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => onNavigate('/signup')} size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
              Commencer gratuitement
            </Button>
            <Button variant="outline" onClick={() => onNavigate('/contact')} size="lg" className="border-slate-600 text-white hover:bg-slate-800">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
