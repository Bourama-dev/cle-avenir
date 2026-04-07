import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlogManager from '@/components/admin/AdminBlogManager';
import AdminFormationManager from '@/components/admin/AdminFormationManager';
import AdminMetierManager from '@/components/admin/AdminMetierManager';
import AdminOffreManager from '@/components/admin/AdminOffreManager';
import { BookOpen, GraduationCap, Briefcase, FileText, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null; // Will redirect in useEffect

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Helmet>
        <title>Panneau Admin - CléAvenir</title>
        <meta name="description" content="Panneau d'administration de CléAvenir" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PANNEAU ADMIN</h1>
            <p className="text-slate-500 mt-1">Bienvenue, {user?.email} 👋</p>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <Tabs defaultValue="blogs" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl bg-slate-100/50 p-1 rounded-lg">
              <TabsTrigger value="blogs" className="flex gap-2 font-medium">
                <FileText className="w-4 h-4" /> Blogs
              </TabsTrigger>
              <TabsTrigger value="formations" className="flex gap-2 font-medium">
                <GraduationCap className="w-4 h-4" /> Formations
              </TabsTrigger>
              <TabsTrigger value="metiers" className="flex gap-2 font-medium">
                <BookOpen className="w-4 h-4" /> Métiers
              </TabsTrigger>
              <TabsTrigger value="offres" className="flex gap-2 font-medium">
                <Briefcase className="w-4 h-4" /> Offres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blogs" className="transition-smooth animate-in fade-in slide-in-from-bottom-2">
              <AdminBlogManager />
            </TabsContent>
            
            <TabsContent value="formations" className="transition-smooth animate-in fade-in slide-in-from-bottom-2">
              <AdminFormationManager />
            </TabsContent>
            
            <TabsContent value="metiers" className="transition-smooth animate-in fade-in slide-in-from-bottom-2">
              <AdminMetierManager />
            </TabsContent>
            
            <TabsContent value="offres" className="transition-smooth animate-in fade-in slide-in-from-bottom-2">
              <AdminOffreManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}