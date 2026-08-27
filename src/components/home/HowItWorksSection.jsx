import { Target, Zap, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';

const WAYPOINTS = [
  {
    number: '01',
    icon: Target,
    title: 'Passe le test gratuit',
    desc: "Réponds à quelques questions sur tes centres d'intérêt, tes valeurs et ton parcours. Aucune inscription requise.",
  },
  {
    number: '02',
    icon: Zap,
    title: 'Cléo analyse ton profil',
    desc: 'Notre IA génère une analyse complète de tes compétences, aspirations et affinités métier en quelques secondes.',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Explore ta voie',
    desc: "Accède aux métiers, formations et offres d'emploi personnalisés pour toi, avec des données officielles à jour.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative bg-[#faf6e9] py-24 dark:bg-[#1d1938] md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <AnimatedSection className="mb-16 max-w-2xl">
          <AnimatedItem>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#147a68] dark:text-[#4fd6b8]">
              Le trajet
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <h2
              className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
            >
              Trois étapes, une route qui se dessine.
            </h2>
          </AnimatedItem>
        </AnimatedSection>

        <div className="relative">
          {/* the route connecting the three waypoints, drawn as an actual line */}
          <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-[#e8459a]/40 via-[#e8459a] to-[#e8459a]/40 md:block" />

          <AnimatedSection className="grid grid-cols-1 gap-12 md:grid-cols-3" stagger={0.2}>
            {WAYPOINTS.map((step) => {
              const Icon = step.icon;
              return (
                <AnimatedItem key={step.number}>
                  <div className="relative flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                      className="relative z-10 mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-[#e8459a] bg-[#faf6e9] text-[#e8459a] shadow-[0_0_0_6px_rgba(232,69,154,0.08)] dark:bg-[#1d1938] dark:text-[#f472b6]"
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <span className="mb-2 font-mono text-xs tracking-widest text-slate-400 dark:text-slate-500">
                      {step.number}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {step.desc}
                    </p>
                  </div>
                </AnimatedItem>
              );
            })}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
