import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Building2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/lib/customSupabaseClient';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EstablishmentSearch = ({ 
  onSelect, 
  initialValue = null, 
  placeholder = "Rechercher votre établissement...",
  className,
  error
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search effect
  useEffect(() => {
    const searchEstablishments = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('establishments')
          .select('id, name, city, region, postal_code')
          .or(`name.ilike.%${debouncedQuery}%,city.ilike.%${debouncedQuery}%`)
          .limit(10);

        if (error) throw error;
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Error searching establishments:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedItem) {
      searchEstablishments();
    }
  }, [debouncedQuery, selectedItem]);

  // Initial value handling
  useEffect(() => {
    if (initialValue && !selectedItem) {
       // Ideally we fetch the full object if only ID is passed, 
       // but here we assume initialValue might be the object or we might need to fetch it.
       // For simplicity in this implementation, we expect the parent to pass the object 
       // OR we fetch it if it's an ID string.
       const fetchInitial = async () => {
          if (typeof initialValue === 'string') {
             const { data } = await supabase.from('establishments').select('*').eq('id', initialValue).single();
             if (data) {
                setSelectedItem(data);
                setQuery(data.name);
             }
          } else if (initialValue.name) {
             setSelectedItem(initialValue);
             setQuery(initialValue.name);
          }
       };
       fetchInitial();
    }
  }, [initialValue]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setIsOpen(false);
    setActiveIndex(-1);
    if (onSelect) onSelect(item);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedItem(null);
    setQuery('');
    setResults([]);
    if (onSelect) onSelect(null);
    // Focus input after clear
    const input = wrapperRef.current?.querySelector('input');
    if (input) input.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {selectedItem ? <Building2 className="h-4 w-4 text-blue-600" /> : <Search className="h-4 w-4" />}
        </div>
        
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedItem(null);
            if (onSelect) onSelect(null);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
             if (query.length >= 2 && !selectedItem) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            "pl-9 pr-10 transition-all duration-200",
            selectedItem ? "border-blue-500 bg-blue-50/30 text-blue-900 font-medium" : "",
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="establishment-results"
          role="combobox"
          autoComplete="off"
        />

        {/* Right Icon (Clear or Loading) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Effacer la sélection"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (debouncedQuery.length >= 2 || results.length > 0) && !selectedItem && (
        <div 
          id="establishment-results"
          className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "px-4 py-3 cursor-pointer flex items-start gap-3 transition-colors duration-150",
                    index === activeIndex ? "bg-slate-50 text-slate-900" : "text-slate-600"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                    index === activeIndex ? "bg-white border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"
                  )}>
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {item.city} {item.postal_code && `(${item.postal_code})`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-slate-500">
               {!loading && (
                 <>
                   <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                   <p className="text-sm">Aucun établissement trouvé</p>
                   <p className="text-xs text-slate-400 mt-1">Essayez avec le nom de la ville ?</p>
                 </>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EstablishmentSearch;