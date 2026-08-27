import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import StarMapCanvas from './StarMapCanvas';

const SEGMENTS = [
  {
    id: 'lyceen',
    label: 'Lycéen·ne',
    title: 'Tu ne sais pas encore quoi choisir après le bac.',
    desc: "CléAvenir t'aide à explorer sans te fermer de portes — filières générales, technologiques, ou professionnelles.",
    nodeIds: ['dev_web', 'ux_designer', 'data_analyst', 'architect', 'avocat', 'teacher', 'bts-sio', 'but-info', 'de-infirmier'],
  },
  {
    id: 'apprenti',
    label: 'Apprenti·e',
    title: "Tu veux apprendre un métier sur le terrain.",
    desc: 'Des parcours en alternance vers des métiers manuels et techniques, avec de vrais débouchés.',
    nodeIds: ['electrician', 'boulanger', 'coach_sportif', 'cap-boulanger', 'cap-electricien', 'bpjeps', 'epitech', '42'],
  },
  {
    id: 'reorientation',
    label: 'Réorientation',
    title: "Ta première voie ne te correspond plus.",
    desc: 'On repart de tes compétences déjà acquises pour tracer une nouvelle route, pas de zéro.',
    nodeIds: ['sales_rep', 'marketing_manager', 'nurse', 'avocat', 'openclassrooms', 'capa', 'de-infirmier'],
  },
];

export default function AudienceSection() {
  const [active, setActive] = useState('lyceen');
  const emphasizedIds = useMemo(() => {
    const segment = SEGMENTS.find((s) => s.id === active);
    return new Set(segment?.nodeIds ?? []);
  }, [active]);

  return (
    <section className="relative overflow-hidden bg-[#1d1938] py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-16">
        <AnimatedSection>
          <AnimatedItem>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#4fd6b8]">Pour qui</p>
          </AnimatedItem>
          <AnimatedItem>
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="mb-8 bg-white/5">
                {SEGMENTS.map((s) => (
                  <TabsTrigger key={s.id} value={s.id} className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {SEGMENTS.map((s) => (
                <TabsContent key={s.id} value={s.id} className="mt-0">
                  <h3
                    className="mb-4 text-2xl font-bold leading-snug md:text-3xl"
                    style={{ textWrap: 'balance', fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
                  >
                    {s.title}
                  </h3>
                  <p className="max-w-md text-slate-300">{s.desc}</p>
                </TabsContent>
              ))}
            </Tabs>
          </AnimatedItem>
        </AnimatedSection>

        <div className="relative h-[340px] md:h-[420px]">
          <StarMapCanvas className="absolute inset-0 h-full w-full" interactive={false} emphasizedIds={emphasizedIds} />
        </div>
      </div>
    </section>
  );
}
