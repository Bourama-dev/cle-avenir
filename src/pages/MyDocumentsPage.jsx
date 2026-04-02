import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Copy, 
  Loader2,
  Plus,
  Calendar,
  File,
  LayoutTemplate
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cvSaveService } from '@/services/cvSaveService';
import { coverLetterSaveService } from '@/services/coverLetterSaveService';
import { exportCVPDF } from '@/utils/cvPdfExporter';
import { exportCoverLetterPDF } from '@/utils/coverLetterPdfExporter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';
import { CV_TEMPLATES_CONFIG } from '@/data/cvTemplateConfig';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';

const MyDocumentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cvs, setCvs] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cvs');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const [cvsResult, lettersResult] = await Promise.all([
        cvSaveService.listUserCvs(user.id),
        coverLetterSaveService.listUserCoverLetters(user.id)
      ]);

      setCvs(cvsResult.data);
      setCoverLetters(lettersResult.data);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger vos documents."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCv = (cvId) => {
    navigate(`/cv-builder/${cvId}`);
  };

  const handleEditCoverLetter = (letterId) => {
    navigate(`/cover-letter-builder/${letterId}`);
  };

  const handleDeleteCv = async (cvId) => {
    setItemToDelete({ type: 'cv', id: cvId });
    setDeleteDialogOpen(true);
  };

  const handleDeleteCoverLetter = async (letterId) => {
    setItemToDelete({ type: 'letter', id: letterId });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      if (itemToDelete.type === 'cv') {
        await cvSaveService.deleteCv(itemToDelete.id, user.id);
        setCvs(prev => prev.filter(cv => cv.id !== itemToDelete.id));
        toast({ title: "CV supprimé avec succès" });
      } else {
        await coverLetterSaveService.deleteCoverLetter(itemToDelete.id, user.id);
        setCoverLetters(prev => prev.filter(letter => letter.id !== itemToDelete.id));
        toast({ title: "Lettre de motivation supprimée avec succès" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDuplicateCv = async (cvId) => {
    try {
      const result = await cvSaveService.duplicateCv(cvId, user.id);
      setCvs(prev => [result.data, ...prev]);
      toast({ title: "CV dupliqué avec succès" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const handleDuplicateCoverLetter = async (letterId) => {
    try {
      const result = await coverLetterSaveService.duplicateCoverLetter(letterId, user.id);
      setCoverLetters(prev => [result.data, ...prev]);
      toast({ title: "Lettre dupliquée avec succès" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const getTemplateName = (templateId, type) => {
    if (type === 'cv') {
      const template = CV_TEMPLATES_CONFIG.find(t => t.id === templateId);
      return template?.name || 'Modèle inconnu';
    } else {
      const template = CL_TEMPLATES_CONFIG.find(t => t.id === templateId);
      return template?.name || 'Modèle inconnu';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const DocumentCard = ({ doc, type }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">{doc.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <LayoutTemplate className="w-4 h-4" />
              {getTemplateName(doc.template_id, type)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {type === 'cv' ? 'CV' : 'Lettre'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Créé le {formatDate(doc.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <File className="w-3 h-3" />
              Modifié le {formatDate(doc.updated_at)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              size="sm" 
              onClick={() => type === 'cv' ? handleEditCv(doc.id) : handleEditCoverLetter(doc.id)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Modifier
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => type === 'cv' ? handleDuplicateCv(doc.id) : handleDuplicateCoverLetter(doc.id)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Dupliquer
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => type === 'cv' ? handleDeleteCv(doc.id) : handleDeleteCoverLetter(doc.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {type === 'cv' ? 'Aucun CV enregistré' : 'Aucune lettre de motivation enregistrée'}
      </h3>
      <p className="text-slate-600 mb-6">
        {type === 'cv' 
          ? 'Créez votre premier CV professionnel en quelques minutes' 
          : 'Rédigez votre première lettre de motivation personnalisée'}
      </p>
      <Button 
        onClick={() => navigate(type === 'cv' ? '/cv-builder' : '/cover-letter-builder')}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        {type === 'cv' ? 'Créer un CV' : 'Créer une lettre'}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <SEOHead 
        title="Mes Documents - CV & Lettres de Motivation"
        description="Gérez vos CV et lettres de motivation sauvegardés"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes Documents</h1>
          <p className="text-slate-600">Gérez vos CV et lettres de motivation</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="cvs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              CV ({cvs.length})
            </TabsTrigger>
            <TabsTrigger value="letters" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lettres de motivation ({coverLetters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cvs">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={() => navigate('/cv-builder')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau CV
              </Button>
            </div>

            {cvs.length === 0 ? (
              <EmptyState type="cv" />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvs.map(cv => (
                  <DocumentCard key={cv.id} doc={cv} type="cv" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="letters">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={() => navigate('/cover-letter-builder')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle lettre
              </Button>
            </div>

            {coverLetters.length === 0 ? (
              <EmptyState type="letter" />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coverLetters.map(letter => (
                  <DocumentCard key={letter.id} doc={letter} type="letter" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyDocumentsPage;