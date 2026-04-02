import React from 'react';
import { motion } from 'framer-motion';
import { Flag, CheckCircle2, Circle } from 'lucide-react';

const CareerTimelineWidget = ({ goals }) => {
  // Sort goals by due date and take next 3
  const upcomingGoals = [...goals].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border"
    >
      <h3 className="font-bold text-lg mb-6 flex items-center">
        <Flag className="w-5 h-5 mr-2 text-foreground" />
        Timeline de Carrière
      </h3>

      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-8">
            {upcomingGoals.length > 0 ? upcomingGoals.map((goal, index) => (
                <div key={goal.id} className="relative flex items-start gap-4 group">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-card shadow-sm ${goal.completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                        {goal.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                            <h4 className={`font-semibold ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {goal.title}
                            </h4>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {new Date(goal.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                </div>
            )) : (
                <div className="text-center py-8 pl-8 text-muted-foreground text-sm">
                    Ajoutez des objectifs pour visualiser votre parcours.
                </div>
            )}
            
            {/* Future Goal Placeholder */}
            <div className="relative flex items-start gap-4 opacity-50">
                 <div className="relative z-10 w-10 h-10 rounded-full bg-muted flex items-center justify-center border-4 border-card">
                    <Flag className="w-4 h-4 text-muted-foreground" />
                 </div>
                 <div className="pt-2">
                    <h4 className="font-semibold text-foreground">Prochain grand succès</h4>
                    <p className="text-sm text-muted-foreground">Continuez vos efforts !</p>
                 </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerTimelineWidget;