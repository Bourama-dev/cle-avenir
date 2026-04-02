import React from 'react';
import { ArrowRight, Frown, Smile } from 'lucide-react';

const BeforeAfter = () => {
  return (
    <section className="hiw-section">
      <div className="hiw-section-title">
        <h2>L'effet CléAvenir</h2>
      </div>

      <div className="hiw-ba-container">
        {/* Before */}
        <div className="hiw-ba-column hiw-ba-before">
          <div className="flex items-center gap-3 mb-6">
            <Frown className="w-8 h-8 text-red-500" />
            <h3 className="text-xl font-bold text-red-900 m-0">Avant</h3>
          </div>
          <ul className="space-y-4 text-red-800">
            <li className="flex gap-3 items-start">
              <span className="text-xl">😕</span>
              <span>"Je suis perdu, il y a trop d'options..."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">😰</span>
              <span>"Peur de me tromper de voie."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">📉</span>
              <span>"Je ne sais pas quels métiers recrutent."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">🥱</span>
              <span>"Les bilans classiques sont trop longs."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">💸</span>
              <span>"Un coaching privé coûte trop cher."</span>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="hiw-ba-arrow">
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* After */}
        <div className="hiw-ba-column hiw-ba-after">
          <div className="flex items-center gap-3 mb-6">
            <Smile className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-bold text-green-900 m-0">Avec CléAvenir</h3>
          </div>
          <ul className="space-y-4 text-green-800">
            <li className="flex gap-3 items-start">
              <span className="text-xl">🎯</span>
              <span>"J'ai 5 pistes claires et motivantes."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">🚀</span>
              <span>"Je sais exactement quelle formation faire."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">💼</span>
              <span>"Je vise des métiers d'avenir."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">⚡</span>
              <span>"Résultats en 10 minutes chrono."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl">💎</span>
              <span>"Une expertise pro accessible à tous."</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;