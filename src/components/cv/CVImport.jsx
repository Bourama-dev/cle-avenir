import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, ArrowRight, Save, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cvParserService } from '@/services/cvParserService';
import { cvAiService } from '@/services/cvAiService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const CVImport = ({ onImportComplete, onCancel }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('upload'); // 'upload', 'parsing', 'review'
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Check type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Format non supporté. Veuillez utiliser PDF ou DOCX.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep('parsing');
    setProgress(10);

    try {
      // 1. Extract Text
      setProgress(30);
      const text = await cvParserService.extractText(file);
      
      if (!text || text.length < 50) {
        throw new Error("Impossible de lire le texte du fichier ou fichier vide.");
      }

      setProgress(60);
      // 2. AI Structuring
      const structuredData = await cvAiService.structureCV(text);
      
      setProgress(100);
      setExtractedData(structuredData);
      setStep('review');
      setLoading(false);

    } catch (err) {
      console.error("Import Error:", err);
      setError(err.message || "Une erreur est survenue lors de l'import.");
      setStep('upload');
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Transform extracted data to match profile structure if necessary
    const profileFormat = {
      first_name: extractedData.personal?.first_name,
      last_name: extractedData.personal?.last_name,
      email: extractedData.personal?.email,
      phone: extractedData.personal?.phone,
      location: extractedData.personal?.location,
      main_goal: extractedData.personal?.summary ? "Trouver un emploi correspondant à mon profil" : "",
      experience: extractedData.experience || [],
      education: extractedData.education || [],
      skills: extractedData.skills || [],
      interests: extractedData.interests || []
    };

    onImportComplete(profileFormat);
    toast({
      title: "Profil mis à jour",
      description: "Les informations de votre CV ont été importées.",
    });
  };

  // ---- RENDER STEPS ----

  if (step === 'review' && extractedData) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Vérification des données</h2>
            <p className="text-slate-500">Confirmez les informations extraites avant de les sauvegarder.</p>
          </div>
          <Badge variant={extractedData.confidence > 0.7 ? "default" : "secondary"} className={extractedData.confidence > 0.7 ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700"}>
            Confiance IA: {Math.round((extractedData.confidence || 0) * 100)}%
          </Badge>
        </div>

        <ScrollArea className="h-[60vh] rounded-md border p-4 bg-slate-50">
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-semibold text-violet-700 mb-3 flex items-center gap-2">
                <FileText size={18} /> Informations Personnelles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Prénom</Label>
                  <Input value={extractedData.personal?.first_name || ''} onChange={e => setExtractedData({...extractedData, personal: {...extractedData.personal, first_name: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Nom</Label>
                  <Input value={extractedData.personal?.last_name || ''} onChange={e => setExtractedData({...extractedData, personal: {...extractedData.personal, last_name: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Email</Label>
                  <Input value={extractedData.personal?.email || ''} onChange={e => setExtractedData({...extractedData, personal: {...extractedData.personal, email: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Téléphone</Label>
                  <Input value={extractedData.personal?.phone || ''} onChange={e => setExtractedData({...extractedData, personal: {...extractedData.personal, phone: e.target.value}})} />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
               <h3 className="font-semibold text-violet-700 mb-3 flex items-center gap-2">
                <ArrowRight size={18} /> Expériences ({extractedData.experience?.length || 0})
              </h3>
              <div className="space-y-4">
                {extractedData.experience?.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 text-sm space-y-2 relative group">
                    <button 
                      onClick={() => {
                        const newExp = [...extractedData.experience];
                        newExp.splice(idx, 1);
                        setExtractedData({...extractedData, experience: newExp});
                      }}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={exp.role} onChange={e => {
                        const newExp = [...extractedData.experience];
                        newExp[idx].role = e.target.value;
                        setExtractedData({...extractedData, experience: newExp});
                      }} placeholder="Poste" className="font-medium" />
                      <Input value={exp.company} onChange={e => {
                        const newExp = [...extractedData.experience];
                        newExp[idx].company = e.target.value;
                        setExtractedData({...extractedData, experience: newExp});
                      }} placeholder="Entreprise" />
                    </div>
                    <Textarea value={exp.description} onChange={e => {
                        const newExp = [...extractedData.experience];
                        newExp[idx].description = e.target.value;
                        setExtractedData({...extractedData, experience: newExp});
                      }} className="h-20 text-xs" placeholder="Description" />
                  </div>
                ))}
              </div>
            </div>

             {/* Skills */}
             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
               <h3 className="font-semibold text-violet-700 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} /> Compétences
              </h3>
              <Textarea 
                value={extractedData.skills?.join(', ')} 
                onChange={e => setExtractedData({...extractedData, skills: e.target.value.split(',').map(s => s.trim())})}
                placeholder="Liste de compétences séparées par des virgules"
              />
             </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={() => { setStep('upload'); setExtractedData(null); }}>
             <RefreshCw className="mr-2 h-4 w-4" /> Recommencer
          </Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
             <Save className="mr-2 h-4 w-4" /> Importer dans mon profil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Importez votre CV</h2>
        <p className="text-slate-500">
          L'IA va analyser votre document pour remplir votre profil automatiquement.
        </p>
      </div>

      <Card 
        className={`border-2 border-dashed transition-all duration-300 overflow-hidden relative ${
          isDragOver ? 'border-violet-500 bg-violet-50' : 'border-slate-200'
        } ${loading ? 'pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          {loading ? (
             <div className="w-full max-w-xs space-y-6">
                <div className="relative mx-auto w-16 h-16">
                   <div className="absolute inset-0 bg-violet-200 rounded-full animate-ping opacity-75"></div>
                   <div className="relative bg-white p-4 rounded-full shadow-sm z-10 flex items-center justify-center h-full w-full">
                      <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-900 mb-2">Analyse intelligente...</h3>
                   <p className="text-sm text-slate-500 mb-4">
                     {progress < 50 ? "Lecture du fichier" : "Extraction des données"}
                   </p>
                   <Progress value={progress} className="h-2 w-full" />
                </div>
             </div>
          ) : (
             <>
               <div className="bg-violet-100 p-4 rounded-full mb-6">
                  <Upload className="w-8 h-8 text-violet-600" />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">Glissez votre CV ici</h3>
               <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                 Supporte les fichiers PDF et Word (DOCX). Maximum 10MB.
               </p>
               
               <input 
                 type="file" 
                 id="cv-upload-input" 
                 className="hidden" 
                 accept=".pdf,.docx,.doc"
                 onChange={handleFileInput}
               />
               <div className="flex flex-col gap-3 w-full max-w-xs">
                 <Button onClick={() => document.getElementById('cv-upload-input').click()} className="w-full bg-violet-600 hover:bg-violet-700">
                   Sélectionner un fichier
                 </Button>
                 <Button variant="ghost" onClick={onCancel} className="text-slate-400">
                   Annuler
                 </Button>
               </div>
             </>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur d'import</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
              <p className="text-xs text-slate-600 font-medium">Extraction du texte</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
              <p className="text-xs text-slate-600 font-medium">Analyse IA</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
              <p className="text-xs text-slate-600 font-medium">Validation</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default CVImport;