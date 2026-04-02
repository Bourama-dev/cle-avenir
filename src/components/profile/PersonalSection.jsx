import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, MapPin, Phone, Mail, User } from 'lucide-react';

const PersonalSection = ({ formData, onChange, onAvatarUpload, uploading }) => {
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await onAvatarUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-slate-200">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-400">
              {formData.first_name?.[0]}{formData.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
            <Upload className="h-6 w-6" />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium">Photo de profil</h3>
          <p className="text-sm text-slate-500">Cliquez sur l'image pour la modifier.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              id="firstName" 
              className="pl-9"
              value={formData.first_name || ''} 
              onChange={(e) => onChange('first_name', e.target.value)} 
              placeholder="Votre prénom"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <div className="relative">
             <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
             <Input 
                id="lastName" 
                className="pl-9"
                value={formData.last_name || ''} 
                onChange={(e) => onChange('last_name', e.target.value)} 
                placeholder="Votre nom"
             />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
             <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
             <Input id="email" className="pl-9 bg-slate-50" value={formData.email || ''} disabled />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
             <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
             <Input 
                id="phone" 
                className="pl-9"
                value={formData.phone || ''} 
                onChange={(e) => onChange('phone', e.target.value)} 
                placeholder="06 12 34 56 78"
             />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Localisation</Label>
          <div className="relative">
             <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
             <Input 
                id="location" 
                className="pl-9"
                value={formData.location || ''} 
                onChange={(e) => onChange('location', e.target.value)} 
                placeholder="Ville, Pays (ex: Paris, France)"
             />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio / Résumé</Label>
          <Textarea 
            id="bio" 
            rows={4}
            value={formData.motivation || ''} 
            onChange={(e) => onChange('motivation', e.target.value)} 
            placeholder="Parlez-nous de vous, de vos objectifs professionnels..."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;