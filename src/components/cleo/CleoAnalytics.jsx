import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Award } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-xs text-violet-600 font-medium">
          {payload[0].name}: <span className="text-slate-900 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CleoAnalytics = ({ skills, activities, stats }) => {
  
  // Transform skills for Radar Chart
  const radarData = skills.length > 0 ? skills.map(s => ({
    subject: s.skill_name.length > 10 ? s.skill_name.substring(0, 10) + '...' : s.skill_name,
    A: s.level,
    fullMark: 100
  })) : [
    { subject: 'Tech', A: 20, fullMark: 100 },
    { subject: 'Soft Skills', A: 50, fullMark: 100 },
    { subject: 'Gestion', A: 30, fullMark: 100 },
    { subject: 'Langues', A: 40, fullMark: 100 },
    { subject: 'Leadership', A: 10, fullMark: 100 },
  ];

  // Mock Progress Data (Real implementation would query historical stats)
  const progressData = [
    { name: 'Lun', xp: 20 },
    { name: 'Mar', xp: 45 },
    { name: 'Mer', xp: 30 },
    { name: 'Jeu', xp: 80 },
    { name: 'Ven', xp: 50 },
    { name: 'Sam', xp: 90 },
    { name: 'Dim', xp: stats.total_xp ? stats.total_xp % 100 : 60 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Skill Radar */}
      <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-slate-800">
              <Activity size={18} className="text-violet-500" /> Empreinte de Compétences
            </CardTitle>
            <CardDescription>Votre profil multidimensionnel actuel</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Niveau"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* XP Curve */}
      <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-slate-800">
              <TrendingUp size={18} className="text-emerald-500" /> Vélocité d'Apprentissage
            </CardTitle>
            <CardDescription>Points d'expérience gagnés cette semaine</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorXp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Activités Complétées', val: activities.filter(a => a.status === 'completed').length, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Série Actuelle', val: `${stats.current_streak} Jours`, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
           { label: 'Total XP', val: stats.total_xp || 0, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'Niveau', val: Math.floor((stats.total_xp || 0) / 1000) + 1, icon: Award, color: 'text-pink-500', bg: 'bg-pink-50' },
         ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2"
            >
               <div className={`p-2 rounded-full ${item.bg}`}>
                  <item.icon size={20} className={item.color} />
               </div>
               <div>
                  <div className="text-2xl font-bold text-slate-900">{item.val}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</div>
               </div>
            </motion.div>
         ))}
      </div>

    </div>
  );
};

export default CleoAnalytics;