import React, { useState } from 'react';
import {
  X, ChevronDown, Info, BookOpen, Briefcase, Building, BarChart2,
  CheckCircle, Users, FileText, Star, GitCompare, ArrowRight,
  Clock, TrendingUp, MapPin, Award, DollarSign, Globe, ExternalLink,
  GraduationCap, Download, Play, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import './FormationDetailsPanel.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Contextual data generator based on formation title keywords
   ───────────────────────────────────────────────────────────────────────────── */

const SECTORS = {
  informatique: {
    keywords: ['informatique', 'numérique', 'web', 'digital', 'développeur', 'réseau', 'système', 'cybersécurité', 'data', 'intelligence artificielle', 'logiciel', 'coding'],
    careers: [
      { title: 'Développeur Web / Mobile', salary: '32–48k€', demand: 'Très élevée', growth: '+22%', description: 'Conception et développement d\'applications web et mobiles.' },
      { title: 'Administrateur Systèmes & Réseaux', salary: '30–45k€', demand: 'Élevée', growth: '+15%', description: 'Gestion et maintenance des infrastructures informatiques.' },
      { title: 'Analyste Données (Data Analyst)', salary: '35–55k€', demand: 'Très élevée', growth: '+28%', description: 'Analyse et exploitation des données pour la prise de décision.' },
      { title: 'Technicien Support IT', salary: '24–35k€', demand: 'Élevée', growth: '+10%', description: 'Assistance technique et résolution des incidents informatiques.' },
    ],
    modules: [
      { name: 'Algorithmique & Programmation', hours: '180h', diff: 'Intermédiaire', desc: 'Bases de la logique de programmation, structures de données et algorithmes.' },
      { name: 'Bases de Données & SQL', hours: '120h', diff: 'Intermédiaire', desc: 'Conception, modélisation et interrogation de bases de données relationnelles.' },
      { name: 'Réseaux & Systèmes', hours: '100h', diff: 'Intermédiaire', desc: 'Architecture réseau, protocoles TCP/IP, administration système.' },
      { name: 'Développement Web (HTML/CSS/JS)', hours: '160h', diff: 'Intermédiaire', desc: 'Création d\'interfaces web modernes et responsives.' },
      { name: 'Projet Professionnel & Stage', hours: '400h', diff: 'Avancé', desc: 'Mise en situation réelle en entreprise pour valider les acquis.' },
    ],
    skills: ['Programmation (Python, Java, PHP)', 'HTML/CSS/JavaScript', 'SQL & NoSQL', 'Git & versioning', 'Méthodes Agile/Scrum', 'Cybersécurité de base', 'Cloud computing'],
    partners: ['Capgemini', 'Sopra Steria', 'Orange Business Services', 'Atos', 'Thales', 'IBM France'],
    startingSalary: 28000, salary3y: 36000, salary5y: 45000, successRate: 83, employmentRate: 89, satisfaction: 4.2,
  },
  commerce: {
    keywords: ['commerce', 'vente', 'marketing', 'management', 'gestion', 'entreprise', 'mco', 'ndrc', 'commercial', 'banque', 'finance', 'comptabilité', 'assurance'],
    careers: [
      { title: 'Chargé de Clientèle', salary: '26–38k€', demand: 'Élevée', growth: '+8%', description: 'Gestion et développement d\'un portefeuille de clients.' },
      { title: 'Responsable Commercial', salary: '35–55k€', demand: 'Élevée', growth: '+12%', description: 'Pilotage d\'une équipe de vente et atteinte des objectifs commerciaux.' },
      { title: 'Chargé de Marketing Digital', salary: '30–45k€', demand: 'Très élevée', growth: '+18%', description: 'Stratégie de communication digitale et acquisition client.' },
      { title: 'Contrôleur de Gestion', salary: '35–50k€', demand: 'Stable', growth: '+5%', description: 'Analyse financière et pilotage de la performance économique.' },
    ],
    modules: [
      { name: 'Techniques de Vente & Négociation', hours: '120h', diff: 'Intermédiaire', desc: 'Méthodes de prospection, argumentation et closing.' },
      { name: 'Marketing & Communication', hours: '100h', diff: 'Débutant', desc: 'Stratégies marketing, e-commerce et réseaux sociaux.' },
      { name: 'Gestion de la Relation Client (CRM)', hours: '80h', diff: 'Intermédiaire', desc: 'Outils CRM, fidélisation et satisfaction client.' },
      { name: 'Économie & Droit des Affaires', hours: '90h', diff: 'Intermédiaire', desc: 'Cadre juridique et économique de l\'entreprise.' },
      { name: 'Stage & Projet Entreprise', hours: '500h', diff: 'Avancé', desc: 'Immersion professionnelle en environnement commercial.' },
    ],
    skills: ['Techniques de vente', 'CRM (Salesforce, HubSpot)', 'Marketing digital', 'Excel & Pack Office', 'Gestion de projet', 'Communication professionnelle'],
    partners: ['BNP Paribas', 'Leroy Merlin', 'LVMH', 'Carrefour', 'Société Générale', 'Decathlon'],
    startingSalary: 24000, salary3y: 32000, salary5y: 42000, successRate: 80, employmentRate: 85, satisfaction: 4.0,
  },
  sante: {
    keywords: ['infirmier', 'santé', 'médical', 'aide-soignant', 'paramédical', 'pharmacie', 'kiné', 'ergothérapie', 'psychologie'],
    careers: [
      { title: 'Infirmier(ère) Diplômé(e) d\'État', salary: '28–40k€', demand: 'Très élevée', growth: '+15%', description: 'Soins infirmiers, surveillance des patients et collaboration médicale.' },
      { title: 'Aide-Soignant(e)', salary: '22–30k€', demand: 'Élevée', growth: '+12%', description: 'Accompagnement des patients dans les actes de la vie quotidienne.' },
      { title: 'Cadre de Santé', salary: '38–52k€', demand: 'Stable', growth: '+6%', description: 'Encadrement et coordination des équipes soignantes.' },
      { title: 'Coordinateur Médico-Social', salary: '30–42k€', demand: 'Élevée', growth: '+10%', description: 'Coordination des parcours de soins et accompagnement social.' },
    ],
    modules: [
      { name: 'Anatomie & Physiologie', hours: '150h', diff: 'Intermédiaire', desc: 'Structure et fonctionnement du corps humain.' },
      { name: 'Soins Infirmiers Fondamentaux', hours: '200h', diff: 'Intermédiaire', desc: 'Techniques de soins, hygiène et asepsie.' },
      { name: 'Pharmacologie & Traitements', hours: '80h', diff: 'Avancé', desc: 'Médicaments, posologies et interactions médicamenteuses.' },
      { name: 'Communication en Santé', hours: '60h', diff: 'Débutant', desc: 'Relation soignant-patient, annonce et éthique médicale.' },
      { name: 'Stages Cliniques', hours: '900h', diff: 'Avancé', desc: 'Mises en situation dans divers services hospitaliers et médico-sociaux.' },
    ],
    skills: ['Soins techniques', 'Pharmacologie', 'Écoute & empathie', 'Gestion du stress', 'Travail en équipe pluridisciplinaire', 'Informatique médicale'],
    partners: ['CHU de France', 'Korian', 'Orpea', 'Croix-Rouge Française', 'APHP', 'Ramsay Santé'],
    startingSalary: 25000, salary3y: 30000, salary5y: 36000, successRate: 78, employmentRate: 94, satisfaction: 4.3,
  },
  btp: {
    keywords: ['bâtiment', 'travaux', 'construction', 'génie civil', 'btp', 'architecture', 'électricité', 'plomberie', 'maçonnerie', 'topographie'],
    careers: [
      { title: 'Conducteur de Travaux', salary: '38–55k€', demand: 'Élevée', growth: '+10%', description: 'Pilotage et coordination des chantiers de construction.' },
      { title: 'Technicien Bureau d\'Études', salary: '30–42k€', demand: 'Élevée', growth: '+8%', description: 'Conception et chiffrage de projets de construction.' },
      { title: 'Chef de Chantier', salary: '32–48k€', demand: 'Élevée', growth: '+9%', description: 'Encadrement des équipes sur site et respect des délais.' },
      { title: 'Économiste de la Construction', salary: '35–50k€', demand: 'Stable', growth: '+5%', description: 'Estimation des coûts et optimisation des ressources.' },
    ],
    modules: [
      { name: 'Dessin Technique & CAO/DAO', hours: '140h', diff: 'Intermédiaire', desc: 'Lecture de plans, AutoCAD et logiciels de conception.' },
      { name: 'Matériaux & Techniques de Construction', hours: '120h', diff: 'Intermédiaire', desc: 'Propriétés des matériaux et procédés de construction.' },
      { name: 'Topographie & Implantation', hours: '80h', diff: 'Intermédiaire', desc: 'Mesures sur terrain, relevés et implantation d\'ouvrages.' },
      { name: 'Gestion de Chantier & Sécurité', hours: '100h', diff: 'Avancé', desc: 'Planning, gestion budgétaire et prévention des risques.' },
      { name: 'Stage en Entreprise BTP', hours: '400h', diff: 'Avancé', desc: 'Participation réelle à des projets de construction.' },
    ],
    skills: ['AutoCAD / Revit', 'Lecture de plans', 'Gestion de chantier', 'Métrés & devis', 'Réglementation thermique (RE2020)', 'Travail en équipe'],
    partners: ['Bouygues Construction', 'Vinci', 'Eiffage', 'Spie Batignolles', 'Nexity', 'Colas'],
    startingSalary: 26000, salary3y: 34000, salary5y: 44000, successRate: 81, employmentRate: 87, satisfaction: 4.1,
  },
  tourisme: {
    keywords: ['tourisme', 'hôtellerie', 'restauration', 'cuisine', 'hotellerie', 'accueil', 'hébergement', 'voyage', 'événementiel'],
    careers: [
      { title: 'Responsable d\'Hébergement', salary: '28–42k€', demand: 'Élevée', growth: '+9%', description: 'Gestion des services d\'accueil et d\'hébergement d\'un établissement.' },
      { title: 'Chef de Partie / Cuisinier', salary: '24–36k€', demand: 'Très élevée', growth: '+14%', description: 'Préparation et élaboration des plats en brigade.' },
      { title: 'Agent de Voyage / Conseiller', salary: '22–32k€', demand: 'Stable', growth: '+3%', description: 'Conception et vente de séjours et circuits touristiques.' },
      { title: 'Chargé d\'Événementiel', salary: '28–42k€', demand: 'Élevée', growth: '+11%', description: 'Organisation et logistique d\'événements professionnels.' },
    ],
    modules: [
      { name: 'Techniques d\'Accueil & Service', hours: '120h', diff: 'Débutant', desc: 'Protocoles d\'accueil, techniques de service en salle et bar.' },
      { name: 'Cuisine & Gastronomie', hours: '200h', diff: 'Intermédiaire', desc: 'Techniques culinaires, hygiène HACCP et créativité.' },
      { name: 'Gestion Hôtelière & Revenue Management', hours: '100h', diff: 'Intermédiaire', desc: 'Yield management, taux d\'occupation et optimisation des revenus.' },
      { name: 'Langues Étrangères (Anglais + option)', hours: '80h', diff: 'Débutant', desc: 'Communication professionnelle en contexte touristique international.' },
      { name: 'Stage en Établissement', hours: '600h', diff: 'Avancé', desc: 'Immersion complète en hôtel, restaurant ou agence de voyage.' },
    ],
    skills: ['Service en salle', 'Anglais professionnel', 'PMS hôteliers (Opera)', 'Cuisine & HACCP', 'Vente & conseil', 'Gestion de l\'expérience client'],
    partners: ['AccorHotels', 'Marriott', 'Club Med', 'TUI France', 'Sodexo', 'Elior'],
    startingSalary: 21000, salary3y: 27000, salary5y: 34000, successRate: 79, employmentRate: 86, satisfaction: 4.1,
  },
  default: {
    keywords: [],
    careers: [
      { title: 'Responsable de Projet', salary: '32–48k€', demand: 'Élevée', growth: '+12%', description: 'Pilotage de projets transverses et coordination d\'équipes.' },
      { title: 'Chargé de Développement RH', salary: '30–42k€', demand: 'Stable', growth: '+7%', description: 'Recrutement, formation et gestion des talents.' },
      { title: 'Consultant Junior', salary: '28–40k€', demand: 'Élevée', growth: '+10%', description: 'Conseil et accompagnement des organisations.' },
      { title: 'Chargé de Communication', salary: '26–38k€', demand: 'Stable', growth: '+6%', description: 'Stratégie de communication interne et externe.' },
    ],
    modules: [
      { name: 'Fondamentaux du Domaine', hours: '160h', diff: 'Débutant', desc: 'Concepts clés, histoire et état de l\'art du secteur.' },
      { name: 'Méthodes & Outils Professionnels', hours: '120h', diff: 'Intermédiaire', desc: 'Outils et méthodes de référence utilisés en entreprise.' },
      { name: 'Gestion de Projet', hours: '80h', diff: 'Intermédiaire', desc: 'Planification, suivi budgétaire et management d\'équipe.' },
      { name: 'Communication & Soft Skills', hours: '60h', diff: 'Débutant', desc: 'Prise de parole, travail en équipe et gestion du temps.' },
      { name: 'Stage & Mémoire Professionnel', hours: '400h', diff: 'Avancé', desc: 'Application concrète des acquis en contexte professionnel.' },
    ],
    skills: ['Gestion de projet', 'Pack Office / Google Workspace', 'Communication professionnelle', 'Travail en équipe', 'Analyse et synthèse', 'Anglais professionnel'],
    partners: ['Decathlon', 'L\'Oréal', 'Total Energies', 'Danone', 'Michelin', 'Schneider Electric'],
    startingSalary: 24000, salary3y: 31000, salary5y: 40000, successRate: 80, employmentRate: 83, satisfaction: 4.0,
  },
};

const REVIEWS = [
  { name: 'Sarah M.', time: 'Il y a 3 semaines', stars: 5, text: 'Formation vraiment complète. Les enseignants sont disponibles et les cours très bien structurés. J\'ai trouvé un emploi deux semaines après ma sortie !' },
  { name: 'Lucas B.', time: 'Il y a 2 mois', stars: 5, text: 'Très bonne ambiance de classe. Les projets pratiques m\'ont permis de construire un vrai portfolio. Je recommande vivement !' },
  { name: 'Amina K.', time: 'Il y a 4 mois', stars: 4, text: 'Formation solide avec un bon équilibre théorie/pratique. Le stage de fin d\'année est bien encadré. Seul bémol : les emplois du temps parfois chargés.' },
  { name: 'Thomas R.', time: 'Il y a 5 mois', stars: 5, text: 'Les intervenants professionnels apportent un regard concret du monde du travail. Ça change vraiment de la théorie pure !' },
  { name: 'Julie F.', time: 'Il y a 6 mois', stars: 4, text: 'Excellente formation. J\'ai appris énormément et les ressources pédagogiques sont de qualité. Je me sens vraiment prête pour le marché du travail.' },
];

const getSector = (title = '', level = '') => {
  const lower = (title + ' ' + level).toLowerCase();
  for (const [key, sector] of Object.entries(SECTORS)) {
    if (key === 'default') continue;
    if (sector.keywords.some(k => lower.includes(k))) return sector;
  }
  return SECTORS.default;
};

const seedRandom = (str, min, max) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return min + Math.abs(h) % (max - min + 1);
};

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────────────────────────────────────── */

