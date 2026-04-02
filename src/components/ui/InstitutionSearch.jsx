import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Building2, MapPin, X, School, GraduationCap } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { InstitutionSearchService } from '@/services/InstitutionSearchService';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const InstitutionSearch = ({ 
  onSelect, 
  initialValue = null, 
  placeholder = "Rechercher un établissement...",
  className,
  filters = {}
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const wrapperRef = useRef(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await InstitutionSearchService.search({
          query: debouncedQuery,
          ...filters
        });
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Institution search failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedItem) {
      search();
    }
  }, [debouncedQuery, filters, selectedItem]);

  // Handle initial value
  useEffect(() => {
    if (initialValue && typeof initialValue === 'object') {
        setSelectedItem(initialValue);
        setQuery(initialValue.name);
    }
  }, [initialValue]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setIsOpen(false);
    if(onSelect) onSelect(item);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedItem(null);
    setQuery('');
    setResults([]);
    if(onSelect) onSelect(null);
  };

  const getIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('lycée')) return <School className="h-4 w-4 text-orange-500" />;
    if (t.includes('université')) return <GraduationCap className="h-4 w-4 text-purple-500" />;
    if (t.includes('collège')) return <Building2 className="h-4 w-4 text-blue-500" />;
    return <Building2 className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className={cn("relative w-full", className)} ref={wrapperRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
        <Input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedItem(null);
            setIsOpen(true);
          }}
          onFocus={() => {
             if (query.length >= 2 && !selectedItem) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "pl-9 pr-10 bg-white shadow-sm border-slate-200 focus:border-purple-500 transition-all",
            selectedItem ? "border-purple-500 bg-purple-50 text-purple-900 font-medium" : ""
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            ) : query && (
                <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
      </div>

      {isOpen && (results.length > 0 || (query.length > 1 && !loading)) && !selectedItem && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-slate-200 shadow-xl max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {results.length > 0 ? (
            <ul className="py-1 divide-y divide-slate-50">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-slate-50 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                        {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-900 truncate text-sm">{item.name}</span>
                            {item.status && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${item.status === 'Public' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {item.city} <span className="text-slate-300">|</span> {item.postal_code}
                            </span>
                            {item.programsCount > 0 && (
                                <span className="text-[10px] text-purple-600 font-medium">
                                    {item.programsCount} formations disponibles
                                </span>
                            )}
                        </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="px-4 py-6 text-center">
                 <div className="mx-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <Building2 className="h-5 w-5 text-slate-400" />
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Aucun établissement trouvé</p>
                 <p className="text-xs text-slate-400 mt-1">Essayez de vérifier l'orthographe ou la ville</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstitutionSearch;