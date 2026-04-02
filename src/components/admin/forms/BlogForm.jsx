import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getPublicBlogImageUrl } from '@/utils/blogImages';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function BlogForm({ initialData, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: '', category: 'Conseils', excerpt: '', content: '', featured_image: '', author: '', published: false
  });
  const [imageFile, setImageFile] = useState(null);
  
  // Use helper to resolve initial image to proper URL for preview
  const [imagePreview, setImagePreview] = useState(
    initialData?.featured_image ? getPublicBlogImageUrl(initialData.featured_image) : null
  );

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });

  const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Format invalide', description: 'Seuls les formats JPEG, PNG, WEBP et GIF sont acceptés.' });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ variant: 'destructive', title: 'Fichier trop lourd', description: 'La taille de l\'image ne doit pas dépasser 5MB.' });
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateImage(file)) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imagePath = formData.featured_image;
      
      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `blog-covers/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Échec de l'upload: ${uploadError.message}`);
        }
        
        imagePath = filePath;
        setUploading(false);
      }
      
      const payload = {
        ...formData,
        featured_image: imagePath,
        published_at: formData.published ? new Date().toISOString() : null
      };

      await onSubmit(payload);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message || "Une erreur est survenue lors de l'enregistrement." });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Titre</Label>
        <Input name="title" value={formData.title} onChange={handleChange} required className="text-gray-900 bg-white border-gray-300" />
      </div>
      <div>
        <Label>Catégorie</Label>
        <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
          <SelectTrigger className="text-gray-900 bg-white border-gray-300"><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alternance">Alternance</SelectItem>
            <SelectItem value="Conseils">Conseils</SelectItem>
            <SelectItem value="Tendances">Tendances</SelectItem>
            <SelectItem value="Métiers">Métiers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Description courte</Label>
        <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required className="text-gray-900 bg-white border-gray-300" />
      </div>
      <div>
        <Label>Contenu complet</Label>
        <Textarea name="content" value={formData.content} onChange={handleChange} rows={6} required className="text-gray-900 bg-white border-gray-300" />
      </div>
      <div className="border border-slate-200 p-4 rounded-md bg-slate-50">
        <Label className="flex items-center gap-2 mb-2"><ImageIcon className="w-4 h-4" /> Image de couverture (Optionnel)</Label>
        <Input type="file" accept="image/jpeg, image/png, image/webp, image/gif" onChange={handleImageChange} className="mt-1 bg-white text-gray-900" />
        <p className="text-xs text-slate-500 mt-1">Formats acceptés : JPG, PNG, WEBP, GIF. Max : 5MB.</p>
        
        {imagePreview && (
          <div className="mt-4 border border-slate-200 rounded-md p-2 bg-white inline-block">
            <p className="text-xs font-medium text-slate-500 mb-2">Aperçu :</p>
            <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded shadow-sm" />
          </div>
        )}
        {!imagePreview && formData.featured_image && (
           <div className="mt-2 text-xs text-slate-500 truncate max-w-full">
              Chemin actuel: {formData.featured_image}
           </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Auteur</Label>
          <Input name="author" value={formData.author} onChange={handleChange} required className="text-gray-900 bg-white border-gray-300" />
        </div>
        <div>
          <Label>Statut</Label>
          <Select value={formData.published ? 'published' : 'draft'} onValueChange={(val) => handleSelectChange('published', val === 'published')}>
            <SelectTrigger className="text-gray-900 bg-white border-gray-300"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading || uploading}>Annuler</Button>
        <Button type="submit" disabled={loading || uploading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? 'Téléchargement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}