import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import StarMapCanvas from './StarMapCanvas';

const PAIN_POINTS = [
  {
    title: 'Données dispersées',
    desc: "Parcoursup, sites métiers, forums, avis de proches — l'information existe, mais nulle part rassemblée.",
  },
  {
    title: 'Conseils génériques',
    desc: 'Des tests standardisés qui ne tiennent pas compte de tes compétences ni de tes motivations réelles.',
  },
  {
    title: 'Accompagnement non-scalable',
    desc: "Un conseiller d'orientation pour des centaines d'élèves — impossible de suivre chacun individuellement.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-[#f3ecd9] py-24 dark:bg-[#171330] md:py-32">
      <StarMapCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-60" foggy interactive={false} />

      <div className="relative mx-auto max-w-4xl px-6 md:px-16">
        <AnimatedSection>
          <AnimatedItem>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#8a6a2f] dark:text-[#c9a15a]">
              Le constat
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <h2
              className="mb-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
            >
              Avant la carte, il n'y a que du brouillard.
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mb-14 max-w-xl text-base text-slate-600 md:text-lg dark:text-slate-300">
              L'orientation en France ne manque pas d'information — elle manque de structure. Résultat : des choix subis plutôt que choisis.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 gap-8 md:grid-cols-3" stagger={0.12}>
          {PAIN_POINTS.map((p) => (
            <AnimatedItem key={p.title}>
              <div className="rounded-sm border border-amber-900/10 bg-[#f6f4ec]/80 p-6 backdrop-blur-sm dark:border-amber-200/10 dark:bg-[#1a1e26]/80">
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
