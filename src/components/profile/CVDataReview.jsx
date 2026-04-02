import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, GraduationCap, Zap, Trash2, Plus, Check, X, RefreshCcw, Loader2, User } from 'lucide-react';
import { getPdfWorkerStatus, initPdfWorker } from '@/utils/pdfWorkerSetup';
import { validateCVData } from '@/utils/cvDataValidator';

const CVDataReview = ({ extractedData, validationResults, onSave, onCancel }) => {
  const [data, setData] = useState({
    personal_info: { name: '', email: '', phone: '', location: '' },
    experiences: [],
    education: [],
    skills: [],
    confidence_score: 0
  });
  
  const [validation, setValidation] = useState(validationResults || { isValid: true, errors: {}, warnings: {} });
  const [workerStatus, setWorkerStatus] = useState(getPdfWorkerStatus());
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (extractedData) {
      setData({
        personal_info: extractedData.personal_info || { name: '', email: '', phone: '', location: '' },
        experiences: extractedData.experiences || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        confidence_score: extractedData.confidence_score || 0
      });
    }
  }, [extractedData]);
  
  useEffect(() => {
    if (!workerStatus.isInitialized) {
      handleRetryWorker();
    }
  }, []);

  const handleRetryWorker = async () => {
    setIsRetrying(true);
    await initPdfWorker();
    setWorkerStatus(getPdfWorkerStatus());
    setIsRetrying(false);
  };

  const revalidate = (newData) => {
    const results = validateCVData(newData);
    setValidation(results);
  };

  const handlePersonalInfoChange = (field, value) => {
    const newData = { ...data, personal_info: { ...data.personal_info, [field]: value } };
    setData(newData);
    revalidate(newData);
  };

  const handleUpdateArray = (key, index, field, value) => {
    const newArray = [...data[key]];
    newArray[index] = { ...newArray[index], [field]: value };
    const newData = { ...data, [key]: newArray };
    setData(newData);
    revalidate(newData);
  };

  const handleRemoveItem = (key, index) => {
    const newArray = [...data[key]];
    newArray.splice(index, 1);
    const newData = { ...data, [key]: newArray };
    setData(newData);
    revalidate(newData);
  };

  const handleAddItem = (key, defaultItem) => {
    const newData = { ...data, [key]: [...data[key], defaultItem] };
    setData(newData);
    revalidate(newData);
  };

  const [newSkill, setNewSkill] = useState('');
  const handleAddSkill = () => {
    if (newSkill.trim() && !data.skills.find(s => s.skill === newSkill.trim())) {
      const newData = { ...data, skills: [...data.skills, { skill: newSkill.trim(), level: 'Intermédiaire' }] };
      setData(newData);
      setNewSkill('');
      revalidate(newData);
    }
  };
  const handleRemoveSkill = (skillName) => {
    const newData = { ...data, skills: data.skills.filter(s => s.skill !== skillName) };
    setData(newData);
    revalidate(newData);
  };

  if (!workerStatus.isInitialized && workerStatus.error) {
    return (
      <Card className="rounded-xl shadow-lg border-orange-200 bg-white mt-6">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-orange-800 font-medium">L'outil d'extraction PDF n'a pas pu démarrer.</p>
          <Button onClick={handleRetryWorker} disabled={isRetrying} variant="outline" className="text-orange-700 border-orange-300">
            {isRetrying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
            Réessayer l'initialisation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border-indigo-200 bg-white mt-6 animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 rounded-t-xl pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-600" />
              Données extraites
            </CardTitle>
            <CardDescription className="text-indigo-700/70">
              Vérifiez et corrigez les informations extraites de votre CV avant de les enregistrer.
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Confiance d'extraction</span>
            <div className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${data.confidence_score >= 80 ? 'bg-green-100 text-green-700' : data.confidence_score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {data.confidence_score}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="personal" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
              <TabsTrigger value="personal" className="gap-2">
                <User className="w-4 h-4" /> Info
              </TabsTrigger>
              <TabsTrigger value="experiences" className="gap-2">
                <Briefcase className="w-4 h-4" /> Expériences
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2">
                <GraduationCap className="w-4 h-4" /> Formations
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Zap className="w-4 h-4" /> Compétences
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 max-h-[500px] overflow-y-auto">
            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4 mt-0">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={validation.errors.name ? "text-red-500" : ""}>Nom Complet *</Label>
                    <Input value={data.personal_info.name} onChange={(e) => handlePersonalInfoChange('name', e.target.value)} className={validation.errors.name ? "border-red-500 text-gray-900" : "text-gray-900"} />
                    {validation.errors.name && <p className="text-xs text-red-500">{validation.errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className={validation.errors.email ? "text-red-500" : ""}>Email</Label>
                    <Input value={data.personal_info.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} className={validation.errors.email ? "border-red-500 text-gray-900" : "text-gray-900"} />
                    {validation.errors.email && <p className="text-xs text-red-500">{validation.errors.email}</p>}
                    {validation.warnings.email && <p className="text-xs text-amber-500">{validation.warnings.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input value={data.personal_info.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} className="text-gray-900" />
                    {validation.warnings.phone && <p className="text-xs text-amber-500">{validation.warnings.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Localisation</Label>
                    <Input value={data.personal_info.location} onChange={(e) => handlePersonalInfoChange('location', e.target.value)} className="text-gray-900" />
                  </div>
               </div>
            </TabsContent>

            {/* Experiences Tab */}
            <TabsContent value="experiences" className="space-y-4 mt-0">
              {data.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500" 
                    onClick={() => handleRemoveItem('experiences', idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={validation.errors[`exp_${idx}_position`] ? "text-red-500" : ""}>Poste *</Label>
                      <Input value={exp.position} onChange={(e) => handleUpdateArray('experiences', idx, 'position', e.target.value)} className={validation.errors[`exp_${idx}_position`] ? "border-red-500 text-gray-900" : "text-gray-900"} />
                      {validation.errors[`exp_${idx}_position`] && <p className="text-xs text-red-500">{validation.errors[`exp_${idx}_position`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={validation.errors[`exp_${idx}_company`] ? "text-red-500" : ""}>Entreprise *</Label>
                      <Input value={exp.company} onChange={(e) => handleUpdateArray('experiences', idx, 'company', e.target.value)} className={validation.errors[`exp_${idx}_company`] ? "border-red-500 text-gray-900" : "text-gray-900"} />
                      {validation.errors[`exp_${idx}_company`] && <p className="text-xs text-red-500">{validation.errors[`exp_${idx}_company`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input type="date" value={exp.start_date} onChange={(e) => handleUpdateArray('experiences', idx, 'start_date', e.target.value)} className="text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input type="date" value={exp.end_date} onChange={(e) => handleUpdateArray('experiences', idx, 'end_date', e.target.value)} className="text-gray-900" />
                      {validation.errors[`exp_${idx}_dates`] && <p className="text-xs text-red-500">{validation.errors[`exp_${idx}_dates`]}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea value={exp.description} onChange={(e) => handleUpdateArray('experiences', idx, 'description', e.target.value)} className="text-gray-900" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => handleAddItem('experiences', { position: '', company: '', start_date: '', end_date: '', description: '' })} className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Ajouter une expérience
              </Button>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4 mt-0">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500" 
                    onClick={() => handleRemoveItem('education', idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Diplôme</Label>
                      <Input value={edu.diploma} onChange={(e) => handleUpdateArray('education', idx, 'diploma', e.target.value)} className="text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label>École</Label>
                      <Input value={edu.school} onChange={(e) => handleUpdateArray('education', idx, 'school', e.target.value)} className="text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label>Domaine</Label>
                      <Input value={edu.field} onChange={(e) => handleUpdateArray('education', idx, 'field', e.target.value)} className="text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label>Année</Label>
                      <Input value={edu.year} onChange={(e) => handleUpdateArray('education', idx, 'year', e.target.value)} className="text-gray-900" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => handleAddItem('education', { diploma: '', school: '', field: '', year: '', description: '' })} className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Ajouter une formation
              </Button>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 mt-0">
              <div className="flex gap-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()} placeholder="Nouvelle compétence..." className="text-gray-900" />
                <Button onClick={handleAddSkill} variant="secondary"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 border rounded-xl bg-slate-50 min-h-[100px]">
                {data.skills.map((skillObj, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium flex items-center gap-2">
                    {skillObj.skill}
                    <button onClick={() => handleRemoveSkill(skillObj.skill)} className="text-slate-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => onSave(data)} disabled={!validation.isValid}>
            <Check className="w-4 h-4 mr-2" /> Importer dans mon profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVDataReview;