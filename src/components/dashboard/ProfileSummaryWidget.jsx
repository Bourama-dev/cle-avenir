import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Award, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ProfileSummaryWidget = ({ userProfile, matches }) => {
  // Calculate profile completion (simplified heuristic)
  const calculateCompletion = () => {
    if (!userProfile) return 0;
    let score = 0;
    if (userProfile.first_name) score += 20;
    if (userProfile.interests && userProfile.interests.length > 0) score += 30;
    if (userProfile.values && userProfile.values.length > 0) score += 30;
    if (userProfile.skills && userProfile.skills.length > 0) score += 20;
    return score;
  };

  const completion = calculateCompletion();
  const topMatch = matches && matches.length > 0 ? matches[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-primary" />
          Synthèse du Profil
        </h3>
        <span className="text-sm font-medium text-muted-foreground">{completion}% complet</span>
      </div>

      <div className="mb-6">
        <Progress value={completion} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground text-right">
          {completion < 100 ? "Complétez votre profil pour de meilleures recommandations" : "Profil optimal"}
        </p>
      </div>

      {topMatch ? (
        <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
            <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Top Compatibilité</p>
                    <h4 className="font-bold text-foreground">{topMatch.libelle}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{topMatch.score} points de match</p>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">Faites le test pour voir votre match idéal</p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center">
            <Award className="w-4 h-4 mr-2 text-accent" />
            Points Forts Identifiés
        </h4>
        <div className="flex flex-wrap gap-2">
            {userProfile?.skills?.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                </Badge>
            )) || <span className="text-xs text-muted-foreground">Aucun point fort renseigné</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSummaryWidget;