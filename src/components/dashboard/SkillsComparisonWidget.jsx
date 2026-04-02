import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const SkillsComparisonWidget = ({ userProfile, matches }) => {
  const topMatch = matches?.[0];
  
  // Mock required skills based on top match domain or generic set
  const requiredSkills = topMatch?.domain === 'Technologie' 
    ? ['Logique', 'Anglais', 'Gestion projet', 'Programmation', 'Communication']
    : ['Communication', 'Organisation', 'Travail équipe', 'Autonomie', 'Créativité'];

  const userSkills = userProfile?.skills || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full"
    >
       <h3 className="font-bold text-lg mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-secondary" />
        Comparateur de Compétences
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        Comparaison avec le profil type : <span className="font-semibold text-foreground">{topMatch?.libelle || "Métier Cible"}</span>
      </p>

      <div className="space-y-4">
        {requiredSkills.map((skill, idx) => {
            const hasSkill = userSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
            // Heuristic percentage: if has skill 80-100%, else 20-40%
            const percent = hasSkill ? 85 + (idx * 2) : 25 + (idx * 5); 
            
            return (
                <div key={idx}>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-foreground">{skill}</span>
                        <span className={hasSkill ? "text-green-600" : "text-muted-foreground"}>
                            {hasSkill ? "Acquis" : "À développer"}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${hasSkill ? 'bg-green-500' : 'bg-slate-300'}`}
                        />
                    </div>
                </div>
            );
        })}
      </div>
    </motion.div>
  );
};

export default SkillsComparisonWidget;