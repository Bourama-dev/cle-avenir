import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UploadCloud, FileText, AlertCircle, CheckCircle2, RefreshCcw, Settings, Loader2, Database, ShieldAlert } from 'lucide-react';
import { useSafeToast } from '@/hooks/useSafeToast';
import { useCVExtraction } from '@/hooks/useCVExtraction';
import { cvStorageService } from '@/services/cvStorageService';
import { cvFormDataService } from '@/services/cvFormDataService';
import { checkCvUploadBucketStatus } from '@/utils/supabaseStorageSetup';
import { initPdfWorker } from '@/utils/pdfWorkerSetup';
import SetupGuide from './SetupGuide';
import CVDataReview from './CVDataReview';

const CVUploadSection = ({ userId, currentResumeUrl, onUploadComplete, onExtractionComplete }) => {
  const { toast } = useSafeToast();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bucketStatus, setBucketStatus] = useState('checking'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [manualWorkerRetry, setManualWorkerRetry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showReview, setShowReview] = useState(false);
  
  const { processCV, extractedData, validation, extracting, error: extractError, clearData, workerStatus } = useCVExtraction();

  const verifyBucket = useCallback(async () => {
    setBucketStatus('checking');
    const result = await checkCvUploadBucketStatus();
    setBucketStatus(result.status);
  }, []);

  useEffect(() => {
    verifyBucket();
  }, [verifyBucket]);

  const handleRetryWorker = async () => {
    setManualWorkerRetry(true);
    await initPdfWorker();
    setManualWorkerRetry(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setUploadError(null);
    clearData();
    setShowReview(false);

    if (file.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Format invalide', description: 'Veuillez uploader un fichier PDF.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Fichier trop lourd', description: 'Le CV ne doit pas dépasser 10 Mo.' });
      return;
    }

    setSelectedFile(file);
    await processUploadAndExtract(file);
  };

  const processUploadAndExtract = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(20);
      
      // Upload to Storage
      const { url, fileName } = await cvStorageService.uploadCVFile(userId, file);
      setUploadProgress(50);
      setBucketStatus('ok');

      // Process Extraction
      const result = await processCV(file);
      setUploadProgress(90);

      // Store in DB initially as inactive until reviewed
      const saveResponse = await cvFormDataService.saveCVData(userId, result.data, url, fileName, false);
      if (!saveResponse.success) throw new Error(saveResponse.error);
      
      setUploadProgress(100);
      setUploading(false);
      setShowReview(true);
      
    } catch (err) {
      console.error("Process aborted due to error.", err);
      setUploading(false);
      setUploadError(err.message || 'Erreur lors du traitement du fichier.');
    }
  };

  const handleSaveReview = async (reviewedData) => {
    try {
      const response = await cvFormDataService.saveCVData(userId, reviewedData, null, selectedFile?.name, true);
      if (!response.success) throw new Error(response.error);
      
      toast({ title: 'Données enregistrées !', description: 'Votre CV a été mis à jour dans votre profil.' });
      setShowReview(false);
      if (onExtractionComplete) onExtractionComplete(reviewedData);
      if (onUploadComplete) onUploadComplete();
    } catch(err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message || 'Impossible de sauvegarder les données.' });
    }
  };

  const triggerInput = () => {
    if (bucketStatus === 'missing' || bucketStatus === 'rls_error') {
      setIsGuideOpen(true);
      return;
    }
    setUploadError(null);
    clearData();
    fileInputRef.current.click();
  };

  const isProcessing = uploading || extracting;
  const progressValue = uploadProgress;
  const statusMessage = uploading ? 'Téléchargement et analyse en cours...' : '';

  const renderStatusBadge = () => {
    switch (bucketStatus) {
      case 'checking':
        return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Vérification...</Badge>;
      case 'ok':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Configuré</Badge>;
      case 'missing':
      case 'rls_error':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 cursor-pointer hover:bg-amber-100" onClick={() => setIsGuideOpen(true)}>⚠ Setup requis</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm border border-slate-200 bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5 text-indigo-500" />
              Importer un CV PDF
            </h3>
            {renderStatusBadge()}
          </div>

          {workerStatus.error && (
            <Alert variant="destructive" className="mb-4 bg-orange-50 border-orange-200 text-orange-900">
              <ShieldAlert className="h-4 w-4 text-orange-600" />
              <AlertTitle className="font-semibold">Service d'analyse PDF indisponible</AlertTitle>
              <AlertDescription className="mt-1">
                Le moteur de lecture PDF n'a pas pu démarrer. L'extraction automatique du texte pourrait échouer.
              </AlertDescription>
              <Button 
                variant="outline" size="sm" 
                className="mt-3 bg-white text-orange-700 border-orange-200 hover:bg-orange-100" 
                onClick={handleRetryWorker}
                disabled={manualWorkerRetry}
              >
                {manualWorkerRetry ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCcw className="w-3 h-3 mr-2" />} Relancer
              </Button>
            </Alert>
          )}

          {(uploadError || extractError) && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 font-semibold">Erreur de traitement</AlertTitle>
              <AlertDescription className="text-red-700 mt-1">{uploadError || extractError}</AlertDescription>
              <Button variant="outline" size="sm" className="mt-3 bg-white hover:bg-red-50 text-red-700 border-red-200" onClick={() => triggerInput()}>
                <RefreshCcw className="w-3 h-3 mr-2" /> Réessayer
              </Button>
            </Alert>
          )}

          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            } ${(bucketStatus === 'missing' || bucketStatus === 'rls_error') && !isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={handleChange} disabled={isProcessing || bucketStatus === 'missing' || bucketStatus === 'rls_error'} />
            
            {isProcessing ? (
              <div className="space-y-4 max-w-sm mx-auto">
                <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>{statusMessage}</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2 w-full bg-indigo-100" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UploadCloud className={`w-6 h-6 ${(bucketStatus === 'missing' || bucketStatus === 'rls_error') ? 'text-slate-400' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800">Glissez-déposez votre CV ici</p>
                  <p className="text-sm text-slate-500 mt-1">Format PDF uniquement (max. 10 Mo)</p>
                </div>
                <Button onClick={triggerInput} variant="outline" className="bg-white text-gray-900" disabled={bucketStatus === 'missing' || bucketStatus === 'rls_error'}>
                  Parcourir les fichiers
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showReview && extractedData && (
        <CVDataReview 
          extractedData={extractedData} 
          validationResults={validation} 
          onSave={handleSaveReview} 
          onCancel={() => setShowReview(false)} 
        />
      )}
    </div>
  );
};

export default CVUploadSection;