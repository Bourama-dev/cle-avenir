import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const MetierFilterPanel = ({
  matches = [],
  onFilterChange,
  currentSort = 'score',
  currentTab = 'all'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'score', label: '⭐ Meilleur Match', desc: 'Score de compatibilité' },
    { value: 'demand', label: '📈 Haute Demande', desc: 'Demande du marché' },
    { value: 'growth', label: '🌱 Croissance', desc: 'Potentiel de croissance' },
    { value: 'name', label: '🔤 Alphabétique', desc: 'Ordre alphabétique' },
  ];

  const tabs = [
    {
      value: 'all',
      label: '🎯 Tous',
      count: matches.length,
      desc: 'Tous les métiers'
    },
    {
      value: 'excellent',
      label: '🟢 Excellent Match',
      count: matches.filter(m => m.finalScore >= 80).length,
      desc: 'Score ≥ 80%'
    },
    {
      value: 'good',
      label: '🟡 Bon Match',
      count: matches.filter(m => m.finalScore >= 60 && m.finalScore < 80).length,
      desc: 'Score 60-79%'
    },
    {
      value: 'explore',
      label: '🔍 À Explorer',
      count: matches.filter(m => m.finalScore < 60).length,
      desc: 'Score < 60%'
    },
  ];

  const uniqueSectors = [...new Set(matches.map(m => m.sector || 'Général'))].sort();

  return (
    <div className="space-y-4 mb-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <motion.button
            key={tab.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange({ tab: tab.value })}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              currentTab === tab.value
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  currentTab === tab.value
                    ? 'bg-indigo-400 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Sort & Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 font-semibold text-sm text-slate-700 transition-all"
          >
            <Filter className="w-4 h-4" />
            Trier par
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-72"
            >
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({ sort: option.value });
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-indigo-50 transition-colors ${
                    currentSort === option.value ? 'bg-indigo-100 font-bold' : ''
                  }`}
                >
                  <div className="font-semibold text-slate-900">{option.label}</div>
                  <div className="text-xs text-slate-500">{option.desc}</div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sector Filter */}
        {uniqueSectors.length > 0 && (
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 font-semibold text-sm text-slate-700 transition-all">
              🏭 Secteurs
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-56 max-h-64 overflow-y-auto hidden group-hover:block">
              {uniqueSectors.map(sector => (
                <button
                  key={sector}
                  onClick={() => onFilterChange({ sector })}
                  className="w-full text-left px-4 py-2.5 border-b border-slate-100 hover:bg-indigo-50 transition-colors text-sm text-slate-700"
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={() => onFilterChange({ reset: true })}
          className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-semibold text-sm text-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      {/* Active Filter Info */}
      {currentTab !== 'all' && (
        <div className="text-sm text-slate-600">
          Affichage: {tabs.find(t => t.value === currentTab)?.desc}
        </div>
      )}
    </div>
  );
};

export default MetierFilterPanel;
