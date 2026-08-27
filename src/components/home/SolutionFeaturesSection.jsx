import { Search, GraduationCap, Zap } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import TiltCard from '@/components/ui/TiltCard';

const FEATURES = [
  {
    icon: Search,
    title: 'Exploration Métiers',
    desc: "Des milliers de fiches métiers détaillées avec salaires, débouchés et perspectives d'évolution — données ROME/ESCO à jour.",
    link: '/metiers',
  },
  {
    icon: GraduationCap,
    title: 'Formations Adaptées',
    desc: 'La formation qui correspond à ton niveau, ta région et tes objectifs — pas une liste générique.',
    link: '/formations',
  },
  {
    icon: Zap,
    title: 'Coaching IA · Cléo',
    desc: "Un assistant personnel disponible 24/7 qui analyse ton profil et t'accompagne pas à pas.",
    link: '/cleo',
  },
];

export default function SolutionFeaturesSection({ onNavigate }) {
  return (
    <section className="bg-[#faf6e9] py-24 dark:bg-[#1d1938] md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <AnimatedSection className="mb-16 max-w-2xl">
          <AnimatedItem>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#147a68] dark:text-[#4fd6b8]">
              La solution
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <h2
              className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
            >
              Trois instruments pour naviguer.
            </h2>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.12}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <AnimatedItem key={f.title}>
                <TiltCard
                  intensity={8}
                  glare={0.14}
                  onClick={() => onNavigate?.(f.link)}
                  className="group h-full cursor-pointer rounded-sm border border-amber-900/10 bg-[#f6f4ec] p-8 transition-all duration-300 hover:border-[#e8459a]/30 hover:shadow-xl dark:border-amber-200/10 dark:bg-[#12151b]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#e8459a]/30 text-[#e8459a] dark:text-[#f472b6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.desc}</p>
                </TiltCard>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
