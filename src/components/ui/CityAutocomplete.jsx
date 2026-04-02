import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const CityAutocomplete = ({ value, onCitySelect, placeholder = "Ville, région ou code postal", className }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  
  const debouncedSearch = useDebounce(inputValue, 400);

  // Sync internal state if prop changes externally
  useEffect(() => {
    if (value !== inputValue) {
       setInputValue(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Fetch cities from Supabase
  useEffect(() => {
    const fetchCities = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Select latitude/longitude for radius search
        let query = supabase
          .from('city')
          .select('id, Ville, "Code Postal", dep_code, latitude, longitude, région, département')
          .limit(15);

        const cleanSearch = debouncedSearch.trim().replace(/[%,]/g, '');

        if (/^\d+$/.test(cleanSearch)) {
           // NUMERIC SEARCH (Zip or Dep code)
           if (cleanSearch.length === 5) {
             query = query.eq('"Code Postal"', parseInt(cleanSearch, 10));
           } else {
             query = query.ilike('dep_code', `${cleanSearch}%`);
           }
        } else {
           // TEXT SEARCH: Ville, Région, or Département
           query = query.or(`Ville.ilike.${cleanSearch}%,région.ilike.${cleanSearch}%,département.ilike.${cleanSearch}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Deduplicate based on Name + Zip
        const uniqueCities = (data || []).reduce((acc, current) => {
          const exists = acc.find(item => 
            item.Ville === current.Ville && 
            item['Code Postal'] === current['Code Postal']
          );
          if (!exists) return acc.concat([current]);
          return acc;
        }, []);

        setSuggestions(uniqueCities);
        // Only open if we have results and user is focused
        if (uniqueCities.length > 0 && document.activeElement === wrapperRef.current?.querySelector('input')) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); 

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Notify parent of text change immediately (clears selected object)
    onCitySelect(newValue, null);
    
    if (newValue.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelectCity = (city) => {
    const cityName = city.Ville;
    const formattedDisplay = `${cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase()}`;
    
    setInputValue(formattedDisplay);
    // Pass full city object including lat/lon and zip
    onCitySelect(formattedDisplay, city);
    setIsOpen(false);
    setSuggestions([]);
  };

  const clearInput = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setInputValue('');
    onCitySelect('', null);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative group">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-violet-600 transition-colors pointer-events-none z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-10 h-12 text-base bg-white border-slate-200 focus:ring-violet-500 focus:border-violet-500 rounded-lg truncate shadow-sm"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
        ) : inputValue ? (
          <button 
            onClick={clearInput}
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <ul className="py-1">
            {suggestions.map((city) => (
              <li
                key={`${city.id}-${city['Code Postal']}`}
                onClick={() => handleSelectCity(city)}
                className="px-3 py-2.5 hover:bg-violet-50 cursor-pointer transition-colors flex items-center justify-between group text-sm border-b border-slate-50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 group-hover:text-violet-700 transition-colors flex items-center gap-2">
                    {city.Ville}
                    {city.région && (
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-normal bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {city.région}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center text-xs text-slate-500 gap-2 mt-0.5">
                    <span className="font-mono font-medium text-slate-600">{String(city['Code Postal']).padStart(5, '0')}</span>
                    {city.département && <span className="text-slate-400">• {city.département} ({city.dep_code})</span>}
                  </div>
                </div>
                {inputValue.toLowerCase() === city.Ville.toLowerCase() && (
                  <Check className="h-4 w-4 text-violet-600" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;