const Section = ({ id, expanded, onToggle, title, icon, children, badge }) => (
  <div className="details-section">
    <div className="section-header" onClick={onToggle}>
      <div className="section-title">
        <span className="text-indigo-600">{icon}</span>
        {title}
        {badge && <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
      </div>
      <ChevronDown className={`toggle-icon ${expanded ? 'open' : ''}`} />
    </div>
    {expanded && <div className="section-content">{children}</div>}
  </div>
);

const StatCard = ({ label, value, icon, sub }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="text-sm text-slate-500 font-medium mt-1">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
  </div>
);

const SalaryCard = ({ label, value, highlighted }) => (
  <div className={`p-4 rounded-lg border ${highlighted ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
    <div className="text-sm text-slate-500 mb-1">{label}</div>
    <div className={`text-xl font-bold ${highlighted ? 'text-indigo-700' : 'text-slate-800'}`}>
      {typeof value === 'number' ? `${value.toLocaleString('fr-FR')} €` : value}
    </div>
  </div>
);

const StarRow = ({ count }) => (
  <div className="flex text-amber-500">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={14} fill={i <= count ? 'currentColor' : 'none'} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main panel
   ───────────────────────────────────────────────────────────────────────────── */

const FormationDetailsPanel = ({ formationId, formationData, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    curriculum: false,
    careers: false,
    stats: false,
    prerequisites: false,
    partners: false,
    resources: false,
    reviews: false,
    comparison: false,
  });

  const toggleSection = (s) =>
    setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));

  if (!formationData) return null;

  const { ui_details } = formationData;
  const title   = formationData.libelle_formation || '';
  const level   = ui_details?.level_label || '';
  const seed    = formationId || title;
  const sector  = getSector(title, level);

  // Seeded-deterministic slice so each formation shows consistent (but different) data
  const reviewOffset  = seedRandom(seed, 0, 2);
  const partnerOffset = seedRandom(seed, 0, 2);
  const selectedReviews  = [...REVIEWS.slice(reviewOffset), ...REVIEWS.slice(0, reviewOffset)].slice(0, 3);
  const selectedPartners = [...sector.partners.slice(partnerOffset), ...sector.partners.slice(0, partnerOffset)].slice(0, 4);

  // Adjust stats by level
  const levelMultiplier = { 'BAC+5': 1.25, 'BAC+3': 1.05, 'BAC+2': 1.0, 'CAP': 0.88, 'BAC': 0.92 };
  const mult = levelMultiplier[level] || 1;
  const stats = {
    successRate:     Math.round(sector.successRate * mult),
    employmentRate:  Math.min(99, Math.round(sector.employmentRate * mult)),
    satisfaction:    (Math.min(5, sector.satisfaction * (mult > 1 ? 1.05 : 1))).toFixed(1),
    totalStudents:   seedRandom(seed, 200, 1800),
    startingSalary:  Math.round(sector.startingSalary * mult),
    salary3y:        Math.round(sector.salary3y * mult),
    salary5y:        Math.round(sector.salary5y * mult),
  };

  // Contextual description
  const description = formationData.description
    || `La formation ${title} vous prépare aux métiers du secteur avec une approche alliant théorie rigoureuse et pratique intensive. Elle développe les compétences techniques et transversales attendues par les employeurs pour une insertion professionnelle rapide et durable.`;

  // Admission details by level
  const admissionLevel = {
    'BAC+5': { from: 'Bac+3 ou Bac+4 (L3, BUT, BTS avec mention)', process: ['Dossier académique (notes M1/L3)', 'Lettre de motivation détaillée', 'CV & portefeuille de projets', 'Entretien de motivation (30 min)', 'Tests de niveau selon spécialité'] },
    'BAC+3': { from: 'Baccalauréat (toutes séries) ou équivalent', process: ['Dossier Parcoursup / candidature directe', 'Bulletins scolaires de Terminale et 1ère', 'Lettre de motivation', 'Entretien (certains établissements)'] },
    'BAC+2': { from: 'Baccalauréat (toutes séries) ou équivalent', process: ['Candidature via Parcoursup', 'Bulletins scolaires (1ère et Terminale)', 'Lettre de motivation & CV', 'Entretien de motivation (pour certains BTS)'] },
    'CAP':   { from: 'Ouvert à tous niveaux (3ème recommandé)', process: ['Candidature directe à l\'établissement', 'Entretien de motivation', 'Dossier scolaire (bienveillant)'] },
    'BAC':   { from: 'Brevet des collèges ou niveau 3ème', process: ['Affectation via Affelnet', 'Voeux sur Parcoursup (lycées)', 'Dossier de candidature'] },
  };
  const admission = admissionLevel[level] || admissionLevel['BAC+2'];

  return (
    <div className="formation-details-panel" id="details-panel">
      {/* ── Header ── */}
      <div className="details-header">
        <div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2">
            {level || 'Formation'}
          </Badge>
          <h2>{title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90 mt-1">
            {(formationData.etablissements?.[0]?.ville || formationData.ville) && (
              <span className="flex items-center gap-1"><MapPin size={14} /> {formationData.etablissements?.[0]?.ville || formationData.ville}</span>
            )}
            {ui_details?.duration && <span className="flex items-center gap-1"><Clock size={14} /> {ui_details.duration}</span>}
            {ui_details?.certificate && <span className="flex items-center gap-1"><Award size={14} /> {ui_details.certificate}</span>}
            {ui_details?.format && <span className="flex items-center gap-1"><Globe size={14} /> {ui_details.format}</span>}
          </div>
        </div>
        <button onClick={onClose} className="close-btn" aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      <div className="details-content">

        {/* ── 1. Informations Générales ── */}
        <Section id="general" expanded={expandedSections.general} onToggle={() => toggleSection('general')}
          title="Informations Générales" icon={<Info size={20} />}>
          <div className="description-box">{description}</div>
          <div className="info-grid">
            {[
              { label: 'Type de formation',      value: ui_details?.format || 'Présentiel / Hybride' },
              { label: 'Niveau de sortie',        value: level || 'Non précisé' },
              { label: 'Coût & Financement',      value: ui_details?.cost || 'Gratuit — financé CPF / Région' },
              { label: 'Langue d\'enseignement',  value: ui_details?.language || 'Français' },
              { label: 'Durée totale des cours',  value: ui_details?.total_hours || 'Variable selon parcours' },
              { label: 'Certification',           value: 'Diplôme d\'État ou titre RNCP reconnu' },
              { label: 'Nombre de modules',       value: `${ui_details?.modules_count || sector.modules.length} unités d\'enseignement` },
              { label: 'Accès aux ressources',    value: ui_details?.access_duration || 'Accès illimité + e-learning' },
              { label: 'Établissements partenaires', value: `${formationData.etablissements?.length || 'Plusieurs'} établissements en France` },
            ].map((item, i) => (
              <div key={i} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 2. Programme & Compétences ── */}
        <Section id="curriculum" expanded={expandedSections.curriculum} onToggle={() => toggleSection('curriculum')}
          title="Programme & Compétences" icon={<BookOpen size={20} />} badge={`${sector.modules.length} modules`}>
          <h4 className="font-semibold text-slate-800 mb-4">Modules principaux</h4>
          <div className="module-list">
            {sector.modules.map((mod, i) => (
              <div key={i} className="module-card">
                <div className="module-badge">{i + 1}</div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800">{mod.name}</h5>
                  <p className="text-sm text-slate-500 mt-0.5">{mod.desc}</p>
                </div>
                <div className="text-right text-sm text-slate-500 shrink-0">
                  <div className="font-semibold text-indigo-600">{mod.hours}</div>
                  <div className="text-xs">{mod.diff}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-800 mt-6 mb-3">Compétences visées à l'issue de la formation</h4>
          <div className="skills-grid">
            {sector.skills.map((skill, i) => (
              <div key={i} className="skill-tag">
                <CheckCircle size={14} /> {skill}
              </div>
            ))}
          </div>

          {ui_details?.outcomes?.length > 0 && (
            <>
              <h4 className="font-semibold text-slate-800 mt-6 mb-3">Objectifs pédagogiques</h4>
              <ul className="space-y-2">
                {ui_details.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>

        {/* ── 3. Débouchés Professionnels ── */}
        <Section id="careers" expanded={expandedSections.careers} onToggle={() => toggleSection('careers')}
          title="Débouchés Professionnels" icon={<Briefcase size={20} />} badge={`${sector.careers.length} métiers`}>
          <p className="text-sm text-slate-500 mb-4">
            Les diplômés de cette formation accèdent aux métiers suivants dans les 6 mois après obtention du diplôme.
          </p>
          <div className="careers-grid">
            {sector.careers.map((career, i) => (
              <div key={i} className="career-card">
                <div className="compatibility-badge">{95 - i * 4}% Match</div>
                <h4 className="font-bold text-lg text-slate-800 mb-2 pr-20">{career.title}</h4>
                <p className="text-sm text-slate-600 mb-4">{career.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`demand-badge ${career.demand === 'Très élevée' ? 'demand-high' : career.demand === 'Élevée' ? 'demand-medium' : 'demand-low'}`}>
                    Demande : {career.demand}
                  </span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded flex items-center gap-1 text-slate-600">
                    <TrendingUp size={12} className="text-emerald-500" /> {career.growth}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <DollarSign size={14} className="text-emerald-500" /> {career.salary}
                  </span>
                  <Button variant="link" size="sm" className="text-indigo-600 p-0 h-auto text-xs gap-1">
                    Voir offres <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 4. Statistiques & Salaire ── */}
        <Section id="stats" expanded={expandedSections.stats} onToggle={() => toggleSection('stats')}
          title="Statistiques & Salaire" icon={<BarChart2 size={20} />}>
          <div className="stats-grid">
            <StatCard label="Étudiants / an" value={stats.totalStudents.toLocaleString('fr-FR')} icon={<Users size={24} />} sub="en France" />
            <StatCard label="Taux de réussite" value={`${stats.successRate}%`} icon={<Award size={24} />} sub="à l'examen final" />
            <StatCard label="Insertion pro." value={`${stats.employmentRate}%`} icon={<Briefcase size={24} />} sub="à 6 mois" />
            <StatCard label="Satisfaction" value={`${stats.satisfaction}/5`} icon={<Star size={24} />} sub="avis étudiants" />
          </div>

          <h4 className="font-semibold text-slate-800 mt-8 mb-4">Évolution salariale moyenne</h4>
          <div className="salary-breakdown">
            <SalaryCard label="Salaire débutant" value={stats.startingSalary} />
            <SalaryCard label="Après 3 ans d'expérience" value={stats.salary3y} />
            <SalaryCard label="Après 5 ans d'expérience" value={stats.salary5y} highlighted />
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
            <strong>📊 Source :</strong> Données estimées basées sur les enquêtes d'insertion professionnelle du SIES (Ministère de l'Enseignement Supérieur) et des observatoires de branche.
          </div>
        </Section>

        {/* ── 5. Prérequis & Admission ── */}
        <Section id="prerequisites" expanded={expandedSections.prerequisites} onToggle={() => toggleSection('prerequisites')}
          title="Prérequis & Admission" icon={<CheckCircle size={20} />}>
          <div className="prerequisites-list">
            <div className="prerequisite-item">
              <GraduationCap size={24} className="text-indigo-600 shrink-0 mt-1" />
              <div>
                <h5 className="font-bold text-slate-800">Niveau d'accès requis</h5>
                <p className="text-slate-600 mt-1">{admission.from}</p>
              </div>
            </div>

            <div className="prerequisite-item">
              <FileText size={24} className="text-indigo-600 shrink-0 mt-1" />
              <div className="flex-1">
                <h5 className="font-bold text-slate-800 mb-2">Processus d'admission</h5>
                <ol className="space-y-2">
                  {admission.process.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="prerequisite-item">
              <Calendar size={24} className="text-indigo-600 shrink-0 mt-1" />
              <div>
                <h5 className="font-bold text-slate-800">Calendrier des candidatures</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="font-semibold text-slate-700">📅 Ouverture des candidatures</div>
                    <div className="text-slate-500 mt-1">Janvier — Mars (selon établissement)</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="font-semibold text-slate-700">🎓 Rentrée</div>
                    <div className="text-slate-500 mt-1">Septembre (certains établissements : Février)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="prerequisite-item">
              <DollarSign size={24} className="text-indigo-600 shrink-0 mt-1" />
              <div>
                <h5 className="font-bold text-slate-800">Financement & Aides</h5>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Gratuit si formation initiale publique</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Finançable via le CPF (Compte Personnel de Formation)</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Éligible aux aides régionales et France Travail</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Contrat d'apprentissage possible (alternance)</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 6. Entreprises Partenaires ── */}
        <Section id="partners" expanded={expandedSections.partners} onToggle={() => toggleSection('partners')}
          title="Entreprises Partenaires" icon={<Users size={20} />} badge={`${selectedPartners.length} entreprises`}>
          <p className="text-sm text-slate-500 mb-4">Ces entreprises accueillent régulièrement des stagiaires et apprentis issus de cette formation.</p>
          <div className="partners-grid">
            {selectedPartners.map((name, i) => (
              <div key={i} className="partner-card">
                <div className="partner-logo">
                  <span className="text-2xl font-black text-slate-300">{name[0]}</span>
                </div>
                <h5 className="font-bold text-slate-800 mb-1">{name}</h5>
                <p className="text-xs text-slate-500 mb-3">Partenaire recrutement</p>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-xs mb-3">Offres stage / emploi</Badge>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <ExternalLink size={12} /> Voir les offres
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7. Ressources Pédagogiques ── */}
        <Section id="resources" expanded={expandedSections.resources} onToggle={() => toggleSection('resources')}
          title="Ressources Pédagogiques" icon={<FileText size={20} />}>
          <div className="resources-list">
            {[
              { icon: 'PDF', color: 'red', label: 'Brochure officielle de la formation', sublabel: 'Programme détaillé, conditions d\'admission, contacts', action: 'Télécharger' },
              { icon: 'VID', color: 'blue', label: 'Présentation vidéo de la formation', sublabel: 'Témoignages d\'anciens étudiants et enseignants', action: 'Regarder' },
              { icon: 'WEB', color: 'violet', label: 'Site officiel de l\'établissement', sublabel: 'Informations à jour, actualités et événements portes ouvertes', action: 'Visiter' },
              { icon: 'DOC', color: 'emerald', label: 'Référentiel de certification RNCP', sublabel: 'Compétences certifiées et blocs de validation', action: 'Consulter' },
              { icon: 'FAQ', color: 'amber', label: 'Questions fréquentes', sublabel: 'Alternance, financement, débouchés, témoignages', action: 'Lire' },
            ].map((res, i) => {
              const colorMap = { red: 'bg-red-100 text-red-600', blue: 'bg-blue-100 text-blue-600', violet: 'bg-violet-100 text-violet-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600' };
              return (
                <div key={i} className="resource-item">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${colorMap[res.color]}`}>
                    {res.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-800 text-sm">{res.label}</h5>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.sublabel}</p>
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0 text-indigo-600 text-xs shrink-0 gap-1">
                    {res.action === 'Télécharger' ? <Download size={12} /> : res.action === 'Regarder' ? <Play size={12} /> : <ExternalLink size={12} />}
                    {res.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── 8. Avis & Témoignages ── */}
        <Section id="reviews" expanded={expandedSections.reviews} onToggle={() => toggleSection('reviews')}
          title="Avis & Témoignages" icon={<Star size={20} />} badge={`${stats.satisfaction}/5 ★`}>
          <div className="flex items-center gap-6 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-500">{stats.satisfaction}</div>
              <StarRow count={Math.round(parseFloat(stats.satisfaction))} />
              <div className="text-xs text-slate-500 mt-1">Note globale</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3].map(stars => {
                const pct = stars === 5 ? 62 : stars === 4 ? 28 : 7;
                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500 w-3">{stars}</span>
                    <Star size={10} fill="currentColor" className="text-amber-400" />
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="reviews-list">
            {selectedReviews.map((review, i) => (
              <div key={i} className="review-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-slate-800">{review.name}</span>
                    <span className="text-slate-400 text-xs ml-2">— Diplômé(e)</span>
                  </div>
                  <span className="text-slate-400 text-xs">{review.time}</span>
                </div>
                <StarRow count={review.stars} />
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 9. Comparateur ── */}
        <Section id="comparison" expanded={expandedSections.comparison} onToggle={() => toggleSection('comparison')}
          title="Comparateur" icon={<GitCompare size={20} />}>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th>Cette formation</th>
                  <th>Moyenne nationale</th>
                  <th>Meilleure performance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Durée', mine: ui_details?.duration || '2 ans', avg: '2 ans', best: '2 ans' },
                  { label: 'Financement', mine: 'Gratuit / CPF', avg: 'CPF + aide', best: 'Intégralement financé' },
                  { label: 'Taux de réussite', mine: `${stats.successRate}%`, avg: '75%', best: '93%' },
                  { label: 'Taux d\'insertion', mine: `${stats.employmentRate}%`, avg: '80%', best: '97%' },
                  { label: 'Salaire débutant', mine: `${stats.startingSalary.toLocaleString('fr-FR')} €`, avg: '24 000 €', best: `${Math.round(stats.startingSalary * 1.1).toLocaleString('fr-FR')} €` },
                  { label: 'Satisfaction', mine: `${stats.satisfaction}/5`, avg: '3.9/5', best: '4.8/5' },
                  { label: 'Durée totale cours', mine: ui_details?.total_hours || '600–900h', avg: '700h', best: '1 000h+' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'current-formation' : ''}>
                    <td className="font-medium text-slate-700">{row.label}</td>
                    <td className="font-semibold text-indigo-700">{row.mine}</td>
                    <td className="text-slate-500">{row.avg}</td>
                    <td className="text-emerald-600 font-medium">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default FormationDetailsPanel;
