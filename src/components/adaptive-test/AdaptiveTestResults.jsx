import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ResultsHeader from './ResultsHeader';
import ShareResults from './ShareResults';
import ProfileMetierMatcher from '@/components/ProfileMetierMatcher';

import { matchProfileToMetiers } from '@/services/profileMetierMatchingService';
import { classifyProfile } from '@/utils/matchMetiersToResult';

const AdaptiveTestResults = ({ history, userPlan = 'discovery' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchedMetiers, setMatchedMetiers] = useState([]);
  const [profileResult, setProfileResult] = useState(null);

  useEffect(() => {
    const processMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Extract Profile Type & Preferences
        const classified = classifyProfile(history);
        setProfileResult(classified);
        
        // 2. Call specialized matching service
        const matches = await matchProfileToMetiers(
          classified.type, 
          classified.sectors || [], 
          classified.topTraits || []
        );
        
        setMatchedMetiers(matches);
      } catch (err) {
        console.error("Error matching metiers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (history && history.length > 0) {
      processMatches();
    }
  }, [history]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Analyse de votre profil et recherche des meilleurs métiers...</p>
      </div>
    );
  }

  const primaryProfile = profileResult?.type || "Explorateur";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <ResultsHeader primaryProfile={primaryProfile} score={profileResult?.score || 80} />

      <div className="mt-12 space-y-8">
         <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Vos métiers compatibles</h2>
              <p className="text-slate-500">Basé sur vos affinités en {profileResult?.sectors?.join(', ')}</p>
            </div>
            <span className="hidden sm:inline-block text-sm font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-full border shadow-sm">
                {matchedMetiers.length} métiers trouvés
            </span>
         </div>

         <ProfileMetierMatcher 
            metiers={matchedMetiers} 
            userPlan={userPlan} 
            error={error} 
            loading={loading} 
         />

         <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mt-12">
             <h3 className="font-bold text-slate-900 text-xl mb-6">Et maintenant ?</h3>
             <div className="grid md:grid-cols-2 gap-4 mb-6">
               <Button onClick={() => navigate('/metiers')} className="w-full justify-between bg-slate-900 hover:bg-violet-700 text-white rounded-xl h-14 text-lg">
                  Explorer le catalogue <ArrowRight className="w-5 h-5" />
               </Button>
               
               <Button onClick={() => navigate('/formations')} variant="outline" className="w-full justify-between rounded-xl h-14 border-slate-200 text-lg">
                  Trouver une formation <BookOpen className="w-5 h-5" />
               </Button>
             </div>

             <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                 <ShareResults primaryProfile={primaryProfile} />
                 <Button 
                    onClick={() => window.location.reload()} 
                    variant="ghost" 
                    className="rounded-xl text-slate-500 hover:text-slate-700"
                 >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Refaire le test
                 </Button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default AdaptiveTestResults;