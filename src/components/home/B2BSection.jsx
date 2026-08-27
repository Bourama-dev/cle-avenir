import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';

export default function B2BSection({ onNavigate }) {
  return (
    <section className="bg-[#f3ecd9] py-20 dark:bg-[#171330] md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-16">
        <AnimatedSection>
          <AnimatedItem>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#8a6a2f] dark:text-[#c9a15a]">
              Pour les établissements
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <h2
              className="mx-auto mb-5 max-w-xl text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
            >
              Lycées, CFA, missions locales — accompagnez vos élèves à grande échelle.
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mx-auto mb-8 max-w-lg text-base text-slate-600 dark:text-slate-300">
              CléAvenir s'intègre à vos dispositifs d'orientation existants, avec un tableau de bord pour suivre l'engagement de vos élèves.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <button
              type="button"
              onClick={() => onNavigate?.('/etablissement')}
              className="rounded-sm border border-slate-900 px-6 py-3 font-mono text-sm text-slate-900 transition-colors hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900"
            >
              Contactez-nous pour votre établissement
            </button>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
