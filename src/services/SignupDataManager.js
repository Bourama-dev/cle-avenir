import { supabase } from '@/lib/customSupabaseClient';

export const SignupDataManager = {
  async createAccount(formData) {
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            role: 'user'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur lors de la création de l'utilisateur.");

      // 2. Prepare Profile Data
      const profileUpdates = {
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        region: formData.region,
        country: formData.country,
        professional_status: formData.status,
        education_level: formData.educationLevel,
        field_of_study: formData.fieldOfStudy,
        interests: formData.interests,
        skills: formData.skills,
        goals: formData.careerGoals,
        
        // Link establishment if found
        institution_id: formData.establishmentId || null,
        // Also save code for reference if needed
        institution_code: formData.establishmentCode || null,
        institution_name: formData.establishmentName || null,

        // Preferences in JSONB
        preferences: {
          work_mode: formData.workPreferences?.remote,
          work_pace: formData.workPreferences?.pace,
          salary_range: formData.salaryRange,
          relocation: formData.willingToRelocate,
          notifications: formData.communicationPreferences?.notifications
        },
        
        newsletter_subscribed: formData.communicationPreferences?.newsletter || false,
        data_consent: formData.termsAccepted,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      // 3. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', authData.user.id);

      if (profileError) {
        console.error("Profile update warning:", profileError);
      }

      // 4. Create User Institution Link (if code used)
      if (formData.establishmentId) {
        const { error: linkError } = await supabase
          .from('user_institution_links')
          .insert({
            user_id: authData.user.id,
            institution_id: formData.establishmentId,
            code_used: formData.establishmentCode || 'MANUAL'
          });
        
        if (linkError) console.error("Link creation warning:", linkError);
      }

      return { success: true, user: authData.user };
    } catch (error) {
      console.error("SignupDataManager Error:", error);
      return { success: false, error: error.message };
    }
  }
};