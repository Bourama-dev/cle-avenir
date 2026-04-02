import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    { id: 'acceptance', title: '1. Acceptation' },
    { id: 'usage', title: '2. Utilisation du Service' },
    { id: 'ip', title: '3. Propriété Intellectuelle' },
    { id: 'responsibilities', title: '4. Responsabilités' },
    { id: 'liability', title: '5. Limitation de Responsabilité' },
    { id: 'modifications', title: '6. Modifications' },
    { id: 'termination', title: '7. Résiliation' },
    { id: 'law', title: '8. Droit Applicable' }
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <Card className="p-6 border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Sommaire</h3>
              <ul className="space-y-3">
                {sections.map(s => (
                  <li key={s.id}>
                    <button onClick={() => scrollTo(s.id)} className="text-slate-600 hover:text-indigo-600 text-sm text-left transition-colors font-medium">
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </aside>

        <div className="flex-1 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-black text-slate-900">Conditions Générales d'Utilisation</h1>
            </div>
            <p className="text-slate-500">Dernière mise à jour : 4 Mars 2026</p>
          </div>

          <Card className="p-8 md:p-12 prose prose-slate max-w-none border-slate-200 shadow-sm bg-white rounded-xl">
            <section id="acceptance">
              <h2>1. Acceptation des CGU</h2>
              <p>L'utilisation de la plateforme CléAvenir implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.</p>
            </section>
            <Separator className="my-6" />
            <section id="usage">
              <h2>2. Utilisation du Service</h2>
              <p>Vous vous engagez à fournir des informations exactes lors de votre inscription et à utiliser la plateforme de manière légale et conforme à sa destination (aide à l'orientation et à l'insertion professionnelle).</p>
            </section>
            <Separator className="my-6" />
            <section id="ip">
              <h2>3. Propriété Intellectuelle</h2>
              <p>L'ensemble du contenu (textes, algorithmes, design, bases de données) est la propriété exclusive de CléAvenir. Toute reproduction non autorisée est strictement interdite.</p>
            </section>
            <Separator className="my-6" />
            <section id="responsibilities">
              <h2>4. Vos Responsabilités</h2>
              <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les actions effectuées sous votre compte.</p>
            </section>
            <Separator className="my-6" />
            <section id="liability">
              <h2>5. Limitation de Responsabilité</h2>
              <p>CléAvenir est un outil d'aide à la décision. Les résultats algorithmiques sont fournis à titre indicatif et ne remplacent pas les conseils d'un professionnel. Notre responsabilité ne saurait être engagée quant aux choix de carrière de l'utilisateur.</p>
            </section>
            <Separator className="my-6" />
            <section id="modifications">
              <h2>6. Modifications des CGU</h2>
              <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des changements substantiels.</p>
            </section>
            <Separator className="my-6" />
            <section id="termination">
              <h2>7. Résiliation</h2>
              <p>Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre l'accès en cas de violation grave de ces CGU.</p>
            </section>
            <Separator className="my-6" />
            <section id="law">
              <h2>8. Droit Applicable et Juridiction</h2>
              <p>Ces conditions sont régies par le droit français. Tout litige relèvera de la compétence exclusive des tribunaux français.</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;