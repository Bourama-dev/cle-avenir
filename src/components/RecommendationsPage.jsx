import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import JobCard from '@/components/job-explorer/JobCard';
import { calculateMatchScore } from '@/lib/matchingAlgorithm';
import { jobs as mockJobs, mockProfile } from '@/data/mockData';

const RecommendationsPage = ({ onNavigate }) => {
  // Use mockProfile as we are in a demo environment
  const activeProfile = mockProfile;

  const recommendations = useMemo(() => {
    return mockJobs
      .map(job => ({ ...job, matchData: calculateMatchScore(activeProfile, job) }))
      .sort((a, b) => b.matchData.score - a.matchData.score)
      .slice(0, 3); // Top 3 matches
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => onNavigate('/dashboard')} className="mb-6 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Vos Recommandations Personnalisées</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Basé sur vos compétences en <span className="font-semibold text-indigo-600">{activeProfile.skills.slice(0,3).join(', ')}</span> et vos préférences.
          </p>
        </div>

        {recommendations.length > 0 && (
          <div className="grid gap-8 mb-12">
            {recommendations.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                   {index === 0 && (
                    <div className="absolute -top-3 -left-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Top Match
                    </div>
                   )}
                   <JobCard 
                     job={job} 
                     matchData={job.matchData} 
                     isSaved={false} 
                     onToggleSave={() => {}} 
                     onClick={() => onNavigate(`/job/${job.id}`)}
                   />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Pourquoi ces offres ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>Notre algorithme analyse 5 points clés de votre profil :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Vos compétences techniques et soft skills</li>
                  <li>Votre niveau d'expérience actuel</li>
                  <li>Vos prétentions salariales</li>
                  <li>Votre préférence pour le télétravail</li>
                  <li>Le type de contrat recherché</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-indigo-900 text-white border-none">
               <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full">
                  <h3 className="font-bold text-xl mb-2">Vous voulez plus de choix ?</h3>
                  <p className="text-indigo-200 mb-4 text-sm">Explorez toutes les offres disponibles et utilisez nos filtres avancés.</p>
                  <Button variant="secondary" className="w-full" onClick={() => onNavigate('/offres-emploi')}>
                    Voir toutes les offres
                  </Button>
               </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;