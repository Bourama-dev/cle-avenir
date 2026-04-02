import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

const UnifiedSignupStep3 = ({ formData, handleFieldChange, errors, onNext, onPrev }) => {
  const countries = ["France", "Belgique", "Suisse", "Canada", "Luxembourg", "Autre"];
  const regions = [
    "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", 
    "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", 
    "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", 
    "Pays de la Loire", "Provence-Alpes-Côte d'Azur", "Outre-mer"
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Où habitez-vous ?</h2>
        <p className="text-slate-500">Pour vous proposer des opportunités locales.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className={errors.address ? "border-red-500 bg-red-50" : ""}
            placeholder="123 Rue de la Paix"
          />
           {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label>Ville</Label>
             <CityAutocomplete 
                 value={formData.city}
                 onCitySelect={(cityName, cityData) => {
                     handleFieldChange('city', cityName);
                     if (cityData) {
                         handleFieldChange('postalCode', cityData['Code Postal']);
                         // Try to map region if possible or leave for manual select
                         if (cityData.région) handleFieldChange('region', cityData.région);
                     }
                 }}
             />
             {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city}</p>}
           </div>
           <div className="space-y-2">
             <Label>Code Postal</Label>
             <Input
               value={formData.postalCode}
               onChange={(e) => handleFieldChange('postalCode', e.target.value)}
               className={errors.postalCode ? "border-red-500 bg-red-50" : ""}
               placeholder="75000"
             />
             {errors.postalCode && <p className="text-xs text-red-500 font-medium">{errors.postalCode}</p>}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label>Région</Label>
            <Select 
                value={formData.region} 
                onValueChange={(val) => handleFieldChange('region', val)}
            >
                <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            {errors.region && <p className="text-xs text-red-500 font-medium">{errors.region}</p>}
            </div>

            <div className="space-y-2">
            <Label>Pays</Label>
            <Select 
                value={formData.country} 
                onValueChange={(val) => handleFieldChange('country', val)}
            >
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-red-500 font-medium">{errors.country}</p>}
            </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={onPrev} className="flex-1 border-slate-200 hover:bg-slate-50 h-12">
          <ArrowLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg h-12">
          Suivant <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UnifiedSignupStep3;