import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, FileText, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SLUG_LABELS = {
  cgu: 'CGU',
  politique_confidentialite: 'Politique de confidentialité',
  rgpd: 'RGPD — Vos Droits',
  mentions_legales: 'Mentions Légales',
};

const AdminLegalVersions = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('id, slug, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les versions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const activateVersion = async (doc) => {
    setActivating(doc.id);
    try {
      await supabase.from('legal_documents').update({ is_active: false }).eq('slug', doc.slug);
      const { error } = await supabase.from('legal_documents').update({ is_active: true }).eq('id', doc.id);
      if (error) throw error;
      toast({ title: 'Version activée', description: `"${SLUG_LABELS[doc.slug] || doc.slug}" mis à jour.`, className: 'bg-green-50 border-green-200' });
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'activer cette version.' });
    } finally {
      setActivating(null);
    }
  };

  const grouped = documents.reduce((acc, doc) => {
    if (!acc[doc.slug]) acc[doc.slug] = [];
    acc[doc.slug].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Versions des Documents Légaux</h2>
        <span className="text-sm text-slate-500">{documents.length} version(s) au total</span>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500">Aucun document légal trouvé.</CardContent></Card>
      ) : (
        Object.entries(grouped).map(([slug, versions]) => (
          <Card key={slug}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-blue-500" />
                {SLUG_LABELS[slug] || slug}
                <Badge variant="outline" className="ml-2 text-xs">{versions.length} version(s)</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(doc.created_at).toLocaleString('fr-FR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {doc.is_active
                          ? <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
                          : <Badge variant="secondary">Archivée</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {!doc.is_active && (
                          <Button size="sm" variant="outline" disabled={activating === doc.id} onClick={() => activateVersion(doc)}>
                            {activating === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Activer'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminLegalVersions;
