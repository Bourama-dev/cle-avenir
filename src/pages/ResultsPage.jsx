import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { AuthService } from '@/services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatsGrid } from '@/components/cleo/charts/CleoChartLibrary';
import { normalizedIncludes } from '@/utils/stringUtils';
import { calculateRiasecMatch } from '@/utils/riasecMatchingAlgorithm';
import { METIER_ENRICHED_DATA } from '@/data/romeMapping';

// Generate a basic RIASEC profile based on job keywords
const generateBasicRiasecProfile = (jobLibelle, jobDescription) => {
  const text = `${jobLibelle} ${jobDescription}`.toLowerCase();

  // Keyword mappings for RIASEC dimensions
  const keywords = {
    R: ['manuel', 'main', 'mécanicien', 'construction', 'ouvrier', 'technique', 'réparation', 'électricien', 'plomberie'],
    I: ['recherche', 'analyse', 'scientifique', 'informatique', 'développeur', 'programmation', 'data', 'ingénieur', 'technique'],
    A: ['design', 'créatif', 'art', 'dessin', 'graphique', 'musique', 'création', 'artiste', 'animation', 'web'],
    S: ['social', 'aide', 'soin', 'santé', 'infirmier', 'coach', 'accompagnement', 'éducation', 'travail social', 'communication', 'relation'],
    E: ['vente', 'commercial', 'entrepreneuriat', 'direction', 'manager', 'leadership', 'négociation', 'business'],
    C: ['organisation', 'administratif', 'comptabilité', 'gestion', 'réglementation', 'contrôle', 'respect', 'ordre']
  };

  const profile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  let totalMatches = 0;

  Object.entries(keywords).forEach(([dimension, words]) => {
    const matches = words.filter(word => text.includes(word)).length;
    profile[dimension] = matches;
    totalMatches += matches;
  });

  // Normalize to sum to a reasonable total (around 350 so normalized to 100)
  if (totalMatches === 0) {
    // Default if no keywords match
    return { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 };
  }

  const factor = 350 / totalMatches;
  Object.keys(profile).forEach(key => {
    profile[key] = Math.round(profile[key] * factor);
  });

  return profile;
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [otherJobs, setOtherJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check Auth manually to ensure robust redirect
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          navigate('/login', { state: { from: '/results' } });
          return;
        }

        const session = await AuthService.getSession();

        // 2. Fetch Profile Data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profileData) {
          navigate('/profile');
          return;
        }
        setProfile(profileData);

        // 3. Get RIASEC profile from localStorage (saved by TestPage)
        const riasecProfile = JSON.parse(localStorage.getItem('test_riasec_profile') || '{}');
        console.log('[ResultsPage] RIASEC Profile from localStorage:', riasecProfile);

        // 4. Fetch Jobs from rome_metiers
        const { data: jobsData, error: jobsError } = await supabase
          .from('rome_metiers')
          .select('code, libelle, description, niveau_etudes, salaire')
          .limit(100);

        if (jobsError) {
          console.error('[ResultsPage] Error fetching jobs:', jobsError);
        }
        console.log('[ResultsPage] Jobs fetched:', jobsData?.length || 0, 'jobs');

        // 5. Score jobs based on RIASEC matching + education + interests
        const processedJobs = (jobsData || []).map(job => {
          let matchScore = 0;
          let reason = [];

          // Get enriched RIASEC data for the job (or generate one from keywords)
          const enrichedData = METIER_ENRICHED_DATA[job.code];
          const jobRiasecProfile = enrichedData?.riasec ||
            generateBasicRiasecProfile(job.libelle, job.description || '');

          // 5a. RIASEC matching (primary scoring)
          if (Object.keys(riasecProfile).length > 0) {
            const { matchScore: riasecScore } = calculateRiasecMatch(riasecProfile, jobRiasecProfile);
            matchScore = riasecScore;
            if (riasecScore >= 70) {
              reason.push("Correspond à votre profil RIASEC");
            }
          } else {
            // Fallback if no RIASEC profile
            matchScore = 50;
          }

          // 5b. Education level constraint
          const reqLevel = job.niveau_etudes || '';
          if (profileData.wants_long_studies === 'Oui' && reqLevel.includes('Bac+5')) {
            matchScore += 10;
            reason.push("Correspond à votre préférence d'études longues");
          } else if (profileData.wants_long_studies === 'Non' && reqLevel.includes('Bac+5')) {
            matchScore -= 15;
            reason.push("Nécessite des études longues non souhaitées");
          }

          // 5c. Interest matching
          if (profileData.interests && Array.isArray(profileData.interests) && profileData.interests.length > 0) {
            const hasMatch = profileData.interests.some(interest =>
              normalizedIncludes(job.description, interest) ||
              normalizedIncludes(job.libelle, interest) ||
              normalizedIncludes(enrichedData.matchKeywords?.join(' ') || '', interest)
            );
            if (hasMatch) {
              matchScore += 10;
              if (!reason.includes("Correspond à vos domaines d'intérêt")) {
                reason.push("Correspond à vos domaines d'intérêt");
              }
            }
          }

          // Clamp final score
          matchScore = Math.min(98, Math.max(15, matchScore));

          return {
            ...job,
            // Keep original job name, only use enriched data for missing fields
            libelle: job.libelle, // Keep the original job libelle from DB
            description: job.description || enrichedData?.description,
            salary: job.salaire || enrichedData?.salary,
            salaryMin: enrichedData?.salaryMin,
            salaryMax: enrichedData?.salaryMax,
            demand: enrichedData?.demand,
            difficulty: enrichedData?.difficulty,
            progression: enrichedData?.progression,
            access: enrichedData?.access,
            tags: enrichedData?.tags || [],
            domain: enrichedData?.domain || 'Secteur',
            matchKeywords: enrichedData?.matchKeywords || [],
            riasec: jobRiasecProfile,
            matchScore,
            reason: reason.length > 0 ? reason[0] : "Profil compatible"
          };
        }).sort((a, b) => b.matchScore - a.matchScore);

        console.log('[ResultsPage] Processed jobs:', processedJobs.length, 'jobs');
        console.log('[ResultsPage] Top 5 jobs by score:', processedJobs.slice(0, 5).map(j => ({ libelle: j.libelle, score: j.matchScore })));

        // Always show top jobs, even if scores are lower than ideal
        const recommended = processedJobs.filter(j => j.matchScore >= 70).slice(0, 6);
        const others = processedJobs.filter(j => j.matchScore < 70 && j.matchScore >= 50).slice(0, 3);

        // If no recommended jobs found, show top jobs regardless of threshold
        if (recommended.length === 0 && processedJobs.length > 0) {
          setRecommendedJobs(processedJobs.slice(0, 6));
          setOtherJobs(processedJobs.slice(6, 9));
        } else {
          setRecommendedJobs(recommended);
          setOtherJobs(others.length > 0 ? others : processedJobs.filter(j => j.matchScore < 70 && j.matchScore >= 40).slice(0, 3));
        }

      } catch (err) {
        console.error("Error fetching results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-600 font-medium">Analyse de votre profil en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="relative text-center space-y-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="absolute right-0 top-0 text-slate-500 hover:text-slate-900"
          >
            Déconnexion
          </Button>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 pt-8 md:pt-0">
            Bonjour {profile?.first_name} !
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Basé sur votre profil ({profile?.education_level}, {profile?.wants_long_studies === 'Oui' ? 'Études longues' : 'Études courtes'}), voici les métiers faits pour vous.
          </p>
        </div>

        {/* Profile Summary Stats */}
        <StatsGrid
          stats={[
            {
              label: 'Recommandations',
              value: recommendedJobs.length,
              trend: recommendedJobs.length > 3 ? 'up' : 'neutral',
              subtitle: 'métiers à fort potentiel'
            },
            {
              label: 'Match moyen',
              value: `${Math.round(recommendedJobs.reduce((sum, j) => sum + j.matchScore, 0) / (recommendedJobs.length || 1))}%`,
              trend: 'up',
              subtitle: 'avec votre profil'
            },
            {
              label: 'Niveau d\'études',
              value: profile?.education_level || 'Non défini',
              trend: 'neutral',
              subtitle: profile?.wants_long_studies === 'Oui' ? 'Études longues' : 'Études courtes'
            },
            {
              label: 'À explorer',
              value: otherJobs.length,
              trend: otherJobs.length > 0 ? 'neutral' : 'up',
              subtitle: 'opportunités complémentaires'
            }
          ]}
        />

        {/* Recommended Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 p-2 rounded-lg">✨</span>
            Vos Top Recommandations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job, idx) => (
              <motion.div 
                key={job.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full flex flex-col border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1">
                        Match {job.matchScore}%
                      </Badge>
                      <GraduationCap className="text-slate-400 w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl leading-tight line-clamp-2" title={job.libelle}>
                      {job.libelle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {job.description || "Description non disponible. Ce métier offre des perspectives intéressantes."}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Compatibilité</span>
                        <span>{job.matchScore}%</span>
                      </div>
                      <Progress value={job.matchScore} className="h-2 bg-slate-100" indicatorClassName={job.matchScore > 85 ? "bg-green-500" : "bg-indigo-500"} />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-6 px-6">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      onClick={() => navigate(`/action-plan?job=${job.libelle}`)}
                    >
                      Voir le plan d'action <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Jobs (Less Match) */}
        {otherJobs.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Métiers à explorer avec prudence</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherJobs.map((job) => (
                <Card key={job.code} className="bg-slate-50 border-dashed border-slate-300 opacity-80 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-slate-700 line-clamp-1">{job.libelle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-red-600 font-medium mb-3">⚠️ {job.reason}</p>
                    <Badge variant="outline" className="text-slate-500 border-slate-300 bg-white">Match {job.matchScore}%</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultsPage;