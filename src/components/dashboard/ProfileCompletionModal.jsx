import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, GraduationCap, Briefcase, Wallet } from 'lucide-react';

const ProfileCompletionModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: initialData?.location || '',
    education_level: initialData?.education_level || initialData?.educationLevel || '',
    experience_years: initialData?.experience_years || initialData?.experienceYears || 0,
    budget: initialData?.budget ? parseInt(initialData.budget) : 0
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    // Format for DB
    const finalData = {
      ...formData,
      budget: formData.budget.toString(),
      // Ensure we keep legacy camelCase if needed by other components, but prioritize DB columns
      educationLevel: formData.education_level, 
      experienceYears: formData.experience_years
    };
    
    onSave(finalData);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos recommandations seront plus précises !",
    });
    // Explicit close trigger (though parent effect might also handle it)
    onClose();
  };

  const isStep1Valid = formData.location?.trim() && formData.education_level;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => {
          // Allow closing via outside click if needed, or prevent if strictly mandatory. 
          // For UX, standard behavior is allowing close.
      }}>
        <DialogHeader>
          <DialogTitle>Complétez votre profil ({step}/3)</DialogTitle>
          <DialogDescription>
            Ces informations nous aident à trouver les offres et formations adaptées.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ma zone de recherche</Label>
                <Input 
                  placeholder="Ex: Paris, Lyon, Remote..." 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Niveau d'études actuel</Label>
                <Select 
                  value={formData.education_level} 
                  onValueChange={(val) => setFormData({...formData, education_level: val})}
                >
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bac">Bac</SelectItem>
                    <SelectItem value="bac+2">Bac +2 (BTS/DUT)</SelectItem>
                    <SelectItem value="bac+3">Bac +3 (Licence/Bachelor)</SelectItem>
                    <SelectItem value="bac+5">Bac +5 (Master/Ingénieur)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
               <div className="space-y-2">
                <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Années d'expérience professionnelle</Label>
                <Input 
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
               <div className="space-y-2">
                <Label className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Budget Formation (CPF inclus)</Label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">0€</span>
                  <span className="font-bold text-primary">{formData.budget}€</span>
                  <span className="text-sm text-slate-500">10 000€+</span>
                </div>
                <Slider 
                  value={[formData.budget]} 
                  max={10000} 
                  step={100} 
                  onValueChange={(val) => setFormData({...formData, budget: val[0]})} 
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button>}
          <Button 
             onClick={handleNext}
             disabled={step === 1 && !isStep1Valid}
          >
            {step === 3 ? "Terminer" : "Suivant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;