import React from 'react';
import SEOHead from '@/components/SEOHead';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Mentions Légales" 
        description="Mentions légales et informations de l'éditeur de CléAvenir." 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Mentions Légales</h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Éditeur du site</h2>
              <p className="mb-2">Le site <strong>CléAvenir</strong> est édité par :</p>
              <ul className="space-y-1">
                <li><strong>Raison sociale :</strong> CléAvenir SAS</li>
                <li><strong>Capital social :</strong> 10 000 €</li>
                <li><strong>Siège social :</strong> 30 rue du Faubourg Saint Vincent, 45000 Orléans, France</li>
                <li><strong>RCS :</strong> Orléans B 123 456 789</li>
                <li><strong>TVA Intracommunautaire :</strong> FR 12 345678910</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Directeur de la publication</h2>
              <p>
                Monsieur Jean Dupont, en qualité de Président.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Hébergement</h2>
              <p className="mb-2">Le site est hébergé par :</p>
              <ul className="space-y-1">
                <li><strong>Nom de l'hébergeur :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Contact :</strong> privacy@vercel.com</li>
              </ul>
              <p className="mt-4 text-sm">
                Les données de la base de données (Supabase) sont hébergées sur des serveurs situés au sein de l'Union Européenne (Région Francfort/Paris) afin de garantir la conformité RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Contact</h2>
              <ul className="space-y-1">
                <li><strong>Email support :</strong> <a href="mailto:contact@cleavenir.com" className="text-blue-600 hover:underline">contact@cleavenir.com</a></li>
                <li><strong>Délégué à la Protection des Données (DPO) :</strong> <a href="mailto:dpo@cleavenir.com" className="text-blue-600 hover:underline">dpo@cleavenir.com</a></li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Signaler un contenu illicite</h2>
              <p>
                Conformément à la loi pour la confiance dans l'économie numérique (LCEN), vous pouvez signaler tout contenu illicite en nous écrivant à l'adresse email de contact mentionnée ci-dessus.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;