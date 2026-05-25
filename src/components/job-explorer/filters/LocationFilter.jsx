import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

// Fetches French communes using api-adresse.data.gouv.fr (primary) with
// geo.api.gouv.fr as fallback. Both return INSEE codes required by France Travail.
// Uses AbortController instead of AbortSignal.timeout() for Safari compatibility.
async function fetchCommunes(query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    // Primary: api-adresse.data.gouv.fr — official French address search API
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&autocomplete=1&limit=6`,
      { signal: controller.signal }
    );
    if (res.ok) {
      const json = await res.json();
      // Map to a uniform shape: { code, nom, codesPostaux, centre, codeDepartement }
      return (json.features ?? []).map((f) => ({
        code: f.properties.citycode,
        nom: f.properties.city,
        codesPostaux: [f.properties.postcode],
        centre: { coordinates: f.geometry.coordinates }, // [lon, lat]
        codeDepartement: (f.properties.context ?? '').split(',')[0].trim(),
      }));
    }
  } catch (_) {
    // Fallback below
  } finally {
    clearTimeout(timer);
  }

  // Fallback: geo.api.gouv.fr
  const controller2 = new AbortController();
  const timer2 = setTimeout(() => controller2.abort(), 6000);
  try {
    const res2 = await fetch(
      `https://geo.api.gouv.fr/communes?q=${encodeURIComponent(query)}&fields=code,nom,codesPostaux,centre,codeDepartement&limit=6&boost=population`,
      { signal: controller2.signal }
    );
    if (!res2.ok) throw new Error(`geo.api ${res2.status}`);
    return await res2.json();
  } finally {
    clearTimeout(timer2);
  }
}

const LocationFilter = ({ value, onLocationChange }) => {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedInput = useDebounce(inputValue, 350);
  const wrapperRef = useRef(null);

  // Sync input when external value changes (e.g. reset filters)
  useEffect(() => {
    if (!value) {
      setInputValue('');
    } else if (value.name && value.name !== inputValue) {
      setInputValue(value.name);
    }
  // intentionally omit inputValue — we only want to react to value prop changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!debouncedInput || debouncedInput.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    // Don't re-fetch if the current value already matches the input
    if (value?.name === debouncedInput) return;

    let cancelled = false;
    setLoading(true);
    setFetchError(false);

    fetchCommunes(debouncedInput)
      .then((data) => {
        if (!cancelled) {
          setSuggestions(data);
          setIsOpen(data.length > 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
          setFetchError(true);
          setIsOpen(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedInput, value]);

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
    const coords = commune.centre?.coordinates ?? [0, 0];
    onLocationChange({
      name: commune.nom,
      inseeCode: commune.code,
      zipcode: commune.codesPostaux?.[0],
      departement: commune.codeDepartement,
      lat: coords[1],
      lon: coords[0],
    });
    setInputValue(commune.nom);
    setIsOpen(false);
    setSuggestions([]);
    setFetchError(false);
  };

  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    setFetchError(false);
    if (v === '') onLocationChange(null);
  };

  return (
    <div className="space-y-3" ref={wrapperRef}>
      <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
        <MapPin className="w-4 h-4 text-slate-500" />
        Localisation
      </label>
      <div className="relative">
        <Input
          placeholder="Ville ou code postal..."
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          className={cn(
            "bg-white pr-8 focus:ring-2 focus:ring-rose-500/20 transition-all",
            value ? "border-emerald-200 bg-emerald-50/30 text-emerald-900" : ""
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : value ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : null}
        </div>

        {/* Confirmed selection badge */}
        {value?.inseeCode && (
          <div className="text-[10px] text-slate-400 mt-1 px-1 flex justify-end font-mono">
            INSEE {value.inseeCode} · {value.zipcode}
          </div>
        )}

        {/* Error message */}
        {fetchError && !loading && (
          <div className="flex items-center gap-1.5 mt-1 px-1 text-[11px] text-amber-600">
            <AlertCircle className="h-3 w-3 shrink-0" />
            Impossible de charger les suggestions. Réessayez.
          </div>
        )}

        {/* Suggestions dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-[100] w-full mt-1 bg-white rounded-md shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
            {suggestions.map((commune) => (
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
