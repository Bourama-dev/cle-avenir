import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

// Uses geo.api.gouv.fr (official French government API) which returns INSEE codes
// directly — France Travail requires INSEE codes, not postal codes.
async function fetchCommunes(query) {
  const res = await fetch(
    `https://geo.api.gouv.fr/communes?q=${encodeURIComponent(query)}&fields=code,nom,codesPostaux,centre,codeDepartement&limit=6&boost=population`,
    { signal: AbortSignal.timeout(5_000) }
  );
  if (!res.ok) throw new Error(`geo.api error ${res.status}`);
  return res.json();
}

const LocationFilter = ({ value, onLocationChange }) => {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setInputValue('');
    } else if (value.name !== inputValue) {
      setInputValue(value.name);
    }
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedInput || debouncedInput.length < 2) {
        setSuggestions([]);
        return;
      }
      if (value?.name === debouncedInput) return;

      setLoading(true);
      try {
        const data = await fetchCommunes(debouncedInput);
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching communes:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (commune) => {
    // geo.api.gouv.fr returns coordinates as [lon, lat] in GeoJSON format
    const coords = commune.centre?.coordinates ?? [0, 0];
    const lon = coords[0];
    const lat = coords[1];

    onLocationChange({
      name: commune.nom,
      inseeCode: commune.code,          // INSEE code — used by France Travail API
      zipcode: commune.codesPostaux?.[0], // first postal code
      departement: commune.codeDepartement,
      lat,
      lon,
    });

    setInputValue(commune.nom);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      onLocationChange(null);
    }
  };

  return (
    <div className="space-y-3" ref={wrapperRef}>
      <label className="text-sm font-medium flex items-center gap-2 text-slate-700 location-info">
        <MapPin className="w-4 h-4 text-slate-500" />
        Localisation
      </label>
      <div className="relative">
        <Input
          placeholder="Ville, code postal..."
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            "bg-white pr-8 focus:ring-2 focus:ring-rose-500/20 transition-all",
            value ? "border-emerald-200 bg-emerald-50/30 text-emerald-900 selected-location" : ""
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : value ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : null}
        </div>

        {value?.inseeCode && (
          <div className="text-[10px] text-slate-400 mt-1 px-1 flex justify-end font-mono">
            INSEE {value.inseeCode} · {value.zipcode}
          </div>
        )}

        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
            {suggestions.map((commune) => (
              // onMouseDown + preventDefault keeps the Input focused while the
              // selection fires, preventing any blur-triggered side-effects from
              // racing with the click event and discarding the selection.
              <div
                key={commune.code}
                role="option"
                aria-selected="false"
                className="w-full flex items-baseline gap-2 py-2 px-3 text-sm hover:bg-slate-50 cursor-pointer select-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(commune);
                }}
              >
                <span className="font-medium text-slate-900">{commune.nom}</span>
                <span className="text-xs text-slate-400 ml-auto shrink-0">
                  {commune.codesPostaux?.[0]}
                  {commune.codeDepartement && ` · ${commune.codeDepartement}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;
