import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, Code, Layers, GitBranch, FileCode, Workflow, 
  ChevronRight, Hash, Scale, MessageSquare, Zap, Target, 
  ArrowRight, ClipboardList, Compass, Database, Briefcase,
  Crosshair, BarChart, Users, Brain, Award, CheckCircle,
  HardDrive, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('collecte');

  const sections = [
    { id: 'collecte', title: '1️⃣ Collecte des réponses', icon: ClipboardList },
    { id: 'vecteur-user', title: '2️⃣ Vecteur utilisateur', icon: Target },
    { id: 'riasec', title: '3️⃣ Projection RIASEC', icon: Compass },
    { id: 'rome', title: '4️⃣ Récupération ROME', icon: Database },
    { id: 'vecteur-metier', title: '5️⃣ Vecteur métier', icon: Briefcase },
    { id: 'similarite', title: '6️⃣ Similarité vectorielle', icon: Crosshair },
    { id: 'zscore', title: '7️⃣ Normalisation Z-score', icon: BarChart },
    { id: 'comportement', title: '8️⃣ Couche adaptative', icon: Users },
    { id: 'apprentissage', title: '9️⃣ Apprentissage direct', icon: Brain },
    { id: 'resultat', title: '🔟 Résultat final', icon: Award },
    { id: 'moteur-realite', title: '🧠 Le moteur en réalité', icon: Zap },
    { id: 'resume', title: '📊 En résumé', icon: CheckCircle },
    { id: 'architecture', title: '🏗️ Architecture globale', icon: Workflow },
    { id: 'fichiers', title: '📁 Fichiers clés', icon: FileCode },
    { id: 'tables', title: '🗄️ Tables Supabase', icon: HardDrive },
    { id: 'rpc', title: '⚙️ Fonctions RPC', icon: Settings }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Helmet>
        <title>Documentation - Moteur de Recommandation | CléAvenir</title>
        <meta name="description" content="CléAvenir - Moteur de Recommandation Hybride Auto-Apprenant" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold">CléAvenir - Moteur de Recommandation Hybride Auto-Apprenant</h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl ml-1">
              Système scientifiquement cohérent combinant psychométrie, similarité vectorielle, statistiques adaptatives et reinforcement learning.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:w-72 lg:sticky lg:top-24 h-fit z-10">
              <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-800">Table des matières</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 h-[65vh] overflow-y-auto custom-scrollbar">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700 font-bold shadow-sm'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                          activeSection === section.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`} />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-12">
              
              {/* Section 1 */}
              <section id="collecte" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">1️⃣ Collecte des réponses</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <CardContent className="pt-8 px-6 pb-8">
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">•</span> L'utilisateur répond aux questions</li>
                      <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">•</span> Chaque réponse contient des weights par dimension</li>
                      <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">•</span> Chaque question a un weight (importance stratégique)</li>
                      <li className="flex gap-2 items-start bg-blue-50 p-3 rounded-lg mt-4">
                        <span className="font-bold text-blue-800">Résultat :</span> Réponses → Somme pondérée → Vecteur brut utilisateur
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2 */}
              <section id="vecteur-user" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">2️⃣ Construction du vecteur utilisateur</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <CardContent className="pt-8 px-6 pb-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-800 text-white">Fichier</Badge>
                      <code className="text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">buildUserVector.js</code>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Processus :</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                        <li>Initialisation vecteur vide (22 dimensions)</li>
                        <li>Addition des poids × poids question</li>
                        <li>Normalisation L2</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-800">
                      <p className="font-mono text-xs text-slate-400 mb-2">// Formule</p>
                      <code className="font-mono text-sm text-green-400 block">dimension_norm = valeur / √(Σ valeurs²)</code>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800 mb-2">Résultat :</p>
                      <code className="text-sm text-slate-600">{`{ "dimensions": { ...norme = 1 }, "riasec": { R,I,A,S,E,C } }`}</code>
                    </div>
                    <p className="text-sm text-slate-500 italic">Note : Le vecteur est mathématiquement stable</p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3 */}
              <section id="riasec" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">3️⃣ Projection RIASEC</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <CardContent className="pt-8 px-6 pb-8 space-y-6">
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-800 uppercase font-semibold">
                          <tr>
                            <th className="px-6 py-3">Type RIASEC</th>
                            <th className="px-6 py-3">Dimensions CléAvenir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">R (Réaliste)</td><td className="px-6 py-3 text-slate-600">pratique, construction, sport</td></tr>
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">I (Investigateur)</td><td className="px-6 py-3 text-slate-600">analytique, tech, innovation</td></tr>
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">A (Artistique)</td><td className="px-6 py-3 text-slate-600">art, creativite</td></tr>
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">S (Social)</td><td className="px-6 py-3 text-slate-600">relationnel, education, sante</td></tr>
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">E (Entreprenant)</td><td className="px-6 py-3 text-slate-600">commerce, leadership, marketing</td></tr>
                          <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-bold text-slate-900">C (Conventionnel)</td><td className="px-6 py-3 text-slate-600">rigueur, droit</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Utilité :</h4>
                      <ul className="space-y-1 text-slate-700">
                        <li className="flex gap-2 items-center"><span className="text-green-500 font-bold">•</span> Expliquer le profil</li>
                        <li className="flex gap-2 items-center"><span className="text-green-500 font-bold">•</span> Ajouter cohérence scientifique</li>
                        <li className="flex gap-2 items-center"><span className="text-green-500 font-bold">•</span> Améliorer matching</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4 */}
              <section id="rome" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Database className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">4️⃣ Récupération métiers ROME</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                  <CardContent className="pt-8 px-6 pb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="border-yellow-300 text-yellow-800 bg-yellow-50">Table Supabase</Badge>
                      <code className="text-sm font-semibold">public.rome_metiers</code>
                    </div>
                    <p className="font-semibold text-slate-800 mb-3">Chaque métier contient :</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {['RIASEC majeur', 'RIASEC mineur', 'adjusted_weights (apprentissage)', 'compétences', 'proximités'].map((item, idx) => (
                         <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-700 text-center font-medium shadow-sm">
                           {item}
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5 */}
              <section id="vecteur-metier" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">5️⃣ Construction du vecteur métier</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                  <CardContent className="pt-8 px-6 pb-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-800 text-white">Fonction</Badge>
                      <code className="text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded">buildCareerVectorFromROME()</code>
                    </div>
                    <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 mb-3">Logique :</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center bg-white p-2 rounded border border-indigo-50"><span className="text-slate-600">RIASEC majeur</span><Badge className="bg-indigo-600">+0.7</Badge></li>
                        <li className="flex justify-between items-center bg-white p-2 rounded border border-indigo-50"><span className="text-slate-600">RIASEC mineur</span><Badge className="bg-indigo-500">+0.3</Badge></li>
                        <li className="flex justify-between items-center bg-white p-2 rounded border border-indigo-50"><span className="text-slate-600">adjusted_weights</span><Badge variant="outline" className="border-indigo-300 text-indigo-700">ajout dynamique</Badge></li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700"><span className="font-bold text-slate-900">Résultat :</span> Chaque métier devient un vecteur compatible avec celui de l'utilisateur.</p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6 & 7 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="similarite" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                      <Crosshair className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">6️⃣ Similarité vectorielle</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                    <CardContent className="pt-8 px-6 pb-8 space-y-6">
                      <div className="bg-slate-900 rounded-lg p-5 border border-slate-800">
                        <p className="font-mono text-xs text-slate-400 mb-2">// Formule</p>
                        <code className="font-mono text-sm text-pink-400 block break-all">cosine(u, m) = (u · m) / (||u|| × ||m||)</code>
                      </div>
                      <div className="p-4 bg-pink-50 text-pink-900 rounded-lg border border-pink-100">
                        <span className="font-bold">Résultat :</span> Score entre 0 et 1
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section id="zscore" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                      <BarChart className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">7️⃣ Normalisation Z-score</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
                    <CardContent className="pt-8 px-6 pb-8 space-y-4">
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                        <code className="font-mono text-sm text-teal-400 block break-all">z = (score - moyenne) / écart-type</code>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">Pourquoi :</h4>
                        <ul className="text-sm space-y-1 text-slate-600 ml-4 list-disc">
                          <li>Évite qu'un métier sorte juste parce que tous sont faibles</li>
                          <li>Garde uniquement ceux au-dessus de la moyenne</li>
                        </ul>
                      </div>
                      <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 font-mono text-sm font-bold rounded">
                        Filtre : zScore &gt; 0
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Section 8 & 9 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="comportement" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">8️⃣ Couche adaptative</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
                    <CardContent className="pt-6 px-6 pb-8 space-y-4">
                      <div className="flex items-center gap-2">
                         <Badge variant="outline" className="border-orange-300">Table</Badge>
                         <code className="text-sm">career_statistics</code>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                        <code className="font-mono text-xs text-orange-400 block break-words">boost = (chosenRate × 0.5 + likeRate × 0.3 + clickRate × 0.2) × 0.15</code>
                      </div>
                      <ul className="text-sm space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-orange-500"/> Plafonné à 0.15</li>
                        <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-orange-500"/> Ajouté au zScore</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>

                <section id="apprentissage" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">9️⃣ Apprentissage direct</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                    <CardContent className="pt-6 px-6 pb-8 space-y-4">
                      <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                        <span className="font-bold text-cyan-800 text-sm">Quand :</span> <span className="text-sm text-cyan-900">Utilisateur choisit un métier</span>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                        <code className="font-mono text-sm text-cyan-400 block break-words">adjusted_weights += user_vector × 0.02</code>
                        <div className="mt-2 text-xs text-slate-400 border-t border-slate-700 pt-2">Plafond max : 0.2</div>
                      </div>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900">Effet :</span> Le métier évolue progressivement vers les profils réels.
                      </p>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Section 10 */}
              <section id="resultat" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">🔟 Résultat final</h2>
                </div>
                <Card className="shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                  <CardContent className="pt-8 px-6 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 space-y-4 w-full">
                        <h4 className="font-bold text-slate-800 text-lg">Le moteur retourne :</h4>
                        <div className="flex items-center gap-4">
                          <div className="bg-yellow-500 text-white text-3xl font-black p-4 rounded-xl shadow-lg">15</div>
                          <div className="text-lg font-semibold text-slate-700">Top métiers<br/><span className="text-sm font-normal text-slate-500">Triés par score final</span></div>
                        </div>
                      </div>
                      <div className="flex-1 w-full bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-3">Basé sur :</h5>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Similarité mathématique</li>
                          <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Distribution statistique</li>
                          <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Performance comportementale</li>
                          <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Apprentissage progressif</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 11 & 12 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="moteur-realite" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">🧠 Ce que le moteur fait réellement</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <CardContent className="pt-6 px-6 pb-8">
                      <p className="font-semibold text-slate-800 mb-4">Il combine :</p>
                      <ul className="space-y-3 text-slate-700">
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Psychométrie (dimensions + RIASEC)</li>
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Similarité vectorielle</li>
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Statistiques adaptatives</li>
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Reinforcement learning léger</li>
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Données gouvernementales ROME</li>
                        <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Base évolutive auto-calibrée</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>

                <section id="resume" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">📊 En résumé</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <CardContent className="pt-6 px-6 pb-8">
                      <p className="font-semibold text-slate-800 mb-4">Le test est maintenant :</p>
                      <ul className="space-y-3 text-slate-700">
                        <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-green-500 shrink-0"/> Scientifiquement cohérent</li>
                        <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-green-500 shrink-0"/> Mathématiquement stable</li>
                        <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-green-500 shrink-0"/> Basé sur données officielles</li>
                        <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-green-500 shrink-0"/> Auto-améliorant</li>
                        <li className="flex items-start gap-2"><Zap className="h-5 w-5 text-green-500 shrink-0"/> Prêt pour ML supervisé futur</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Section 13 */}
              <section id="architecture" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">🏗️ Architecture globale</h2>
                </div>
                
                <Card className="shadow-lg border-none overflow-hidden bg-slate-900 text-white">
                  <CardContent className="p-8">
                    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-700">
                       {[
                         { title: "Questionnaire → Vecteur L2", desc: "Collecte et normalisation L2 des réponses de l'utilisateur." },
                         { title: "scoreROME → Cosine Similarity", desc: "Calcul du produit scalaire entre le profil et les métiers ROME." },
                         { title: "Z-Score Normalization", desc: "Écrêtage statistique pour ne conserver que les scores performants." },
                         { title: "Boost Comportemental", desc: "Ajustement selon la popularité réelle de la communauté." },
                         { title: "Renforcement des Dimensions", desc: "Mise à jour légère des poids du métier vers le profil validé." },
                         { title: "Top 15 Métiers", desc: "Affichage final des résultats optimisés." }
                       ].map((step, idx) => (
                         <div key={idx} className="relative flex items-center gap-6 pl-2">
                           <div className="absolute left-0 w-10 h-10 rounded-full bg-slate-800 border-2 border-purple-500 flex items-center justify-center font-bold text-purple-400 z-10">
                             {idx + 1}
                           </div>
                           <div className="ml-8 bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex-1 hover:bg-slate-800 transition-colors">
                             <h4 className="font-bold text-purple-200">{step.title}</h4>
                             <p className="text-sm text-slate-400 mt-1">{step.desc}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 14 */}
              <section id="fichiers" className="scroll-mt-28">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <FileCode className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">📁 Fichiers clés</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                   {[
                     { path: '/src/data/dimensions.js', desc: 'Définition des 22 dimensions' },
                     { path: '/src/data/questions.js', desc: 'Questions du questionnaire' },
                     { path: '/src/services/buildUserVector.js', desc: 'Construction du vecteur utilisateur' },
                     { path: '/src/services/scoreROME.js', desc: 'Moteur de scoring' },
                     { path: '/src/services/careerStats.js', desc: 'Gestion des statistiques' },
                     { path: '/src/services/reinforceCareer.js', desc: 'Renforcement des dimensions' },
                     { path: '/src/lib/testResultsClassifier.js', desc: 'Classification des résultats' }
                   ].map((file, idx) => (
                     <Card key={idx} className="group hover:border-indigo-300 transition-all cursor-default">
                       <CardContent className="p-4 flex items-start gap-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           <FileCode className="h-4 w-4" />
                         </div>
                         <div>
                           <div className="font-mono text-xs font-bold text-slate-800 mb-1">{file.path}</div>
                           <p className="text-sm text-slate-500 leading-snug">{file.desc}</p>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                </div>
              </section>

              {/* Section 15 & 16 */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <section id="tables" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                      <HardDrive className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">🗄️ Tables Supabase</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-rose-400 to-red-500"></div>
                    <CardContent className="pt-6 px-6 pb-8 space-y-4">
                       <div className="space-y-3">
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">rome_metiers</code>
                           <p className="text-xs text-slate-500 mt-1">Métiers ROME avec dimensions</p>
                         </div>
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">career_feedback</code>
                           <p className="text-xs text-slate-500 mt-1">Feedback utilisateur</p>
                         </div>
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">career_statistics</code>
                           <p className="text-xs text-slate-500 mt-1">Statistiques agrégées</p>
                         </div>
                       </div>
                    </CardContent>
                  </Card>
                </section>

                <section id="rpc" className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                      <Settings className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">⚙️ Fonctions RPC</h2>
                  </div>
                  <Card className="shadow-lg border-none overflow-hidden h-full">
                    <div className="h-2 bg-gradient-to-r from-slate-500 to-slate-700"></div>
                    <CardContent className="pt-6 px-6 pb-8 space-y-4">
                       <div className="space-y-3">
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">increment_shown</code>
                           <p className="text-xs text-slate-500 mt-1">Incrémente le nombre d'affichages</p>
                         </div>
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">increment_action</code>
                           <p className="text-xs text-slate-500 mt-1">Incrémente une action (clicked, liked, chosen)</p>
                         </div>
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <code className="text-sm font-bold text-slate-800">reinforce_career_dimensions</code>
                           <p className="text-xs text-slate-500 mt-1">Renforce les dimensions d'un métier</p>
                         </div>
                       </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentationPage;