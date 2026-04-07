import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { Shield, Mail } from 'lucide-react';

const PolitiqueConfidentialitePage = () => {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      subtitle="Notre engagement pour la protection de vos données personnelles et le respect de votre vie privée."
      lastUpdated="8 avril 2026"
    >
      <div className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          CléAvenir SAS, en tant que responsable du traitement, s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés.
        </p>
        <p>
          Cette politique décrit quelles données nous collectons, pourquoi, comment nous les utilisons et vos droits à leur égard.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Données collectées</h2>
        <h3>Données fournies directement</h3>
        <ul>
          <li><strong>Inscription :</strong> Nom, prénom, adresse email, mot de passe (chiffré via bcrypt).</li>
          <li><strong>Profil :</strong> Âge, niveau d'études, situation professionnelle, secteurs d'intérêt (optionnel).</li>
          <li><strong>Test d'orientation :</strong> Réponses aux questions, résultats RIASEC, métiers recommandés.</li>
          <li><strong>Documents :</strong> CV et lettres de motivation créés sur la plateforme.</li>
          <li><strong>Contact :</strong> Messages envoyés via le formulaire de contact.</li>
        </ul>
        <h3>Données collectées automatiquement</h3>
        <ul>
          <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation.</li>
          <li><strong>Données de navigation :</strong> Pages visitées, durée des sessions, actions effectuées.</li>
          <li><strong>Cookies :</strong> Voir notre <a href="/gestion-cookies" className="text-blue-600 hover:underline">politique cookies</a>.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>3. Finalités du traitement</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Gérer votre compte et vous authentifier de manière sécurisée.</li>
          <li>Fournir les résultats de tests d'orientation personnalisés.</li>
          <li>Améliorer nos algorithmes de recommandation (données agrégées et anonymisées).</li>
          <li>Vous envoyer des communications relatives à votre compte ou à nos services (selon vos préférences).</li>
          <li>Assurer la sécurité et prévenir les fraudes sur la plateforme.</li>
          <li>Respecter nos obligations légales.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>4. Base légale des traitements</h2>
        <ul>
          <li><strong>Exécution du contrat :</strong> Gestion du compte, fourniture des services.</li>
          <li><strong>Intérêt légitime :</strong> Amélioration de la plateforme, sécurité.</li>
          <li><strong>Consentement :</strong> Cookies analytiques et marketing, communications commerciales.</li>
          <li><strong>Obligation légale :</strong> Conservation de certaines données comptables et légales.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>5. Partage des données</h2>
        <p>
          Nous ne vendons <strong>jamais</strong> vos données personnelles à des tiers. Nous partageons uniquement les informations strictement nécessaires avec :
        </p>
        <ul>
          <li><strong>Supabase :</strong> Hébergement de la base de données (serveurs en Europe).</li>
          <li><strong>Vercel :</strong> Hébergement de l'application web.</li>
          <li><strong>Stripe :</strong> Traitement sécurisé des paiements.</li>
          <li><strong>France Travail (Pôle Emploi) :</strong> API offres d'emploi (données non personnelles).</li>
          <li><strong>Autorités légales :</strong> Si requis par la loi ou une décision judiciaire.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>6. Sécurité des données</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 my-4">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-800 m-0 mb-1">Mesures de protection</h4>
            <p className="text-sm text-blue-700 m-0">
              Chiffrement en transit (TLS 1.3) et au repos, mots de passe hachés (bcrypt), accès aux données restreint au personnel habilité, journalisation des accès.
            </p>
          </div>
        </div>
      </div>

      <div className="legal-section">
        <h2>7. Durée de conservation</h2>
        <ul>
          <li><strong>Données de compte :</strong> Conservées pendant toute la durée d'activité du compte, puis supprimées ou anonymisées dans un délai de 30 jours après fermeture.</li>
          <li><strong>Résultats de tests :</strong> Conservés selon les préférences utilisateur, supprimables à tout moment.</li>
          <li><strong>Données de facturation :</strong> 10 ans (obligation légale).</li>
          <li><strong>Logs de sécurité :</strong> 12 mois.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>8. Vos droits RGPD</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles.</li>
          <li><strong>Droit de rectification :</strong> Corriger des informations inexactes ou incomplètes.</li>
          <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données ("droit à l'oubli").</li>
          <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et lisible par machine.</li>
          <li><strong>Droit d'opposition :</strong> Vous opposer à certains traitements basés sur l'intérêt légitime.</li>
          <li><strong>Droit à la limitation :</strong> Demander la suspension temporaire du traitement de vos données.</li>
        </ul>
        <p>Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) :</p>
        <a
          href="mailto:dpo@cleavenir.com"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium mt-2"
        >
          <Mail className="w-4 h-4" /> dpo@cleavenir.com
        </a>
        <p className="mt-4 text-sm text-slate-500">
          Vous disposez également du droit d'introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a>.
        </p>
      </div>

      <div className="legal-section">
        <h2>9. Transferts hors UE</h2>
        <p>
          Certains de nos prestataires (Vercel, Stripe) sont basés aux États-Unis. Ces transferts sont encadrés par des garanties appropriées conformes au RGPD (clauses contractuelles types de la Commission européenne).
        </p>
      </div>

      <div className="legal-section">
        <h2>10. Contact</h2>
        <p>
          Pour toute question relative à cette politique ou à l'exercice de vos droits :<br/>
          <a href="mailto:dpo@cleavenir.com" className="text-blue-600 hover:underline">dpo@cleavenir.com</a> — Délégué à la Protection des Données CléAvenir
        </p>
      </div>
    </LegalLayout>
  );
};

export default PolitiqueConfidentialitePage;
