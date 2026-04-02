import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { actionPlanService } from '@/services/actionPlanService';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, MapPin, CheckCircle2, Clock, BookOpen, Target, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ActionPlanPage = () => {
  const [searchParams] = useSearchParams();
  const targetJob = searchParams.get('job') || 'Développeur Web';
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('education_level')
          .eq('user_id', user.id)
          .single();

        const currentLevel = profile?.education_level || 'Terminal';
        
        // Generate plan based on profile and target
        const generatedPlan = actionPlanService.generatePlan(currentLevel, targetJob);
        setPlan(generatedPlan);

      } catch (err) {
        console.error("Error generating plan", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [user, targetJob]);

  const handleSavePlan = async () => {
    if (!user || !plan) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('action_plans')
        .insert({
          user_id: user.id,
          current_level: plan.currentLevel,
          target_job: plan.targetJob,
          duration: plan.duration,
          steps: plan.steps
        });

      if (error) throw error;
      
      toast({
        title: "Plan d'action sauvegardé !",
        description: "Vous pouvez le retrouver dans votre tableau de bord."
      });
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" onClick={() => navigate('/results')} className="pl-0 text-slate-500 hover:text-slate-900 -ml-2 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux résultats
            </Button>
            <h1 className="text-3xl font-extrabold text-slate-900">Plan d'action : {targetJob}</h1>
            <p className="text-slate-600 flex items-center mt-2">
              <Clock className="w-4 h-4 mr-2" /> Durée estimée : {plan?.duration}
            </p>
          </div>
          <Button onClick={handleSavePlan} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Sauvegarder le plan
          </Button>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-6 space-y-10 py-6">
          {plan?.steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isTodo = step.status === 'todo';

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-slate-50 bg-white
                  ${isCompleted ? 'border-green-500 bg-green-500' : ''}
                  ${isCurrent ? 'border-indigo-600 bg-indigo-600' : ''}
                  ${isTodo ? 'border-slate-300' : ''}
                `} />

                <Card className={`border-none shadow-sm ${isCurrent ? 'ring-2 ring-indigo-600 shadow-md' : 'bg-white/80'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {isCompleted && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Acquis</Badge>}
                      {isCurrent && <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none"><MapPin className="w-3 h-3 mr-1" /> Étape Actuelle</Badge>}
                      <Badge variant="outline" className="text-slate-500"><Clock className="w-3 h-3 mr-1" /> {step.duration}</Badge>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${isCurrent ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 flex items-start">
                      <Target className="w-4 h-4 mr-2 mt-1 shrink-0 text-slate-400" />
                      {step.objective}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Actions requises</h4>
                        <ul className="space-y-2">
                          {step.actions.map((action, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-700">
                              <span className="text-indigo-500 mr-2">•</span> {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ressources & Compétences</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {step.competencies.map((comp, i) => (
                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-normal">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                        <ul className="space-y-1">
                          {step.resources.map((res, i) => (
                            <li key={i} className="flex items-center text-sm text-slate-600">
                              <BookOpen className="w-3 h-3 mr-2 text-slate-400" /> {res}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ActionPlanPage;