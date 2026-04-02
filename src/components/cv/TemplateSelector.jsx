import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';

export const CV_TEMPLATES = [
  { 
    id: TEMPLATE_UUIDS.template5, 
    name: 'CléAvenir Pro', 
    description: 'Design officiel sombre avec sidebar et logo.',
    previewColor: 'bg-slate-900 border-slate-800',
    isNew: true
  },
  { 
    id: TEMPLATE_UUIDS.template6, 
    name: 'CléAvenir Élégance', 
    description: 'En-tête dégradé aux couleurs de la marque.',
    previewColor: 'bg-gradient-to-br from-violet-600 to-pink-600 border-none',
    isNew: true
  },
  { 
    id: TEMPLATE_UUIDS.template2, 
    name: 'Moderne', 
    description: 'Design épuré avec barre latérale et accents violets.',
    previewColor: 'bg-gradient-to-br from-white via-white to-violet-50 border-violet-200'
  },
  { 
    id: TEMPLATE_UUIDS.template1, 
    name: 'Classique', 
    description: 'Traditionnel, police avec empattement, mise en page centrée.',
    previewColor: 'bg-[#fdfbf7] border-slate-200' 
  },
  { 
    id: TEMPLATE_UUIDS.template3, 
    name: 'Minimaliste', 
    description: 'Noir et blanc, typographie forte, mise en page grille.',
    previewColor: 'bg-white border-black'
  },
  { 
    id: TEMPLATE_UUIDS.template4, 
    name: 'Créatif', 
    description: 'En-tête audacieux, formes géométriques, tons émeraude.',
    previewColor: 'bg-emerald-50 border-emerald-200'
  },
];

const TemplateSelector = ({ open, onOpenChange, currentTemplate, onSelect }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choisir un modèle</DialogTitle>
          <DialogDescription>
            Sélectionnez le design qui correspond le mieux à votre profil.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
          {CV_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-primary overflow-hidden group relative",
                currentTemplate === template.id ? "ring-2 ring-offset-2 ring-primary border-primary" : "border-slate-200"
              )}
              onClick={() => onSelect(template.id)}
            >
              <div className={`h-48 w-full ${template.previewColor} relative p-6 flex flex-col`}>
                 <div className="w-full h-4 bg-current opacity-20 rounded mb-2 mix-blend-overlay"></div>
                 <div className="w-2/3 h-8 bg-current opacity-30 rounded mb-4 mix-blend-overlay"></div>
                 <div className="flex gap-4 flex-1">
                    <div className="w-1/3 bg-current opacity-10 rounded h-full mix-blend-overlay"></div>
                    <div className="flex-1 space-y-2">
                       <div className="w-full h-2 bg-current opacity-20 rounded mix-blend-overlay"></div>
                       <div className="w-full h-2 bg-current opacity-20 rounded mix-blend-overlay"></div>
                       <div className="w-3/4 h-2 bg-current opacity-20 rounded mix-blend-overlay"></div>
                    </div>
                 </div>

                 {template.isNew && (
                   <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Star size={10} className="fill-yellow-900" /> NOUVEAU
                   </div>
                 )}

                 {currentTemplate === template.id && (
                    <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full shadow-lg">
                       <Check size={16} />
                    </div>
                 )}
              </div>
              <CardContent className="p-4 bg-white">
                 <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    {template.name}
                 </h3>
                 <p className="text-sm text-slate-500">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;