import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Database, UserCheck, Eye, Globe, 
  Server, Trash2, Download, AlertCircle, FileText,
  ChevronRight, CheckCircle, Mail, Phone, MapPin,
  Settings, Save
} from 'lucide-react';
import { Helmet } from 'react-helmet';

// UI Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Custom Components
import DataDeletionRequest from '@/components/DataDeletionRequest';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PolitiqueConfidentialite = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("policy");
  
  // Consent State
  const [consent, setConsent] = useState({
    necessary: true, // Always true
    functional: true,
    analytics: false,
    marketing: false
  });
  const [consentLoading, setConsentLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    // Load existing consent if available
    const loadConsent = async () => {
      if (user) {
        const { data } = await supabase
          .from('consent_logs')
          .select('preferences')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data?.preferences) {
          setConsent(prev => ({ ...prev, ...data.preferences }));
        }
      } else {
         // Load from local storage if not logged in
         const saved = localStorage.getItem('cookie_consent');
         if (saved) {
             try {
                 setConsent(prev => ({ ...prev, ...JSON.parse(saved) }));
             } catch (e) {
                 console.error("Failed to parse consent", e);
             }
         }
      }
    };
    loadConsent();
  }, [user]);

  const handleConsentChange = (key, value) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const saveConsent = async () => {
    setConsentLoading(true);
    try {
      if (user) {
        await supabase.from('consent_logs').insert({
          user_id: user.id,
          consent_type: 'cookie_preferences',
          agreed: true,
          preferences: consent,
          user_agent: navigator.userAgent
        });
      }
      
      // Also save to local storage for persistence
      localStorage.setItem('cookie_consent', JSON.stringify(consent));
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos choix de confidentialité ont été mis à jour.",
        variant: "default",
        className: "bg-green-50 border-green-200"
      });
    } catch (error) {
      console.error('Error saving consent:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
    } finally {
      setConsentLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter pour exporter vos données." });
      return;
    }

    setExportLoading(true);
    try {
      // Invoke the edge function
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        headers: {
           // Pass the auth token if needed, though supabase-js handles this automatically for .invoke
        }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleavenir_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export terminé",
        description: "Vos données ont été téléchargées avec succès.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Échec de l'export",
        description: "Une erreur est survenue lors de la récupération de vos données.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité & RGPD - CléAvenir</title>
        <meta name="description" content="Découvrez comment CléAvenir protège vos données personnelles. Transparence, droits RGPD et gestion de vos préférences." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Badge className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-blue-400/30 mb-2">
                  <Shield className="w-3 h-3 mr-1" /> Conforme RGPD
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Politique de Confidentialité
                </h1>
                <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
                  Votre confiance est notre priorité. Nous nous engageons à protéger vos données personnelles avec transparence et sécurité, conformément au Règlement Général sur la Protection des Données (RGPD).
                </p>
                <div className="text-sm text-blue-300">
                  Dernière mise à jour : 13 Janvier 2026
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block"
              >
                <Lock className="w-32 h-32 text-white/10" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-5xl px-4 py-12 -mt-8">
          <Tabs defaultValue="policy" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-white rounded-xl shadow-lg border border-slate-100 mb-8">
              <TabsTrigger value="policy" className="py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileText className="w-4 h-4 mr-2" /> Politique Détaillée
              </TabsTrigger>
              <TabsTrigger value="consent" className="py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Settings className="w-4 h-4 mr-2" /> Gestion des Cookies
              </TabsTrigger>
              <TabsTrigger value="data" className="py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                <Database className="w-4 h-4 mr-2" /> Mes Données & Droits
              </TabsTrigger>
            </TabsList>

            {/* Tab: Policy Text */}
            <TabsContent value="policy">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="bg-blue-50/50 p-6 border-b border-blue-100">
                    <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Vue d'ensemble
                    </h2>
                    <p className="text-blue-800/80 mt-2">
                      Cette politique s'applique à tous les services proposés par CléAvenir. Elle détaille la manière dont nous collectons, utilisons et protégeons vos informations.
                    </p>
                  </div>
                </Card>

                <Accordion type="single" collapsible className="space-y-4">
                  
                  {/* Section 1 */}
                  <AccordionItem value="item-1" className="bg-white rounded-lg border border-slate-200 px-2 shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-t-lg">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">
                          <Database className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-900">1. Collecte des Données</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 space-y-3">
                      <p>Nous collectons les données suivantes pour vous fournir nos services d'orientation :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Données d'identité :</strong> Nom, prénom, email, âge (pour adapter les résultats).</li>
                        <li><strong>Données professionnelles :</strong> Expérience, études, compétences actuelles.</li>
                        <li><strong>Données de test :</strong> Vos réponses aux questionnaires psychométriques et d'intérêts.</li>
                        <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, logs de connexion (sécurité).</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2 */}
                  <AccordionItem value="item-2" className="bg-white rounded-lg border border-slate-200 px-2 shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-t-lg">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-blue-50 rounded-md text-blue-600">
                          <Server className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-900">2. Traitement & Finalités</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 space-y-3">
                      <p>Vos données sont traitées pour les finalités suivantes :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Générer votre profil de compétences et vos correspondances métiers (Matching).</li>
                        <li>Vous proposer des offres d'emploi et de formation pertinentes.</li>
                        <li>Améliorer nos algorithmes de recommandation (données anonymisées).</li>
                        <li>Gérer votre compte utilisateur et vos abonnements.</li>
                        <li>Assurer la sécurité de la plateforme et prévenir la fraude.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 3 */}
                  <AccordionItem value="item-3" className="bg-white rounded-lg border border-slate-200 px-2 shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-t-lg">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-green-50 rounded-md text-green-600">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-900">3. Vos Droits (RGPD)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 space-y-3">
                      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données (disponible dans l'onglet "Mes Données").</li>
                        <li><strong>Droit de rectification :</strong> Corriger vos informations inexactes via votre profil.</li>
                        <li><strong>Droit à l'effacement :</strong> Demander la suppression de votre compte.</li>
                        <li><strong>Droit à la limitation :</strong> Geler temporairement l'utilisation de vos données.</li>
                        <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format lisible.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                   {/* Section 4 - Third Parties */}
                   <AccordionItem value="item-4" className="bg-white rounded-lg border border-slate-200 px-2 shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-t-lg">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-purple-50 rounded-md text-purple-600">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-900">4. Sous-traitants & Transferts</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 space-y-3">
                      <p>Nous partageons certaines données avec des partenaires de confiance strictement encadrés :</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                          <span className="font-semibold block text-slate-800">Supabase</span>
                          <span className="text-sm text-slate-500">Hébergement & Base de données (UE)</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                          <span className="font-semibold block text-slate-800">Stripe</span>
                          <span className="text-sm text-slate-500">Paiements sécurisés (Global, certifié)</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                          <span className="font-semibold block text-slate-800">OpenAI / Anthropic</span>
                          <span className="text-sm text-slate-500">Traitement IA (Données anonymisées uniquement)</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 5 - Retention */}
                  <AccordionItem value="item-5" className="bg-white rounded-lg border border-slate-200 px-2 shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 rounded-t-lg">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-amber-50 rounded-md text-amber-600">
                          <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium text-slate-900">5. Conservation & Sécurité</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-slate-600 space-y-3">
                      <p>
                        Vos données sont conservées tant que votre compte est actif. En cas d'inactivité de plus de 3 ans, elles sont automatiquement supprimées ou anonymisées.
                      </p>
                      <p>
                        Nous utilisons le chiffrement TLS pour tous les transferts et le chiffrement AES-256 pour les données sensibles au repos.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* DPO Section */}
                <Card className="bg-slate-900 text-slate-200 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Délégué à la Protection des Données (DPO)</h3>
                        <p className="mb-4 text-slate-400">Pour toute question relative à vos données ou pour exercer vos droits, vous pouvez contacter notre DPO.</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <a href="mailto:dpo@cleavenir.com" className="hover:text-blue-400 transition-colors">dpo@cleavenir.com</a>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            <span>123 Avenue de l'Innovation, 75001 Paris, France</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-400" />
                            <span>+33 1 23 45 67 89</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-auto p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Délais de réponse</h4>
                        <p className="text-sm text-slate-400">Nous nous engageons à répondre à toutes les demandes RGPD sous 72 heures ouvrées.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab: Consent Management */}
            <TabsContent value="consent">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                <Card className="border-t-4 border-t-purple-600 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-6 h-6 text-purple-600" />
                      Gestion des Consentements
                    </CardTitle>
                    <CardDescription>
                      Personnalisez vos préférences en matière de cookies et de traitement des données. Vous pouvez modifier ces choix à tout moment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Necessary */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="space-y-1">
                        <Label htmlFor="necessary" className="text-base font-semibold text-slate-900">Cookies Essentiels</Label>
                        <p className="text-sm text-slate-500 max-w-lg">Indispensables au fonctionnement du site (connexion, sécurité, panier). Ne peuvent pas être désactivés.</p>
                      </div>
                      <Switch id="necessary" checked={true} disabled />
                    </div>

                    {/* Functional */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="space-y-1">
                        <Label htmlFor="functional" className="text-base font-semibold text-slate-900">Fonctionnalités & Préférences</Label>
                        <p className="text-sm text-slate-500 max-w-lg">Sauvegarde vos choix (langue, mode sombre) et permet l'utilisation de fonctionnalités avancées.</p>
                      </div>
                      <Switch 
                        id="functional" 
                        checked={consent.functional}
                        onCheckedChange={(checked) => handleConsentChange('functional', checked)}
                      />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="space-y-1">
                        <Label htmlFor="analytics" className="text-base font-semibold text-slate-900">Analytique & Performance</Label>
                        <p className="text-sm text-slate-500 max-w-lg">Nous aide à comprendre comment le site est utilisé pour améliorer nos services (données anonymisées).</p>
                      </div>
                      <Switch 
                        id="analytics" 
                        checked={consent.analytics}
                        onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                      />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="space-y-1">
                        <Label htmlFor="marketing" className="text-base font-semibold text-slate-900">Marketing & Ciblage</Label>
                        <p className="text-sm text-slate-500 max-w-lg">Permet de vous proposer des offres pertinentes sur des sites tiers.</p>
                      </div>
                      <Switch 
                        id="marketing" 
                        checked={consent.marketing}
                        onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                      />
                    </div>

                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between py-4">
                    <Button variant="ghost" onClick={() => setConsent({
                      necessary: true, functional: false, analytics: false, marketing: false
                    })}>
                      Tout refuser
                    </Button>
                    <div className="flex gap-2">
                       <Button variant="outline" onClick={() => setConsent({
                        necessary: true, functional: true, analytics: true, marketing: true
                      })}>
                        Tout accepter
                      </Button>
                      <Button onClick={saveConsent} disabled={consentLoading} className="bg-purple-600 hover:bg-purple-700">
                        {consentLoading ? "Sauvegarde..." : "Enregistrer mes choix"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab: Data Management */}
            <TabsContent value="data">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                
                {/* Export Card */}
                <Card className="border-l-4 border-l-blue-500 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-500" />
                      Portabilité des données
                    </CardTitle>
                    <CardDescription>
                      Téléchargez une copie intégrale de vos données personnelles au format JSON (lisible par machine).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
                      <strong>Le fichier inclura :</strong> Votre profil, historique de tests, résultats de matching, favoris, et logs de consentement.
                    </div>
                    <Button 
                      onClick={handleExportData} 
                      disabled={exportLoading}
                      className="w-full sm:w-auto gap-2"
                    >
                      {exportLoading ? (
                        <>Traitement en cours...</>
                      ) : (
                        <><Download className="w-4 h-4" /> Télécharger mes données</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Separator />

                {/* Deletion Request Component */}
                <div id="deletion-zone">
                  <DataDeletionRequest />
                </div>

              </motion.div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PolitiqueConfidentialite;