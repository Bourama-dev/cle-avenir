import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import EstablishmentEmailsManager from './EstablishmentEmailsManager';
import EstablishmentCodeManager from './EstablishmentCodeManager';
import EstablishmentPasswordManager from './EstablishmentPasswordManager';
import { EstablishmentCodeGenerator } from '@/utils/EstablishmentCodeGenerator';
import { cn } from '@/lib/utils';
import bcrypt from 'bcryptjs';

const EstablishmentForm = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  
  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    postal_code: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    status: 'active',
    sector: 'public',
    establishment_code: '',
    activation_password: '', // This will hold either the hash (from DB) or the new plain text
    emails: [],
    ...initialData
  });

  const [activeTab, setActiveTab] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  
  // Track if password has been modified (so we know if we need to hash it)
  const [isPasswordModified, setIsPasswordModified] = useState(false);

  // Debug logging for initial data load
  useEffect(() => {
    if (initialData) {
      console.log("EstablishmentForm loaded with initial data:", initialData);
      // Ensure we map 'uai' or 'code' correctly if they differ in schema
      if (!formData.establishment_code && initialData.code) {
          setFormData(prev => ({ ...prev, establishment_code: initialData.code }));
      }
    } else {
      console.log("EstablishmentForm initialized for new entry creation");
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name?.trim()) newErrors.name = "Le nom est requis";
    if (!formData.city?.trim()) newErrors.city = "La ville est requise";
    
    // Email validation
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmailsChange = (newEmails) => {
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const handlePasswordRegenerate = (newPass) => {
    setFormData(prev => ({ ...prev, activation_password: newPass }));
    setIsPasswordModified(true);
  };

  const handleCodeRegenerate = (newCode) => {
    setFormData(prev => ({ ...prev, establishment_code: newCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez vérifier les champs en rouge.",
        variant: "destructive"
      });
      if (errors.name || errors.city || errors.email) {
        setActiveTab('info');
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process password: Hash if modified
      let finalPassword = formData.activation_password;
      
      if (isPasswordModified && finalPassword) {
        // Hash the new temporary password
        const salt = await bcrypt.genSalt(10);
        finalPassword = await bcrypt.hash(finalPassword, salt);
      } else if (!finalPassword && !initialData) {
         // Should not happen if we enforce generation, but safe default
         // Optionally force generation here if missing
      }

      // Prepare payload
      const payload = {
        ...formData,
        activation_password: finalPassword,
        phone: formData.phone?.trim() || null,
        email: formData.email?.trim() || null,
        website: formData.website?.trim() || null,
        description: formData.description?.trim() || null,
        postal_code: formData.postal_code?.trim() || null,
        // Ensure standard fields
        code: formData.establishment_code || null, // Map establishment_code to 'code' column if needed
        uai: formData.establishment_code || null   // Map to 'uai' as well just in case
      };
      
      // Remove temporary UI fields if they exist
      delete payload.establishment_code;

      console.log("Submitting establishment payload:", { ...payload, activation_password: '***' });

      await onSubmit(payload);
      
      toast({
        title: "Succès",
        description: "L'établissement a été enregistré avec succès.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Establishment submission error:", error);
      let errorMessage = "Une erreur est survenue lors de l'enregistrement.";
      if (error.message) errorMessage = error.message;
      setSubmitError(errorMessage);
      toast({
        title: "Erreur d'enregistrement",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informations Générales</TabsTrigger>
          <TabsTrigger value="access">Accès & Sécurité</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 min-h-[400px]">
          <TabsContent value="info" className="space-y-4 animate-in fade-in-50 duration-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'établissement <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ex: Université de Paris"
                    value={formData.name || ''} 
                    onChange={handleChange} 
                    className={cn(errors.name && "border-red-500 focus-visible:ring-red-500 bg-red-50")}
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'établissement</Label>
                  <Select 
                    value={formData.type || ''} 
                    onValueChange={(val) => handleSelectChange('type', val)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Universite">Université</SelectItem>
                      <SelectItem value="Ecole d'ingenieur">École d'ingénieur</SelectItem>
                      <SelectItem value="Ecole de commerce">École de commerce</SelectItem>
                      <SelectItem value="Lycee">Lycée</SelectItem>
                      <SelectItem value="CFA">CFA</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="Ex: 12 rue de la Paix"
                  value={formData.address || ''} 
                  onChange={handleChange} 
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Code Postal</Label>
                  <Input 
                    id="postal_code" 
                    name="postal_code" 
                    placeholder="75000"
                    value={formData.postal_code || ''} 
                    onChange={handleChange} 
                    disabled={isSubmitting}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville <span className="text-red-500">*</span></Label>
                  <Input 
                    id="city" 
                    name="city" 
                    placeholder="Paris"
                    value={formData.city || ''} 
                    onChange={handleChange} 
                    className={cn(errors.city && "border-red-500 focus-visible:ring-red-500 bg-red-50")}
                    disabled={isSubmitting}
                  />
                  {errors.city && <p className="text-xs text-red-500 font-medium mt-1">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input 
                    id="region" 
                    name="region" 
                    placeholder="Île-de-France"
                    value={formData.region || ''} 
                    onChange={handleChange} 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de contact</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="contact@etablissement.fr"
                    value={formData.email || ''} 
                    onChange={handleChange}
                    className={cn(errors.email && "border-red-500 focus-visible:ring-red-500 bg-red-50")}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="01 23 45 67 89"
                    value={formData.phone || ''} 
                    onChange={handleChange} 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site Web</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website || ''} 
                  onChange={handleChange} 
                  placeholder="https://www.mon-etablissement.fr" 
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description courte</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Brève présentation de l'établissement..."
                  value={formData.description || ''} 
                  onChange={handleChange} 
                  rows={3} 
                  disabled={isSubmitting}
                />
              </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-6 animate-in fade-in-50 duration-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EstablishmentCodeManager 
                  code={formData.establishment_code} 
                  onRegenerate={handleCodeRegenerate}
                  disabled={isSubmitting}
                />
                
                <EstablishmentPasswordManager
                  password={formData.activation_password}
                  canRegenerate={isPasswordModified || !initialData} 
                  onRegenerate={handlePasswordRegenerate}
                  disabled={isSubmitting}
                />
             </div>

             <div className="pt-2">
               <EstablishmentEmailsManager 
                  emails={formData.emails} 
                  onChange={handleEmailsChange} 
                  establishmentId={initialData?.id}
                  disabled={isSubmitting}
               />
             </div>
             
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex gap-3 text-sm text-amber-900 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                   <p className="font-semibold mb-1 text-amber-800">Note de sécurité</p>
                   Les identifiants générés (Code UAI et Mot de passe) sont nécessaires pour l'activation initiale du compte établissement.
                   Veuillez les transmettre de manière sécurisée au responsable.
                </div>
             </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8 bg-white sticky bottom-0 z-10 py-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="hover:bg-slate-100"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-purple-600 text-white hover:bg-purple-700 min-w-[140px] shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EstablishmentForm;