import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Plus, Trash2, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cvAiService } from '@/services/cvAiService';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

const CVForm = ({ data: rawData, onChange }) => {
  const { toast } = useToast();
  const [improvingField, setImprovingField] = useState(null);

  // Normalize data defensively to avoid undefined properties
  const data = normalizeCVData(rawData);

  const COMMON_SOFT_SKILLS = [
    "Communication", "Leadership", "Esprit d'équipe", "Créativité", 
    "Résolution de problèmes", "Gestion du temps", "Adaptabilité", 
    "Esprit critique", "Empathie", "Confiance", "Autonomie", 
    "Flexibilité", "Écoute active", "Négociation", "Présentation"
  ];

  const handleInfoChange = (field, value) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: newExp });
  };

  const handleEducationChange = (index, field, value) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { degree: '', institution: '', dates: '', description: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: newEdu });
  };

  const handleQualityChange = (index, field, value) => {
    const newQual = [...data.qualities];
    newQual[index] = { ...newQual[index], [field]: value };
    onChange({ ...data, qualities: newQual });
  };

  const addQuality = () => {
    onChange({
      ...data,
      qualities: [...data.qualities, { name: '', level: 'Intermédiaire', description: '' }]
    });
  };

  const removeQuality = (index) => {
    const newQual = data.qualities.filter((_, i) => i !== index);
    onChange({ ...data, qualities: newQual });
  };

  const handleAiImprove = async (text, section, callback, fieldId) => {
    if (!text || text.length < 10) {
      toast({ variant: "destructive", title: "Texte trop court", description: "Écrivez au moins quelques mots pour que l'IA puisse travailler." });
      return;
    }

    setImprovingField(fieldId);
    try {
      const improved = await cvAiService.improveContent(text, section);
      callback(improved);
      toast({ title: "Amélioration réussie !", description: "Le texte a été reformulé par l'IA." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur IA", description: error.message });
    } finally {
      setImprovingField(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-1">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-slate-100 p-1 mb-4 h-auto">
          <TabsTrigger value="personal" className="px-3 py-2">Info Perso</TabsTrigger>
          <TabsTrigger value="summary" className="px-3 py-2">Profil</TabsTrigger>
          <TabsTrigger value="experience" className="px-3 py-2">Expérience</TabsTrigger>
          <TabsTrigger value="education" className="px-3 py-2">Formation</TabsTrigger>
          <TabsTrigger value="skills" className="px-3 py-2">Compétences</TabsTrigger>
          <TabsTrigger value="qualities" className="px-3 py-2">Qualités</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={data.personalInfo?.firstName || ''} onChange={(e) => handleInfoChange('firstName', e.target.value)} placeholder="Jean" />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={data.personalInfo?.lastName || ''} onChange={(e) => handleInfoChange('lastName', e.target.value)} placeholder="Dupont" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Titre du CV / Poste visé</Label>
            <Input value={data.personalInfo?.title || data.jobTitle || ''} onChange={(e) => {
               handleInfoChange('title', e.target.value);
               onChange({ ...data, jobTitle: e.target.value });
            }} placeholder="Développeur Fullstack" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={data.personalInfo?.email || ''} onChange={(e) => handleInfoChange('email', e.target.value)} placeholder="jean.dupont@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={data.personalInfo?.phone || ''} onChange={(e) => handleInfoChange('phone', e.target.value)} placeholder="06 12 34 56 78" />
            </div>
          </div>
          <div className="space-y-2">
             <Label>Localisation</Label>
             <Input value={data.personalInfo?.location || ''} onChange={(e) => handleInfoChange('location', e.target.value)} placeholder="Paris, France" />
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Résumé du profil</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-violet-600 border-violet-200 hover:bg-violet-50"
                onClick={() => handleAiImprove(data.summary, "Résumé de profil CV", (val) => onChange({...data, summary: val}), 'summary')}
                disabled={improvingField === 'summary'}
              >
                {improvingField === 'summary' ? <Loader2 className="w-3 h-3 animate-spin mr-2"/> : <Wand2 className="w-3 h-3 mr-2" />}
                Améliorer avec IA
              </Button>
            </div>
            <Textarea 
              className="min-h-[200px] leading-relaxed"
              placeholder="Décrivez votre parcours, vos objectifs et vos atouts principaux..." 
              value={data.summary} 
              onChange={(e) => onChange({...data, summary: e.target.value})}
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" />
              Astuce : Écrivez un brouillon et laissez l'IA le rendre professionnel.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          {data.experience.map((exp, index) => (
            <Card key={index} className="relative group">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Poste</Label>
                     <Input value={exp.title || exp.role || ''} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} placeholder="Ex: Chef de projet" />
                   </div>
                   <div className="space-y-2">
                     <Label>Entreprise</Label>
                     <Input value={exp.company || ''} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} placeholder="Ex: Tech Solutions" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Date début</Label>
                     <Input value={exp.startDate || exp.dates || ''} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} placeholder="2020" />
                   </div>
                   <div className="space-y-2">
                     <Label>Date fin</Label>
                     <Input value={exp.endDate || ''} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} placeholder="Présent" />
                   </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Description des tâches</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-violet-600 border-violet-200 hover:bg-violet-50"
                      onClick={() => handleAiImprove(exp.description, "Expérience professionnelle CV", (val) => handleExperienceChange(index, 'description', val), `exp-${index}`)}
                      disabled={improvingField === `exp-${index}`}
                    >
                      {improvingField === `exp-${index}` ? <Loader2 className="w-3 h-3 animate-spin mr-2"/> : <Wand2 className="w-3 h-3 mr-2" />}
                      IA
                    </Button>
                  </div>
                  <Textarea 
                    value={exp.description || ''} 
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} 
                    placeholder="• Gestion de projet..."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addExperience} variant="outline" className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Ajouter une expérience
          </Button>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          {data.education.map((edu, index) => (
            <Card key={index} className="relative group hover:border-indigo-200 transition-colors">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Diplôme / Formation</Label>
                     <Input value={edu.degree || ''} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder="Ex: Master Informatique" />
                   </div>
                   <div className="space-y-2">
                     <Label>Établissement</Label>
                     <Input value={edu.institution || ''} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} placeholder="Ex: Université de Paris" />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label>Période</Label>
                   <Input value={edu.dates || ''} onChange={(e) => handleEducationChange(index, 'dates', e.target.value)} placeholder="Ex: 2018 - 2020" />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optionnelle)</Label>
                  <Textarea 
                    value={edu.description || ''} 
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)} 
                    placeholder="Mention Très Bien, Projet de fin d'études..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addEducation} variant="outline" className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Ajouter une formation
          </Button>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
           <div className="space-y-2">
              <Label>Compétences (séparées par des virgules)</Label>
              <Textarea 
                value={Array.isArray(data.skills) ? data.skills.join(', ') : data.skills} 
                onChange={(e) => onChange({...data, skills: e.target.value.split(',').map(s => s.trim())})} 
                placeholder="Gestion de projet, React, Communication..."
              />
           </div>
           <div className="space-y-2">
              <Label>Langues (ex: Anglais B2, Espagnol A1)</Label>
              <Textarea 
                value={data.languages.map(l => `${l.name} ${l.level}`).join('\n')} 
                onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    const langs = lines.map(line => {
                        const parts = line.split(' ');
                        const level = parts.pop();
                        const name = parts.join(' ');
                        return { name, level };
                    });
                    onChange({...data, languages: langs});
                }} 
                placeholder="Anglais C1&#10;Espagnol B2"
                className="min-h-[100px]"
              />
           </div>
        </TabsContent>

        <TabsContent value="qualities" className="space-y-6">
          <datalist id="soft-skills-suggestions">
            {COMMON_SOFT_SKILLS.map((skill, idx) => (
              <option key={idx} value={skill} />
            ))}
          </datalist>

          {data.qualities.map((qual, index) => (
            <Card key={index} className="relative group hover:border-indigo-200 transition-colors">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                onClick={() => removeQuality(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Qualité / Soft Skill</Label>
                     <Input 
                       value={qual.name || ''} 
                       onChange={(e) => handleQualityChange(index, 'name', e.target.value)} 
                       placeholder="Ex: Communication" 
                       list="soft-skills-suggestions"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Niveau</Label>
                     <Select 
                       value={qual.level || 'Intermédiaire'} 
                       onValueChange={(val) => handleQualityChange(index, 'level', val)}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Sélectionner le niveau" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Débutant">Débutant</SelectItem>
                         <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                         <SelectItem value="Avancé">Avancé</SelectItem>
                         <SelectItem value="Expert">Expert</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (Optionnelle)</Label>
                  <Textarea 
                    value={qual.description || ''} 
                    onChange={(e) => handleQualityChange(index, 'description', e.target.value)} 
                    placeholder="Comment appliquez-vous cette qualité au quotidien ?"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addQuality} variant="outline" className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Ajouter une qualité
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CVForm;