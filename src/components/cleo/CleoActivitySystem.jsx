import React, { useState, useEffect } from 'react';
import { 
  Trophy, Star, Zap, BookOpen, Brain, 
  CheckCircle2, Lock, Play, Clock, BarChart3, ListTodo, LayoutGrid, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { activityService } from '@/services/activityService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import CleoAnalytics from './CleoAnalytics';
import LearningRoadmap from './LearningRoadmap';

const ActivityCard = ({ activity, onStart, loading }) => {
  const isCompleted = activity.status === 'completed';
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      className={cn(
        "group relative bg-white border rounded-xl overflow-hidden transition-all shadow-sm h-full flex flex-col",
        isCompleted ? 'border-green-100 bg-green-50/10' : 'border-slate-200'
      )}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Top Badges */}
        <div className="flex justify-between items-start mb-3">
          <Badge variant={isCompleted ? "default" : "outline"} className={cn(
            "text-[10px] uppercase tracking-wider font-bold border-0",
            isCompleted ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600"
          )}>
            {activity.type}
          </Badge>
          {isCompleted && <CheckCircle2 size={18} className="text-green-500" />}
        </div>

        {/* Content */}
        <div className="mb-4 flex-1">
          <h3 className="font-bold text-slate-800 mb-2 group-hover:text-violet-700 transition-colors line-clamp-1 text-base">
            {activity.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
           <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock size={12} /> {activity.duration_minutes}m
           </div>
           <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
              <Star size={10} fill="currentColor" /> {activity.xp_reward} XP
           </div>
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
           <Button onClick={() => onStart(activity)} className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play size={16} className="mr-2" /> {isCompleted ? 'Refaire' : 'Commencer'}
           </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CleoActivitySystem = ({ onStartActivity }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ total_xp: 0, current_streak: 0 });
  const [skills, setSkills] = useState([]);

  const fetchData = async () => {
      try {
          if (!userProfile?.id) return;
          setLoading(true);
          
          const [acts, userStats, userSkills] = await Promise.all([
              activityService.getActivities(userProfile.id),
              activityService.getUserStats(userProfile.id),
              activityService.getUserSkills(userProfile.id)
          ]);

          setActivities(acts);
          setStats(userStats);
          setSkills(userSkills);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, [userProfile?.id]);

  const handleStart = async (activity) => {
      try {
          await activityService.startActivity(userProfile.id, activity.id);
          onStartActivity(activity);
          fetchData();
      } catch (e) {
          console.error(e);
      }
  };

  const progress = ((stats.total_xp || 0) % 1000) / 1000 * 100;

  return (
    <div className="h-full flex flex-col bg-slate-50/50 overflow-hidden font-sans">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
               Développement & Compétences <Sparkles className="text-amber-400 w-5 h-5" />
            </h1>
            <p className="text-slate-500 text-sm">Gérez votre progression et validez vos acquis.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Niveau {Math.floor((stats.total_xp || 0) / 1000) + 1}</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${progress}%` }}></div>
                </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-slate-200">
                <Star className="text-amber-400 fill-amber-400 animate-pulse" size={16} />
                <span className="font-bold font-mono">{stats.total_xp || 0} XP</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
         <Tabs defaultValue="roadmap" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <TabsList className="bg-white border border-slate-200 p-1 shadow-sm">
                  <TabsTrigger value="roadmap" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 gap-2">
                     <ListTodo size={14} /> Roadmap
                  </TabsTrigger>
                  <TabsTrigger value="catalog" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 gap-2">
                     <LayoutGrid size={14} /> Catalogue
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 gap-2">
                     <BarChart3 size={14} /> Analytics
                  </TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="roadmap" className="flex-1 overflow-hidden mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* Left: Interactive Roadmap */}
                  <div className="lg:col-span-2 overflow-y-auto pr-2 pb-10">
                     <LearningRoadmap activities={activities} onStart={handleStart} />
                  </div>
                  {/* Right: Quick Stats Sidebar (simplified) */}
                  <div className="hidden lg:block space-y-4">
                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <Zap className="text-amber-500" size={18} /> Série en cours
                        </h3>
                        <div className="text-4xl font-bold text-slate-900 mb-1">{stats.current_streak}</div>
                        <p className="text-xs text-slate-500">Jours consécutifs d'apprentissage</p>
                     </div>
                     <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-5 rounded-2xl shadow-lg shadow-violet-200 text-white">
                        <h3 className="font-bold mb-2">Conseil du jour</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                           "La régularité bat l'intensité. Mieux vaut 15 minutes par jour que 2 heures le dimanche."
                        </p>
                     </div>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="catalog" className="flex-1 overflow-y-auto mt-0 pb-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {activities.map(act => (
                     <ActivityCard key={act.id} activity={act} onStart={handleStart} loading={loading} />
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="stats" className="flex-1 overflow-y-auto mt-0 pb-10">
               <CleoAnalytics skills={skills} activities={activities} stats={stats} />
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
};

export default CleoActivitySystem;