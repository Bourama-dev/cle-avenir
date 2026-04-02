import React from 'react';
import { Check, X, GraduationCap, Briefcase, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatIsCleAvenir = () => {
  return (
    <section className="hiw-section bg-white" id="concept">
      <div className="hiw-section-title">
        <h2>Plus qu'un simple test d'orientation</h2>
        <p>CléAvenir réinvente l'accompagnement carrière en rendant l'orientation accessible, précise et actionnable pour tous.</p>
      </div>

      <div className="hiw-comparison-grid">
        {/* Traditional */}
        <div className="hiw-card traditional">
          <h3 className="text-xl font-bold text-slate-400 mb-4 flex items-center gap-2">
            <X className="w-6 h-6" /> Orientation Classique
          </h3>
          <ul className="space-y-3 text-slate-500">
            <li className="flex gap-2"><X className="w-5 h-5 flex-shrink-0 text-red-400" /> Tests longs et ennuyeux (45min+)</li>
            <li className="flex gap-2"><X className="w-5 h-5 flex-shrink-0 text-red-400" /> Résultats génériques et flous</li>
            <li className="flex gap-2"><X className="w-5 h-5 flex-shrink-0 text-red-400" /> Données marché souvent obsolètes</li>
            <li className="flex gap-2"><X className="w-5 h-5 flex-shrink-0 text-red-400" /> Pas de plan d'action concret</li>
            <li className="flex gap-2"><X className="w-5 h-5 flex-shrink-0 text-red-400" /> Coût élevé (bilan de compétences)</li>
          </ul>
        </div>

        {/* CléAvenir */}
        <div className="hiw-card cleavenir transform scale-105 shadow-xl">
          <h3 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <Check className="w-6 h-6" /> Méthode CléAvenir
          </h3>
          <ul className="space-y-3 text-slate-700 font-medium">
            <li className="flex gap-2"><Check className="w-5 h-5 flex-shrink-0 text-green-500" /> Test adaptatif intelligent (7-10 min)</li>
            <li className="flex gap-2"><Check className="w-5 h-5 flex-shrink-0 text-green-500" /> 5 Métiers ciblés sur votre personnalité</li>
            <li className="flex gap-2"><Check className="w-5 h-5 flex-shrink-0 text-green-500" /> Connexion temps réel au marché de l'emploi</li>
            <li className="flex gap-2"><Check className="w-5 h-5 flex-shrink-0 text-green-500" /> Feuille de route formation & emploi</li>
            <li className="flex gap-2"><Check className="w-5 h-5 flex-shrink-0 text-green-500" /> Coach IA disponible 24/7</li>
          </ul>
        </div>
      </div>

      <div className="hiw-users-grid">
        <motion.div whileHover={{ y: -10 }} className="hiw-user-card">
          <div className="hiw-user-icon text-blue-500">🎓</div>
          <h4 className="text-lg font-bold mb-2">Lycéens & Étudiants</h4>
          <p className="text-slate-500">Pour choisir la bonne formation et éviter les erreurs d'aiguillage sur Parcoursup.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="hiw-user-card">
          <div className="hiw-user-icon text-purple-500">💼</div>
          <h4 className="text-lg font-bold mb-2">En Reconversion</h4>
          <p className="text-slate-500">Pour changer de vie, identifier ses compétences transférables et trouver un métier porteur.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="hiw-user-card">
          <div className="hiw-user-icon text-green-500">🔍</div>
          <h4 className="text-lg font-bold mb-2">Demandeurs d'emploi</h4>
          <p className="text-slate-500">Pour rebondir rapidement vers des secteurs qui recrutent vraiment près de chez vous.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsCleAvenir;