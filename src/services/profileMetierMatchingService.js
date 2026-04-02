import { supabase } from '@/lib/customSupabaseClient';
import { validateMatchingInputs, validateMatchingOutputs } from '@/utils/metierMatchingValidator';

// Mappings for offline/fallback scoring
export const PROFILE_MAPPINGS = {
  "Créatif & Innovant": {
    sectors: ["Design", "Arts", "Communication", "Architecture", "Construction"],
    competencies: ["Créativité", "Innovation", "Adaptabilité", "Autonomie"],
    antiSectors: ["Logistique", "Transport", "Supply Chain", "Comptabilité"]
  },
  "Analytique & Tech": {
    sectors: ["IT", "Numérique", "Data", "Finance", "Ingénierie"],
    competencies: ["Analyse", "Résolution de problèmes", "Rigueur", "Logique"],
    antiSectors: ["Social", "Arts manuels"]
  },
  "Social & Humain": {
    sectors: ["Santé", "Social", "Éducation", "Ressources Humaines"],
    competencies: ["Empathie", "Communication", "Écoute", "Patience"],
    antiSectors: ["Industrie lourde", "IT pur"]
  },
  "Leader & Business": {
    sectors: ["Commerce", "Management", "Finance", "Marketing"],
    competencies: ["Leadership", "Négociation", "Stratégie", "Décision"],
    antiSectors: ["Recherche fondamentale", "Artisanat d'art"]
  },
  "Pragmatique & Terrain": {
    sectors: ["Construction", "Agriculture", "Logistique", "Environnement"],
    competencies: ["Pratique", "Résolution de problèmes", "Endurance"],
    antiSectors: ["Bureautique pure", "Finance"]
  },
  "Généraliste": {
    sectors: ["Services", "Administration", "Commerce"],
    competencies: ["Polyvalence", "Organisation", "Relationnel"],
    antiSectors: []
  },
  "Pragmatique & Polyvalent": {
    sectors: ["Services", "Administration", "Commerce"],
    competencies: ["Polyvalence", "Organisation", "Relationnel"],
    antiSectors: []
  }
};

export const matchProfileToMetiers = async (profileType, preferredSectors = [], keyCompetencies = []) => {
  validateMatchingInputs(profileType, preferredSectors, keyCompetencies);

  const safeProfileType = profileType || "Pragmatique & Polyvalent";
  const mappedSectors = preferredSectors.length > 0 ? preferredSectors : (PROFILE_MAPPINGS[safeProfileType]?.sectors || ["Services"]);
  const mappedCompetencies = keyCompetencies.length > 0 ? keyCompetencies : (PROFILE_MAPPINGS[safeProfileType]?.competencies || ["Autonomie"]);

  console.log(`[Matching] Attempting RPC get_profile_matched_metiers for ${safeProfileType}`);
  console.log(`[Matching] Params: sectors=${mappedSectors.join(',')}, comps=${mappedCompetencies.join(',')}`);

  try {
    const { data: rpcMatches, error } = await supabase.rpc('get_profile_matched_metiers', {
      p_profile_type: safeProfileType,
      p_sectors: mappedSectors,
      p_competencies: mappedCompetencies
    });

    if (error) {
      console.error("[Matching] ❌ Supabase RPC Error:", error.message, error.details, error.hint);
      throw error;
    }

    if (rpcMatches && rpcMatches.length > 0) {
      console.log(`[Matching] ✅ RPC returned ${rpcMatches.length} matches`);
      // Filter out anti-sectors if defined
      const antiSectors = PROFILE_MAPPINGS[safeProfileType]?.antiSectors || [];
      let finalMatches = rpcMatches;

      if (antiSectors.length > 0) {
        finalMatches = rpcMatches.filter(m => {
          const text = `${m.libelle} ${m.description}`.toLowerCase();
          return !antiSectors.some(anti => text.includes(anti.toLowerCase()));
        });
      }

      validateMatchingOutputs(safeProfileType, finalMatches);
      return { matches: finalMatches.slice(0, 10), debug: { source: 'rpc', count: finalMatches.length } };
    } else {
      console.warn("[Matching] ⚠️ RPC returned 0 results. Falling back to local JS matching.");
    }
  } catch (err) {
    console.error("[Matching] ❌ RPC matching failed, falling back to local JS matching:", err);
  }

  // Fallback to JS filtering if RPC fails or returns empty
  console.log("[Matching] 🔄 Starting Local JS Matching fallback...");
  const { data: allMetiers, error: fetchError } = await supabase.from('rome_metiers').select('*');
  
  if (fetchError) {
    console.error("[Matching] ❌ Failed to fetch rome_metiers for fallback:", fetchError);
    return { matches: [], debug: { source: 'error', error: fetchError.message } };
  }
  
  if (!allMetiers) return { matches: [], debug: { source: 'empty_db' } };

  const antiSectors = PROFILE_MAPPINGS[safeProfileType]?.antiSectors || [];

  const scoredMetiers = allMetiers.map(m => {
    let score = 40; // Base score
    // Case-sensitive exact keys for fallback
    const textData = `${m.libelle} ${m.description} ${JSON.stringify(m.themes)} ${JSON.stringify(m.divisionsNaf)} ${JSON.stringify(m.competencesMobilisees)} ${JSON.stringify(m.competencesMobiliseesPrincipales)}`.toLowerCase();

    // Check anti-sectors
    const hasAntiSector = antiSectors.some(anti => textData.includes(anti.toLowerCase()));
    if (hasAntiSector) return { ...m, match_score: 0 };

    // Score sectors
    mappedSectors.forEach(s => {
      if (textData.includes(s.toLowerCase())) score += 15;
    });

    // Score competencies
    mappedCompetencies.forEach(c => {
      if (textData.includes(c.toLowerCase())) score += 10;
    });

    return { ...m, match_score: Math.min(100, score) };
  });

  const validMatches = scoredMetiers
    .filter(m => m.match_score >= 50)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);

  validateMatchingOutputs(safeProfileType, validMatches);
  console.log(`[Matching] ✅ Local JS matching returned ${validMatches.length} matches`);
  return { matches: validMatches, debug: { source: 'local_js', count: validMatches.length } };
};