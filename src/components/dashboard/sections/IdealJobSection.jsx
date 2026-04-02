import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, DollarSign, TrendingUp, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdealJobSection = ({ match, userProfile }) => {
  const navigate = useNavigate();
  const plan = userProfile?.subscription_tier || 'free';
  const isPremium = plan !== 'free';

  if (!match) return (
     <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Aucun métier identifié</h2>
        <p className="text-slate-500 mb-6">Nous avons besoin de mieux vous connaître.</p>
        <Button onClick={() => navigate('/test')}>Passer le test</Button>
     </div>
  );

  return (
    <div className="space-y-6">
       {/* Hero Header */}
       <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-green-500 text-white hover:bg-green-600 border-none px-3 py-1 text-base">
                   {Math.round(match.matchPercentage)}% Compatible
                </Badge>
                {match.tags && Object.keys(match.tags).slice(0,3).map(tag => (
                   <Badge key={tag} variant="outline" className="text-slate-300 border-slate-600 capitalize">{tag}</Badge>
                ))}
             </div>
             <h1 className="text-4xl font-extrabold mb-4">{match.title}</h1>
             <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{match.description}</p>
          </div>
       </div>

       {/* Detailed Tabs */}
       <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl w-full justify-start h-auto overflow-x-auto flex-nowrap">
             <TabsTrigger value="overview" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium">Vue d'ensemble</TabsTrigger>
             <TabsTrigger value="skills" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium">Compétences</TabsTrigger>
             <TabsTrigger value="salary" className="rounded-lg px-4 py-2.5 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium flex items-center gap-2">
                Salaire { !isPremium && <Lock className="w-3 h-3 text-slate-400" /> }
             </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
             {/* Key Stats */}
             <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-100 shadow-sm">
                   <CardContent className="p-6">
                      <h3 className="font-bold text-blue-900 mb-2 flex items-center"><TrendingUp className="w-5 h-5 mr-2"/> Débouchés</h3>
                      <p className="text-blue-700 font-medium">{match.outlook || "Très favorables"}</p>
                   </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-100 shadow-sm">
                   <CardContent className="p-6">
                      <h3 className="font-bold text-purple-900 mb-2 flex items-center"><BookOpen className="w-5 h-5 mr-2"/> Formation</h3>
                      <p className="text-purple-700 font-medium">{match.education || "Bac +3 à Bac +5"}</p>
                   </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100 shadow-sm">
                   <CardContent className="p-6">
                      <h3 className="font-bold text-orange-900 mb-2 flex items-center"><Users className="w-5 h-5 mr-2"/> Environnement</h3>
                      <p className="text-orange-700 font-medium">Bureau / Hybride</p>
                   </CardContent>
                </Card>
             </div>
             
             {/* Reasons */}
             <Card className="border-slate-200">
                <CardContent className="p-8">
                   <h3 className="text-xl font-bold mb-6 text-slate-900">Pourquoi ce métier ?</h3>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                         <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 shrink-0">
                           <CheckCircle2 size={16} />
                         </div>
                         <p className="text-slate-700">Correspond à votre intérêt pour <span className="font-semibold text-slate-900">la technologie et la résolution de problèmes</span>.</p>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                         <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 shrink-0">
                           <CheckCircle2 size={16} />
                         </div>
                         <p className="text-slate-700">S'aligne avec votre désir d'<span className="font-semibold text-slate-900">autonomie et de créativité</span>.</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
             <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-slate-900">Compétences Requises</h3>
                  <div className="flex flex-wrap gap-2">
                     {match.tags && Object.keys(match.tags).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 capitalize">
                           {tag}
                        </Badge>
                     ))}
                  </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="salary" className="mt-6">
             <Card className="relative overflow-hidden border-slate-200 shadow-sm">
                {!isPremium && (
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                        <Lock className="w-8 h-8 text-slate-900" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Information réservée aux membres Premium</h3>
                      <p className="text-slate-500 mb-6 max-w-md">Débloquez les grilles de salaires détaillées, l'évolution de carrière et les primes.</p>
                      <Button onClick={() => navigate('/premium')} className="bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white font-bold shadow-lg px-8">
                         Débloquer l'accès
                      </Button>
                   </div>
                )}
                <CardContent className="p-8">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="p-5 bg-green-50 rounded-2xl text-green-600 border border-green-100">
                         <DollarSign className="w-10 h-10" />
                      </div>
                      <div>
                         <div className="text-sm text-slate-500 uppercase font-bold tracking-wide">Salaire Moyen Annuel</div>
                         <div className="text-4xl font-extrabold text-slate-900">{match.salary || "35k€ - 45k€"}</div>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div>
                         <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
                            <span>Junior (0-2 ans)</span>
                            <span>32k€</span>
                         </div>
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-300 w-[40%] rounded-full"></div></div>
                      </div>
                      <div>
                         <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
                            <span>Confirmé (2-5 ans)</span>
                            <span>42k€</span>
                         </div>
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-400 w-[60%] rounded-full"></div></div>
                      </div>
                      <div>
                         <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
                            <span>Expert (5+ ans)</span>
                            <span>55k€+</span>
                         </div>
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-800 w-[85%] rounded-full"></div></div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>
       </Tabs>
    </div>
  );
};

export default IdealJobSection;