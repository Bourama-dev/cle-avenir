export const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

  const R = 6371; 
  const dLat = deg2rad(nLat2 - nLat1);
  const dLon = deg2rad(nLon2 - nLon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(nLat1)) * Math.cos(deg2rad(nLat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  
  return parseFloat(d.toFixed(1)); 
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const getCoordinatesFromLocation = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `${NOMINATIM_API_URL}?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=fr&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map(item => ({
      ...item,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    })).filter(item => !isNaN(item.lat) && !isNaN(item.lon));
    
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return [];
  }
};

export const filterFormationsByLocation = (formations, centerLat, centerLon, radiusKm) => {
  if (!formations || !Array.isArray(formations)) return [];
  
  const cLat = Number(centerLat);
  const cLon = Number(centerLon);
  const rad = Number(radiusKm);

  if (isNaN(cLat) || isNaN(cLon) || isNaN(rad)) return formations;

  return formations.map(formation => {
    // Attempt to extract latitude/longitude depending on object structure
    const jLat = Number(formation.location_lat || formation.latitude || formation.lieu?.latitude);
    const jLon = Number(formation.location_lng || formation.longitude || formation.lieu?.longitude);

    let distance = null;
    if (!isNaN(jLat) && !isNaN(jLon)) {
      distance = calculateDistance(cLat, cLon, jLat, jLon);
    }
    
    return { ...formation, distance };
  }).filter(formation => {
    if (formation.distance === null) return true; // Keep items with unknown location
    return formation.distance <= rad;
  }).sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
};

export const validateLocation = (location) => {
  if (!location) return false;
  return !isNaN(parseFloat(location.lat || location.latitude)) && 
         !isNaN(parseFloat(location.lon || location.longitude));
};