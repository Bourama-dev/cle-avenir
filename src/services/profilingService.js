import { supabase } from '@/lib/customSupabaseClient';

const ProfilingService = {
  // Calculate completion percentage with detailed breakdown
  calculateCompletion(profile) {
    if (!profile) return 0;
    
    const criteria = [
      { key: 'basic_info', weight: 15, check: () => profile.first_name && profile.location },
      { key: 'education', weight: 20, check: () => profile.education && Array.isArray(profile.education) && profile.education.length > 0 },
      { key: 'experience', weight: 20, check: () => profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0 },
      { key: 'main_goal', weight: 20, check: () => !!profile.main_goal },
      { key: 'skills', weight: 15, check: () => profile.skills && profile.skills.length > 0 },
      { key: 'constraints', weight: 10, check: () => profile.constraints && (profile.constraints.salary_expectations || profile.constraints.availability) }
    ];

    let score = 0;
    criteria.forEach(c => {
      if (c.check()) score += c.weight;
    });

    return Math.min(100, Math.round(score));
  },

  getMissingFields(profile) {
    if (!profile) return [];
    const missing = [];
    if (!profile.location) missing.push({ id: 'location', label: 'Localisation' });
    if (!profile.main_goal) missing.push({ id: 'main_goal', label: 'Objectif principal' });
    if (!profile.education || profile.education.length === 0) missing.push({ id: 'education', label: 'Formation' });
    if (!profile.experience || profile.experience.length === 0) missing.push({ id: 'experience', label: 'Expérience' });
    if (!profile.skills || profile.skills.length === 0) missing.push({ id: 'skills', label: 'Compétences' });
    if (!profile.constraints?.salary_expectations) missing.push({ id: 'salary', label: 'Salaire visé' });
    return missing;
  },

  // Save profile update with versioning
  async updateProfile(userId, updates, summary = "Mise à jour via Cléo") {
    // 1. Get current for snapshot (Optional optimization: pass current if available to save 1 read)
    const { data: current } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    // Merge array logic for skills/interests (Append instead of overwrite if requested)
    let finalUpdates = { ...updates };
    
    if (updates.skills && current?.skills) {
      // Append new skills, unique only
      const newSkills = [...new Set([...(current.skills || []), ...updates.skills])];
      finalUpdates.skills = newSkills;
    }

    if (updates.interests && current?.interests) {
      const newInterests = [...new Set([...(current.interests || []), ...updates.interests])];
      finalUpdates.interests = newInterests;
    }

    // Merge constraints
    if (updates.constraints && current?.constraints) {
      finalUpdates.constraints = { ...current.constraints, ...updates.constraints };
    }

    // 2. Save version history
    if (current) {
      await supabase.from('profile_versions').insert({
        user_id: userId,
        profile_snapshot: current,
        change_summary: summary
      });
    }

    // 3. Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...finalUpdates, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // 4. Also store in cleo_memories for semantic search retrieval later
    if (summary !== "Mise à jour manuelle") {
      await supabase.from('cleo_memories').insert({
        user_id: userId,
        category: 'profile_enrichment',
        content: `Mise à jour du profil: ${JSON.stringify(updates)}`,
        importance: 3
      });
    }

    return data;
  },

  determineProfile(userVector) {
    // Basic logic to determine a profile based on dominant dimension
    // This prevents the "undefined" error by ensuring all fields exist
    
    let dominantTrait = 'Explorateur';
    
    if (userVector && userVector.dimensions) {
        // Sort dimensions by value descending
        const sorted = Object.entries(userVector.dimensions).sort(([,a], [,b]) => b - a);
        if (sorted.length > 0) {
            dominantTrait = sorted[0][0]; // e.g. 'creative', 'tech'
        }
    }

    // Simple mapping for fallback/default profiles
    // In a full implementation, this would come from a database or richer config
    const profiles = {
        creative: { 
            title: "Créatif", 
            emoji: "🎨", 
            desc: "Vous avez besoin d'exprimer vos idées et d'innover.", 
            strengths: ["Imagination", "Originalité", "Esthétique"], 
            weaknesses: ["Perfectionnisme", "Sensibilité à la critique"] 
        },
        tech: { 
            title: "Technophile", 
            emoji: "💻", 
            desc: "Vous êtes à l'aise avec les outils numériques et la logique.", 
            strengths: ["Logique", "Résolution de problèmes", "Curiosité technique"], 
            weaknesses: ["Communication parfois complexe", "Focalisation sur les détails"] 
        },
        social: { 
            title: "Social", 
            emoji: "🤝", 
            desc: "Le contact humain et l'entraide sont vos moteurs.", 
            strengths: ["Empathie", "Communication", "Esprit d'équipe"], 
            weaknesses: ["Difficulté à dire non", "Sensibilité émotionnelle"] 
        },
        analytique: { 
            title: "Analyste", 
            emoji: "📊", 
            desc: "Vous aimez comprendre, décortiquer et organiser.", 
            strengths: ["Rigueur", "Organisation", "Logique"], 
            weaknesses: ["Sur-analyse", "Prise de décision lente"] 
        },
        leadership: { 
            title: "Leader", 
            emoji: "🦁", 
            desc: "Vous aimez guider, décider et prendre des responsabilités.", 
            strengths: ["Prise de décision", "Vision", "Charisme"], 
            weaknesses: ["Impatience", "Délégation difficile"] 
        },
        // Default
        explorateur: { 
            title: "Explorateur", 
            emoji: "🧭", 
            desc: "Vous avez un profil polyvalent et curieux, ouvert à tout.", 
            strengths: ["Adaptabilité", "Curiosité", "Polyvalence"], 
            weaknesses: ["Indécision", "Dispersion", "Manque de spécialisation"] 
        }
    };

    // Normalize key to match map
    const key = (dominantTrait || 'explorateur').toLowerCase();
    // Fallback to 'explorateur' if key not found
    const profileInfo = profiles[key] || profiles['explorateur'];

    return { 
      primaryProfile: { 
        title: profileInfo.title, 
        percentage: 100,
        emoji: profileInfo.emoji,
        subtitle: "Votre profil dominant",
        description: profileInfo.desc,
        // CRITICAL FIX: Ensure arrays are always present
        strengths: profileInfo.strengths || ["Polyvalence", "Curiosité", "Adaptabilité"],
        weaknesses: profileInfo.weaknesses || ["Indécision", "Dispersion"]
      } 
    };
  }
};

export { ProfilingService, ProfilingService as profilingService };