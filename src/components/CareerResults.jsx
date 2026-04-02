import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Zap, CheckCircle2, Loader2, Heart } from 'lucide-react';
import { generateDetailedResults } from '@/lib/testResultsClassifier';
import { incrementShown, incrementAction } from '@/services/careerStats';
import { reinforceCareer } from '@/services/reinforceCareer';

function CareerCard({ career, rank, userProfile }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  
  // Ref to prevent double-tracking clicks on strict React StrictMode
  const clickTracked = useRef(false);

  const handleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    // Track click when expanded for the first time
    if (newExpanded && !clickTracked.current) {
      incrementAction(career.code, 'clicked');
      clickTracked.current = true;
    }
  };

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent expanding the card
    if (!liked) {
      setLiked(true);
      incrementAction(career.code, 'liked');
    }
  };

  const handleChoose = async () => {
    incrementAction(career.code, 'chosen');
    
    // Trigger the adaptive reinforcement algorithm for this career based on user's profile
    if (userProfile && userProfile.riasec) {
      try {
        await reinforceCareer(career.code, userProfile.riasec);
        console.log(`Career ${career.code} dimensions reinforced successfully.`);
      } catch (err) {
        console.error(`Failed to reinforce career ${career.code}:`, err);
      }
    }
    
    // UI navigation or selection confirmation would normally follow here
  };

  const medals = ['🥇', '🥈', '🥉', '⭐', '⭐'];

  // Use the new final 'score' which includes the adaptive boost
  const scoreToUse = career.score || career.zScore || 0;
  const displayPercentage = Math.min(99, Math.max(50, Math.round(50 + (scoreToUse * 15))));

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-pink-100 overflow-hidden animate-slideUp">
      <button
        onClick={handleExpand}
        className="w-full p-6 text-left hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-4xl filter drop-shadow-sm">{medals[rank - 1] || '✨'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900">{career.libelle || career.title}</h3>
                {career.boostApplied > 0.05 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Zap size={10} className="fill-yellow-600" /> Populaire
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 line-clamp-1">{career.description || 'Description non disponible'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike} 
              className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-100 text-pink-600' : 'bg-slate-50 text-slate-400 hover:text-pink-500 hover:bg-pink-50'}`}
              title="J'aime ce métier"
            >
              <Heart size={20} className={liked ? "fill-pink-500" : ""} />
            </button>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">{displayPercentage}%</p>
              <div className="w-16 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                   className="h-full bg-purple-500 rounded-full"
                   style={{ width: `${displayPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-pink-100 p-6 bg-gradient-to-br from-pink-50/50 to-purple-50/50 animate-slideDown">
          <div className="mb-6 bg-white/60 p-4 rounded-xl border border-pink-100">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Zap size={18} className="text-yellow-500 fill-yellow-500" />
                Pourquoi ce métier vous correspond ?
            </h4>
            <div className="space-y-2">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Votre profil RIASEC est fortement aligné {career.riasecMajeur ? `(Dominante: ${career.riasecMajeur})` : ''}
                  </span>
                </div>
            </div>
          </div>

          <button 
            onClick={handleChoose}
            className="w-full p-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            Voir les formations pour devenir {career.libelle || career.title}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CareerResults({ testAnswers }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Track which careers have already been marked as shown
  const shownTracked = useRef(new Set());

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await generateDetailedResults(testAnswers);
        setResults(data);
        
        // Asynchronously track that these careers were shown to the user
        if (data && data.topCareers && data.topCareers.length > 0) {
          data.topCareers.forEach(career => {
            if (career.code && !shownTracked.current.has(career.code)) {
              incrementShown(career.code);
              shownTracked.current.add(career.code);
            }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [testAnswers]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (!results || !results.topCareers || results.topCareers.length === 0) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Profil atypique détecté</h2>
                  <p className="text-slate-600 mb-4">Vos réponses sont très variées et ne correspondent pas précisément à nos standards actuels.</p>
                  <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700">Refaire le test</button>
              </div>
          </div>
      );
  }

  const { topCareers, userProfile } = results;
  const riasec = userProfile?.riasec || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-slate-100 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-slideDown">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200">
            <span className="text-sm font-bold text-purple-700 tracking-wide uppercase">✨ Analyse terminée</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Votre boussole professionnelle
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nous avons analysé vos aspirations, vos compétences et votre personnalité pour trouver les métiers qui vous rendront vraiment heureux.
          </p>
        </div>

        <div className="mb-16 animate-slideUp delay-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Votre Profil RIASEC
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(riasec).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([key, score]) => (
                <div key={key} className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Type {key}</h3>
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {(score * 100).toFixed(0)}%
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div className="mb-12 animate-slideUp delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Top métiers recommandés</h2>
          </div>
          
          <div className="space-y-6">
            {topCareers.map((career, idx) => (
              <CareerCard 
                key={career.code || idx} 
                career={career} 
                rank={idx + 1} 
                userProfile={userProfile}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}