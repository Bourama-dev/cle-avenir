/**
 * Service to handle data export logic
 */
export const PrivacyExportService = {
  /**
   * Generates a structured JSON export of user data
   * In a real backend environment, this would be a stream or a background job.
   * Here we simulate aggregating data from various tables.
   */
  async generateUserDataExport(userId, userProfile, supabaseClient) {
    try {
      // 1. Fetch Test History
      const { data: testHistory } = await supabaseClient
        .from('test_results')
        .select('*')
        .eq('user_id', userId);

      // 2. Fetch Saved Items
      const { data: savedJobs } = await supabaseClient
        .from('saved_jobs')
        .select('*')
        .eq('user_id', userId);
        
      const { data: savedFormations } = await supabaseClient
        .from('saved_formations')
        .select('*')
        .eq('user_id', userId);

      // 3. Fetch Consent Logs
      const { data: consents } = await supabaseClient
        .from('consent_logs')
        .select('*')
        .eq('user_id', userId);

      // Construct the export object
      const exportData = {
        metadata: {
          export_date: new Date().toISOString(),
          requested_by: userId,
          platform: "CléAvenir",
          version: "1.0",
          compliance: "GDPR/RGPD Article 20"
        },
        profile: {
          ...userProfile,
          // Exclude sensitive internal fields if any
        },
        activity: {
          test_results: testHistory || [],
          saved_jobs: savedJobs || [],
          saved_formations: savedFormations || []
        },
        consents: consents || []
      };

      return exportData;
    } catch (error) {
      console.error("Export generation failed:", error);
      throw new Error("Failed to generate data export");
    }
  },

  /**
   * Triggers a download of the JSON file in the browser
   */
  downloadJSON(data, filename = 'cleavenir-data-export.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};