import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, CheckCircle2, TrendingUp, Calendar, Download, 
  Target, MessageSquare, Briefcase, GraduationCap, Users, 
  AlertCircle, ChevronRight, Star, ArrowUpRight, Sparkles, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getUserProfile } from '@/services/userProfile';
import { TrackingService } from '@/services/trackingService';
import { useToast } from '@/components/ui/use-toast';
import { TIERS } from '@/constants/subscriptionTiers';
import AICoachWidget from '@/components/dashboard/AICoachWidget';
import { motion, AnimatePresence } from 'framer-motion';

const TrackingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const init = async () => {
      if (!user) return;

      const profile = getUserProfile();
      // Simple client-side tier check
      if (profile && profile.subscription_tier !== TIERS.PREMIUM_PLUS && profile.role !== 'admin') {
         toast({
           title: "Accès restreint",
           description: "Cette page est réservée aux membres Premium+.",
           variant: "destructive"
         });
         navigate('/dashboard');
         return;
      }

      setLoading(true);
      try {
        const [reportData, goalsData] = await Promise.all([
          TrackingService.getCurrentReport(user.id),
          TrackingService.getGoals(user.id)
        ]);
        setReport(reportData);
        setGoals(goalsData);
      } catch (error) {
        console.error("Failed to load tracking data", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre rapport mensuel.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, navigate, toast]);

  const handleGoalToggle = async (goalId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await TrackingService.updateGoalStatus(goalId, newStatus);
      setGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, completed: newStatus, status: newStatus ? 'completed' : 'pending' } : g
      ));
      toast({
        title: newStatus ? "Objectif atteint ! 🎉" : "Objectif mis à jour",
        description: newStatus ? "Bravo pour cette avancée." : "Statut modifié avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'objectif.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun rapport disponible</h2>
        <Button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</Button>
      </div>
    );
  }

  const kpiData = [
    { label: "Candidatures", value: report.kpis?.applications_sent || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Formations", value: report.kpis?.courses_completed || 0, icon: GraduationCap, color: "text-violet-600", bg: "bg-violet-100" },
    { label: "Réseau", value: report.kpis?.networking_contacts || 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent -ml-2" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex border-violet-200 text-violet-700 bg-violet-50">
                <Star className="h-3 w-3 mr-1 fill-violet-700" /> Premium+
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Exporter PDF</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rapport Mensuel</h1>
              <p className="text-slate-500 capitalize flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" /> {currentMonth}
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
               <div className="text-right">
                 <p className="text-sm font-medium text-slate-500">Progression globale</p>
                 <p className="text-2xl font-bold text-slate-900">{report.progress_percentage}%</p>
               </div>
               <div className="w-32">
                 <Progress value={report.progress_percentage} className="h-2" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AI Insight Teaser */}
        <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none shadow-md">
           <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">Besoin d'analyser vos résultats ?</h3>
                    <p className="text-violet-100">Votre Coach IA peut vous expliquer ce rapport et définir votre prochaine action.</p>
                 </div>
              </div>
              <Button 
                onClick={() => setShowAIChat(true)} 
                variant="secondary" 
                className="bg-white text-violet-600 hover:bg-violet-50 font-semibold shadow-sm"
              >
                Discuter avec le Coach
              </Button>
           </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="col-span-2 md:col-span-1 border-l-4 border-l-violet-600 shadow-sm">
             <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="text-sm font-medium text-slate-500">Score d'engagement</p>
                      <p className="text-3xl font-bold text-violet-900 mt-1">{report.engagement_score}</p>
                   </div>
                   <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-violet-600" />
                   </div>
                </div>
             </CardContent>
          </Card>

          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                </div>
                <p className="text-sm font-medium text-slate-600 mt-3">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Coach Feedback */}
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                     {report.coach_name?.charAt(0) || 'C'}
                  </div>
                  Le mot de {report.coach_name || 'votre Coach'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-yellow max-w-none text-slate-700 bg-white/60 p-4 rounded-lg backdrop-blur-sm border border-yellow-100/50">
                  <p className="italic leading-relaxed">"{report.coach_feedback}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Objectives Tracker */}
            <Card className="shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-600" />
                    Objectifs du mois
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-1">
                 {goals.length === 0 && (
                   <p className="text-slate-500 text-sm text-center py-4">Aucun objectif défini.</p>
                 )}
                 {goals.map((goal) => (
                   <div key={goal.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <Checkbox 
                        id={`goal-${goal.id}`} 
                        checked={goal.completed}
                        onCheckedChange={() => handleGoalToggle(goal.id, goal.completed)}
                        className="mt-1 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          htmlFor={`goal-${goal.id}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                            goal.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {goal.title}
                        </label>
                      </div>
                   </div>
                 ))}
               </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="shadow-sm">
               <CardHeader>
                 <CardTitle>Activité Hebdomadaire</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="h-[300px] w-full mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={report.activity_data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column - Summaries */}
          <div className="space-y-6">
            <Card className="shadow-sm border-emerald-100">
               <CardHeader className="bg-emerald-50/50 pb-4">
                 <CardTitle className="flex items-center gap-2 text-emerald-800 text-lg">
                   <CheckCircle2 className="h-5 w-5" />
                   Réalisations
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                 <ul className="space-y-3">
                   {report.achievements?.map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating AI Chat */}
      <AnimatePresence>
        {showAIChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowAIChat(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative z-10 w-full max-w-lg"
             >
                <AICoachWidget compact={false} onClose={() => setShowAIChat(false)} />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAB Trigger */}
      {!showAIChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 flex items-center justify-center z-40 hover:bg-violet-700 transition-colors"
        >
          <MessageSquare className="h-7 w-7" />
        </motion.button>
      )}
    </div>
  );
};

export default TrackingPage;