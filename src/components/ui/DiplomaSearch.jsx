import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, GraduationCap, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { DiplomaService } from '@/services/DiplomaService';
import { Input } from '@/components/ui/input';
import { formatDiplomaLevel } from '@/utils/diplomaUtils';
import { cn } from '@/lib/utils';

const DiplomaSearch = ({ onSelect, placeholder = "Rechercher un diplôme...", className }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef(null);

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
        const data = await DiplomaService.searchDiplomas(debouncedQuery);
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Diploma search failed", err);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="pl-9 pr-4"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || query.length > 1) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md border shadow-lg max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                >
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {formatDiplomaLevel(item.level)}
                    </span>
                    {item.sector && (
                      <span className="text-xs text-slate-400">• {item.sector}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             !loading && (
               <div className="px-4 py-3 text-sm text-slate-500 text-center">
                 Aucun diplôme trouvé
               </div>
             )
          )}
        </div>
      )}
    </div>
  );
};

export default DiplomaSearch;