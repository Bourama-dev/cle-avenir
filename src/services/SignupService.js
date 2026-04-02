import { supabase } from '@/lib/customSupabaseClient';

export const SignupService = {
  checkEmailExists: async (email) => {
    // We rely on auth provider error
    return false; 
  },

  getInterests: async () => {
    const { data, error } = await supabase
      .from('interests')
      .select('id, name, description')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  registerUser: async (formData) => {
    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          role: 'individual',
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Erreur lors de la création du compte.");

    const userId = authData.user.id;

    // 2. Update Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        role: formData.role, 
        education_level: formData.education_level,
        sector: formData.sector,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        region: formData.region,
        interests: formData.interests, 
        primary_objective: formData.primary_objective,
        data_consent: formData.data_consent,
        marketing_consent: formData.marketing_consent,
        establishment_id: formData.establishment?.id || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) throw new Error("Erreur lors de la sauvegarde du profil.");

    // 3. Insert User Interests
    if (formData.interests && formData.interests.length > 0) {
      const interestsToInsert = formData.interests.map(interestId => ({
        user_id: userId,
        interest_id: interestId
      }));

      await supabase.from('user_interests').insert(interestsToInsert);
    }

    // 4. Link Establishment
    if (formData.establishment?.id) {
       await supabase.from('establishment_users').insert([{
           establishment_id: formData.establishment.id,
           user_id: userId,
           role: formData.role === 'student' ? 'student' : 'member', 
           status: 'active',
           joined_at: new Date().toISOString()
        }]);
    }

    // 5. Save Diplomas (New)
    if (formData.diplomas && formData.diplomas.length > 0) {
       const userDiplomas = formData.diplomas.map(d => ({
          user_id: userId,
          diploma_id: d.id,
          status: d.status || 'obtained',
          obtained_date: new Date().toISOString() // Default to today or handle properly
       }));
       await supabase.from('user_diplomas').insert(userDiplomas);
    }

    // 6. Save Diploma Goals (New)
    if (formData.diplomaGoals && formData.diplomaGoals.length > 0) {
       const userGoals = formData.diplomaGoals.map(g => ({
          user_id: userId,
          diploma_id: g.id,
          target_date: g.targetDate,
          priority: g.priority || 'medium'
       }));
       await supabase.from('user_diploma_goals').insert(userGoals);
    }

    return authData;
  }
};