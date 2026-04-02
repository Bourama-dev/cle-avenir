import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BadgesWidget = ({ stats }) => {
  const badges = [
    { 
        id: 1, 
        name: "Explorateur", 
        icon: Star, 
        description: "A complété le test de profil", 
        earned: true, 
        color: "text-yellow-500 bg-yellow-50" 
    },
    { 
        id: 2, 
        name: "Visionnaire", 
        icon: Trophy, 
        description: "A défini 3 objectifs", 
        earned: stats.goalsCompleted >= 3, 
        color: "text-purple-500 bg-purple-50" 
    },
    { 
        id: 3, 
        name: "Chasseur", 
        icon: Medal, 
        description: "A sauvegardé 5 offres", 
        earned: stats.savedJobs >= 5, 
        color: "text-blue-500 bg-blue-50" 
    },
    { 
        id: 4, 
        name: "Expert", 
        icon: Crown, 
        description: "Profil complété à 100%", 
        earned: false, // Hardcoded for now
        color: "text-rose-500 bg-rose-50" 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border"
    >
       <h3 className="font-bold text-lg mb-6 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Badges & Réussites
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TooltipProvider>
            {badges.map((badge) => (
                <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all ${badge.earned ? 'border-transparent bg-card shadow-sm' : 'border-muted opacity-50'}`}>
                            <div className={`p-3 rounded-full mb-2 ${badge.earned ? badge.color : 'bg-muted text-muted-foreground'}`}>
                                <badge.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold text-center">{badge.name}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{badge.description}</p>
                        {!badge.earned && <p className="text-xs text-muted-foreground mt-1">(Verrouillé)</p>}
                    </TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default BadgesWidget;