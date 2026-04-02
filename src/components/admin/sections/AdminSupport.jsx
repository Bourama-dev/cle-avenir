import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, MessageSquare, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('support_requests').update({ status }).eq('id', id);
    fetchTickets();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-slate-900">Support Client</h2>
       <div className="grid gap-4">
          {tickets.map(ticket => (
             <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                   <div className="flex justify-between items-start">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">{ticket.subject}</span>
                            <Badge variant={ticket.status === 'resolved' ? 'outline' : 'default'} className="uppercase text-[10px]">
                               {ticket.status || 'open'}
                            </Badge>
                            <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleString()}</span>
                         </div>
                         <p className="text-slate-600 mb-2">{ticket.message}</p>
                         <div className="text-sm text-slate-500 flex gap-2 items-center">
                            <MessageSquare className="w-4 h-4"/> {ticket.email} ({ticket.name})
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {ticket.status !== 'resolved' && (
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus(ticket.id, 'resolved')}>
                               <Check className="w-4 h-4 mr-1"/> Résoudre
                            </Button>
                         )}
                      </div>
                   </div>
                </CardContent>
             </Card>
          ))}
          {tickets.length === 0 && <p className="text-center text-slate-500">Aucun ticket de support.</p>}
       </div>
    </div>
  );
};

export default AdminSupport;