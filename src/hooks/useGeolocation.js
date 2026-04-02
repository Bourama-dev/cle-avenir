import { useState, useCallback } from 'react';

const CACHE_KEY = 'cleavenir_user_location';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    // Check cache first
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setLocation({ latitude: cached.lat, longitude: cached.lon });
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(coords);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          lat: coords.latitude,
          lon: coords.longitude,
          timestamp: Date.now()
        }));
        setLoading(false);
      },
      (err) => {
        let errorMessage = "Impossible de récupérer votre position.";
        if (err.code === 1) errorMessage = "Vous avez refusé l'accès à la géolocalisation.";
        if (err.code === 2) errorMessage = "Position indisponible.";
        if (err.code === 3) errorMessage = "Délai d'attente dépassé.";
        setError(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    localStorage.removeItem(CACHE_KEY);
  }, []);

  return { location, error, loading, requestLocation, clearLocation };
}