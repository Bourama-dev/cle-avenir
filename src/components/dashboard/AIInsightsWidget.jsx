import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const AIInsightsWidget = ({ userProfile, matches }) => {
  const navigate = useNavigate();

  // Heuristic generation of "AI" insights
  const generateInsights = () => {
    const insights = [];
    
    if (matches && matches.length > 0) {
        const topDomain = matches[0].domain;
        insights.push({
            type: 'career',
            icon: Target,
            color: 'text-blue-500',
            title: "Trajectoire de carrière",
            text: `Le secteur "${topDomain}" recrute fortement. Visez des rôles juniors pour commencer.`
        });
    }

    if (!userProfile?.skills || userProfile.skills.length < 3) {
        insights.push({
            type: 'gap',
            icon: Zap,
            color: 'text-amber-500',
            title: "Analyse des écarts",
            text: "Ajoutez plus de compétences techniques pour améliorer la précision du matching."
        });
    } else {
        insights.push({
             type: 'strength',
             icon: Zap,
             color: 'text-green-500',
             title: "Potentiel détecté",
             text: "Votre profil indique une forte prédisposition pour le leadership d'équipe."
        });
    }

    insights.push({
        type: 'learning',
        icon: BookOpen,
        color: 'text-purple-500',
        title: "Prochaine étape",
        text: "Consultez les formations certifiantes liées à votre Top Match."
    });

    return insights;
  };

  const insights = generateInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
          Insights IA
        </h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Bêta</Badge>
      </div>

      <div className="space-y-4 flex-1">
        {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`mt-1 p-1.5 rounded-lg bg-background shadow-sm h-fit ${insight.color}`}>
                    <insight.icon className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-foreground">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.text}</p>
                </div>
            </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/recommendations')}
      >
        Voir toutes les recommandations <ArrowRight className="w-3 h-3 ml-1" />
      </Button>
    </motion.div>
  );
};

export default AIInsightsWidget;