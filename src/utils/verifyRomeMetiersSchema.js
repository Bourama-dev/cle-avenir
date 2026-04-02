import { supabase } from '@/lib/customSupabaseClient';

/**
 * Script to verify the exact casing and columns of the rome_metiers table.
 * Can be run from browser console: window.verifyRomeSchema()
 */
export const verifyRomeSchema = async () => {
  console.log("🔍 Verifying rome_metiers schema...");
  try {
    const { data, error } = await supabase
      .from('rome_metiers')
      .select('*')
      .limit(1);

    if (error) {
      console.error("❌ Error fetching schema:", error);
      return;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log("✅ Actual columns in rome_metiers:");
      console.table(columns.map(col => ({ ColumnName: col })));
      
      // Specifically check problematic ones
      const targetCols = [
        'divisionsNaf', 'themes', 
        'competencesMobilisees', 'competencesMobiliseesPrincipales', 
        'competencesMobiliseesEmergentes', 'riasecMajeur', 'riasecMineur'
      ];
      
      console.log("🎯 Target Columns Check:");
      targetCols.forEach(col => {
        const exactMatch = columns.includes(col);
        const lowerMatch = columns.includes(col.toLowerCase());
        console.log(`- ${col}: ${exactMatch ? '✅ EXACT MATCH' : (lowerMatch ? '⚠️ LOWERCASE ONLY' : '❌ NOT FOUND')}`);
      });
    } else {
      console.warn("⚠️ No data found in rome_metiers table to verify schema.");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
};

// Expose to window for easy debugging
if (typeof window !== 'undefined') {
  window.verifyRomeSchema = verifyRomeSchema;
}