import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Navigation, Building2, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const InstitutionDetailsModal = ({ institution, isOpen, onClose, onSelect }) => {
  if (!institution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex items-start justify-between">
                <div>
                     <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-3">
                        {institution.type} • {institution.status}
                     </Badge>
                     <DialogTitle className="text-2xl font-bold text-white mb-2">
                         {institution.name}
                     </DialogTitle>
                     <div className="flex items-center gap-2 text-white/80 text-sm">
                         <MapPin className="h-4 w-4" />
                         {institution.address}, {institution.postal_code} {institution.city}
                     </div>
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
            <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {institution.phone && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Phone className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Téléphone</div>
                                <div className="text-sm font-semibold text-slate-900">{institution.phone}</div>
                            </div>
                        </div>
                    )}
                    {institution.email && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <Mail className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Email</div>
                                <div className="text-sm font-semibold text-slate-900 truncate max-w-[200px]" title={institution.email}>
                                    {institution.email}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location Map Placeholder (Could be real map later) */}
                <div className="rounded-xl overflow-hidden bg-slate-100 h-48 relative flex items-center justify-center border border-slate-200 group">
                    {institution.latitude && institution.longitude ? (
                        <div className="text-center">
                            <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2 animate-bounce" />
                            <p className="text-sm text-slate-600 font-medium">Localisation disponible</p>
                            <Button variant="link" size="sm" className="text-purple-600" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${institution.latitude},${institution.longitude}`, '_blank')}>
                                Voir sur Google Maps <Navigation className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">Carte non disponible</p>
                    )}
                </div>

                {/* Programs (If any) */}
                <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        Programmes & Formations
                    </h3>
                    {institution.programs && institution.programs.length > 0 ? (
                        <div className="space-y-2">
                            {/* This would iterate over programs if fetched */}
                            <p className="text-sm text-slate-600">Cette établissement propose plusieurs formations.</p>
                        </div>
                    ) : (
                         <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
                             <p className="text-sm text-slate-500">Détails des programmes non disponibles pour le moment.</p>
                         </div>
                    )}
                </div>
            </div>
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50 flex gap-3 justify-end">
            {institution.website && (
                <Button variant="outline" onClick={() => window.open(institution.website, '_blank')}>
                    <Globe className="mr-2 h-4 w-4" />
                    Site Web
                </Button>
            )}
            {onSelect && (
                 <Button onClick={() => onSelect(institution)} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sélectionner cet établissement
                 </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionDetailsModal;