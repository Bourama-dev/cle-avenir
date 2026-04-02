import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Database, ShieldCheck, PlayCircle } from 'lucide-react';

const SetupGuide = () => {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 font-semibold">Guide de configuration Supabase</AlertTitle>
        <AlertDescription className="text-blue-700">
          Suivez ces étapes dans votre tableau de bord Supabase pour activer la fonctionnalité de téléchargement de CV.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {/* Step 1 */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" /> 
                Créer le Bucket
              </h4>
              <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm text-slate-600">
                <li>Allez dans le <strong>Dashboard Supabase</strong> &gt; <strong>Storage</strong>.</li>
                <li>Cliquez sur <strong>New Bucket</strong>.</li>
                <li>Nommez-le exactement <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">cv-uploads</code>.</li>
                <li>Laissez le bucket en mode <strong>Private</strong> (ne cochez pas "Public bucket").</li>
                <li>Cliquez sur <strong>Save</strong>.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" /> 
                Configurer les politiques RLS
              </h4>
              <p className="text-sm text-slate-600 mt-2 mb-3">
                Vous devez autoriser les utilisateurs connectés à uploader et lire leurs propres fichiers. 
                Dans la section Storage, allez dans <strong>Policies</strong> et ajoutez ces politiques au bucket <code>cv-uploads</code> :
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Politique d'Insertion (Upload) :</p>
                  <ul className="text-xs text-slate-600 list-disc ml-4 space-y-0.5">
                    <li><strong>Action:</strong> INSERT</li>
                    <li><strong>Target roles:</strong> authenticated</li>
                    <li><strong>WITH CHECK expression:</strong> <code className="text-indigo-600">bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]</code></li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Politique de Lecture (Select) :</p>
                  <ul className="text-xs text-slate-600 list-disc ml-4 space-y-0.5">
                    <li><strong>Action:</strong> SELECT</li>
                    <li><strong>Target roles:</strong> authenticated</li>
                    <li><strong>USING expression:</strong> <code className="text-indigo-600">bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardContent className="p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-slate-500" /> 
                Tester la fonctionnalité
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Une fois le bucket et les politiques créés, fermez cette fenêtre et cliquez sur le bouton <strong>Vérifier la connexion</strong> ou essayez d'uploader un CV à nouveau.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGuide;