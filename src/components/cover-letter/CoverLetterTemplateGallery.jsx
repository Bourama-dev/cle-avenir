import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Palette } from 'lucide-react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { cn } from '@/lib/utils';

const CoverLetterTemplateGallery = ({ isOpen, onClose, onSelect, currentTemplateId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 border-b bg-white z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Palette className="h-5 w-5" />
             </div>
             <div>
                <DialogTitle>Bibliothèque de Modèles</DialogTitle>
                <DialogDescription>
                  Choisissez parmi nos 8 modèles de lettres de motivation conçus pour impressionner.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 bg-slate-50 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-20">
            {CL_TEMPLATES_CONFIG.map((template) => {
              const isSelected = currentTemplateId === template.id;
              
              return (
                <div 
                  key={template.id}
                  className={cn(
                    "group relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-xl cursor-pointer flex flex-col",
                    isSelected ? "border-purple-600 ring-2 ring-purple-100 shadow-md" : "border-slate-200 hover:border-slate-300"
                  )}
                  onClick={() => onSelect(template.id)}
                >
                  <div className="aspect-[210/297] bg-slate-50 relative p-3 overflow-hidden border-b border-slate-100">
                     <div className="w-full h-full bg-white shadow-sm flex flex-col p-2 gap-1 overflow-hidden" style={{ borderTop: `4px solid ${template.color}` }}>
                        <div className="h-2 w-1/3 bg-slate-800 rounded-sm mb-2"></div>
                        <div className="flex justify-end mb-2">
                           <div className="h-6 w-1/3 bg-slate-100 rounded-sm"></div>
                        </div>
                        <div className="space-y-1 flex-1 mt-2">
                           <div className="w-full h-1 bg-slate-200 rounded-full"></div>
                           <div className="w-full h-1 bg-slate-200 rounded-full"></div>
                           <div className="w-2/3 h-1 bg-slate-200 rounded-full"></div>
                        </div>
                     </div>
                     
                     {isSelected && (
                       <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center backdrop-blur-[1px]">
                         <div className="bg-white rounded-full p-2 shadow-lg scale-100 animate-in zoom-in">
                           <Check className="h-6 w-6 text-purple-600" />
                         </div>
                       </div>
                     )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                       <h3 className="font-semibold text-slate-900 line-clamp-1 text-sm">{template.name}</h3>
                       <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{template.description}</p>
                    </div>
                    <div className="flex gap-1 mt-3">
                       {template.tags.slice(0,2).map(tag => (
                          <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                       ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-white flex justify-end gap-3">
           <Button variant="outline" onClick={onClose}>Annuler</Button>
           <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">Valider la sélection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterTemplateGallery;