import { supabase } from '@/lib/customSupabaseClient';
import { SECTORS } from '@/constants/sectors';

function assignMockSector(item) {
  if (item.sector) return item;
  const title = String(item.libelle_formation || item.intitule || '').toLowerCase();
  let matchedSector = SECTORS[Math.floor(Math.random() * SECTORS.length)].id;
  for (const s of SECTORS) {
    if (title.includes(s.name.toLowerCase().split(' ')[0])) {
      matchedSector = s.id;
      break;
    }
  }
  return { ...item, sector: matchedSector };
}

export async function invokeParcoursup(body) {
  try {
    const { data, error } = await supabase.functions.invoke('parcoursup-api', { 
      body,
      method: 'POST',
    });
    if (error) throw new Error(error.message || 'Erreur API');
    return data;
  } catch (e) {
    console.error('Parcoursup Service Error:', e);
    return { success: false, error: e.message };
  }
}

export async function fetchFormations(params = {}) {
  try {
    const limit = params.limit ? parseInt(params.limit, 10) : 100;
    const offset = params.offset ? parseInt(params.offset, 10) : 0;
    
    const payload = {
      action: 'formations',
      q: String(params.q || '').trim(),
      ville: params.ville ? String(params.ville).trim() : undefined,
      codePostal: params.codePostal ? String(params.codePostal).trim() : undefined,
      type: params.type ? String(params.type).trim() : undefined,
      limit,
      offset
    };

    const data = await invokeParcoursup(payload);
    if (data.success === false) throw new Error(data.error || 'Erreur API Parcoursup');

    const results = Array.isArray(data.results) ? data.results.map(assignMockSector) : [];
    
    return {
      success: true,
      results,
      count: results.length,
      total: data.total ?? results.length,
      limit,
      offset
    };
  } catch (error) {
    console.error('fetchFormations error:', error);
    return { success: false, error: error.message, results: [], total: 0 };
  }
}

export async function getFormationById(id) {
  if (!id || typeof id !== 'string') return { success: false, error: 'Invalid ID format' };
  try {
    const payload = { action: 'formation_details', id: id };
    const data = await invokeParcoursup(payload);
    if (data && !data.error) return { ...data, ...assignMockSector(data) };
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}