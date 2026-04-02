import React, { useState, useMemo } from 'react';
import { X, MapPin, Globe, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLinkedMetiers, getLinkedEmplois } from '@/services/linkedData';
import { isValidUUID } from '@/lib/utils';

export default function ParcoursupDetailsModal({ formation, onClose }) {
  const [currentEtabIndex, setCurrentEtabIndex] = useState(0);

  // Validate formation ID if it's used for any internal queries (though this modal mostly uses props)
  if (formation?.id && !isValidUUID(formation.id) && !formation.g_ta_cod) {
      // Just a warning in console as we might be displaying external data
      console.debug("ParcoursupDetailsModal: Displaying formation with non-UUID ID:", formation.id);
  }

  const etablissements = useMemo(() => formation.etablissements || [], [formation]);
  const linkedMetiers = useMemo(() => getLinkedMetiers(formation), [formation]);
  const linkedEmplois = useMemo(() => getLinkedEmplois(formation), [formation]);

  const currentEtab = etablissements[currentEtabIndex] || null;
  const totalEtabs = etablissements.length;

  const handlePrevEtab = () => setCurrentEtabIndex(prev => (prev === 0 ? totalEtabs - 1 : prev - 1));
  const handleNextEtab = () => setCurrentEtabIndex(prev => (prev === totalEtabs - 1 ? 0 : prev + 1));

  if (!formation) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-indigo-700 text-white p-6 flex justify-between items-start z-10 shadow-md shrink-0 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Parcoursup</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight">{formation.libelle_formation}</h2>
            <p className="text-violet-100 text-sm mt-1 flex items-center gap-2 opacity-90">
              {formation.type_formation} {formation.niveau && `• ${formation.niveau}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">📚 Informations clés</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Type', value: formation.type_formation },
                { label: 'Niveau', value: formation.niveau },
                { label: 'Taux d\'accès', value: formation.taux_acces ? `${formation.taux_acces}%` : null },
                { label: 'Sélectivité', value: formation.selectivite },
              ].map((item, i) => item.value && (
                <div key={i}>
                  <p className="text-xs font-semibold text-slate-500 uppercase">{item.label}</p>
                  <p className="font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {(linkedMetiers.length > 0 || linkedEmplois.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4">
               {linkedMetiers.length > 0 && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                     <h4 className="font-bold text-emerald-900 mb-3 text-sm">💼 Métiers visés</h4>
                     <div className="flex flex-wrap gap-2">
                        {linkedMetiers.map((m, i) => <span key={i} className="bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{m}</span>)}
                     </div>
                  </div>
               )}
               {linkedEmplois.length > 0 && (
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                     <h4 className="font-bold text-blue-900 mb-3 text-sm">📋 Exemples d'emplois</h4>
                     <div className="flex flex-wrap gap-2">
                        {linkedEmplois.map((e, i) => <span key={i} className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-medium">{e}</span>)}
                     </div>
                  </div>
               )}
            </div>
          )}

          {/* Etablissements */}
          <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
               🏫 Établissements <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{totalEtabs}</span>
               </h3>
               {totalEtabs > 1 && <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">{currentEtabIndex + 1} / {totalEtabs}</div>}
            </div>

            {totalEtabs > 1 && (
               <div className="flex items-center gap-2 mb-4 p-1 bg-slate-50 rounded-lg border border-slate-100">
                  <button onClick={handlePrevEtab} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ChevronLeft size={18} /></button>
                  <div className="flex gap-1 overflow-x-auto flex-1 py-1 px-1">
                  {etablissements.map((_, idx) => (
                     <button key={idx} onClick={() => setCurrentEtabIndex(idx)} className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${idx === currentEtabIndex ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 border'}`}>
                        {idx + 1}
                     </button>
                  ))}
                  </div>
                  <button onClick={handleNextEtab} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ChevronRight size={18} /></button>
               </div>
            )}

            {currentEtab && (
               <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">{currentEtab.nom}</h4>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                     {currentEtab.ville && (
                        <div className="flex gap-3">
                           <div className="p-2 bg-violet-50 rounded text-violet-600 h-fit"><MapPin size={18} /></div>
                           <div>
                              <p className="text-xs font-medium text-slate-500 uppercase">Ville</p>
                              <p className="font-semibold text-slate-900">{currentEtab.ville}</p>
                              <p className="text-xs text-slate-500">{currentEtab.code_postal}</p>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                     {currentEtab.latitude && (
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`https://maps.google.com/?q=${currentEtab.latitude},${currentEtab.longitude}`, '_blank')}>
                           <MapPin size={16} className="mr-2" /> Carte
                        </Button>
                     )}
                     {formation.lien_parcoursup && (
                        <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => window.open(formation.lien_parcoursup, '_blank')}>
                           <Globe size={16} className="mr-2" /> Parcoursup
                        </Button>
                     )}
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t p-4 flex justify-end rounded-b-2xl shrink-0">
          <Button onClick={onClose} variant="outline">Fermer</Button>
        </div>
      </div>
    </div>
  );
}