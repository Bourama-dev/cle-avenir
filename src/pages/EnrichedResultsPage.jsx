import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TestResultsService } from '../services/testResultsService';
import { Lock, ChevronRight, Zap, Crown } from 'lucide-react';
import { trackEvent, trackPageView } from '@/services/trackingService';

/* ---------------------------------------
   Helpers
---------------------------------------- */
const CACHE_KEY = 'cleavenir_enriched_results';

const getCachedResults = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

export default function EnrichedResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [results, setResults] = useState(null);
  const [displayedResults, setDisplayedResults] = useState(null);
  const mountedRef = useRef(true);

  /* ---------------------------------------
     Lifecycle safety
  ---------------------------------------- */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ---------------------------------------
     Init + fallback refresh safe
  ---------------------------------------- */
  useEffect(() => {
    document.title = 'Analyse enrichie — CléAvenir';
    trackPageView('/resultats-enrichis', 'Analyse enrichie');

    const testResults =
      location.state?.testResults || getCachedResults();

    if (!testResults) {
      navigate('/test');
      return;
    }

    const enrichedResults =
      TestResultsService.getEnrichedResults(testResults);

    setResults(testResults);
    setDisplayedResults(enrichedResults);

    // Cache pour refresh
    localStorage.setItem(CACHE_KEY, JSON.stringify(testResults));

    // Tracking ML-ready
    trackEvent('enriched_results_view', {
      top_career: enrichedResults?.matchedCareers?.[0]?.title,
      confidence: enrichedResults?.confidence,
      locked_items: enrichedResults?.matchedCareers?.filter(c => c.locked).length
    });
  }, [location, navigate]);

  const handleUpgradePremium = () => {
    trackEvent('premium_cta_click', {
      source: 'enriched_results',
      locked_careers: displayedResults?.matchedCareers?.filter(c => c.locked).length
    });
    navigate('/forfaits');
  };

  if (!displayedResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement…
      </div>
    );
  }

  /* ---------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Ton analyse enrichie
          </h1>
          <p className="text-slate-600 text-lg">
            Une lecture approfondie basée sur ton profil, tes compétences et tes préférences
          </p>
        </div>

        {/* Profil psychologique */}
        {displayedResults.psychologicalTraits && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ton profil psychologique
            </h2>
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-600 mb-2">
                  {displayedResults.psychologicalTraits.dominant}
                </h3>
                <p className="text-slate-600 mb-4">
                  {displayedResults.psychologicalTraits.description}
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${displayedResults.psychologicalTraits.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {displayedResults.psychologicalTraits.percentage}% de correspondance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Métiers */}
        <Section title="Métiers qui te correspondent">
          {displayedResults.matchedCareers.map((career) => (
            <Card locked={career.locked} key={career.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {career.locked ? 'Métier premium' : career.title}
                    </h3>
                    {career.locked && <Lock size={18} className="text-slate-400" />}
                  </div>

                  <p className="text-slate-600 mb-3">
                    {career.locked ? 'Analyse complète disponible en version premium.' : career.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <Metric label="Correspondance" value={`${career.match}%`} highlight />
                    <Metric label="Salaire moyen" value={career.locked ? '***' : career.salary} />
                  </div>
                </div>
                <ChevronRight className="text-slate-400" />
              </div>
            </Card>
          ))}
        </Section>

        {/* Plan d’action */}
        <Section title="Ton plan d’action">
          {displayedResults.actionPlan.map((step) => (
            <Card locked={step.locked} key={step.step}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.locked ? 'Étape premium' : step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.locked ? 'Débloque cette étape pour avancer concrètement.' : step.description}
                  </p>
                </div>
                {step.locked && <Lock size={18} className="text-slate-400" />}
              </div>
            </Card>
          ))}
        </Section>

        {/* CTA Premium */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-8 border border-purple-200">
          <div className="flex items-start gap-4">
            <Crown className="text-purple-600 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Passe à l’analyse complète
              </h3>
              <p className="text-slate-600 mb-6">
                Débloque tous les métiers, compétences clés, formations recommandées
                et un plan d’action personnalisé.
              </p>
              <button
                onClick={handleUpgradePremium}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                <Zap size={20} />
                Accéder à la version complète
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------------------------------
   Small components
---------------------------------------- */
function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Card({ locked, children }) {
  return (
    <div
      className={`rounded-lg shadow p-6 border transition ${
        locked
          ? 'bg-slate-100 border-slate-300 blur-sm opacity-60'
          : 'bg-white border-slate-200 hover:shadow-lg'
      }`}
    >
      {children}
    </div>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-purple-600' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}