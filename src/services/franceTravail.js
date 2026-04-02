import { supabase } from '@/lib/customSupabaseClient';
import { SECTORS } from '@/constants/sectors';

/**
 * Helper to assign a random or mapped sector if none exists
 */
function assignMockSector(item) {
  if (item.sector) return item;
  // Mock assignment based on string matching or random
  const title = String(item.intitule || item.libelle_formation || '').toLowerCase();
  let matchedSector = SECTORS[Math.floor(Math.random() * SECTORS.length)].id;
  
  for (const s of SECTORS) {
    if (title.includes(s.name.toLowerCase().split(' ')[0])) {
      matchedSector = s.id;
      break;
    }
  }
  return { ...item, sector: matchedSector };
}

/**
 * Fetch jobs from France Travail API (via Edge Function)
 */
export async function searchJobs(params = {}) {
  try {
    const payload = {
      action: 'search_jobs',
      query: params.query || '',
      location: params.location || '',
      distance: params.distance || 10,
      contractType: params.contractType,
      experience: params.experience,
      limit: params.limit || 20,
      offset: params.offset || 0
    };

    const { data, error } = await supabase.functions.invoke('france-travail-api', { body: payload });

    if (error) throw new Error(error.message || 'Erreur lors de la recherche d\'emploi');
    
    return {
      success: true,
      results: (data.results || []).map(assignMockSector),
      total: data.total || 0
    };
  } catch (error) {
    console.error('France Travail Job Search Error:', error);
    return { success: false, error: error.message, results: [] };
  }
}

/**
 * Get specific job details
 */
export async function getJobDetails(id) {
  if (!id) return { success: false, error: 'ID manquant' };
  try {
    const { data, error } = await supabase.functions.invoke('get-job-details', { body: { jobId: id } });
    if (error) throw new Error("Service momentanément indisponible");
    if (data.error) throw new Error(data.error === 'Job not found' ? "Offre introuvable ou expirée" : data.error);
    return { success: true, data: assignMockSector(data) };
  } catch (error) {
    return { success: false, error: error.message || "Impossible de charger l'offre" };
  }
}

/**
 * Fetch formations (via generic API gateway)
 */
export async function fetchFormations(params = {}) {
  try {
    const limit = Math.min(Math.max(parseInt(params.limit, 10) || 20, 1), 100);
    const offset = Math.max(parseInt(params.offset, 10) || 0, 0);

    const payload = {
      action: 'formations',
      q: String(params.q || '').trim(),
      ville: params.ville ? String(params.ville).trim() : undefined,
      codePostal: params.codePostal ? String(params.codePostal).trim() : undefined,
      limit,
      offset
    };

    const { data, error } = await supabase.functions.invoke('france-travail-api', { body: payload });

    if (error) throw new Error(error.message || 'Erreur Supabase Functions');
    if (!data) throw new Error('Réponse invalide');

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
    console.error('France Travail Service Error:', error);
    return { success: false, error: error.message, results: [], total: 0 };
  }
}

export async function getFormationById(id) {
  if (!id || typeof id !== 'string') return { success: false, error: 'Invalid ID format' };
  try {
    const payload = { action: 'formation_details', id: id };
    const { data, error } = await supabase.functions.invoke('france-travail-api', { body: payload });
    if (error) throw error;
    return { success: true, data: assignMockSector(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}