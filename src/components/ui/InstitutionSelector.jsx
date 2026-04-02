import React, { useState } from 'react';
import InstitutionSearch from './InstitutionSearch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstitutionSelector = ({ selectedInstitution, onSelect, className }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');

  const types = [
    { value: 'Lycée', label: 'Lycée' },
    { value: 'Collège', label: 'Collège' },
    { value: 'Université', label: 'Université' },
    { value: 'Ecole', label: 'École Supérieure' }
  ];

  const handleRemove = () => {
    onSelect(null);
  };

  if (selectedInstitution) {
      return (
          <div className={`border rounded-lg p-4 bg-white shadow-sm relative overflow-hidden group ${className}`}>
              <div className="absolute top-0 right-0 p-4">
                  <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
              
              <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                      <div className="font-semibold text-slate-900">{selectedInstitution.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs font-normal bg-slate-50">
                              {selectedInstitution.type}
                          </Badge>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedInstitution.status === 'Public' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                              {selectedInstitution.status || 'Secteur inconnu'}
                          </span>
                      </div>
                  </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{selectedInstitution.address}, {selectedInstitution.postal_code} {selectedInstitution.city}</span>
                  </div>
                  
                  {(selectedInstitution.phone || selectedInstitution.email) && (
                    <div className="flex gap-4 mt-1">
                        {selectedInstitution.phone && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <Phone className="h-3 w-3 text-slate-400" />
                                {selectedInstitution.phone}
                            </div>
                        )}
                        {selectedInstitution.email && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <Mail className="h-3 w-3 text-slate-400" />
                                <span className="truncate max-w-[200px]">{selectedInstitution.email}</span>
                            </div>
                        )}
                    </div>
                  )}
                  
                  {selectedInstitution.website && (
                      <div className="flex items-center gap-1.5 mt-1">
                          <Globe className="h-3 w-3 text-slate-400" />
                          <a href={selectedInstitution.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                              Visiter le site web
                          </a>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
         <div className="w-1/2">
             <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="Type d'établissement" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    {types.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
             </Select>
         </div>
         <div className="w-1/2">
             <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous secteurs</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Privé">Privé</SelectItem>
                </SelectContent>
             </Select>
         </div>
      </div>

      <InstitutionSearch 
         onSelect={onSelect}
         initialValue={selectedInstitution}
         filters={{
            type: typeFilter !== 'all' ? typeFilter : undefined,
            sector: sectorFilter !== 'all' ? sectorFilter : undefined
         }}
         placeholder="Nom de l'école, collège, lycée..."
      />
      <div className="text-[10px] text-slate-400 text-center">
         Recherchez parmi plus de 60,000 établissements en France
      </div>
    </div>
  );
};

export default InstitutionSelector;