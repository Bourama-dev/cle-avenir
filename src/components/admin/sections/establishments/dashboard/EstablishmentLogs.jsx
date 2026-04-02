import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Filter, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const LOG_FILTERS = [
  { label: 'Tous', value: 'all' },
  { label: 'Inscriptions', value: 'user_signup' },
  { label: 'Tests', value: 'test_completed' },
  { label: 'Paiements', value: 'payment_succeeded' },
  { label: 'Admin', value: 'school_updated' }
];

const EstablishmentLogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [id, activeFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('event_log')
        .select('*')
        .eq('school_id', id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (activeFilter !== 'all') {
        query = query.eq('event_type', activeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les logs."
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeBadge = (type) => {
    const styles = {
      user_signup: "bg-green-100 text-green-800 border-green-200",
      test_completed: "bg-blue-100 text-blue-800 border-blue-200",
      payment_succeeded: "bg-purple-100 text-purple-800 border-purple-200",
      school_updated: "bg-amber-100 text-amber-800 border-amber-200",
      default: "bg-slate-100 text-slate-800 border-slate-200"
    };
    
    return styles[type] || styles.default;
  };

  const formatMetadata = (metadata) => {
    if (!metadata) return '-';
    try {
      // If it's a string, try to parse it, otherwise display
      if (typeof metadata === 'string') return metadata;
      
      // If object, prettify specific fields
      const displayParts = [];
      if (metadata.email) displayParts.push(`Email: ${metadata.email}`);
      if (metadata.score) displayParts.push(`Score: ${metadata.score}`);
      if (metadata.amount) displayParts.push(`Montant: ${metadata.amount / 100}€`);
      if (metadata.changes) displayParts.push(`Champs modifiés: ${Array.isArray(metadata.changes) ? metadata.changes.join(', ') : JSON.stringify(metadata.changes)}`);
      
      if (displayParts.length > 0) return displayParts.join(' | ');
      
      // Fallback to JSON string
      return JSON.stringify(metadata).substring(0, 50) + (JSON.stringify(metadata).length > 50 ? '...' : '');
    } catch (e) {
      return JSON.stringify(metadata);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Journal d'activité</h1>
      </div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Historique des événements
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {LOG_FILTERS.map(filter => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className={activeFilter === filter.value ? "bg-slate-800" : ""}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <FileText className="h-12 w-12 mb-3 opacity-20" />
              <p>Aucun événement trouvé pour ce filtre.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-slate-600">
                      {format(new Date(log.created_at), "d MMM yyyy HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getEventTypeBadge(log.event_type)}>
                        {log.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-md truncate">
                      {formatMetadata(log.metadata)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstablishmentLogs;