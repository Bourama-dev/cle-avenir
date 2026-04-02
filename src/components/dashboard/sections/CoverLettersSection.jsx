import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Edit, Trash2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

const CoverLettersSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLetters();
  }, [user]);

  const fetchLetters = async () => {
    setLoading(true);
    const { data } = await supabase.from('user_cover_letters').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    setLetters(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette lettre ?")) return;
    await supabase.from('user_cover_letters').delete().eq('id', id);
    fetchLetters();
    toast({ title: "Lettre supprimée" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Lettres de Motivation</h2>
        <Button onClick={() => navigate('/cover-letter-builder')} className="bg-purple-600">
           <Plus className="mr-2 h-4 w-4" /> Nouvelle Lettre
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : letters.length === 0 ? (
        <Card className="border-dashed border-2 p-10 text-center bg-slate-50">
           <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
           <h3 className="text-lg font-medium text-slate-900">Aucune lettre créée</h3>
           <p className="text-slate-500 mb-4">Créez votre première lettre de motivation professionnelle en quelques clics.</p>
           <Button onClick={() => navigate('/cover-letter-builder')}>Créer une lettre</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {letters.map((letter) => (
             <Card key={letter.id} className="hover:shadow-md transition-shadow group relative">
                <CardContent className="p-5">
                   <div className="h-32 bg-slate-100 rounded mb-4 flex items-center justify-center border">
                      <FileText className="h-10 w-10 text-slate-300" />
                   </div>
                   <h3 className="font-bold truncate mb-1">{letter.title}</h3>
                   <p className="text-xs text-slate-500 mb-4">Modifié le {new Date(letter.updated_at).toLocaleDateString()}</p>
                   
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/cover-letter-builder/${letter.id}`)}>
                         <Edit className="h-3 w-3 mr-2" /> Éditer
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(letter.id)}>
                         <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      )}
    </div>
  );
};

export default CoverLettersSection;