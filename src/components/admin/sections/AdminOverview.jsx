import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import HelpButton from '@/components/ui/HelpButton';

const AdminOverview = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalRevenue: 0,
    conversionRate: 0,
    onlineNow: 0,
    newUsers24h: 0,
    newSubs24h: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // 1. Basic Counts
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: testsCount } = await supabase.from('test_results').select('*', { count: 'exact', head: true });
        
        // 2. Revenue
        const { data: subs } = await supabase.from('subscriptions').select('amount').eq('status', 'active');
        const revenue = subs?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

        // 3. Activity (24h)
        const { count: newUsersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneDayAgo);
          
        const { count: newSubsCount } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneDayAgo);

        // 4. Online Now (Proxy: updated_at in last hour)
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        const { count: activeUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', oneHourAgo);

        // 5. Calculate Conversion
        const { count: paidUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .neq('subscription_tier', 'free')
            .not('subscription_tier', 'is', null);
        
        const conversion = (usersCount && usersCount > 0) ? ((paidUsers || 0) / usersCount) * 100 : 0;

        setMetrics({
          totalUsers: usersCount || 0,
          totalTests: testsCount || 0,
          totalRevenue: revenue,
          conversionRate: conversion.toFixed(1),
          onlineNow: activeUsers || 0,
          newUsers24h: newUsersCount || 0,
          newSubs24h: newSubsCount || 0
        });

        // 6. Chart Data (Last 7 Days)
        const { data: usersLast7Days } = await supabase
            .from('profiles')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString());

        const { data: testsLast7Days } = await supabase
            .from('test_results')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString());

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            days.push(d.toLocaleDateString('fr-FR', { weekday: 'short' }));
        }

        const buckets = days.reduce((acc, day) => {
            acc[day] = { users: 0, tests: 0 };
            return acc;
        }, {});

        const incrementBucket = (isoDate, key) => {
             const dayName = new Date(isoDate).toLocaleDateString('fr-FR', { weekday: 'short' });
             if (buckets[dayName]) {
                 buckets[dayName][key]++;
             }
        };

        usersLast7Days?.forEach(u => incrementBucket(u.created_at, 'users'));
        testsLast7Days?.forEach(t => incrementBucket(t.created_at, 'tests'));

        const finalChartData = days.map(day => ({
            name: day,
            users: buckets[day].users,
            tests: buckets[day].tests
        }));

        setChartData(finalChartData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Utilisateurs Total", value: metrics.totalUsers, change: `+${metrics.newUsers24h}`, icon: Users, color: "text-blue-500", suffix: "" },
    { title: "Tests Effectués", value: metrics.totalTests, change: "N/A", icon: FileText, color: "text-purple-500", suffix: "" },
    { title: "Taux Conversion", value: metrics.conversionRate, change: "Var.", icon: TrendingUp, color: "text-green-500", suffix: "%" },
    { title: "Revenu Mensuel", value: metrics.totalRevenue, change: `+${metrics.newSubs24h} subs`, icon: DollarSign, color: "text-yellow-500", suffix: "€" },
  ];

  if (loading) {
      return (
          <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Vue d'ensemble</h2>
            <HelpButton section="DASHBOARD" />
          </div>
          <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            En direct
          </span>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
             <Card key={i} className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                   <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                   <div className="text-2xl font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}</div>
                   <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {stat.change !== 'N/A' && stat.change !== 'Var.' && (
                          <span className="text-green-600 font-bold bg-green-50 px-1 rounded">{stat.change}</span> 
                      )}
                      <span className="hidden sm:inline">récemment</span>
                   </p>
                </CardContent>
             </Card>
          ))}
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
          <Card className="xl:col-span-4 shadow-sm border-slate-200 overflow-hidden">
             <CardHeader>
                <CardTitle>Activité (7 derniers jours)</CardTitle>
             </CardHeader>
             <CardContent className="pl-0 sm:pl-2">
                <div className="h-[250px] sm:h-[350px] w-full min-w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                        />
                        <Area type="monotone" dataKey="users" name="Inscriptions" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>

          <Card className="xl:col-span-3 shadow-sm border-slate-200 overflow-hidden">
             <CardHeader>
                <CardTitle>Tests vs Inscriptions</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="h-[250px] sm:h-[350px] w-full min-w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="tests" name="Tests" fill="#82ca9d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="users" name="Inscriptions" fill="#8884d8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
       </div>
    </div>
  );
};

export default AdminOverview;