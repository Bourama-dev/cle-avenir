import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Network, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UserClusteringService } from '@/services/UserClusteringService';
import { supabase } from '@/lib/customSupabaseClient';

const ClusterAnalysisComponent = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCluster = async () => {
      if (authLoading) return;
      if (!userProfile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch a sample of other profiles for clustering context
        const { data: sampleProfiles, error } = await supabase
          .from('profiles')
          .select('id, answers, role, subscription_tier')
          .limit(50); // Small sample for frontend clustering demo

        if (error) throw error;

        if (sampleProfiles && sampleProfiles.length > 5) {
          const result = UserClusteringService.clusterUsers([userProfile, ...sampleProfiles], 5);
          
          const myAssignment = result.assignments.find(a => a.id === userProfile.id);
          const myClusterMeta = result.metadata.find(m => m.id === myAssignment.cluster);
          
          setClusterData({
            clusterId: myClusterMeta.id,
            dominantTraits: myClusterMeta.dominantTraits,
            similarUsersCount: myClusterMeta.size - 1, // Exclude self
          });
        }
      } catch (err) {
        console.error('Error in clustering:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCluster();
  }, [userProfile, authLoading]);

  if (loading || authLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6 flex items-center justify-center min-h-[150px]">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </CardContent>
      </Card>
    );
  }

  if (!clusterData) return null;

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-indigo-900">
          <Network className="h-5 w-5 text-indigo-500" />
          Votre Profil IA
        </CardTitle>
        <CardDescription>
          Analyse comportementale de votre groupe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Vous appartenez au</p>
            <h4 className="font-bold text-slate-800">Groupe Analytique #{clusterData.clusterId + 1}</h4>
            <p className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3" /> {clusterData.similarUsersCount} profils similaires
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-400" /> Traits dominants du groupe
          </h4>
          <div className="flex flex-wrap gap-2">
            {clusterData.dominantTraits.length > 0 ? (
              clusterData.dominantTraits.map((trait, idx) => (
                <Badge key={idx} variant="secondary" className="bg-white border-indigo-200 text-indigo-700 px-3 py-1">
                  {trait.replace(/_/g, ' ')}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">
                Analyse en cours...
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterAnalysisComponent;