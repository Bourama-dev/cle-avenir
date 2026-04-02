import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { institutionService } from '@/services/institutionService';
import { Copy, Plus, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminInstitutionCodesPage = () => {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: inst } = await supabase.from('institutions').select('*').eq('id', id).single();
      const { data: c } = await supabase.from('institution_codes').select('*').eq('institution_id', id).order('created_at', { ascending: false });
      
      setInstitution(inst);
      setCodes(c || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const code = institutionService.generateCode();
      const expires = new Date();
      expires.setDate(expires.getDate() + 30); // 30 days expiry

      const { data, error } = await supabase
        .from('institution_codes')
        .insert({
          institution_id: id,
          code: code,
          expires_at: expires.toISOString(),
          max_uses: 50
        })
        .select()
        .single();

      if (error) throw error;
      
      setCodes([data, ...codes]);
      toast({ title: "Code généré", description: `Code ${code} créé avec succès.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const handleRevoke = async (codeId) => {
    if(!confirm("Voulez-vous vraiment désactiver ce code ?")) return;
    try {
      const { error } = await supabase
        .from('institution_codes')
        .update({ status: 'expired' })
        .eq('id', codeId);
        
      if (error) throw error;
      
      setCodes(codes.map(c => c.id === codeId ? { ...c, status: 'expired' } : c));
      toast({ title: "Code révoqué" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Le code a été copié dans le presse-papier." });
  };

  const getStatusBadge = (code) => {
    const isExpired = new Date(code.expires_at) < new Date();
    if (code.status === 'expired' || isExpired) return <Badge variant="destructive">Expiré</Badge>;
    if (code.status === 'used') return <Badge variant="secondary">Utilisé</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">Actif</Badge>;
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/institutions">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Codes d'accès - {institution?.name}</h1>
          <p className="text-slate-500">Gérez les codes d'invitation pour les étudiants</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des codes</CardTitle>
          <Button onClick={handleGenerateCode} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Générer un code
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Aucun code généré.</TableCell></TableRow>
              ) : (
                codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono font-medium text-lg">{code.code}</TableCell>
                    <TableCell>{getStatusBadge(code)}</TableCell>
                    <TableCell>{code.usage_count} / {code.max_uses}</TableCell>
                    <TableCell>{new Date(code.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code.code)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      {code.status === 'active' && (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRevoke(code.id)}>
                          Désactiver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstitutionCodesPage;