import React, { useState, useEffect, useRef } from 'react';
import { InstitutionSearchService } from '@/services/InstitutionSearchService';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Building2, School, GraduationCap } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const InstitutionSearchSplit = ({ onSelect, className }) => {
    const [city, setCity] = useState('');
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const wrapperRef = useRef(null);
    
    // Debounce both inputs
    const debouncedName = useDebounce(name, 400);
    const debouncedCity = useDebounce(city, 400);

    useEffect(() => {
        const fetchInstitutions = async () => {
            // Require at least 2 chars for name
            if (debouncedName.length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setLoading(true);
            setHasSearched(true);
            
            // Construct query intelligently
            const query = debouncedName + (debouncedCity ? ` ${debouncedCity}` : '');

            try {
                const data = await InstitutionSearchService.search({
                    query: query,
                    limit: 15
                });
                setResults(data || []);
                setIsOpen(true);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutions();
    }, [debouncedName, debouncedCity]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (inst) => {
        setName(inst.name);
        setCity(inst.city);
        setIsOpen(false);
        if(onSelect) onSelect(inst);
    };

    const getIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('lycée')) return <School className="w-4 h-4 text-orange-500" />;
        if (t.includes('université')) return <GraduationCap className="w-4 h-4 text-purple-500" />;
        return <Building2 className="w-4 h-4 text-slate-500" />;
    };

    return (
        <div ref={wrapperRef} className={cn("relative space-y-3", className)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 font-medium ml-1 mb-1 block">Nom de l'établissement</label>
                    <div className="relative">
                        <Input 
                            value={name} 
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsOpen(true);
                            }}
                            placeholder="Ex: Lycée Victor Hugo"
                            className="bg-white"
                        />
                         {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:col-span-1">
                    <label className="text-xs text-slate-500 font-medium ml-1 mb-1 block">Ville (Optionnel)</label>
                    <div className="relative">
                        <Input 
                            value={city} 
                            onChange={(e) => {
                                setCity(e.target.value);
                                setIsOpen(true);
                            }}
                            placeholder="Ex: Paris"
                            className="bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && (debouncedName.length >= 2) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100 top-[calc(100%-8px)]">
                    {results.length > 0 ? (
                        results.map((inst, idx) => (
                            <button
                                key={`${inst.uai}-${idx}`}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3 group"
                                onClick={() => handleSelect(inst)}
                                type="button"
                            >
                                <div className="p-2 bg-slate-100 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">
                                    {getIcon(inst.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                         <div className="font-medium text-sm text-slate-900 truncate pr-2" title={inst.name}>{inst.name}</div>
                                         <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 whitespace-nowrap">{inst.type}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {inst.city} ({inst.postal_code})
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        !loading && hasSearched && (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                <p>Aucun établissement trouvé.</p>
                                <p className="text-xs text-slate-400 mt-1">Essayez de modifier votre recherche.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default InstitutionSearchSplit;