import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon } from 'lucide-react';
import { getPublicBlogImageUrl } from '@/utils/blogImages';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
     title: '', slug: '', excerpt: '', content: '', author: '', category: '', 
     tags: '', featured_image: '', published_at: new Date().toISOString().split('T')[0]
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: p } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('blog_categories').select('*');
    const { data: cm } = await supabase.from('blog_comments').select('*, profiles(email)').order('created_at', { ascending: false });

    setPosts(p || []);
    setCategories(c || []);
    setComments(cm || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async (id) => {
    if(!confirm("Supprimer cet article ?")) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast({ title: "Article supprimé" });
    fetchData();
  };

  const handleDeleteComment = async (id) => {
    if(!confirm("Supprimer ce commentaire ?")) return;
    await supabase.from('blog_comments').delete().eq('id', id);
    toast({ title: "Commentaire supprimé" });
    fetchData();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSavePost = async () => {
    try {
      setUploading(true);
      let imagePath = formData.featured_image;

      // Handle file upload if there's a new file
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `blog-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Échec du téléchargement de l'image: ${uploadError.message}`);
        }

        imagePath = getPublicBlogImageUrl(filePath);
      }

      const payload = {
         ...formData,
         featured_image: imagePath,
         tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags
      };

      if (currentPost) {
         const { error } = await supabase.from('blog_posts').update(payload).eq('id', currentPost.id);
         if (error) throw error;
         toast({ title: "Article mis à jour" });
      } else {
         const { error } = await supabase.from('blog_posts').insert([payload]);
         if (error) throw error;
         toast({ title: "Article créé" });
      }
      setIsPostModalOpen(false);
      fetchData();
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: e.message });
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (post) => {
    setCurrentPost(post);
    setFormData({
       title: post.title || '',
       slug: post.slug || '',
       excerpt: post.excerpt || '',
       content: post.content || '',
       author: post.author || '',
       category: post.category || '',
       tags: post.tags?.join(', ') || '',
       featured_image: post.featured_image || '',
       published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setImageFile(null);
    setImagePreview(getPublicBlogImageUrl(post.featured_image));
    setIsPostModalOpen(true);
  };

  const openNew = () => {
    setCurrentPost(null);
    setFormData({
       title: '', slug: '', excerpt: '', content: '', author: '', category: '', 
       tags: '', featured_image: '', published_at: new Date().toISOString().split('T')[0]
    });
    setImageFile(null);
    setImagePreview(null);
    setIsPostModalOpen(true);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestion du Blog</h2>
          <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Nouvel Article</Button>
       </div>

       <Tabs defaultValue="posts">
          <TabsList>
             <TabsTrigger value="posts">Articles ({posts.length})</TabsTrigger>
             <TabsTrigger value="categories">Catégories ({categories.length})</TabsTrigger>
             <TabsTrigger value="comments">Commentaires ({comments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="bg-white rounded-md border mt-4">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Vues</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {posts.map(post => (
                      <TableRow key={post.id}>
                         <TableCell>
                           <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
                             <img 
                               src={getPublicBlogImageUrl(post.featured_image) || 'https://via.placeholder.com/150'} 
                               alt="cover" 
                               className="w-full h-full object-cover"
                               onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-blog.png'; }}
                             />
                           </div>
                         </TableCell>
                         <TableCell className="font-medium max-w-[200px] truncate" title={post.title}>{post.title}</TableCell>
                         <TableCell>{post.author}</TableCell>
                         <TableCell>{post.category}</TableCell>
                         <TableCell>{post.views_count || 0}</TableCell>
                         <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeletePost(post.id)}><Trash2 className="w-4 h-4" /></Button>
                         </TableCell>
                      </TableRow>
                   ))}
                   {posts.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">Aucun article trouvé.</TableCell>
                      </TableRow>
                   )}
                </TableBody>
             </Table>
          </TabsContent>
          
          <TabsContent value="categories">
              <div className="p-4 bg-white border rounded-md mt-4 text-slate-600">
                Gestion des catégories (Implémentation simplifiée : voir base de données)
              </div>
          </TabsContent>
          
          <TabsContent value="comments" className="bg-white rounded-md border mt-4">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {comments.map(c => (
                      <TableRow key={c.id}>
                         <TableCell>{c.profiles?.email || 'Inconnu'}</TableCell>
                         <TableCell className="max-w-md truncate">{c.content}</TableCell>
                         <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                         <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteComment(c.id)}><Trash2 className="w-4 h-4" /></Button>
                         </TableCell>
                      </TableRow>
                   ))}
                   {comments.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">Aucun commentaire.</TableCell>
                      </TableRow>
                   )}
                </TableBody>
             </Table>
          </TabsContent>
       </Tabs>

       {/* Edit/Create Modal */}
       <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
                <DialogTitle>{currentPost ? 'Modifier l\'article' : 'Nouvel Article'}</DialogTitle>
             </DialogHeader>
             <div className="grid gap-4 py-4">
                <div>
                  <Label>Titre</Label>
                  <Input placeholder="Titre" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label>Slug (URL)</Label>
                     <Input placeholder="Slug (ex: mon-article)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                   </div>
                   <div>
                     <Label>Auteur</Label>
                     <Input placeholder="Auteur" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label>Catégorie</Label>
                     <Input placeholder="Catégorie" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                   </div>
                   <div>
                     <Label>Date de publication</Label>
                     <Input type="date" value={formData.published_at} onChange={e => setFormData({...formData, published_at: e.target.value})} />
                   </div>
                </div>
                <div>
                  <Label>Tags (séparés par des virgules)</Label>
                  <Input placeholder="Ex: alternance, orientation, cv" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                </div>
                
                <div className="border border-slate-200 p-4 rounded-md bg-slate-50">
                  <Label className="flex items-center gap-2 mb-2"><ImageIcon className="w-4 h-4" /> Image de couverture</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 bg-white" />
                  
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

                <div>
                  <Label>Extrait (court résumé)</Label>
                  <Textarea placeholder="Résumé apparaissant sur les cartes..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
                </div>
                <div>
                  <Label>Contenu (HTML supporté)</Label>
                  <Textarea placeholder="<p>Votre texte ici...</p>" className="min-h-[200px] font-mono text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                </div>
             </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setIsPostModalOpen(false)} disabled={uploading}>Annuler</Button>
                <Button onClick={handleSavePost} disabled={uploading} className="bg-indigo-600 hover:bg-indigo-700">
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {uploading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminBlog;