export const COVER_LETTER_TEMPLATES = [
  { id: 'classic_formal', name: 'Classique Formel', category: 'classique', color: '#1e293b', font: 'font-serif', description: 'Idéal pour les banques, assurances et administration.' },
  { id: 'modern_pro', name: 'Moderne Épuré', category: 'moderne', color: '#334155', font: 'font-sans', description: 'Un design net et précis pour les cadres dynamiques.' },
  { id: 'creative_colorful', name: 'Créatif Coloré', category: 'creatif', color: '#ec4899', font: 'font-sans', description: 'Pour les métiers de la communication et du design.' },
  { id: 'startup_tech', name: 'Startup Tech', category: 'tech', color: '#10b981', font: 'font-mono', description: 'Parfait pour les développeurs et chefs de projet.' },
  { id: 'artistic_bold', name: 'Artistique Audacieux', category: 'creatif', color: '#f59e0b', font: 'font-sans', description: 'Osez la couleur pour vous démarquer.' },
  { id: 'corporate_blue', name: 'Professionnel Corporatif', category: 'classique', color: '#1e3a8a', font: 'font-serif', description: 'Sérieux et professionnel, une valeur sûre.' },
  { id: 'minimalist_pure', name: 'Minimaliste Épuré', category: 'minimaliste', color: '#000000', font: 'font-sans', description: 'L\'essentiel, rien que l\'essentiel.' },
  { id: 'geometric_modern', name: 'Moderne Géométrique', category: 'moderne', color: '#6366f1', font: 'font-sans', description: 'Des formes subtiles pour structurer votre propos.' },
  { id: 'luxury_elegant', name: 'Élégant Luxe', category: 'luxe', color: '#b45309', font: 'font-serif', description: 'Noir et doré pour une touche premium.' },
  { id: 'infographic_creative', name: 'Créatif Infographie', category: 'creatif', color: '#0ea5e9', font: 'font-sans', description: 'Utilise des icônes pour aérer le texte.' },
  { id: 'sidebar_modern', name: 'Moderne Sidebar', category: 'moderne', color: '#2dd4bf', font: 'font-sans', description: 'Coordonnées en colonne latérale pour gagner de la place.' },
  { id: 'two_columns_pro', name: 'Professionnel 2 Colonnes', category: 'professionnel', color: '#64748b', font: 'font-sans', description: 'Une mise en page structurée et efficace.' },
  { id: 'portfolio_artistic', name: 'Artistique Portfolio', category: 'artistique', color: '#a855f7', font: 'font-sans', description: 'Mise en avant de votre style personnel.' },
  { id: 'tech_developer', name: 'Tech Developer', category: 'tech', color: '#22c55e', font: 'font-mono', description: 'Inspiré des éditeurs de code.' },
  { id: 'multicolor_modern', name: 'Moderne Coloré', category: 'moderne', color: '#f43f5e', font: 'font-sans', description: 'Dynamique et joyeux sans perdre en sérieux.' },
  { id: 'traditional_classic', name: 'Classique Traditionnel', category: 'classique', color: '#78350f', font: 'font-serif', description: 'La référence absolue pour les postes académiques.' },
  { id: 'refined_minimalist', name: 'Moderne Épuré v2', category: 'minimaliste', color: '#14b8a6', font: 'font-sans', description: 'Variante plus douce du minimalisme.' },
  { id: 'unique_creative', name: 'Créatif Unique', category: 'creatif', color: '#8b5cf6', font: 'font-sans', description: 'Pour ceux qui ne font rien comme les autres.' },
  { id: 'premium_pro', name: 'Professionnel Premium', category: 'luxe', color: '#0f172a', font: 'font-serif', description: 'L\'excellence incarnée.' },
  { id: 'futuristic_modern', name: 'Moderne Futuriste', category: 'moderne', color: '#d946ef', font: 'font-sans', description: 'Avant-gardiste et visionnaire.' },
  { id: 'spontaneous_app', name: 'Candidature Spontanée', category: 'original', color: '#f97316', font: 'font-sans', description: 'Conçu pour capter l\'attention immédiatement.' },
  { id: 'job_response', name: 'Réponse Annonce', category: 'efficace', color: '#06b6d4', font: 'font-sans', description: 'Va droit au but, point par point.' },
  { id: 'career_change', name: 'Changement de Carrière', category: 'persuasif', color: '#84cc16', font: 'font-sans', description: 'Met l\'accent sur les compétences transférables.' },
  { id: 'internship_dynamic', name: 'Stage / Alternance', category: 'jeune', color: '#eab308', font: 'font-sans', description: 'Fraîcheur et motivation avant tout.' },
  { id: 'freelance_pro', name: 'Freelance', category: 'independant', color: '#4b5563', font: 'font-sans', description: 'Présentez-vous comme un partenaire, pas un employé.' }
];

export const getTemplateById = (id) => COVER_LETTER_TEMPLATES.find(t => t.id === id) || COVER_LETTER_TEMPLATES[0];