import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { SECTORS, SECTOR_CATEGORIES } from '@/constants/sectors';

const SectorDiscoveryModule = ({ profile }) => {
  const [expandedSector, setExpandedSector] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const RIASEC_SECTOR_MAPPING = {
    R: ['Bâtiment & Travaux Publics', 'Industrie & Mécanique', 'Métiers Verts', 'Électricité & Électronique'],
    I: ['Informatique & Numérique', 'Chimie & Pharmacie', 'Recherche', 'Sciences & Santé'],
    A: ['Arts & Design', 'Multimédia & Audiovisuel', 'Luxe & Mode', 'Architecture'],
    S: ['Santé & Social', 'Services à la Personne', 'Éducation', 'Sécurité & Prévention'],
    E: ['Commerce & Vente', 'Gestion & Management', 'Immobilier', 'Entrepreneuriat'],
    C: ['Finance & Comptabilité', 'Logistique & Transport', 'Fonction Publique', 'Administration'],
  };

  const SECTOR_CATEGORIES = {
    'Création & Communication': ['Arts & Design', 'Multimédia & Audiovisuel', 'Marketing & Communication', 'Luxe & Mode'],
    'Industrie & Construction': ['Bâtiment & Travaux Publics', 'Industrie & Mécanique', 'Électricité & Électronique', 'Chimie & Pharmacie'],
    'Sciences & Santé': ['Santé & Social', 'Recherche', 'Chimie & Pharmacie', 'Optique & Lunetterie'],
    'Tertiaire': ['Commerce & Vente', 'Finance & Comptabilité', 'Gestion & Management', 'Ressources Humaines'],
    'Services': ['Services à la Personne', 'Tourisme & Loisirs', 'Hôtellerie & Restauration', 'Sécurité & Prévention'],
    'Nature & Environnement': ['Métiers Verts', 'Agriculture', 'Métiers de l\'Eau'],
    'Technologie': ['Informatique & Numérique', 'Électricité & Électronique', 'Multimédia & Audiovisuel'],
    'Artisanat': ['Métiers du Bois', 'Métiers du Cuir', 'Métiers du Textile', 'Prothèse Dentaire'],
  };

  const matchedSectors = useMemo(() => {
    const sectors = new Set();
    Object.entries(profile).forEach(([letter, score]) => {
      if (score >= 50) {
        const recommendedSectors = RIASEC_SECTOR_MAPPING[letter] || [];
        recommendedSectors.forEach(s => sectors.add(s));
      }
    });
    return Array.from(sectors);
  }, [profile]);

  const allCategories = ['all', ...Object.keys(SECTOR_CATEGORIES)];

  const sectorsToShow = useMemo(() => {
    if (selectedCategory === 'all') {
      return matchedSectors;
    }
    return SECTOR_CATEGORIES[selectedCategory] || [];
  }, [selectedCategory, matchedSectors]);

  const getSectorEmoji = (sectorName) => {
    const emojiMap = {
      'Informatique & Numérique': '💻',
      'Santé & Social': '🏥',
      'Arts & Design': '🎨',
      'Bâtiment & Travaux Publics': '🏗️',
      'Commerce & Vente': '🛍️',
      'Finance & Comptabilité': '💰',
      'Industrie & Mécanique': '⚙️',
      'Métiers Verts': '🌱',
      'Gestion & Management': '📊',
      'Électricité & Électronique': '⚡',
      'Chimie & Pharmacie': '🧪',
      'Services à la Personne': '👥',
      'Multimédia & Audiovisuel': '🎬',
      'Ressources Humaines': '👔',
      'Logistique & Transport': '🚚',
      'Immobilier': '🏠',
      'Tourisme & Loisirs': '✈️',
      'Luxe & Mode': '👗',
      'Sécurité & Prévention': '🛡️',
      'Fonction Publique': '🏛️',
      'Métiers du Bois': '🪵',
      'Métiers du Cuir': '🎒',
      'Métiers du Textile': '🧵',
      'Optique & Lunetterie': '👓',
      'Verre & Cristal': '🔮',
    };
    return emojiMap[sectorName] || '💼';
  };

  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mb-4">
          <Sparkles className="w-7 h-7 text-violet-600" />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3">
          Explorez les Secteurs qui Vous Correspondent
        </h3>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Basé sur votre profil RIASEC, découvrez les domaines professionnels où vous pourriez vous épanouir.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category === 'all' ? 'Tous les Secteurs' : category}
          </button>
        ))}
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {sectorsToShow.map(sector => {
            const isMatched = matchedSectors.includes(sector);
            const isExpanded = expandedSector === sector;

            return (
              <motion.div
                key={sector}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`cursor-pointer transition-all overflow-hidden ${
                    isMatched
                      ? 'border-indigo-300 bg-indigo-50/50 hover:shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                  onClick={() => setExpandedSector(isExpanded ? null : sector)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getSectorEmoji(sector)}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{sector}</h4>
                          {isMatched && (
                            <div className="flex items-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Bien adapté</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <p className="text-sm text-slate-600 mb-3">
                            Ce secteur valorise vos points forts et aligne vos intérêts professionnels.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(profile)
                              .filter(([_, score]) => score >= 50)
                              .map(([letter]) => (
                                <Badge key={letter} variant="secondary" className="text-xs">
                                  {letter}
                                </Badge>
                              ))}
                          </div>
                          <Button
                            size="sm"
                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/metiers?sector=${encodeURIComponent(sector)}`;
                            }}
                          >
                            Voir les métiers
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {sectorsToShow.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600 text-lg">
            Aucun secteur ne correspond à votre sélection. Essayez une autre catégorie.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectorDiscoveryModule;
