import React, { useState, useMemo, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { trackEvent, trackPageView } from '@/services/trackingService';

/* ---------------------------------------
   SAFE UTILS
---------------------------------------- */
const safeStr = (v) => (v == null ? '' : String(v));
const norm = (v) => safeStr(v).toLowerCase().trim();

/* ---------------------------------------
   STATIC DATA (peut devenir API plus tard)
---------------------------------------- */
const RESOURCES = [
  {
    id: 1,
    title: 'Guide Complet des Métiers Tech',
    description: 'Découvrez les différents métiers du secteur technologique, leurs compétences requises et les salaires moyens.',
    category: 'Guide',
    format: 'PDF',
    downloadUrl: '#',
    icon: '📚'
  },
  {
    id: 2,
    title: 'Conseils pour Réussir votre Entretien',
    description: 'Préparation, questions fréquentes et stratégies pour impressionner vos recruteurs.',
    category: 'Conseils',
    format: 'PDF',
    downloadUrl: '#',
    icon: '💼'
  },
  {
    id: 3,
    title: 'Tendances du Marché 2024',
    description: 'Analyse des tendances actuelles du marché de l\'emploi et des compétences les plus demandées.',
    category: 'Analyse',
    format: 'PDF',
    downloadUrl: '#',
    icon: '📊'
  },
  {
    id: 4,
    title: 'Modèles de CV et Lettres de Motivation',
    description: 'Templates professionnels à personnaliser pour vos candidatures.',
    category: 'Templates',
    format: 'ZIP',
    downloadUrl: '#',
    icon: '📄'
  },
  {
    id: 5,
    title: 'Ressources de Formation Recommandées',
    description: 'Liste des meilleures plateformes et cours pour développer vos compétences.',
    category: 'Formation',
    format: 'PDF',
    downloadUrl: '#',
    icon: '🎓'
  },
  {
    id: 6,
    title: 'Glossaire des Termes Métier',
    description: 'Définitions et explications des termes techniques et professionnels courants.',
    category: 'Référence',
    format: 'PDF',
    downloadUrl: '#',
    icon: '📖'
  }
];

export default function ResourcesPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  /* ---------------------------------------
     SEO + Tracking page view
  ---------------------------------------- */
  useEffect(() => {
    document.title = 'Ressources — CléAvenir';
    trackPageView('/resources', 'Ressources');
  }, []);

  /* ---------------------------------------
     Filtrage optimisé (memoized)
  ---------------------------------------- */
  const filteredResources = useMemo(() => {
    const q = norm(searchTerm);
    if (!q) return RESOURCES;

    return RESOURCES.filter((r) =>
      norm(r.title).includes(q) ||
      norm(r.description).includes(q) ||
      norm(r.category).includes(q)
    );
  }, [searchTerm]);

  /* ---------------------------------------
     Handlers
  ---------------------------------------- */
  const handleSearch = (value) => {
    setSearchTerm(value);
    trackEvent('resource_search', {
      query: value,
      length: value.length
    });
  };

  const handleDownload = (resource) => {
    trackEvent('resource_download', {
      resourceId: resource.id,
      title: resource.title,
      category: resource.category,
      format: resource.format
    });

    // Mock download (remplaçable par vrai lien)
    if (!resource.downloadUrl || resource.downloadUrl === '#') {
      alert('Téléchargement simulé (ressource bientôt disponible)');
      return;
    }

    window.open(resource.downloadUrl, '_blank', 'noopener');
  };

  /* ---------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header removed */}

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              📚 Ressources
            </h1>
            <p className="text-xl text-slate-600">
              Accédez à nos guides, templates et ressources pour réussir votre carrière
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                aria-label="Rechercher une ressource"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-slate-200 p-6"
              >
                <div className="text-4xl mb-4">{resource.icon}</div>

                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {resource.category}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {resource.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {resource.format}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(resource)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Télécharger
                </button>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 font-semibold">
                Aucune ressource trouvée
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}