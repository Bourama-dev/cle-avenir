import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Trash2, Calendar, Download, AlertCircle } from 'lucide-react';
import { cvFormDataService } from '@/services/cvFormDataService';
import { useSafeToast } from '@/hooks/useSafeToast';
import { Skeleton } from '@/components/ui/skeleton';

const CVManagement = ({ userId }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useSafeToast();

  useEffect(() => {
    loadCVs();
  }, [userId]);

  const loadCVs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cvFormDataService.fetchUserCVs(userId);
      if (response.success) {
        setCvs(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos CVs.");
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger vos CVs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (cvId) => {
    try {
      const response = await cvFormDataService.setActiveCV(userId, cvId);
      if (!response.success) throw new Error(response.error);
      
      toast({ title: 'Succès', description: 'CV défini comme actif.' });
      loadCVs();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message || 'Impossible de définir le CV actif.' });
    }
  };

  const handleDelete = async (cvId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) return;
    try {
      const response = await cvFormDataService.deleteCV(cvId);
      if (!response.success) throw new Error(response.error);
      
      toast({ title: 'Succès', description: 'CV supprimé avec succès.' });
      loadCVs();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message || 'Impossible de supprimer le CV.' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="flex flex-col items-center justify-center p-8 text-red-600">
          <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
          <p>{error}</p>
          <Button variant="outline" className="mt-4 bg-white" onClick={loadCVs}>Réessayer</Button>
        </CardContent>
      </Card>
    );
  }

  if (cvs.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8 text-slate-500">
          <FileText className="w-10 h-10 mb-4 opacity-50" />
          <p>Aucun CV sauvegardé pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cvs.map(cv => (
        <Card key={cv.id} className={`transition-all ${cv.is_active ? 'border-indigo-400 ring-1 ring-indigo-400 shadow-sm' : 'border-slate-200 opacity-80 hover:opacity-100'}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${cv.is_active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  {cv.file_name || cv.title || 'CV sans titre'}
                  {cv.is_active && <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Actif</Badge>}
                </h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Mis à jour le {new Date(cv.updated_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {cv.file_url && (
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600" asChild>
                  <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {!cv.is_active && (
                <Button variant="outline" size="sm" onClick={() => handleSetActive(cv.id)} className="bg-white text-gray-900 hidden sm:flex">
                  <CheckCircle className="w-4 h-4 mr-2" /> Définir comme actif
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cv.id)} className="text-red-500 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CVManagement;