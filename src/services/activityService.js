import { supabase } from '@/lib/customSupabaseClient';
import { TestHistoryService } from './testHistoryService';

const DIMENSION_LABELS = {
  tech: 'Compétences Tech',
  analytique: 'Esprit Analytique',
  communication: 'Communication',
  relationnel: 'Relationnel',
  leadership: 'Leadership',
  creativite: 'Créativité',
  rigueur: 'Rigueur & Organisation',
  marketing: 'Marketing',
  commerce: 'Négociation & Vente',
  gestion: 'Gestion'
};

export const activityService = {
  // Sync skills from latest test results if user_skills is empty
  async syncSkillsFromTestHistory(userId) {
    // 1. Check if skills exist
    const { data: existingSkills } = await supabase
      .from('user_skills')
      .select('id')
      .eq('user_id', userId);

    if (existingSkills && existingSkills.length > 0) return; // Already initialized

    // 2. Fetch latest test
    const history = await TestHistoryService.getUserHistory(userId);
    if (!history || history.length === 0) return;

    const latestTest = history[0];
    const dimensions = latestTest.results?.userVector?.dimensions || {};

    // 3. Transform to skills rows
    const skillsToInsert = Object.entries(dimensions)
      .filter(([key, val]) => DIMENSION_LABELS[key] && val > 0)
      .map(([key, val]) => ({
        user_id: userId,
        skill_name: DIMENSION_LABELS[key],
        level: val,
        last_updated: new Date()
      }));

    if (skillsToInsert.length > 0) {
      await supabase.from('user_skills').insert(skillsToInsert);
    }
  },

  async getActivities(userId) {
    // Sync first
    await this.syncSkillsFromTestHistory(userId);

    // Get all activities
    const { data: activities, error: actError } = await supabase
      .from('activities')
      .select(`
        *,
        category:activity_categories(name, icon, color)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (actError) throw actError;

    // Get user progress
    const { data: userActs, error: userError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId);

    if (userError) throw userError;

    return activities.map(act => {
      const userProgress = userActs.find(ua => ua.activity_id === act.id);
      return {
        ...act,
        status: userProgress ? userProgress.status : 'available',
        score: userProgress?.score || 0,
        user_activity_id: userProgress?.id
      };
    });
  },

  async getPersonalizedRecommendations(userId) {
    // 1. Get Skills
    const { data: skills } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    // 2. Get Activities
    const activities = await this.getActivities(userId);

    if (!skills || skills.length === 0) return activities.slice(0, 2);

    // 3. Find Weak Areas (Gap Analysis)
    const weakSkills = skills.filter(s => s.level < 50).map(s => s.skill_name);
    
    // 4. Recommend:
    // A) Activities matching weak skills (Development)
    // B) Activities matching strong skills but high difficulty (Challenge)
    
    const recommended = activities.filter(act => {
       if (act.status === 'completed') return false;
       
       // Check if activity rewards a weak skill
       const addressesWeakness = act.skills_rewarded?.some(s => weakSkills.some(ws => ws.includes(s)));
       if (addressesWeakness) return true;

       return false;
    });

    // Fallback if no specific recommendations
    return recommended.length > 0 ? recommended.slice(0, 3) : activities.slice(0, 3);
  },

  async getUserStats(userId) {
    const { data, error } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      const { data: newData, error: newError } = await supabase
        .from('user_gamification')
        .insert({ user_id: userId })
        .select()
        .single();
      if (newError) throw newError;
      return newData;
    }

    return data;
  },

  async getUserSkills(userId) {
    // Ensure sync happens before read
    await this.syncSkillsFromTestHistory(userId);

    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId)
      .order('level', { ascending: false }); // Show strongest first or handle in UI

    if (error) throw error;
    return data || [];
  },

  async startActivity(userId, activityId) {
    const { data, error } = await supabase
      .from('user_activities')
      .upsert({
        user_id: userId,
        activity_id: activityId,
        status: 'started',
        created_at: new Date()
      }, { onConflict: 'user_id, activity_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeActivity(userId, activityId, score = 100) {
    const { data: activity } = await supabase
      .from('activities')
      .select('xp_reward, skills_rewarded')
      .eq('id', activityId)
      .single();

    const { error: updateError } = await supabase
      .from('user_activities')
      .update({
        status: 'completed',
        score: score,
        completed_at: new Date()
      })
      .eq('user_id', userId)
      .eq('activity_id', activityId);

    if (updateError) throw updateError;

    // Award XP
    const { data: stats } = await this.getUserStats(userId);
    const newXP = (stats.total_xp || 0) + (activity.xp_reward || 0);
    
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = stats.last_activity_date;
    let newStreak = stats.current_streak;
    
    if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
        const isToday = lastDate.toISOString().split('T')[0] === today;
        
        if (isYesterday) newStreak += 1;
        else if (!isToday) newStreak = 1;
    } else {
        newStreak = 1;
    }

    await supabase
      .from('user_gamification')
      .update({
        total_xp: newXP,
        current_streak: newStreak,
        last_activity_date: today,
        updated_at: new Date()
      })
      .eq('user_id', userId);

    // Update Skills (Gamified Progress)
    if (activity.skills_rewarded && activity.skills_rewarded.length > 0) {
        for (const skill of activity.skills_rewarded) {
            // Find fuzzy match in user skills to update
            const { data: existing } = await supabase
                .from('user_skills')
                .select('*')
                .eq('user_id', userId)
                .ilike('skill_name', `%${skill}%`)
                .maybeSingle();

            if (existing) {
               await supabase
                .from('user_skills')
                .update({ level: Math.min(100, existing.level + 2) }) // +2% per activity
                .eq('id', existing.id);
            } else {
               // New skill learned
               await supabase
                .from('user_skills')
                .insert({ user_id: userId, skill_name: skill, level: 10 });
            }
        }
    }

    return { xpGained: activity.xp_reward };
  }
};