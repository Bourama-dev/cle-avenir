import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Download, ArrowLeft, LayoutTemplate, User, Building, FileText, FolderOpen } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { exportCoverLetterPDF } from '@/utils/coverLetterPdfExporter';
import { coverLetterSaveService } from '@/services/coverLetterSaveService';
import CoverLetterRenderer from '@/components/cover-letter/CoverLetterRenderer';
import CoverLetterTemplateGallery from '@/components/cover-letter/CoverLetterTemplateGallery';
import MobileFormLayout, { AccordionSection } from '@/components/cv/MobileFormLayout';
import FormFieldGroup from '@/components/cv/FormFieldGroup';
import PreviewToggle from '@/components/cv/PreviewToggle';
import CompactPreview from '@/components/cv/CompactPreview';
import FloatingActionBar from '@/components/cv/FloatingActionBar';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';

const CoverLetterBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: 'Nouvelle Lettre',
    recipientName: '',
    recipientCompany: '',
    recipientAddress: '',
    senderName: '',
    senderAddress: '',
    senderEmail: '',
    senderPhone: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    salutation: 'Madame, Monsieur,',
    body: '',
    closing: 'Cordialement,'
  });
  
  const [template, setTemplate] = useState('cl_template_1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [viewMode, setViewMode] = useState('edit');
  const [currentLetterId, setCurrentLetterId] = useState(id || null);

  useEffect(() => {
    const initData = async () => {
      if (id && user) {
        try {
          const result = await coverLetterSaveService.loadCoverLetter(id, user.id);
          if (result.data) {
            setFormData(result.data.content);
            setTemplate(result.data.template_id || 'cl_template_1');
            setSaveTitle(result.data.title);
            setCurrentLetterId(id);
          }
        } catch (error) {
          console.error('Error loading cover letter:', error);
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: error.message
          });
        }
      } else if (user && !id) {
        // Pre-fill from profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
           setFormData(prev => ({
              ...prev,
              senderName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              senderEmail: profile.email || '',
              senderPhone: profile.phone || '',
              senderAddress: [profile.city, profile.country].filter(Boolean).join(', ') || ''
           }));
           setSaveTitle(`Lettre de ${profile.first_name || 'motivation'}`);
        }
      }
      setLoading(false);
    };
    initData();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    if (!saveTitle) {
      setSaveTitle(formData.subject ? `Lettre - ${formData.subject}` : 'Ma lettre de motivation');
    }
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder"
      });
      return;
    }

    if (!saveTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un titre pour votre lettre"
      });
      return;
    }

    setSaving(true);
    try {
      if (currentLetterId) {
        // Update existing letter
        await coverLetterSaveService.updateCoverLetter(currentLetterId, user.id, {
          title: saveTitle,
          content: formData,
          template_id: template
        });
        toast({ title: "Lettre mise à jour avec succès" });
      } else {
        // Save new letter
        const result = await coverLetterSaveService.saveCoverLetter(user.id, saveTitle, formData, template);
        setCurrentLetterId(result.id);
        navigate(`/cover-letter-builder/${result.id}`, { replace: true });
        toast({ title: "Lettre sauvegardée avec succès" });
      }
      setShowSaveDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
     exportCoverLetterPDF('letter-preview', `Lettre_${saveTitle.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>;

  const currentTemplate = CL_TEMPLATES_CONFIG.find(t => t.id === template);

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden relative">
      <header className="bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center shadow-sm z-50 shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
           </Button>
           <Button variant="ghost" size="sm" className="hidden md:flex text-slate-600" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
           </Button>
           <div className="hidden md:block h-6 w-px bg-slate-200"></div>
           <input 
             className="font-bold text-lg border-transparent hover:border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md px-2 py-1 w-full max-w-[200px] md:max-w-xs bg-transparent transition-all outline-none" 
             value={formData.title} 
             name="title" 
             onChange={handleInputChange} 
           />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => navigate('/my-documents')} className="hidden md:flex">
              <FolderOpen className="h-4 w-4 mr-2" />
              Mes documents
           </Button>
           <Button variant="outline" size="sm" onClick={() => setIsGalleryOpen(true)} className="gap-2 touch-target md:h-9">
              <LayoutTemplate className="h-4 w-4 text-slate-500" />
              <span className="hidden md:inline font-medium text-purple-600">{currentTemplate?.name || 'Modèle'}</span>
           </Button>
           
           <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={saving} className="hidden md:flex gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Sauvegarder</span>
           </Button>
           
           <Button size="sm" onClick={handleDownload} className="hidden md:flex bg-purple-600 hover:bg-purple-700 gap-2">
              <Download className="h-4 w-4" /> 
              <span>PDF</span>
           </Button>
        </div>
      </header>

      <PreviewToggle viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex flex-1 overflow-hidden relative">
         <div className={`w-full md:w-5/12 lg:w-1/3 bg-white md:border-r overflow-y-auto z-10 
             ${viewMode === 'preview' ? 'hidden md:block' : 'block'}`}>
            <MobileFormLayout className="p-4 md:p-6">
               <AccordionSection title="Expéditeur (Vous)" icon={User} defaultOpen={true}>
                  <FormFieldGroup label="Nom complet" name="senderName" value={formData.senderName} onChange={handleInputChange} placeholder="Ex: Jean Dupont" />
                  <FormFieldGroup label="Email" type="email" name="senderEmail" value={formData.senderEmail} onChange={handleInputChange} placeholder="jean.dupont@email.com" />
                  <FormFieldGroup label="Téléphone" type="tel" name="senderPhone" value={formData.senderPhone} onChange={handleInputChange} placeholder="06 12 34 56 78" />
                  <FormFieldGroup label="Adresse" name="senderAddress" value={formData.senderAddress} onChange={handleInputChange} placeholder="123 Rue de la Paix, 75000 Paris" />
               </AccordionSection>

               <AccordionSection title="Destinataire (Entreprise)" icon={Building}>
                  <FormFieldGroup label="Nom du contact" name="recipientName" value={formData.recipientName} onChange={handleInputChange} placeholder="Ex: M. Martin (DRH)" />
                  <FormFieldGroup label="Nom de l'entreprise" name="recipientCompany" value={formData.recipientCompany} onChange={handleInputChange} placeholder="Ex: Tech Solutions" />
                  <FormFieldGroup label="Adresse de l'entreprise" name="recipientAddress" value={formData.recipientAddress} onChange={handleInputChange} placeholder="456 Avenue des Champs-Élysées" />
               </AccordionSection>

               <AccordionSection title="Contenu de la lettre" icon={FileText} defaultOpen={true}>
                  <FormFieldGroup label="Objet" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Ex: Candidature au poste de Développeur" />
                  <FormFieldGroup label="Formule d'appel" name="salutation" value={formData.salutation} onChange={handleInputChange} placeholder="Madame, Monsieur," />
                  <FormFieldGroup 
                     label="Corps de la lettre" 
                     name="body" 
                     value={formData.body} 
                     onChange={handleInputChange} 
                     multiline 
                     rows={12} 
                     placeholder="Votre texte de motivation ici..." 
                  />
                  <FormFieldGroup label="Formule de politesse" name="closing" value={formData.closing} onChange={handleInputChange} placeholder="Je vous prie d'agréer..." />
               </AccordionSection>
            </MobileFormLayout>
         </div>

         <div className={`w-full md:w-7/12 lg:w-2/3 bg-slate-200/80 overflow-y-auto 
             ${viewMode === 'edit' ? 'hidden md:block' : 'block'}`}>
            <CompactPreview>
                <CoverLetterRenderer content={formData} templateId={template} />
            </CompactPreview>
         </div>
      </div>

      <FloatingActionBar 
         isVisible={true}
         onSave={handleSaveClick} 
         onDownload={handleDownload} 
         saving={saving} 
      />

      <CoverLetterTemplateGallery 
         isOpen={isGalleryOpen} 
         onClose={() => setIsGalleryOpen(false)} 
         onSelect={(id) => { setTemplate(id); setIsGalleryOpen(false); }}
         currentTemplateId={template}
      />

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Sauvegarder la lettre de motivation</DialogTitle>
                  <DialogDescription>
                      Donnez un titre à votre lettre pour la retrouver facilement
                  </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                  <Label htmlFor="letter-title">Titre de la lettre</Label>
                  <Input
                      id="letter-title"
                      value={saveTitle}
                      onChange={(e) => setSaveTitle(e.target.value)}
                      placeholder="Ex: Lettre - Développeur Full Stack"
                      className="mt-2"
                  />
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={saving}>
                      Annuler
                  </Button>
                  <Button onClick={handleSaveConfirm} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                      {saving ? (
                          <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sauvegarde...
                          </>
                      ) : (
                          <>
                              <Save className="w-4 h-4 mr-2" />
                              Sauvegarder
                          </>
                      )}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverLetterBuilderPage;