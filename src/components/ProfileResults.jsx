import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Briefcase, ArrowRight, Lock } from 'lucide-react';
import FeatureGate from '@/components/FeatureGate';
import { FEATURES, TIERS } from '@/constants/subscriptionTiers';
import UpgradeModal from '@/components/UpgradeModal';

const ProfileResults = ({ userProfile, onNavigate }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!userProfile) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Votre profil professionnel</h1>
        <p className="text-slate-600">Voici l'analyse de vos forces et de vos aspirations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Summary Cards - Always Visible */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Type dominant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">Créatif & Social</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Moteur principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Utilité sociale</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Environnement idéal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Collaboratif</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analyse détaillée</TabsTrigger>
          <TabsTrigger value="jobs">Métiers compatibles</TabsTrigger>
          <TabsTrigger value="action">Plan d'action</TabsTrigger>
        </TabsList>

        {/* 1. ANALYSE DÉTAILLÉE - GATED */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-500" />
                Analyse psychologique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureGate 
                feature={FEATURES.DETAILED_ANALYSIS} 
                title="Analyse approfondie" 
                description="Comprenez pourquoi vous fonctionnez ainsi et quels sont vos blocages."
              >
                <div className="space-y-4 text-slate-700">
                  <p>
                    Votre profil indique une forte prédisposition pour les activités nécessitant de l'empathie et de la créativité.
                    Vous excellez dans les environnements où la communication est fluide et horizontale.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-emerald-700">Vos forces</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Écoute active</li>
                        <li>Résolution de conflits</li>
                        <li>Adaptabilité</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-amber-700">Points de vigilance</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Difficulté à dire non</li>
                        <li>Sensibilité au stress</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </FeatureGate>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. MÉTIERS - PARTIALLY GATED */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">UX Designer</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={95} className="w-24 h-2" />
                      <span className="text-sm font-medium text-green-600">95% compatible</span>
                    </div>
                  </div>
                  
                  {/* Button triggers modal for Freemium */}
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Voir détails <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
                
                {/* Gated Details Section inside the card */}
                <div className="bg-slate-50 border-t border-slate-100 p-4">
                   <FeatureGate 
                     feature={FEATURES.FULL_JOB_DETAILS} 
                     blur={true}
                     title="Détails du métier"
                     description="Salaires, débouchés et formations pour ce métier."
                   >
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                           <span className="block text-slate-500">Salaire débutant</span>
                           <span className="font-semibold">32k - 38k €</span>
                        </div>
                        <div>
                           <span className="block text-slate-500">Demande</span>
                           <span className="font-semibold text-green-600">Très forte</span>
                        </div>
                        <div>
                           <span className="block text-slate-500">Formation</span>
                           <span className="font-semibold">Bac+3 à Bac+5</span>
                        </div>
                      </div>
                   </FeatureGate>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 3. PLAN D'ACTION - GATED */}
        <TabsContent value="action">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-500" />
                Votre feuille de route
              </CardTitle>
            </CardHeader>
            <CardContent>
               <FeatureGate 
                 feature={FEATURES.FULL_ACTION_PLAN}
                 title="Plan d'action complet"
                 description="Débloquez votre guide étape par étape pour réussir votre transition."
               >
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="bg-violet-100 text-violet-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                       <div>
                          <h4 className="font-bold">Valider vos compétences</h4>
                          <p className="text-slate-600 text-sm">Réalisez un bilan de compétences ciblé sur le digital.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="bg-violet-100 text-violet-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                       <div>
                          <h4 className="font-bold">Formation courte</h4>
                          <p className="text-slate-600 text-sm">Inscrivez-vous à un bootcamp UX/UI (3 mois).</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="bg-violet-100 text-violet-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                       <div>
                          <h4 className="font-bold">Portfolio</h4>
                          <p className="text-slate-600 text-sm">Créez 3 projets fictifs pour démontrer votre savoir-faire.</p>
                       </div>
                    </div>
                 </div>
               </FeatureGate>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        targetTier={TIERS.PREMIUM}
      />
    </div>
  );
};

export default ProfileResults;