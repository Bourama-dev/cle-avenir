import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Building, MapPin, Globe, Mail, Phone, Hash } from 'lucide-react';
import { EventLogger } from '@/services/eventLoggerService';
import { EVENT_TYPES } from '@/constants/eventTypes';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EstablishmentPasswordManager from '@/components/admin/sections/establishments/EstablishmentPasswordManager';
import AuthorizedEmails from '@/components/admin/sections/AuthorizedEmails';
import EstablishmentCodeManager from '@/components/admin/sections/establishments/EstablishmentCodeManager';

const EstablishmentEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    city: '',
    postal_code: '',
    region: '',
    website: '',
    contact_email: '',
    phone: '',
    uai: '',
    activation_password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEstablishment();
  }, [id]);

  const fetchEstablishment = async () => {
    try {
      const { data, error } = await supabase
        .from('educational_institutions')
        .select('id, name, type, address, city, postal_code, region, website, email, contact_email, phone, uai, activation_password')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name || '',
          type: data.type || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          region: data.region || '',
          website: data.website || '',
          contact_email: data.email || data.contact_email || '', 
          phone: data.phone || '',
          uai: data.uai || '',
          activation_password: data.activation_password || ''
        });
      }
    } catch (error) {
      console.error('Error fetching establishment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de l'établissement."
      });
      navigate('/admin/establishments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire";
    
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = "Format d'email invalide";
    }

    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      newErrors.website = "L'URL doit commencer par http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('educational_institutions')
        .update({
          name: formData.name,
          type: formData.type,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          region: formData.region,
          website: formData.website,
          email: formData.contact_email,
          phone: formData.phone,
          uai: formData.uai,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      if (id) {
          await EventLogger.logSchoolEvent(
            EVENT_TYPES.SCHOOL_UPDATED,
            id,
            formData.name,
            null,
            null,
            null,
            { updated_by: user?.id, changes: Object.keys(formData) }
          );
      }

      toast({
        title: "Succès",
        description: "L'établissement a été mis à jour avec succès.",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      navigate(`/admin/establishments/${id}/dashboard`);
    } catch (error) {
      console.error('Error updating establishment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la mise à jour : " + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 hover:bg-slate-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
      </Button>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            Modifier l'établissement
          </CardTitle>
        </CardHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="access">Accès & Activation</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de l'établissement <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className={`pl-9 ${errors.name ? "border-red-500" : ""}`} 
                        placeholder="Lycée..."
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="Lycée, Université..." />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} className="pl-9" placeholder="123 Rue..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Code Postal</Label>
                    <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="website" 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        className={`pl-9 ${errors.website ? "border-red-500" : ""}`}
                        placeholder="https://..." 
                      />
                    </div>
                    {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email de contact</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="contact_email" 
                        name="contact_email" 
                        value={formData.contact_email} 
                        onChange={handleChange} 
                        className={`pl-9 ${errors.contact_email ? "border-red-500" : ""}`}
                        placeholder="contact@ecole.fr" 
                      />
                    </div>
                    {errors.contact_email && <p className="text-xs text-red-500 mt-1">{errors.contact_email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="pl-9" placeholder="01 23 45 67 89" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uai">Code UAI</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="uai" name="uai" value={formData.uai} onChange={handleChange} className="pl-9" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 bg-slate-50/50 border-t border-slate-100 p-6">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Enregistrer
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="access" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EstablishmentCodeManager establishmentId={id} />
                <EstablishmentPasswordManager establishmentId={id} password={formData.activation_password} />
            </div>
            {id && <AuthorizedEmails establishmentId={id} />}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EstablishmentEditForm;