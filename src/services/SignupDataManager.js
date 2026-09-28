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
            role: 'user',
            // Read by the profile trigger when the profile row is created, so
            // the link survives signups that wait for email confirmation.
            establishment_code: formData.establishmentId ? formData.establishmentCode : null
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
        
        // The database links the establishment from its code
        // (profiles.establishment_id can't be set directly).
        institution_code: formData.establishmentId ? formData.establishmentCode : null,

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

      return { success: true, user: authData.user };
    } catch (error) {
      console.error("SignupDataManager Error:", error);
      return { success: false, error: error.message };
    }
  }
};