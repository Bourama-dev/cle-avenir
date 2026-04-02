import React from 'react';
import { Lock, Shield, EyeOff, Server, Eye, Pencil, Trash2, Download } from 'lucide-react';

const SecurityData = () => {
  return (
    <section className="hiw-section">
      <div className="hiw-section-title">
        <h2>Vos données sont en sécurité</h2>
        <p>La confiance est notre priorité. Nous respectons les standards les plus stricts.</p>
      </div>

      <div className="hiw-security-grid mb-16">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="hiw-sec-icon"><Lock /></div>
          <h4 className="font-bold mb-2">Données protégées</h4>
          <p className="text-sm text-slate-500">Toutes vos données sont chiffrées de bout en bout (SSL/TLS).</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="hiw-sec-icon"><Shield /></div>
          <h4 className="font-bold mb-2">Conformité RGPD</h4>
          <p className="text-sm text-slate-500">Respect total des normes européennes de protection des données.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="hiw-sec-icon"><EyeOff /></div>
          <h4 className="font-bold mb-2">Aucune revente</h4>
          <p className="text-sm text-slate-500">Nous ne vendons jamais vos données personnelles à des tiers.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="hiw-sec-icon"><Server /></div>
          <h4 className="font-bold mb-2">Utilisation stricte</h4>
          <p className="text-sm text-slate-500">Vos données servent uniquement à améliorer votre orientation.</p>
        </div>
      </div>

      <div className="hiw-section-title mb-8">
         <h3 className="text-2xl font-bold mb-2">Vos droits utilisateurs</h3>
      </div>

      <div className="hiw-rights-grid mb-12">
         <div className="hiw-right-card">
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h4 className="font-bold">Droit d'accès</h4>
            <p className="text-xs text-slate-500 mt-2">Consultez toutes vos données à tout moment.</p>
         </div>
         <div className="hiw-right-card">
            <Pencil className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-bold">Rectification</h4>
            <p className="text-xs text-slate-500 mt-2">Modifiez vos informations en un clic.</p>
         </div>
         <div className="hiw-right-card">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h4 className="font-bold">Droit à l'oubli</h4>
            <p className="text-xs text-slate-500 mt-2">Supprimez définitivement votre compte.</p>
         </div>
         <div className="hiw-right-card">
            <Download className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h4 className="font-bold">Portabilité</h4>
            <p className="text-xs text-slate-500 mt-2">Récupérez vos données au format standard.</p>
         </div>
      </div>
      
      <div className="text-center">
         <a href="/politique-confidentialite" className="text-blue-600 font-medium hover:underline text-sm">
            En savoir plus sur notre politique de confidentialité →
         </a>
      </div>
    </section>
  );
};

export default SecurityData;