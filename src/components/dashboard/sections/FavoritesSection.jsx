import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavoritesSection = ({ favorites }) => {
  const navigate = useNavigate();
  const { jobs, formations, metiers } = favorites;

  const EmptyState = ({ type }) => (
     <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Aucun {type} dans vos favoris.</p>
     </div>
  );

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900">Mes Favoris</h2>
       
       <Tabs defaultValue="jobs">
          <TabsList>
             <TabsTrigger value="jobs">Offres ({jobs.length})</TabsTrigger>
             <TabsTrigger value="formations">Formations ({formations.length})</TabsTrigger>
             <TabsTrigger value="metiers">Métiers ({metiers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4 mt-6">
             {jobs.length > 0 ? jobs.map(item => (
                <Card key={item.id}>
                   <CardContent className="p-4 flex justify-between items-center">
                      <div>
                         <h3 className="font-bold">{item.job_details.title}</h3>
                         <p className="text-sm text-slate-500">{item.job_details.company} • {item.job_details.location}</p>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                         <Button variant="outline" size="sm" onClick={() => navigate(`/job/${item.job_id}`)}>Voir</Button>
                      </div>
                   </CardContent>
                </Card>
             )) : <EmptyState type="offre" />}
          </TabsContent>

          <TabsContent value="formations" className="space-y-4 mt-6">
             {formations.length > 0 ? formations.map(item => (
                <Card key={item.id}>
                   <CardContent className="p-4 flex justify-between items-center">
                      <div>
                         <h3 className="font-bold">{item.formation_details.title}</h3>
                         <p className="text-sm text-slate-500">{item.formation_details.provider}</p>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                         <Button variant="outline" size="sm" onClick={() => navigate(`/formation/${item.formation_id}`)}>Voir</Button>
                      </div>
                   </CardContent>
                </Card>
             )) : <EmptyState type="formation" />}
          </TabsContent>

          <TabsContent value="metiers" className="space-y-4 mt-6">
             {metiers.length > 0 ? metiers.map(item => (
                <Card key={item.id}>
                   <CardContent className="p-4 flex justify-between items-center">
                      <div>
                         <h3 className="font-bold">{item.metier_details.libelle || item.metier_code}</h3>
                         <p className="text-sm text-slate-500">{item.metier_details.domaine}</p>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                         <Button variant="outline" size="sm" onClick={() => navigate(`/metier/${item.metier_code}`)}>Voir</Button>
                      </div>
                   </CardContent>
                </Card>
             )) : <EmptyState type="métier" />}
          </TabsContent>
       </Tabs>
    </div>
  );
};

export default FavoritesSection;