import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getCoordinatesFromLocation } from '@/services/LocationFilterService';
import { useToast } from '@/components/ui/use-toast';

export default function LocationFilter({ onLocationChange, currentRadius = 50 }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [radius, setRadius] = useState([currentRadius]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location: geoLoc, error: geoErr, loading: geoLoading, requestLocation } = useGeolocation();
  const { toast } = useToast();

  useEffect(() => {
    if (geoLoc && !selectedLocation) {
      handleLocationSelect({
        display_name: "Ma position actuelle",
        lat: geoLoc.latitude,
        lon: geoLoc.longitude
      });
    }
    if (geoErr) {
      toast({ title: "Erreur", description: geoErr, variant: "destructive" });
    }
  }, [geoLoc, geoErr]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      const results = await getCoordinatesFromLocation(query);
      setSuggestions(results);
      setIsSearching(false);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setQuery(loc.display_name.split(',')[0]);
    setSuggestions([]);
    onLocationChange({ lat: loc.lat, lon: loc.lon, radius: radius[0] });
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (selectedLocation) {
      onLocationChange({ lat: selectedLocation.lat, lon: selectedLocation.lon, radius: newRadius[0] });
    }
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setQuery('');
    setRadius([50]);
    onLocationChange(null);
  };

  return (
    <Card className="p-4 bg-white shadow-sm border-slate-200">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> Où cherchez-vous ?
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ville ou code postal..."
                className="pl-9 pr-8"
              />
              {query && (
                <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {suggestions.length > 0 && !selectedLocation && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((loc, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-0"
                      onClick={() => handleLocationSelect(loc)}
                    >
                      {loc.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={requestLocation} 
              disabled={geoLoading}
              className="shrink-0"
              title="Utiliser ma position"
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>

        {selectedLocation && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Rayon de recherche</span>
              <span className="font-bold text-primary">{radius[0]} km</span>
            </div>
            <Slider
              value={radius}
              onValueChange={handleRadiusChange}
              max={200}
              min={5}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>5 km</span>
              <span>200 km</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}