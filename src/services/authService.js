import { supabase } from '@/lib/customSupabaseClient';

export const AuthService = {
  async signup(email, password, profileData) {
    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: profileData.first_name,
            last_name: profileData.last_name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from signup");

      // Handle boolean conversion for wants_long_studies
      let wantsLongStudiesBool = null;
      if (profileData.wants_long_studies === 'Oui' || profileData.wants_long_studies === true) wantsLongStudiesBool = true;
      else if (profileData.wants_long_studies === 'Non' || profileData.wants_long_studies === false) wantsLongStudiesBool = false;

      // 2. Save profile to user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: authData.user.id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          age: profileData.age ? parseInt(profileData.age, 10) : null,
          region: profileData.region,
          city: profileData.city,
          education_level: profileData.education_level,
          education_specialty: profileData.education_specialty,
          current_status: profileData.current_status,
          wants_long_studies: wantsLongStudiesBool,
          interests: profileData.interests || [],
          constraints: profileData.constraints || [],
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // We throw here to ensure the caller knows the profile failed, even if auth succeeded
        throw new Error(`Account created, but profile save failed: ${profileError.message}`);
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error("Signup error:", error.message);
      return { data: null, error };
    }
  },

  async login(email, password) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch profile
      let profileData = null;
      if (authData.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();
        profileData = profile;
      }

      return { data: { session: authData.session, user: authData.user, profile: profileData }, error: null };
    } catch (error) {
      console.error("Login error:", error.message);
      return { data: null, error };
    }
  },

  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, age, region, city, education_level, education_specialty, current_status, wants_long_studies, interests, constraints')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Get profile error:", error.message);
      return { data: null, error };
    }
  },

  async updateProfile(userId, profileData) {
    try {
      // Handle boolean conversion for wants_long_studies
      let wantsLongStudiesBool = null;
      if (profileData.wants_long_studies === 'Oui' || profileData.wants_long_studies === true) wantsLongStudiesBool = true;
      else if (profileData.wants_long_studies === 'Non' || profileData.wants_long_studies === false) wantsLongStudiesBool = false;

      const updatePayload = {
        ...profileData,
        wants_long_studies: wantsLongStudiesBool,
        updated_at: new Date().toISOString()
      };

      // Ensure age is integer if provided
      if (updatePayload.age) {
        updatePayload.age = parseInt(updatePayload.age, 10);
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Update profile error:", error.message);
      return { data: null, error };
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error", err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userSession');
      localStorage.removeItem('temp_test_answers');
      localStorage.removeItem('temp_test_scores');
    }
    return { success: true };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};