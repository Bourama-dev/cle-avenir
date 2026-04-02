import React from 'react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LegalPage = ({ onNavigate, tab = "mentions" }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead title="Mentions Légales & Confidentialité" description="Informations légales de CléAvenir." />
      <Header onNavigate={onNavigate} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Informations Légales</h1>
        <Tabs defaultValue={tab} className="w-full">
          <TabsList>
            <TabsTrigger value="mentions">Mentions Légales</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="cgu">CGU</TabsTrigger>
          </TabsList>
          <div className="bg-white p-8 rounded-xl mt-6 border border-slate-200">
            <TabsContent value="mentions">
              <h2 className="text-xl font-bold mb-4">Éditeur du site</h2>
              <p className="mb-4">CléAvenir SAS, au capital de 1000€.<br/>Siège social : Paris, France.<br/>RCS Paris B 123 456 789.</p>
              <h2 className="text-xl font-bold mb-4">Hébergement</h2>
              <p>Hostinger International Ltd.</p>
            </TabsContent>
            <TabsContent value="privacy">
              <h2 className="text-xl font-bold mb-4">Protection des données</h2>
              <p className="mb-4">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
              <p>Contact DPO : dpo@cleavenir.app</p>
            </TabsContent>
            <TabsContent value="cgu">
              <h2 className="text-xl font-bold mb-4">Conditions Générales d'Utilisation</h2>
              <p className="mb-4">L'utilisation de CléAvenir implique l'acceptation pleine et entière des présentes CGU.</p>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default LegalPage;