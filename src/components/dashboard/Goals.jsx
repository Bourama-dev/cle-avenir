import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Target, Calendar, CheckCircle, Plus, Loader2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/customSupabaseClient';

const Goals = ({ userProfile }) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchGoals = async () => {
      // If no profile yet, wait. If explicitly null (logged out/error), stop loading.
      if (!userProfile?.id) {
        if (userProfile === null) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setGoals(data || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Don't show toast on mount error to avoid spam, just log
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGoals();
    return () => { mounted = false; };
  }, [userProfile]);

  const addGoal = async () => {
    if (!userProfile?.id) return;

    const newGoal = {
      user_id: userProfile.id,
      title: "Nouvel objectif",
      description: "Action à réaliser",
      completed: false,
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in_progress'
    };

    // Optimistic UI update
    const tempId = Date.now();
    const optimisticGoal = { ...newGoal, id: tempId };
    setGoals([optimisticGoal, ...goals]);

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([newGoal])
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic goal with real one
      setGoals(prev => prev.map(g => g.id === tempId ? data : g));
      toast({ title: "Objectif ajouté !" });
    } catch (e) {
      console.error(e);
      setGoals(prev => prev.filter(g => g.id !== tempId));
      toast({ title: "Erreur", description: "Impossible d'ajouter l'objectif", variant: "destructive" });
    }
  };

  const toggleGoal = async (goalId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setGoals(goals.map(g => g.id === goalId ? { ...g, completed: newStatus } : g));

    try {
      const { error } = await supabase
        .from('goals')
        .update({ completed: newStatus })
        .eq('id', goalId);
            
      if (error) throw error;
    } catch (e) {
      // Revert on error
      setGoals(goals.map(g => g.id === goalId ? { ...g, completed: currentStatus } : g));
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'objectif", variant: "destructive" });
    }
  };

  const deleteGoal = async (e, goalId) => {
    e.stopPropagation();
    const previousGoals = [...goals];
    setGoals(goals.filter(g => g.id !== goalId));
      
    try {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (error) throw error;
      toast({ title: "Objectif supprimé" });
    } catch (e) {
      setGoals(previousGoals);
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  // Sort: incomplete first
  const sortedGoals = [...goals].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center">
          <Target className="w-5 h-5 mr-2 text-accent" />
          Mes objectifs
        </h2>
        <Button onClick={addGoal} size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-accent/10">
          <Plus className="w-4 h-4 text-accent" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 -mr-4 pr-4 max-h-[300px]">
        {sortedGoals.length > 0 ? (
            <div className="space-y-3">
            {sortedGoals.map((goal) => (
                <div key={goal.id} className={`group relative bg-muted/30 rounded-xl p-3 border border-border transition-all ${goal.completed ? 'opacity-60 bg-muted/10' : 'hover:bg-muted/50'}`}>
                <div className="flex items-start gap-3">
                    <button 
                      onClick={() => toggleGoal(goal.id, goal.completed)} 
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${goal.completed ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground/30 hover:border-accent'}`}
                    >
                        {goal.completed && <CheckCircle className="w-3 h-3" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm truncate ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {goal.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{goal.description}</p>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center text-muted-foreground text-[10px]">
                                <Calendar className="w-3 h-3 mr-1" />
                                {goal.target_date ? new Date(goal.target_date).toLocaleDateString('fr-FR') : 'Pas de date'}
                            </div>
                            <button 
                                onClick={(e) => deleteGoal(e, goal.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <Target className="w-12 h-12 text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Aucun objectif défini.</p>
                <Button onClick={addGoal} variant="outline" size="sm">Commencer</Button>
            </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};

export default Goals;