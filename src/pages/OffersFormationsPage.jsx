import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Briefcase, BookOpen, MapPin, Building, GraduationCap, Clock, Euro, Home, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useNavigation } from '@/hooks/useNavigation';

const OffersFormationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { goBack, goHome } = useNavigation();
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [jobs, setJobs] = useState([]);
  const [formations, setFormations] = useState([]);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch saved jobs
        const { data: jobsData } = await supabase
          .from('saved_jobs')
          .select('*')
          .eq('user_id', user.id);
          
        if (jobsData) setJobs(jobsData);
        else {
           // Mock if empty
           setJobs([
              { id: 1, title: 'Développeur Frontend', company: 'TechCorp', location: 'Paris', contract: 'CDI', salary: '45k' },
              { id: 2, title: 'UX Designer', company: 'DesignStudio', location: 'Lyon', contract: 'Freelance', salary: '400/j' }
           ]);
        }

        // Fetch saved formations
        const { data: formationsData } = await supabase
          .from('saved_formations')
          .select('*')
          .eq('user_id', user.id);
          
        if (formationsData) setFormations(formationsData);
        else {
           // Mock if empty
           setFormations([
              { id: 1, title: 'Master Digital Marketing', provider: 'HETIC', location: 'Paris', duration: '2 ans', level: 'Bac+5' },
              { id: 2, title: 'Bootcamp Data Science', provider: 'Le Wagon', location: 'Remote', duration: '3 mois', level: 'Certificat' }
           ]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredJobs = jobs.filter(j => 
     j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     j.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFormations = formations.filter(f => 
     f.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     f.provider?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col gap-4 mb-2">
         <div className="flex items-center justify-between">
            <Breadcrumbs />
            <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={goHome} className="text-slate-600 hover:text-indigo-600">
                  <Home className="w-4 h-4 mr-2" /> Accueil
               </Button>
               <Button variant="ghost" size="sm" onClick={goBack} className="text-slate-600 hover:text-violet-600">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Retour
               </Button>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Offres & Formations</h1>
           <p className="text-slate-500">Retrouvez vos offres sauvegardées et vos pistes de formation.</p>
        </div>
        
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
           />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
               <Briefcase className="w-4 h-4" /> Offres d'Emploi
            </TabsTrigger>
            <TabsTrigger value="formations" className="flex items-center gap-2">
               <BookOpen className="w-4 h-4" /> Formations
            </TabsTrigger>
         </TabsList>

         <TabsContent value="jobs">
            {loading ? (
               <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredJobs.length === 0 ? (
               <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Aucune offre d'emploi trouvée.</p>
               </div>
            ) : (
               <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                     <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                           <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                 <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                                 <div className="flex items-center gap-2 text-slate-600">
                                    <Building className="h-4 w-4" />
                                    <span>{job.company}</span>
                                 </div>
                              </div>
                              <Badge>{job.contract}</Badge>
                           </div>
                           
                           <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                 <MapPin className="h-4 w-4" /> {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                 <Euro className="h-4 w-4" /> {job.salary || 'Non spécifié'}
                              </div>
                           </div>
                           
                           <div className="mt-4 flex gap-3">
                              <Button size="sm">Voir l'offre</Button>
                              <Button variant="outline" size="sm">Retirer des favoris</Button>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </TabsContent>

         <TabsContent value="formations">
            {loading ? (
               <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredFormations.length === 0 ? (
               <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Aucune formation trouvée.</p>
               </div>
            ) : (
               <div className="grid gap-4">
                  {filteredFormations.map((formation) => (
                     <Card key={formation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                           <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                 <h3 className="font-bold text-lg text-slate-900">{formation.title}</h3>
                                 <div className="flex items-center gap-2 text-slate-600">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>{formation.provider}</span>
                                 </div>
                              </div>
                              <Badge variant="secondary">{formation.level}</Badge>
                           </div>
                           
                           <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                 <MapPin className="h-4 w-4" /> {formation.location}
                              </div>
                              <div className="flex items-center gap-1">
                                 <Clock className="h-4 w-4" /> {formation.duration}
                              </div>
                           </div>
                           
                           <div className="mt-4 flex gap-3">
                              <Button size="sm">Détails</Button>
                              <Button variant="outline" size="sm">Retirer</Button>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </TabsContent>
      </Tabs>
    </div>
  );
};

export default OffersFormationsPage;