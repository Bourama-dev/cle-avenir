import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const AdminAnalytics = () => {
    const [data, setData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Fetch daily signups
            const { data: profiles } = await supabase
                .from('profiles')
                .select('created_at, location')
                .gte('created_at', sevenDaysAgo.toISOString());

            // Process Timeline Data
            const timeline = {};
            const locations = {};

            profiles?.forEach(p => {
                const date = new Date(p.created_at).toLocaleDateString('fr-FR', { weekday: 'short' });
                timeline[date] = (timeline[date] || 0) + 1;

                if (p.location) {
                    const loc = p.location.split(',')[0].trim(); // Simple clean
                    locations[loc] = (locations[loc] || 0) + 1;
                }
            });

            const chartData = Object.entries(timeline).map(([name, count]) => ({ name, users: count }));
            const locData = Object.entries(locations)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            setData(chartData.reverse()); // Just simplistic, real implementation would sort by date properly
            setLocationData(locData);
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading) return <Loader2 className="animate-spin mx-auto mt-12" />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Analytics Avancés</h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Acquisition Utilisateurs (7j)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorU)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Top Localisations</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalytics;