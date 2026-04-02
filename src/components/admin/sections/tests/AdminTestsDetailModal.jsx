import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Calendar, Mail, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DebugResponsesSection from './DebugResponsesSection';

const AdminTestsDetailModal = ({ test, isOpen, onClose }) => {
  if (!test) return null;

  const user = test.profiles;
  const score = test.results?.baseResults?.confidence || 0;
  const matches = test.results?.baseResults?.matchedCareers || [];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-500" />
                  {user ? `${user.first_name || ''} ${user.last_name || ''}` : 'Utilisateur Inconnu'}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 text-sm mt-1">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {user?.email}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(test.created_at), 'PPP à HH:mm', { locale: fr })}</span>
                </DialogDescription>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Score Confiance</div>
                <Badge className={`text-lg px-3 py-1 ${score > 70 ? 'bg-green-100 text-green-700' : score > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {score}%
                </Badge>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white">
          <Tabs defaultValue="results" className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                <TabsTrigger value="results" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2">Résultats</TabsTrigger>
                <TabsTrigger value="answers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2">Réponses</TabsTrigger>
                <TabsTrigger value="debug" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-2">Debug API</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6">
              <TabsContent value="results" className="mt-0 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    Top 5 Métiers Suggérés
                  </h3>
                  <div className="grid gap-3">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                             #{index + 1}
                           </div>
                           <div>
                             <div className="font-medium text-slate-900">{match.career.name}</div>
                             <div className="text-xs text-slate-500 line-clamp-1">{match.reason || "Forte correspondance avec vos intérêts"}</div>
                           </div>
                        </div>
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                          {match.percentage}% Match
                        </Badge>
                      </div>
                    ))}
                    {matches.length === 0 && <p className="text-slate-400 italic text-sm">Aucun résultat disponible.</p>}
                  </div>
                </div>

                {test.results?.profileData?.primaryProfile && (
                   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-semibold text-indigo-900 mb-2">Profil Psychologique</h4>
                      <p className="text-sm text-indigo-700 mb-2 font-medium">{test.results.profileData.primaryProfile.title}</p>
                      <p className="text-xs text-indigo-600 leading-relaxed">{test.results.profileData.primaryProfile.description}</p>
                   </div>
                )}
              </TabsContent>

              <TabsContent value="answers" className="mt-0">
                <div className="space-y-4">
                  {test.answers && Object.entries(test.answers).map(([qId, answer], idx) => (
                    <div key={qId} className="p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between mb-2">
                         <span className="text-xs font-mono text-slate-400">Question ID: {qId}</span>
                         <Badge variant="outline" className="text-[10px]">Répondu</Badge>
                      </div>
                      <div className="text-sm font-medium text-slate-800">
                        {/* If we had the question text map, we'd show it here. For now show the raw answer */}
                        Réponse sélectionnée :
                      </div>
                      <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                         {Array.isArray(answer) ? answer.join(', ') : answer.toString()}
                      </div>
                    </div>
                  ))}
                  {(!test.answers || Object.keys(test.answers).length === 0) && (
                    <p className="text-center text-slate-500 py-8">Aucune réponse enregistrée.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="debug" className="mt-0">
                <div className="space-y-4">
                  <DebugResponsesSection data={test} title="Objet Test Complet" />
                  <DebugResponsesSection data={test.results} title="Détails Résultats" />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTestsDetailModal;