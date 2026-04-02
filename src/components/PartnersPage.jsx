import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SEOHead from '@/components/SEOHead';
import { DollarSign, Target, HeartHandshake as Handshake } from 'lucide-react';

const PartnersPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="Devenir Partenaire CléAvenir - Affiliation" description="Proposez vos formations à notre audience qualifiée. Programme d'affiliation pour écoles, CFA et centres de formation." />
      {/* Header removed */}

      <section className="bg-slate-50 py-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Programme Partenaires & Affiliation</h1>
          <p className="text-xl text-slate-600 mb-8">Connectez vos formations directement aux jeunes qui cherchent leur voie.</p>
          <Button size="lg" className="bg-primary text-white">Devenir Partenaire</Button>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Pourquoi rejoindre le réseau ?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold">Audience Ultra-Qualifiée</h3>
                  <p className="text-slate-600">Nos utilisateurs ont passé des tests IA : nous savons exactement ce qu'ils cherchent.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold">Modèle au résultat</h3>
                  <p className="text-slate-600">Payez uniquement pour les leads qualifiés ou les inscriptions (CPA/CPL).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Handshake className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-bold">Intégration Native</h3>
                  <p className="text-slate-600">Vos formations apparaissent naturellement dans les résultats de matching.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 p-8 rounded-2xl">
            <h3 className="font-bold text-xl mb-4">Demande de partenariat</h3>
            <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); alert("Demande enregistrée")}}>
              <Input placeholder="Nom de l'organisme" required />
              <Input placeholder="Site web" required />
              <Input placeholder="Contact email" type="email" required />
              <Input placeholder="Type de partenariat souhaité" />
              <Button type="submit" className="w-full">Envoyer</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;