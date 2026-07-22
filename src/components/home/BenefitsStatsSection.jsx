import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Clock, Briefcase, BookOpen, Users } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';

const STATS = [
  { value: 5, suffix: ' min', label: 'Pour passer le test', icon: Clock },
  { value: 1000, suffix: '+', label: 'Fiches métiers', icon: Briefcase },
  { value: 10000, suffix: '+', label: 'Formations référencées', icon: BookOpen },
  { value: 200, suffix: '+', label: 'Utilisateurs orientés', icon: Users },
];

function CountUp({ value, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

export default function BenefitsStatsSection() {
  return (
    <section className="border-y border-amber-900/10 bg-[#f3ecd9] py-16 dark:border-amber-200/10 dark:bg-[#171330]">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        <p className="mb-10 text-center font-mono text-xs uppercase tracking-widest text-[#8a6a2f] dark:text-[#c9a15a]">
          Coordonnées relevées sur la carte
        </p>
        <AnimatedSection className="grid grid-cols-2 gap-8 lg:grid-cols-4" stagger={0.1}>
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <AnimatedItem key={stat.label}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon className="mb-1 h-5 w-5 text-[#e8459a] dark:text-[#f472b6]" />
                  <div className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-medium leading-tight text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
