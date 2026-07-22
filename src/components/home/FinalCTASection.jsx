import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import StarMapCanvas from './StarMapCanvas';

export default function FinalCTASection({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-[#faf6e9] py-28 dark:bg-[#1d1938] md:py-36">
      <StarMapCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-70" interactive={false} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#faf6e9] via-transparent to-[#faf6e9] dark:from-[#1d1938] dark:via-transparent dark:to-[#1d1938]" />

      <div className="relative mx-auto max-w-2xl px-6 text-center md:px-16">
        <AnimatedSection>
          <AnimatedItem>
            <h2
              className="mb-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
            >
              La carte est complète. <span className="text-[#e8459a] dark:text-[#f472b6]">Ta route commence ici.</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <button
              type="button"
              onClick={() => onNavigate?.('/test')}
              className="rounded-sm bg-[#e8459a] px-8 py-4 font-mono text-sm text-white shadow-[0_10px_30px_-14px_#e8459a] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white"
            >
              Commencer le test — gratuit
            </button>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
