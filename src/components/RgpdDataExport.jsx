import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { rgpdService } from '@/services/rgpdService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RgpdDataExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user?.id) return;
    
    try {
      setIsDownloading(true);
      await rgpdService.downloadUserData(user.id);
      
      toast({
        title: "Exportation réussie",
        description: "Vos données ont été téléchargées au format JSON.",
        className: "bg-green-50 border-green-200 text-green-900"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'exportation",
        description: "Un problème est survenu lors du téléchargement de vos données."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="p-8 border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1 space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Portabilité des données</h2>
              <p className="text-slate-500">Gérez et exportez vos données personnelles</p>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            Conformément au RGPD, vous avez le droit de demander une copie de toutes les données personnelles 
            que nous avons collectées à votre sujet. Le fichier généré sera au format JSON (lisible par machine).
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="bg-slate-50">Profil et Identité</Badge>
            <Badge variant="outline" className="bg-slate-50">Résultats des Tests</Badge>
            <Badge variant="outline" className="bg-slate-50">Historique d'Activité</Badge>
            <Badge variant="outline" className="bg-slate-50">Préférences</Badge>
          </div>
        </div>

        <div className="w-full md:w-auto relative z-10 shrink-0 flex flex-col items-center gap-3">
           <img 
             src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/b7c26de16852bdcd079edd50e06c5899.png" 
             alt="Data Portability Illustration" 
             className="w-48 h-auto object-contain mb-2 mix-blend-multiply"
           />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Download className="w-5 h-5 mr-2" />
                Télécharger mes données
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Préparer votre archive</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous êtes sur le point de télécharger une copie complète de vos données personnelles. 
                  Ce fichier contient des informations sensibles. Veillez à le conserver en lieu sûr.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700">
                  {isDownloading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Préparation...</>
                  ) : (
                    'Confirmer le téléchargement'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className="text-xs text-slate-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Export sécurisé</span>
        </div>
      </div>
    </Card>
  );
};

export default RgpdDataExport;