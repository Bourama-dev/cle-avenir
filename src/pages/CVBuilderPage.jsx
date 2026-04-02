import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  LayoutTemplate, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Loader2, 
  Save, 
  Download,
  FolderOpen,
  FileText,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { exportCVPDF } from '@/utils/cvPdfExporter';
import { cvSaveService } from '@/services/cvSaveService';
import CVTemplateGallery from '@/components/cv/CVTemplateGallery';
import MobileFormLayout, { AccordionSection } from '@/components/cv/MobileFormLayout';
import FormFieldGroup from '@/components/cv/FormFieldGroup';
import PreviewToggle from '@/components/cv/PreviewToggle';
import CompactPreview from '@/components/cv/CompactPreview';
import FloatingActionBar from '@/components/cv/FloatingActionBar';
import SectionManager from '@/components/cv/SectionManager';
import CVTemplate from '@/components/cv/CVTemplate';
import { CVFormDataManager } from '@/components/cv/CVFormDataManager';
import { TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { isValidUUID } from '@/utils/uuidValidator';
import { handleCVSaveError } from '@/utils/cvErrorHandler';
import { CVErrorBoundary } from '@/components/cv/CVErrorBoundary';

const CVBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const COMMON_SOFT_SKILLS = [
    "Communication", "Leadership", "Esprit d'équipe", "Créativité", 
    "Résolution de problèmes", "Gestion du temps", "Adaptabilité", 
    "Esprit critique", "Empathie", "Confiance", "Autonomie", 
    "Flexibilité", "Écoute active", "Négociation", "Présentation"
  ];
  
  // Task 5: Initialize with robust structure
  const [formData, setFormData] = useState({
      fullName: '', jobTitle: '', email: '', phone: '', address: '', summary: '', skills: '', experience: [], education: [], qualities: [],
      fontClass: 'font-sans', colorScheme: 'default', languages: [],
      personalInfo: { name: '', email: '', phone: '', location: '' }
  });
  
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATE_UUIDS.template1);
  const [showGallery, setShowGallery] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [viewMode, setViewMode] = useState('edit'); 
  const [localSaving, setLocalSaving] = useState(false);
  const [currentCvId, setCurrentCvId] = useState(id && isValidUUID(id) ? id : null);

  useEffect(() => {
    if (id && isValidUUID(id)) {
      loadExistingCv();
    }
  }, [id]);

  const loadExistingCv = async () => {
    if (!id || !isValidUUID(id) || !user) return;
    
    try {
      const result = await cvSaveService.loadCv(id, user.id);
      if (result.data) {
        setFormData(prev => ({
          ...prev,
          ...result.data.data,
          qualities: result.data.data.qualities || []
        }));
        setActiveTemplate(result.data.template_id || TEMPLATE_UUIDS.template1);
        setSaveTitle(result.data.title);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: error.message
      });
    }
  };

  const handleDataLoaded = (data) => {
    setFormData(prev => ({
      ...prev, 
      ...data,
      qualities: data.qualities || prev.qualities || []
    }));
    if (!saveTitle && data.fullName) {
      setSaveTitle(`CV de ${data.fullName}`);
    }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value, personalInfo: { ...prev.personalInfo, [name === 'fullName' ? 'name' : name === 'address' ? 'location' : name]: value } }));
  };

  const handleExperienceChange = (index, field, value) => {
      const newExp = [...(formData.experience || [])];
      newExp[index] = { ...newExp[index], [field]: value };
      setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
      setFormData(prev => ({
          ...prev, 
          experience: [...(prev.experience || []), { id: Date.now(), company: '', role: '', dates: '', description: '' }]
      }));
  };

  const removeExperience = (index) => {
      const newExp = [...(formData.experience || [])];
      newExp.splice(index, 1);
      setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const handleEducationChange = (index, field, value) => {
      const newEdu = [...(formData.education || [])];
      newEdu[index] = { ...newEdu[index], [field]: value };
      setFormData(prev => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
      setFormData(prev => ({
          ...prev, 
          education: [...(prev.education || []), { id: Date.now(), institution: '', degree: '', dates: '', description: '' }]
      }));
  };

  const removeEducation = (index) => {
      const newEdu = [...(formData.education || [])];
      newEdu.splice(index, 1);
      setFormData(prev => ({ ...prev, education: newEdu }));
  };

  const handleQualityChange = (index, field, value) => {
      const newQual = [...(formData.qualities || [])];
      newQual[index] = { ...newQual[index], [field]: value };
      setFormData(prev => ({ ...prev, qualities: newQual }));
  };

  const addQuality = () => {
      setFormData(prev => ({
          ...prev, 
          qualities: [...(prev.qualities || []), { id: Date.now(), name: '', level: 'Intermédiaire', description: '' }]
      }));
  };

  const removeQuality = (index) => {
      const newQual = [...(formData.qualities || [])];
      newQual.splice(index, 1);
      setFormData(prev => ({ ...prev, qualities: newQual }));
  };

  const handleExportPDF = () => {
      exportCVPDF('cv-preview-content', `CV_${formData.fullName || 'Resume'}.pdf`);
  };

  const handleSaveClick = () => {
    if (!saveTitle) {
      setSaveTitle(formData.fullName ? `CV de ${formData.fullName}` : 'Mon CV');
    }
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Erreur", description: "Vous devez être connecté pour sauvegarder" });
      return;
    }

    if (!saveTitle.trim()) {
      toast({ variant: "destructive", title: "Erreur", description: "Veuillez entrer un titre pour votre CV" });
      return;
    }
    
    // Validation before saving (Task 5)
    if (!isValidUUID(activeTemplate)) {
      toast({ variant: "destructive", title: "Erreur de modèle", description: "Le modèle sélectionné n'est pas valide." });
      return;
    }

    setLocalSaving(true);
    try {
      if (currentCvId) {
        if (!isValidUUID(currentCvId)) throw new Error("Identifiant CV invalide.");
        
        await cvSaveService.updateCv(currentCvId, user.id, {
          title: saveTitle,
          data: formData,
          template_id: activeTemplate
        });
        toast({ title: "Succès", description: "CV sauvegardé avec succès !" });
      } else {
        const result = await cvSaveService.saveCv(user.id, saveTitle, formData, activeTemplate);
        setCurrentCvId(result.id);
        navigate(`/cv-builder/${result.id}`, { replace: true });
        toast({ title: "Succès", description: "CV sauvegardé avec succès !" });
      }
      setShowSaveDialog(false);
    } catch (error) {
      handleCVSaveError(error, toast);
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <CVFormDataManager cvId={currentCvId} onDataLoaded={handleDataLoaded}>
      {({ saveForm, saving }) => {
        
        const isSaving = saving || localSaving;

        return (
          <div className="h-screen flex flex-col bg-slate-100 overflow-hidden relative">
              <header className="bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center z-50 shrink-0">
                  <div className="flex items-center gap-2 md:gap-4">
                      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/dashboard')}>
                          <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate('/dashboard')}>
                          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
                      </Button>
                      <h1 className="font-bold text-lg text-slate-800 hidden sm:block">Éditeur de CV</h1>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/my-documents')} className="hidden md:flex">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Mes documents
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowGallery(true)} className="touch-target md:h-9">
                          <LayoutTemplate className="h-4 w-4 md:mr-2" /> 
                          <span className="hidden md:inline">Changer Modèle</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={isSaving} className="hidden md:flex">
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                          Sauvegarder
                      </Button>
                      <Button size="sm" onClick={handleExportPDF} className="hidden md:flex bg-purple-600 hover:bg-purple-700">
                          <Download className="h-4 w-4 mr-2" /> Export PDF
                      </Button>
                  </div>
              </header>

              <PreviewToggle viewMode={viewMode} setViewMode={setViewMode} />

              <div className="flex flex-1 overflow-hidden relative">
                  <div className={`w-full md:w-5/12 lg:w-1/3 bg-white md:border-r overflow-y-auto z-10 
                      ${viewMode === 'preview' ? 'hidden md:block' : 'block'}`}>
                      <MobileFormLayout className="p-4 md:p-6">
                          <AccordionSection title="Informations Personnelles" icon={User} defaultOpen={true}>
                              <FormFieldGroup label="Nom complet" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Ex: Jean Dupont" />
                              <FormFieldGroup label="Titre du poste visé" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="Ex: Développeur Full Stack" />
                              <FormFieldGroup label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jean.dupont@email.com" />
                              <FormFieldGroup label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="06 12 34 56 78" />
                              <FormFieldGroup label="Adresse / Ville" name="address" value={formData.address} onChange={handleInputChange} placeholder="Paris, France" />
                          </AccordionSection>

                          <AccordionSection title="Résumé du Profil" icon={FileText}>
                              <FormFieldGroup 
                                  label="Présentation courte" 
                                  name="summary" 
                                  value={formData.summary} 
                                  onChange={handleInputChange} 
                                  multiline 
                                  rows={5}
                                  placeholder="Décrivez brièvement votre profil..." 
                              />
                          </AccordionSection>

                          <AccordionSection title="Formation" icon={GraduationCap}>
                              <SectionManager 
                                  items={formData.education || []}
                                  itemName="Formation"
                                  onAdd={addEducation}
                                  onRemove={removeEducation}
                                  renderItem={(item, index) => (
                                      <div className="space-y-2">
                                          <FormFieldGroup label="Établissement" value={item.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} placeholder="Université, École..." className="mb-2" />
                                          <FormFieldGroup label="Diplôme / Titre" value={item.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder="Ex: Master, Licence..." className="mb-2" />
                                          <FormFieldGroup label="Période" value={item.dates} onChange={(e) => handleEducationChange(index, 'dates', e.target.value)} placeholder="Ex: 2018 - 2020" className="mb-2" />
                                          <FormFieldGroup label="Description (optionnel)" value={item.description} onChange={(e) => handleEducationChange(index, 'description', e.target.value)} multiline rows={3} placeholder="Mention, Spécialité..." className="mb-0" />
                                      </div>
                                  )}
                              />
                          </AccordionSection>

                          <AccordionSection title="Expérience Professionnelle" icon={Briefcase}>
                              <SectionManager 
                                  items={formData.experience || []}
                                  itemName="Expérience"
                                  onAdd={addExperience}
                                  onRemove={removeExperience}
                                  renderItem={(item, index) => (
                                      <div className="space-y-2">
                                          <FormFieldGroup label="Entreprise" value={item.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} placeholder="Nom de l'entreprise" className="mb-2" />
                                          <FormFieldGroup label="Poste occupé" value={item.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} placeholder="Ex: Chef de projet" className="mb-2" />
                                          <FormFieldGroup label="Période" value={item.dates} onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)} placeholder="Ex: 2020 - Présent" className="mb-2" />
                                          <FormFieldGroup label="Missions et réalisations" value={item.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} multiline rows={4} placeholder="Détaillez vos responsabilités..." className="mb-0" />
                                      </div>
                                  )}
                              />
                          </AccordionSection>

                          <AccordionSection title="Compétences" icon={Zap}>
                              <FormFieldGroup 
                                  label="Vos compétences clés (séparées par des virgules)" 
                                  name="skills" 
                                  value={formData.skills} 
                                  onChange={handleInputChange} 
                                  multiline 
                                  rows={3}
                                  placeholder="Ex: Gestion de projet, React.js, Communication" 
                              />
                          </AccordionSection>

                          <AccordionSection title="Qualités / Soft Skills" icon={Lightbulb}>
                              <datalist id="soft-skills-suggestions-mobile">
                                {COMMON_SOFT_SKILLS.map((skill, idx) => (
                                  <option key={idx} value={skill} />
                                ))}
                              </datalist>

                              <SectionManager 
                                  items={formData.qualities || []}
                                  itemName="Qualité"
                                  onAdd={addQuality}
                                  onRemove={removeQuality}
                                  renderItem={(item, index) => (
                                      <div className="space-y-3">
                                          <div className="space-y-1">
                                            <Label className="text-xs">Qualité / Soft Skill</Label>
                                            <Input 
                                              value={item.name} 
                                              onChange={(e) => handleQualityChange(index, 'name', e.target.value)} 
                                              placeholder="Ex: Communication" 
                                              list="soft-skills-suggestions-mobile"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs">Niveau</Label>
                                            <Select 
                                              value={item.level || 'Intermédiaire'} 
                                              onValueChange={(val) => handleQualityChange(index, 'level', val)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Niveau" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Débutant">Débutant</SelectItem>
                                                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                                                <SelectItem value="Avancé">Avancé</SelectItem>
                                                <SelectItem value="Expert">Expert</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <FormFieldGroup label="Description (optionnel)" value={item.description} onChange={(e) => handleQualityChange(index, 'description', e.target.value)} multiline rows={2} placeholder="Ex: Pratique régulière..." className="mb-0" />
                                      </div>
                                  )}
                              />
                          </AccordionSection>
                      </MobileFormLayout>
                  </div>

                  <div className={`w-full md:w-7/12 lg:w-2/3 bg-slate-200/80 overflow-y-auto 
                      ${viewMode === 'edit' ? 'hidden md:block' : 'block'}`}>
                      <CompactPreview>
                           <CVErrorBoundary>
                               <CVTemplate data={formData} templateName={activeTemplate} />
                           </CVErrorBoundary>
                      </CompactPreview>
                  </div>
              </div>

              <FloatingActionBar 
                 isVisible={true}
                 onSave={handleSaveClick} 
                 onDownload={handleExportPDF} 
                 saving={isSaving} 
              />

              <Dialog open={showGallery} onOpenChange={setShowGallery}>
                  <DialogContent className="max-w-5xl h-[80vh] overflow-y-auto w-[95vw] rounded-xl bg-slate-50">
                      <DialogHeader className="bg-white p-6 border-b">
                          <DialogTitle>Choisir un modèle de CV</DialogTitle>
                      </DialogHeader>
                      <CVTemplateGallery selectedTemplate={activeTemplate} onSelect={(id) => { setActiveTemplate(id); setShowGallery(false); }} />
                  </DialogContent>
              </Dialog>

              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Sauvegarder le CV</DialogTitle>
                          <DialogDescription>
                              Donnez un titre à votre CV pour le retrouver facilement
                          </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                          <Label htmlFor="cv-title">Titre du CV</Label>
                          <Input
                              id="cv-title"
                              value={saveTitle}
                              onChange={(e) => setSaveTitle(e.target.value)}
                              placeholder="Ex: CV Développeur Full Stack"
                              className="mt-2"
                          />
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={localSaving}>
                              Annuler
                          </Button>
                          <Button onClick={handleSaveConfirm} disabled={localSaving} className="bg-indigo-600 hover:bg-indigo-700">
                              {localSaving ? (
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
      }}
    </CVFormDataManager>
  );
};

export default CVBuilderPage;