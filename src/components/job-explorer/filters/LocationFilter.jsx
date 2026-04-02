import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { getCoordinatesFromLocation } from '@/services/LocationFilterService';
import { cn } from '@/lib/utils';

const LocationFilter = ({ value, onLocationChange }) => {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Sync local state if parent updates value (e.g. reset)
    if (!value) {
        setInputValue('');
    } else if (value.name !== inputValue) {
        setInputValue(value.name);
    }
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedInput || debouncedInput.length < 3) {
        setSuggestions([]);
        return;
      }

      // If the current input matches the selected value, don't fetch
      if (value?.name === debouncedInput) return;

      setLoading(true);
      try {
        const data = await getCoordinatesFromLocation(debouncedInput);
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
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

  const handleSelect = (place) => {
    const locationName = place.display_name.split(',')[0]; // Simple name
    const zip = place.address?.postcode;
    
    // Ensure coordinates are numbers
    const lat = typeof place.lat === 'number' ? place.lat : parseFloat(place.lat);
    const lon = typeof place.lon === 'number' ? place.lon : parseFloat(place.lon);
    
    // We send a structured object back with coordinates
    const locationData = {
        name: locationName,
        zipcode: zip,
        lat: lat,
        lon: lon,
        full_name: place.display_name
    };

    setInputValue(locationName);
    onLocationChange(locationData);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
      setInputValue(e.target.value);
      if (e.target.value === '') {
          onLocationChange(null);
      }
  };

  // Safe coordinate display helper
  const renderCoordinates = () => {
    if (!value) return null;
    
    // Handle case where value might be an object but lat/lon are properties
    // or if they are strings that need parsing
    const lat = Number(value.lat);
    const lon = Number(value.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      return (
        <div className="text-[10px] text-slate-400 mt-1 px-1 flex justify-end coordinates font-mono">
           {lat.toFixed(4)}, {lon.toFixed(4)}
        </div>
      );
    }
    return null;
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

        {renderCoordinates()}

        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
            {suggestions.map((place) => (
              <Button
                key={place.place_id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3 text-sm hover:bg-slate-50"
                onClick={() => handleSelect(place)}
              >
                <div className="flex flex-col items-start gap-0.5 w-full">
                    <span className="font-medium text-slate-900 truncate w-full">
                        {place.display_name.split(',')[0]}
                    </span>
                    <span className="text-xs text-slate-500 truncate w-full flex justify-between">
                       <span>{place.address?.postcode} {place.address?.state || place.address?.region}</span>
                       <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-400">
                         {place.address?.country_code?.toUpperCase()}
                       </span>
                    </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;