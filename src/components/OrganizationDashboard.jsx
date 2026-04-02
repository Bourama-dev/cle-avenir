import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
    PlusCircle, BarChart2, MessageSquare, Edit, Trash2, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';
import JobEditor from '@/components/organization/JobEditor';

const OrganizationDashboard = ({ onNavigate, userProfile }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data States
  const [orgId, setOrgId] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Setup State
  const [isSetupRequired, setIsSetupRequired] = useState(false);
  const [setupData, setSetupData] = useState({ name: '', siret: '', website: '', description: '' });

  // Fetch Organization Data securely
  useEffect(() => {
    const initDashboard = async () => {
        if (!userProfile) return;

        // 1. Find Organization ID properly
        let foundOrg = null;
        
        // Check if organizations is an array (1:Many) or object (1:1)
        if (Array.isArray(userProfile.organizations) && userProfile.organizations.length > 0) {
            foundOrg = userProfile.organizations[0];
        } else if (userProfile.organizations && typeof userProfile.organizations === 'object') {
            foundOrg = userProfile.organizations;
        }

        // If not found in profile, try direct fetch
        if (!foundOrg) {
            const { data } = await supabase.from('organizations').select('*').eq('user_id', userProfile.id).maybeSingle();
            foundOrg = data;
        }

        if (foundOrg) {
            setOrgId(foundOrg.id);
            setOrganization(foundOrg);
            fetchJobs(foundOrg.id);
            fetchApplications(foundOrg.id);
            setSetupData({
                name: foundOrg.name || '',
                siret: foundOrg.siret || '',
                website: foundOrg.website || '',
                description: foundOrg.description || ''
            });
        } else {
            setIsSetupRequired(true);
            setIsLoading(false);
        }
    };

    initDashboard();
  }, [userProfile]);

  const fetchJobs = async (id) => {
      const { data } = await supabase.from('job_postings').select('*').eq('organization_id', id).order('created_at', { ascending: false });
      setJobs(data || []);
      setIsLoading(false);
  };

  const fetchApplications = async (id) => {
      const { data: apps, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            job:job_postings!inner(title, organization_id),
            candidate:profiles!job_applications_candidate_id_fkey(first_name, last_name, email, professional_status)
        `)
        .eq('job.organization_id', id);

      if (error) {
          console.error("Error fetching applications:", error);
          toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les candidatures." });
      } else if (apps) {
          setApplications(apps);
      }
  };

  const handleSaveJob = async (jobData) => {
      if (!orgId) return;
      setIsSaving(true);

      try {
          if (editingJob) {
              const { error } = await supabase
                .from('job_postings')
                .update(jobData)
                .eq('id', editingJob.id);
              if(error) throw error;
              toast({ title: "Succès", description: "Annonce mise à jour." });
          } else {
              const { error } = await supabase
                .from('job_postings')
                .insert({ ...jobData, organization_id: orgId });
              if(error) throw error;
              toast({ title: "Succès", description: "Annonce publiée." });
          }
          fetchJobs(orgId);
          setIsEditorOpen(false);
          setEditingJob(null);
      } catch (error) {
          toast({ variant: "destructive", title: "Erreur", description: error.message });
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteJob = async (jobId) => {
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
      const { error } = await supabase.from('job_postings').delete().eq('id', jobId);
      if (!error) {
          toast({ title: "Supprimé", description: "Annonce supprimée." });
          fetchJobs(orgId);
      }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
      const { error } = await supabase.from('job_applications').update({ status: newStatus }).eq('id', appId);
      if (!error) {
          setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
          toast({ title: "Statut mis à jour" });
      }
  };

  const handleSetupProfile = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          const { data, error } = await supabase.from('organizations').insert({
              user_id: userProfile.id,
              ...setupData
          }).select().single();

          if (error) throw error;
          
          setOrgId(data.id);
          setOrganization(data);
          setIsSetupRequired(false);
          toast({ title: "Profil créé !", description: "Vous pouvez maintenant publier des annonces." });
      } catch (err) {
          toast({ variant: "destructive", title: "Erreur", description: err.message });
      } finally {
          setIsSaving(false);
      }
  };

  if (isSetupRequired) {
      return (
        <div className="min-h-screen bg-muted/30">
            {/* Header removed */}
            <main className="container mx-auto px-4 py-12 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Finalisez votre profil entreprise</CardTitle>
                        <CardDescription>Ces informations sont nécessaires pour publier des offres.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSetupProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom de l'entreprise</label>
                                <Input value={setupData.name} onChange={e => setSetupData({...setupData, name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SIRET</label>
                                <Input value={setupData.siret} onChange={e => setSetupData({...setupData, siret: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Web</label>
                                <Input value={setupData.website} onChange={e => setSetupData({...setupData, website: e.target.value})} placeholder="https://" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input value={setupData.description} onChange={e => setSetupData({...setupData, description: e.target.value})} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSaving}>Enregistrer et Continuer</Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Helmet>
        <title>{`Espace Recruteur - ${organization?.name || ''}`}</title>
      </Helmet>
      {/* Header removed */}

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Bonjour, {organization?.name}</h1>
                <p className="text-muted-foreground">Tableau de bord de recrutement.</p>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => { setEditingJob(null); setIsEditorOpen(true); }} className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="w-4 h-4 mr-2" /> Nouvelle Annonce
                </Button>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-card border border-border h-auto p-1 w-full">
                <TabsTrigger value="overview" className="py-2.5">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="jobs" className="py-2.5">Annonces</TabsTrigger>
                <TabsTrigger value="candidates" className="py-2.5">Candidatures</TabsTrigger>
                <TabsTrigger value="analytics" className="py-2.5">Analytique</TabsTrigger>
                <TabsTrigger value="settings" className="py-2.5">Paramètres</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Annonces Actives</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold">{jobs.filter(j => j.status === 'active').length}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Candidatures Reçues</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold">{applications.length}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">En attente de revue</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-orange-600">{applications.filter(a => a.status === 'pending').length}</div></CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* JOBS TAB */}
            <TabsContent value="jobs">
                <Card>
                    <CardHeader>
                        <CardTitle>Vos offres d'emploi</CardTitle>
                        <CardDescription>Gérez la visibilité de vos postes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {jobs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">Aucune annonce publiée.</div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map(job => (
                                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div>
                                            <h3 className="font-bold">{job.title}</h3>
                                            <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                                                <span>{job.location}</span> • <span>{job.contract_type}</span> • 
                                                <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="ml-2 text-[10px] h-5">
                                                    {job.status === 'active' ? 'En ligne' : 'Brouillon'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingJob(job); setIsEditorOpen(true); }}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)}>
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* CANDIDATES TAB */}
            <TabsContent value="candidates">
                <Card>
                    <CardHeader>
                        <CardTitle>Candidatures reçues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                             <div className="text-center py-12 text-muted-foreground">Aucune candidature pour le moment.</div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map(app => (
                                    <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card">
                                        <div className="mb-4 md:mb-0">
                                            <h4 className="font-bold">{app.candidate?.first_name} {app.candidate?.last_name}</h4>
                                            <p className="text-sm text-muted-foreground">{app.candidate?.email}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Badge variant="outline">Pour: {app.job?.title}</Badge>
                                                <Badge className={
                                                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-green-100 text-green-800'
                                                }>
                                                    {app.status === 'pending' ? 'En attente' : app.status === 'rejected' ? 'Rejeté' : 'Accepté'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {app.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50 text-green-700" onClick={() => handleUpdateAppStatus(app.id, 'interviewed')}>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Accepter
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50 text-red-700" onClick={() => handleUpdateAppStatus(app.id, 'rejected')}>
                                                        <XCircle className="mr-2 h-4 w-4" /> Refuser
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="secondary">
                                                <MessageSquare className="mr-2 h-4 w-4" /> Message
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics">
                <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border border-dashed">
                    <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Statistiques détaillées</h3>
                    <p className="text-muted-foreground">Graphiques de performance des annonces (Bientôt disponible)</p>
                </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings">
                 <Card>
                    <CardHeader><CardTitle>Paramètres Organisation</CardTitle></CardHeader>
                    <CardContent>
                         <form className="space-y-4">
                            <div className="space-y-2">
                                <label>Nom</label>
                                <Input defaultValue={organization?.name} disabled />
                            </div>
                            <div className="space-y-2">
                                <label>Description</label>
                                <Input defaultValue={organization?.description} />
                            </div>
                            <div className="space-y-2">
                                <label>Site Web</label>
                                <Input defaultValue={organization?.website} />
                            </div>
                            <Button disabled>Sauvegarder (Lecture seule démo)</Button>
                         </form>
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>

        <JobEditor 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={handleSaveJob}
            initialData={editingJob}
            isLoading={isSaving}
        />
      </main>
    </div>
  );
};

export default OrganizationDashboard;