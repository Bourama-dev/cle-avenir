import { motion } from 'framer-motion';
import StarMapCanvas from './StarMapCanvas';

export default function HeroMapSection({ onNavigate }) {
  return (
    <section className="relative overflow-hidden border-b border-amber-900/10 bg-[#f3ecd9] dark:border-amber-200/10 dark:bg-[#171330]">
      <div className="relative h-[76vh] min-h-[560px] max-h-[820px]">
        <StarMapCanvas className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="pointer-events-auto max-w-xl px-6 md:px-16">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Carte des possibles — édition 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl dark:text-white"
              style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, "Times New Roman", serif' }}
            >
              Ton avenir a des <span className="text-[#e8459a] dark:text-[#f472b6]">coordonnées.</span> On va les calculer.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mb-7 max-w-md text-base text-slate-600 md:text-lg dark:text-slate-300"
            >
              Chaque point de cette carte est un métier ou une formation réelle. Survole ou touche un point pour le découvrir — le test CléAvenir trace ensuite ta position à partir de ce que tu es.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={() => onNavigate?.('/test')}
                className="rounded-sm bg-[#e8459a] px-6 py-3.5 font-mono text-sm text-white shadow-[0_10px_26px_-14px_#e8459a] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white"
              >
                Calculer ma position — gratuit
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('/comment-ca-marche')}
                className="text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-200 dark:decoration-slate-600"
              >
                Lire la carte
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
