import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, DollarSign, CreditCard, Users } from 'lucide-react';

const AdminSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ mrr: 0, active: 0, churn: 0 });

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    const { data } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
    
    if (data) {
        setSubs(data);
        const active = data.filter(s => s.status === 'active');
        const mrr = active.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        setMetrics({ mrr, active: active.length, churn: 0 }); // churn requires historical analysis
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
             <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-full"><DollarSign className="w-6 h-6"/></div>
                <div><div className="text-sm text-slate-500">MRR</div><div className="text-2xl font-bold">{metrics.mrr}€</div></div>
             </CardContent>
          </Card>
          <Card>
             <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-full"><Users className="w-6 h-6"/></div>
                <div><div className="text-sm text-slate-500">Abonnés Actifs</div><div className="text-2xl font-bold">{metrics.active}</div></div>
             </CardContent>
          </Card>
       </div>

       <Card>
          <CardHeader><CardTitle>Derniers Abonnements</CardTitle></CardHeader>
          <CardContent>
             <Table>
                <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Plan</TableHead><TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                   {subs.slice(0, 10).map(sub => (
                      <TableRow key={sub.id}>
                         <TableCell>{sub.user_email}</TableCell>
                         <TableCell className="capitalize">{sub.plan_name}</TableCell>
                         <TableCell>{sub.amount}€</TableCell>
                         <TableCell><Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>{sub.status}</Badge></TableCell>
                         <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </CardContent>
       </Card>
    </div>
  );
};

export default AdminSubscriptions;