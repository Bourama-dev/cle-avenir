import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AdminRoute from '@/lib/AdminRoute';

const mockFeedbackTrend = [
  { name: 'Lun', feedback: 12, rating: 4.2 },
  { name: 'Mar', feedback: 19, rating: 4.5 },
  { name: 'Mer', feedback: 15, rating: 3.9 },
  { name: 'Jeu', feedback: 22, rating: 4.6 },
  { name: 'Ven', feedback: 28, rating: 4.8 },
  { name: 'Sam', feedback: 35, rating: 4.4 },
  { name: 'Dim', feedback: 25, rating: 4.1 },
];

const mockTopMetiers = [
  { name: 'Développeur Web', rating: 4.8, count: 145 },
  { name: 'Data Scientist', rating: 4.6, count: 89 },
  { name: 'Infirmier', rating: 4.5, count: 210 },
  { name: 'Architecte', rating: 4.4, count: 67 },
  { name: 'Designer UX', rating: 4.3, count: 112 },
];

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-emerald-600 font-medium">{trend}</span>
          <span className="text-slate-500">{subtitle}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminAnalyticsDashboard = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Mode Aperçu",
      description: "Certaines données sont simulées pour la démonstration de l'interface analytique.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Feedback</h1>
        <p className="text-slate-500">Vue d'ensemble des retours utilisateurs et de la performance des recommandations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Feedback" value="1,248" subtitle="ce mois-ci" trend="+12.5%" icon={MessageSquare} />
        <StatCard title="Note Moyenne" value="4.2/5" subtitle="tous métiers" trend="+0.1" icon={Star} />
        <StatCard title="Profils Analysés" value="8,432" subtitle="actifs" trend="+5.2%" icon={Users} />
        <StatCard title="Taux d'Acceptation" value="78%" subtitle="recommandations" trend="+2.4%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Volume de Feedback (7 derniers jours)</CardTitle>
            <CardDescription>Évolution du nombre d'avis soumis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFeedbackTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="feedback" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Métiers (Mieux notés)</CardTitle>
            <CardDescription>Métiers ayant reçu les meilleures notes moyennes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {mockTopMetiers.map((metier, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{metier.name}</p>
                      <p className="text-xs text-slate-500">{metier.count} avis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-700">{metier.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;