import React from 'react';
import { CV_TEMPLATES_CONFIG } from '@/data/cvTemplateConfig';
import { Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const CVTemplateGallery = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="p-4 space-y-4">
    <p className="flex items-start gap-2 text-sm text-slate-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
      <span>
        Les modèles <strong className="text-emerald-700">Compatible ATS</strong> (une colonne, titres classiques) sont
        les mieux lus par les logiciels de tri des recruteurs. Tous les modèles exportent un PDF avec du vrai texte.
      </span>
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {CV_TEMPLATES_CONFIG.map((template) => (
        <div 
          key={template.id}
          className={cn(
            "cursor-pointer hover:shadow-lg transition-all border-2 rounded-xl overflow-hidden group relative bg-white flex flex-col",
            selectedTemplate === template.id ? "border-purple-600 ring-2 ring-purple-100" : "border-slate-200"
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-[210/297] bg-slate-50 relative p-3 border-b border-slate-100 overflow-hidden">
             <div className="w-full h-full bg-white shadow-sm flex flex-col gap-1.5 p-2 text-[3px]" style={{ borderTop: `4px solid ${template.color}` }}>
                <div className="w-1/2 h-2 bg-slate-800 mb-1 rounded-sm"></div>
                <div className="w-1/3 h-1.5 bg-slate-400 mb-2 rounded-sm"></div>
                <div className="w-full h-[1px] bg-slate-200"></div>
                <div className="flex gap-1.5 mt-1 h-full">
                   <div className="w-full h-full bg-slate-50 rounded-sm"></div>
                </div>
             </div>
             
             {template.ats && (
               <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                 <ShieldCheck className="h-3 w-3" /> Compatible ATS
               </span>
             )}

             {selectedTemplate === template.id && (
               <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center backdrop-blur-[1px]">
                 <div className="bg-white rounded-full p-2 shadow-md animate-in zoom-in">
                   <Check className="h-6 w-6 text-purple-600" />
                 </div>
               </div>
             )}
          </div>
          <div className="p-3 bg-white flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-800 truncate" title={template.name}>{template.name}</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">{template.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
               {template.tags.slice(0, 2).map(tag => (
                 <span key={tag} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{tag}</span>
               ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default CVTemplateGallery;