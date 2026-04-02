import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, FileText, Save, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminWiki = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase.from('wiki_pages').select('*').order('title');
    if (data) setPages(data);
    setLoading(false);
  };

  const handleSave = async () => {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const payload = { title, content, slug, is_published: true };
    
    let error;
    if (selectedPage) {
       ({ error } = await supabase.from('wiki_pages').update(payload).eq('id', selectedPage.id));
    } else {
       ({ error } = await supabase.from('wiki_pages').insert(payload));
    }

    if (!error) {
      toast({ title: 'Page sauvegardée' });
      setIsEditing(false);
      setSelectedPage(null);
      fetchPages();
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('wiki_pages').delete().eq('id', id);
    fetchPages();
    if (selectedPage?.id === id) {
        setSelectedPage(null);
        setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
       {/* Sidebar List */}
       <Card className="md:col-span-1 h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-3 border-b">
             <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Wiki Pages</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => { setSelectedPage(null); setIsEditing(true); setTitle(''); setContent(''); }}><PlusIcon /></Button>
             </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
             {loading ? <div className="p-4"><Loader2 className="animate-spin" /></div> : (
                <div className="divide-y divide-slate-100">
                   {pages.map(page => (
                      <div 
                        key={page.id} 
                        className={`p-3 cursor-pointer hover:bg-slate-50 text-sm ${selectedPage?.id === page.id ? 'bg-slate-50 font-medium border-l-4 border-primary' : ''}`}
                        onClick={() => { setSelectedPage(page); setIsEditing(false); setTitle(page.title); setContent(page.content); }}
                      >
                         {page.title}
                      </div>
                   ))}
                </div>
             )}
          </CardContent>
       </Card>

       {/* Editor / Viewer */}
       <Card className="md:col-span-3 h-full flex flex-col">
          {isEditing ? (
             <div className="p-6 h-full flex flex-col gap-4">
                <Input placeholder="Titre de la page" value={title} onChange={e => setTitle(e.target.value)} className="text-xl font-bold" />
                <Textarea placeholder="# Contenu Markdown..." value={content} onChange={e => setContent(e.target.value)} className="flex-1 resize-none font-mono text-sm" />
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
                   <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4"/> Sauvegarder</Button>
                </div>
             </div>
          ) : selectedPage ? (
             <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                   <h2 className="text-3xl font-bold text-slate-900">{selectedPage.title}</h2>
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4"/></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedPage.id)}><Trash className="w-4 h-4"/></Button>
                   </div>
                </div>
                <div className="prose max-w-none flex-1 overflow-y-auto">
                   <pre className="whitespace-pre-wrap font-sans text-slate-700">{selectedPage.content}</pre>
                </div>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Sélectionnez une page ou créez-en une nouvelle.</p>
             </div>
          )}
       </Card>
    </div>
  );
};

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

export default AdminWiki;