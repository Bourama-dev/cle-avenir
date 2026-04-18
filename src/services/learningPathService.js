import { supabase } from '@/lib/customSupabaseClient';
import { LOCAL_ACTIVITY_CATALOG } from '@/data/activityCatalog';

// Map RIASEC letters to skill domains to prioritize
const RIASEC_SKILL_MAP = {
  R: ['tech', 'rigueur'],           // Réaliste
  I: ['analytique', 'tech'],        // Investigateur
  A: ['creativite', 'communication'],// Artistique
  S: ['relationnel', 'communication', 'leadership'], // Social
  E: ['leadership', 'commerce'],    // Entrepreneur
  C: ['rigueur', 'gestion'],        // Conventionnel
};

// Map domains to activity skill_rewarded tags
const DOMAIN_TO_SKILL_TAGS = {
  tech: ['tech', 'analytique'],
  communication: ['communication', 'relationnel'],
  leadership: ['leadership', 'gestion'],
  commerce: ['commerce', 'marketing'],
  orientation: ['orientation', 'monde_pro', 'connaissance_soi'],
  creativity: ['creativite'],
  rigor: ['rigueur', 'gestion'],
};

export const learningPathService = {

  async generatePersonalizedPath(userId, userProfile) {
    try {
      // 1. Get all published activities
      const { data: allActivities, error } = await supabase
        .from('activities')
        .select('*, category:activity_categories(name, icon, color)')
        .eq('published', true)
        .order('xp_reward', { ascending: false });

      if (error) throw error;

      // 2. Get user's completed activities to exclude them
      const { data: userActivities } = await supabase
        .from('user_activities')
        .select('activity_id, status')
        .eq('user_id', userId);

      const completedIds = new Set(
        (userActivities || [])
          .filter(ua => ua.status === 'completed')
          .map(ua => ua.activity_id)
      );

      const available = allActivities.filter(a => !completedIds.has(a.id));

      // ── Supplement with local catalog if DB has < 10 activities ────────────────
      let workingSet = available;
      if (available.length < 10) {
        console.log('[learningPathService] DB has fewer than 10 activities — supplementing with local catalog');
        const localNotCompleted = LOCAL_ACTIVITY_CATALOG.filter(a => !completedIds.has(a.id));
        // Merge, DB activities take priority (same id would be from DB)
        const dbIds = new Set(available.map(a => a.id));
        const localOnly = localNotCompleted.filter(a => !dbIds.has(a.id));
        workingSet = [...available, ...localOnly];
      }

      // 3. Get user skills to detect gaps
      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId);

      const weakSkills = (userSkills || [])
        .filter(s => s.level < 50)
        .map(s => s.skill_name.toLowerCase());

      // 4. Build priority list based on RIASEC
      const riasecProfile = userProfile?.riasec_profile || userProfile?.test_results?.riasec || [];
      const priorityDomains = [];

      if (Array.isArray(riasecProfile)) {
        riasecProfile.forEach(letter => {
          const domains = RIASEC_SKILL_MAP[letter.toUpperCase()] || [];
          domains.forEach(d => { if (!priorityDomains.includes(d)) priorityDomains.push(d); });
        });
      }

      // 5. Score and sort activities
      const scored = workingSet.map(activity => {
        let score = 0;

        const skillTags = activity.skills_rewarded || [];

        // Boost if addresses weak skills
        if (weakSkills.length > 0) {
          const addressesWeakness = skillTags.some(tag =>
            weakSkills.some(ws => ws.includes(tag) || tag.includes(ws))
          );
          if (addressesWeakness) score += 40;
        }

        // Boost if aligned with RIASEC
        priorityDomains.forEach((domain, idx) => {
          if (skillTags.some(tag => tag.includes(domain))) {
            score += Math.max(30 - idx * 5, 5);
          }
        });

        // Boost beginner activities for users with few skills
        if (!userSkills || userSkills.length < 3) {
          if (activity.difficulty === 'Débutant') score += 20;
        }

        // Boost high-value activities
        score += Math.floor(activity.xp_reward / 10);

        return { ...activity, _score: score };
      });

      scored.sort((a, b) => b._score - a._score);

      // 6. Build path: first 3 beginner → then intermediate → then advanced
      const beginners = scored.filter(a => a.difficulty === 'Débutant').slice(0, 4);
      const intermediates = scored.filter(a => a.difficulty === 'Intermédiaire').slice(0, 4);
      const advanced = scored.filter(a => ['Avancé', 'Expert'].includes(a.difficulty)).slice(0, 2);

      const pathActivities = [...beginners, ...intermediates, ...advanced];
      const uniqueIds = [...new Set(pathActivities.map(a => a.id))];
      const finalPath = uniqueIds.map(id => pathActivities.find(a => a.id === id));

      // 7. Determine path metadata
      const targetJob = userProfile?.job_title || userProfile?.main_goal || 'Votre projet professionnel';
      const totalXP = finalPath.reduce((sum, a) => sum + (a.xp_reward || 0), 0);
      const totalMinutes = finalPath.reduce((sum, a) => sum + (a.duration_minutes || 0), 0);
      const estimatedWeeks = Math.ceil(totalMinutes / (15 * 5)); // 15 min/day, 5 days/week

      const pathTitle = riasecProfile.length > 0
        ? `Parcours personnalisé — Profil ${riasecProfile.slice(0, 2).join('')}`
        : `Parcours personnalisé — ${targetJob}`;

      // 8. Save path to DB
      const { data: savedPath, error: saveError } = await supabase
        .from('learning_paths')
        .upsert({
          user_id: userId,
          title: pathTitle,
          description: `Parcours généré automatiquement basé sur votre profil${riasecProfile.length > 0 ? ` RIASEC (${riasecProfile.join('')})` : ''} et vos compétences à développer.`,
          target_job: targetJob,
          riasec_profile: riasecProfile,
          activities_order: finalPath.map(a => a.id),
          total_xp: totalXP,
          estimated_weeks: estimatedWeeks,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (saveError) console.warn('[learningPathService] Save error:', saveError);

      return {
        success: true,
        path: savedPath,
        activities: finalPath,
        meta: { totalXP, totalMinutes, estimatedWeeks, pathTitle },
      };

    } catch (err) {
      console.error('[learningPathService] Error:', err);
      return { success: false, error: err.message, activities: [] };
    }
  },

  async getSavedPath(userId) {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  async getPathWithActivities(userId) {
    const path = await this.getSavedPath(userId);
    if (!path || !path.activities_order?.length) return null;

    const { data: activities } = await supabase
      .from('activities')
      .select('*, category:activity_categories(name, icon, color)')
      .in('id', path.activities_order);

    // Get progress
    const { data: userActivities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId);

    const orderedActivities = path.activities_order
      .map(id => {
        const act = (activities || []).find(a => a.id === id);
        if (!act) return null;
        const progress = (userActivities || []).find(ua => ua.activity_id === id);
        return { ...act, status: progress?.status || 'available', score: progress?.score || 0 };
      })
      .filter(Boolean);

    return { path, activities: orderedActivities };
  },
};
