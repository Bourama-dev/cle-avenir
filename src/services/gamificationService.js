import { supabase } from '@/lib/customSupabaseClient';

export const gamificationService = {
  // Get or create user profile
  async getUserProfile(userId) {
    try {
      let { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        return await this.createUserProfile(userId);
      }
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gamification profile:', error);
      return null;
    }
  },

  async createUserProfile(userId) {
    const defaultProfile = {
      user_id: userId,
      level: 1,
      xp: 0,
      xp_next_level: 100,
      total_xp: 0,
      current_streak: 1,
      last_activity_date: new Date().toISOString().split('T')[0],
      badges: [],
      skills: {
        orientation: 0,
        recherche: 0,
        connaissance_soi: 0
      }
    };

    const { data, error } = await supabase
      .from('user_gamification')
      .insert(defaultProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating gamification profile:', error);
      return null;
    }
    return data;
  },

  // Add XP and handle level up
  async addXP(userId, amount, skillType = 'orientation') {
    const profile = await this.getUserProfile(userId);
    if (!profile) return null;

    let { level, xp, xp_next_level, total_xp, skills } = profile;
    
    xp += amount;
    total_xp += amount;
    
    // Update specific skill
    if (skills && skills[skillType] !== undefined) {
      skills[skillType] += amount;
    } else {
      if (!skills) skills = {};
      skills[skillType] = amount;
    }

    // Level up logic
    let leveledUp = false;
    while (xp >= xp_next_level) {
      xp -= xp_next_level;
      level++;
      xp_next_level = Math.floor(xp_next_level * 1.5);
      leveledUp = true;
    }

    const { data, error } = await supabase
      .from('user_gamification')
      .update({ level, xp, xp_next_level, total_xp, skills, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { ...data, leveledUp };
  },

  // Update daily streak
  async updateStreak(userId) {
    const profile = await this.getUserProfile(userId);
    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    // Check if activity was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = profile.current_streak;

    if (lastActivity === today) {
      // Already active today, do nothing
      return;
    } else if (lastActivity === yesterdayStr) {
      // Consecutive day
      newStreak++;
    } else {
      // Streak broken
      newStreak = 1;
    }

    await supabase
      .from('user_gamification')
      .update({ 
        current_streak: newStreak, 
        last_activity_date: today,
        updated_at: new Date()
      })
      .eq('user_id', userId);
  },

  // Add a badge
  async addBadge(userId, badgeId) {
    const profile = await this.getUserProfile(userId);
    if (!profile) return;

    const badges = profile.badges || [];
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      
      await supabase
        .from('user_gamification')
        .update({ badges, updated_at: new Date() })
        .eq('user_id', userId);
        
      return true; // Badge added
    }
    return false; // Already has badge
  },

  // Log an activity
  async logActivity(userId, type, xpEarned, metadata = {}) {
    await supabase.from('user_activities').insert({
      user_id: userId,
      type,
      xp_earned: xpEarned,
      metadata
    });

    // Automatically update streak
    await this.updateStreak(userId);
  }
};