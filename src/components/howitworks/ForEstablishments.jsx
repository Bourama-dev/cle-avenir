import React from 'react';
import { Building2, LineChart, Users, Wallet, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ForEstablishments = () => {
  const navigate = useNavigate();

  return (
    <section className="hiw-section bg-slate-900 text-white rounded-[2rem] my-16 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
             <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Espace Pro</span>
             <h2 className="text-3xl md:text-4xl font-bold mt-2">Pour les établissements & entreprises</h2>
             <p className="text-slate-400 mt-2 max-w-xl">
               Écoles, organismes de formation, recruteurs : découvrez nos solutions dédiées pour attirer et accompagner les talents.
             </p>
          </div>
          <Button 
            onClick={() => navigate('/establishment/login')} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-xl text-lg"
          >
            Découvrir l'offre B2B
          </Button>
        </div>

        <div className="hiw-estab-grid">
          <div className="hiw-estab-card bg-slate-800/50">
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Espace de suivi</h3>
            <p className="text-slate-400 text-sm">Gérez vos candidatures et suivez l'évolution des profils intéressés par votre établissement.</p>
          </div>

          <div className="hiw-estab-card bg-slate-800/50">
            <LineChart className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Indicateurs</h3>
            <p className="text-slate-400 text-sm">Accédez à des statistiques détaillées sur l'attractivité de vos formations et filières.</p>
          </div>

          <div className="hiw-estab-card bg-slate-800/50">
            <Building2 className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Outil clé en main</h3>
            <p className="text-slate-400 text-sm">Une plateforme prête à l'emploi, simple à intégrer dans vos processus existants.</p>
          </div>

          <div className="hiw-estab-card bg-slate-800/50">
            <Wallet className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Financements</h3>
            <p className="text-slate-400 text-sm">Identifiez les leviers de financement pour vos étudiants et futurs collaborateurs.</p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-8">
            <h3 className="text-xl font-bold mb-6">Tous les avantages inclus :</h3>
            <div className="hiw-benefits-list">
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Accès illimité à la CVthèque qualifiée</span></div>
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Matching prédictif par IA</span></div>
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Page établissement personnalisable</span></div>
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Support prioritaire dédié</span></div>
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Export des données (API & CSV)</span></div>
                <div className="hiw-benefit-item"><Check className="text-green-400 w-5 h-5" /> <span>Tableaux de bord d'analyse</span></div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ForEstablishments;