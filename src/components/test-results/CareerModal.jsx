import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, CheckCircle, BarChart2, Briefcase, GraduationCap, TrendingUp, Info } from 'lucide-react';
import FormationsList from './FormationsList';
import { supabase } from '@/lib/customSupabaseClient';

const CareerModal = ({ career, isOpen, onClose, onLike, onChoose, isLiked, isChosen }) => {
  const [stats, setStats] = useState({ views: 0, clicks: 0, likes: 0, chosen: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (!career?.code) return;
      try {
        const { data } = await supabase
          .from('career_statistics')
          .select('*')
          .eq('rome_code', career.code)
          .single();
          
        if (data) {
          setStats({
            views: data.total_shown || 0,
            clicks: data.total_clicked || 0,
            likes: data.total_liked || 0,
            chosen: data.total_chosen || 0
          });
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    if (isOpen) fetchStats();
  }, [career, isOpen]);

  if (!career) return null;

  const score = (career.final_score * 10).toFixed(1);

  // Parse competences if they are stored as JSON string
  const getCompetences = () => {
    try {
      const comps = career.competencesMobiliseesPrincipales || career.competencesMobilisees;
      if (Array.isArray(comps)) return comps;
      if (typeof comps === 'string') return JSON.parse(comps);
      return [];
    } catch {
      return [];
    }
  };
  
  const competencesList = getCompetences();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
        
        {/* Header Section */}
        <div className="bg-indigo-900 text-white p-6 md:p-8 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-indigo-700 hover:bg-indigo-600 border-indigo-500">ROME: {career.code}</Badge>
                <div className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-sm font-bold flex items-center border border-green-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" /> Match: {score}%
                </div>
              </div>
              <DialogTitle className="text-2xl md:text-4xl font-black mb-2">{career.libelle}</DialogTitle>
              <DialogDescription className="text-indigo-200 line-clamp-2">
                Fiche détaillée et statistiques communautaires
              </DialogDescription>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
              <Button 
                variant={isLiked ? "default" : "secondary"} 
                className={isLiked ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-white/10 hover:bg-white/20 text-white border-white/20"}
                onClick={() => onLike(career.code)}
              >
                <Heart className="mr-2 h-4 w-4" fill={isLiked ? "currentColor" : "none"} /> {isLiked ? 'Aimé' : 'J\'aime'}
              </Button>
              <Button 
                className={isChosen ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white text-indigo-900 hover:bg-slate-100"}
                onClick={() => onChoose(career)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> {isChosen ? 'Métier Sélectionné' : 'Choisir ce métier'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Column */}
            <div className="md:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center"><Info className="mr-2 h-5 w-5 text-indigo-500" /> Description</h3>
                <p className="text-slate-600 leading-relaxed">{career.description || career.definition || 'Description non disponible.'}</p>
              </section>

              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="skills" className="rounded-lg">Compétences Requises</TabsTrigger>
                  <TabsTrigger value="formations" className="rounded-lg">Formations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="skills" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-indigo-500" /> Savoir-Faire & Savoir-Être</h3>
                  {competencesList.length > 0 ? (
                    <ul className="space-y-2">
                      {competencesList.map((comp, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-slate-600">{comp.libelle || comp}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">Informations de compétences non renseignées.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="formations" className="mt-4">
                  <FormationsList romeCode={career.code} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Profil RIASEC</h3>
                <div className="space-y-3">
                  {career.riasecMajeur && (
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                      <div className="text-xs text-indigo-500 font-bold uppercase mb-1">Dominante (Majeur)</div>
                      <div className="font-bold text-indigo-900">{career.riasecMajeur}</div>
                    </div>
                  )}
                  {career.riasecMineur && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Secondaire (Mineur)</div>
                      <div className="font-bold text-slate-700">{career.riasecMineur}</div>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-indigo-500" /> Statistiques</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-slate-700">{stats.views}</div>
                    <div className="text-xs text-slate-500">Vues</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-blue-600">{stats.clicks}</div>
                    <div className="text-xs text-slate-500">Clics</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-pink-600">{stats.likes}</div>
                    <div className="text-xs text-slate-500">Favoris</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-green-600">{stats.chosen}</div>
                    <div className="text-xs text-slate-500">Choix Finaux</div>
                  </div>
                </div>
              </section>
              
              {career.salaire && (
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Salaire indicatif</h3>
                  <p className="text-slate-600">{career.salaire}</p>
                </section>
              )}
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CareerModal;