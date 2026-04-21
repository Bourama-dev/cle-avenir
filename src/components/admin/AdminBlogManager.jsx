import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getPublicBlogImageUrl } from '@/utils/blogImages';
import BlogForm from './forms/BlogForm';

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const { toast } = useToast();

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getBlogsList();
      setBlogs(data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Impossible de charger les articles de blog. Veuillez vérifier votre connexion.");
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les blogs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingBlog) {
        await adminService.updateBlog(editingBlog.id, data);
        toast({ title: 'Mise à jour réussie', description: 'Le blog a été modifié avec succès.' });
      } else {
        await adminService.createBlog(data);
        toast({ title: 'Création réussie', description: 'Le blog a été créé avec succès.' });
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("Save blog error:", err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue lors de l\'enregistrement des données du blog.' });
      throw err; // Propagate to form to stop loading state
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce blog ? Cette action est irréversible.")) {
      try {
        await adminService.deleteBlog(id);
        toast({ title: 'Supprimé', description: 'Le blog a été supprimé.' });
        fetchBlogs();
      } catch (error) {
        console.error("Delete blog error:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer ce blog.' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Gestion des Blogs</h2>
        <Button onClick={() => { setEditingBlog(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Ajouter un Blog
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="border rounded-md bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-20 text-center">Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 && !error ? (
                <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">Aucun blog trouvé. Cliquez sur "Ajouter un Blog" pour commencer.</TableCell></TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-center">
                      {blog.featured_image ? (
                        <div className="w-12 h-12 rounded overflow-hidden mx-auto bg-slate-100 border">
                          <img src={getPublicBlogImageUrl(blog.featured_image)} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 border rounded flex items-center justify-center text-[10px] text-slate-400 mx-auto">Sans Image</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={blog.title}>{blog.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {blog.published ? 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Publié</span> : 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Brouillon</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingBlog(blog); setIsModalOpen(true); }} className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)} className="hover:bg-red-50 hover:text-red-600 transition-colors ml-1">
                        <Trash2 className="w-4 h-4 text-slate-600 hover:text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingBlog ? 'Modifier le Blog' : 'Ajouter un Blog'}</DialogTitle>
          </DialogHeader>
          <BlogForm initialData={editingBlog} onSubmit={handleSave} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}