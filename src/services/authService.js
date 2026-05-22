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
        .from('profiles')
        .upsert({
          id: authData.user.id,

          first_name: profileData.first_name,
          last_name: profileData.last_name,

          region: profileData.region,
          city: profileData.city,

          education_level: profileData.education_level,
          specialization: profileData.education_specialty,

          user_status: profileData.current_status,

          age_range: profileData.age
            ? `${profileData.age}-${profileData.age}`
            : null,

          interests: profileData.interests || [],

          // User preferences for job recommendations
          salary_range_min: profileData.salaryRange?.[0] || null,
          salary_range_max: profileData.salaryRange?.[1] || null,

          constraints: {
            selected: profileData.constraints || []
          },

          answers: {
            wants_long_studies: wantsLongStudiesBool
          },

          updated_at: new Date().toISOString()

        }, { onConflict: 'id' });

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
    // Step 1: Authenticate — only this can be a real login failure
    let authData;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      authData = data;
    } catch (error) {
      console.error("Login auth error:", error.message);
      return { data: null, error };
    }

    // Step 2: Fetch profile — failure here must NOT block the login
    let profileData = null;
    if (authData.user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        profileData = profile;
      } catch (profileError) {
        console.warn("Profile fetch failed after login (non-blocking):", profileError?.message);
      }
    }

    return { data: { session: authData.session, user: authData.user, profile: profileData }, error: null };
  },

  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId)
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

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          // 'select_account' lets returning users pick their account without
          // re-showing the full consent screen every time
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async completeGoogleProfile(userId, profileData) {
    try {
      let wantsLongStudiesBool = null;
      if (profileData.wants_long_studies === 'Oui' || profileData.wants_long_studies === true) wantsLongStudiesBool = true;
      else if (profileData.wants_long_studies === 'Non' || profileData.wants_long_studies === false) wantsLongStudiesBool = false;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          region: profileData.region,
          city: profileData.city,
          education_level: profileData.education_level,
          specialization: profileData.education_specialty,
          user_status: profileData.current_status,
          age_range: profileData.age ? `${profileData.age}-${profileData.age}` : null,
          interests: profileData.interests || [],
          salary_range_min: profileData.salaryRange?.[0] || null,
          salary_range_max: profileData.salaryRange?.[1] || null,
          constraints: { selected: profileData.constraints || [] },
          answers: { wants_long_studies: wantsLongStudiesBool },
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Complete Google profile error:', error.message);
      return { error };
    }
  },

  async createParentalConsentRequest(userId, parentEmail, childFirstName) {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error: insertError } = await supabase
        .from('parental_consent_requests')
        .insert({
          user_id: userId,
          parent_email: parentEmail,
          token,
          status: 'pending',
          expires_at: expiresAt,
        });

      if (insertError) throw insertError;

      await supabase
        .from('profiles')
        .update({ parental_consent_status: 'pending' })
        .eq('id', userId);

      // Send email — non-blocking, failure doesn't break signup
      supabase.functions.invoke('send-parental-consent', {
        body: { token, parentEmail, childFirstName },
      }).catch(err => console.warn('[authService] Parental consent email failed:', err));

      return { token, error: null };
    } catch (error) {
      console.error('Parental consent request error:', error.message);
      return { token: null, error };
    }
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