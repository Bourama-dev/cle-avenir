import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Send } from 'lucide-react';

const BlogCommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([{ post_id: postId, user_id: user.id, content: content.trim() }])
        .select()
        .single();

      if (error) throw error;

      setContent('');
      toast({ title: "Commentaire ajouté", description: "Votre commentaire a été publié." });
      if (onCommentAdded && data) onCommentAdded(data);
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'ajouter le commentaire." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-600 mb-2">Connectez-vous pour laisser un commentaire.</p>
        <Button variant="outline" onClick={() => window.location.href = '/login'}>Se connecter</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold mb-4">Laisser un commentaire</h3>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Votre avis nous intéresse..."
        className="mb-4 min-h-[100px]"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          Publier
        </Button>
      </div>
    </form>
  );
};

export default BlogCommentForm;