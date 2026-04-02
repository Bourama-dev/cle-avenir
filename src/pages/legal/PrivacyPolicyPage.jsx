import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    { id: 'intro', title: '1. Introduction' },
    { id: 'collected', title: '2. Données Collectées' },
    { id: 'usage', title: '3. Utilisation des Données' },
    { id: 'rights', title: '4. Vos Droits' },
    { id: 'retention', title: '5. Durée de Conservation' },
    { id: 'security', title: '6. Sécurité' },
    { id: 'contact', title: '7. Contact' }
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* TOC Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <Card className="p-6 border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Sommaire</h3>
              <ul className="space-y-3">
                {sections.map(s => (
                  <li key={s.id}>
                    <button 
                      onClick={() => scrollTo(s.id)}
                      className="text-slate-600 hover:text-indigo-600 text-sm text-left transition-colors font-medium"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-black text-slate-900">Politique de Confidentialité</h1>
            </div>
            <p className="text-slate-500">Dernière mise à jour : 4 Mars 2026</p>
          </div>

          <Card className="p-8 md:p-12 prose prose-slate max-w-none border-slate-200 shadow-sm print:shadow-none bg-white rounded-xl">
            <section id="intro">
              <h2>1. Introduction</h2>
              <p>
                Chez CléAvenir, nous accordons une importance primordiale au respect de votre vie privée et à la protection de vos données personnelles. 
                Cette politique explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme d'orientation.
              </p>
            </section>

            <Separator className="my-8" />

            <section id="collected">
              <h2>2. Données Collectées</h2>
              <p>Nous pouvons collecter les catégories de données suivantes :</p>
              <ul>
                <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail.</li>
                <li><strong>Données de profil :</strong> âge, niveau d'études, situation professionnelle.</li>
                <li><strong>Données de test :</strong> réponses au test RIASEC, préférences métiers.</li>
                <li><strong>Données techniques :</strong> adresse IP, logs de connexion, type de navigateur.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section id="usage">
              <h2>3. Utilisation des Données</h2>
              <p>Vos données sont utilisées exclusivement pour les finalités suivantes :</p>
              <ul>
                <li>Fournir nos services d'orientation algorithmique.</li>
                <li>Personnaliser les recommandations de métiers et de formations.</li>
                <li>Générer vos documents (CV, Lettre de motivation).</li>
                <li>Améliorer la précision de notre IA.</li>
                <li>Assurer la sécurité de votre compte.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section id="rights">
              <h2>4. Vos Droits (RGPD)</h2>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données.</li>
                <li><strong>Droit de rectification :</strong> Corriger des informations inexactes.</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de votre compte et données.</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré (JSON).</li>
                <li><strong>Droit d'opposition :</strong> Refuser certains traitements de données.</li>
              </ul>
              <p>Vous pouvez exercer ces droits directement depuis votre espace "Confidentialité & Données" ou en nous contactant.</p>
            </section>

            <Separator className="my-8" />

            <section id="retention">
              <h2>5. Durée de Conservation</h2>
              <p>Nous conservons vos données uniquement le temps nécessaire à la fourniture de nos services :</p>
              <ul>
                <li>Données de compte : conservées tant que le compte est actif. Supprimées après 3 ans d'inactivité.</li>
                <li>Logs de connexion : conservés 1 an.</li>
                <li>Résultats de tests : anonymisés en cas de suppression du compte, à des fins statistiques.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section id="security">
              <h2>6. Sécurité des Données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles robustes pour protéger vos données contre l'accès non autorisé, 
                la perte ou l'altération (chiffrement en transit et au repos, sauvegardes sécurisées, contrôles d'accès stricts).
              </p>
            </section>

            <Separator className="my-8" />

            <section id="contact">
              <h2>7. Contact DPO</h2>
              <p>Pour toute question concernant cette politique ou vos données personnelles, veuillez contacter notre Délégué à la Protection des Données (DPO) :</p>
              <p className="font-medium text-indigo-700">Email : dpo@cleavenir.com</p>
              <p>Adresse : 30 rue du Faubourg Saint Vincent, 45000 Orléans, France</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;