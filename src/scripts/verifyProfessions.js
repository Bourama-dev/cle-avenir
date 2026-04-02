import { supabase } from '@/lib/customSupabaseClient';

/**
 * Verification script to check that all professions were inserted correctly
 */
export async function verifyProfessionsTable() {
  console.log('🔍 Verifying rome_metiers table...\n');

  try {
    // 1. Check table exists and count records
    const { count, error: countError } = await supabase
      .from('rome_metiers')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error accessing rome_metiers table:', countError);
      return { success: false, error: countError };
    }

    console.log(`✅ rome_metiers table exists with ${count} records\n`);

    // 2. Fetch all professions with key fields
    const { data: professions, error: fetchError } = await supabase
      .from('rome_metiers')
      .select(`
        code,
        libelle,
        description,
        salaire,
        debouches,
        niveau_etudes,
        competencesMobiliseesPrincipales,
        themes,
        created_at
      `)
      .order('libelle')
      .limit(100);

    if (fetchError) {
      console.error('❌ Error fetching professions:', fetchError);
      return { success: false, error: fetchError };
    }

    // 3. Display all professions
    console.log('📊 PROFESSIONS DETAILS (Top 100):\n');
    professions.forEach((prof, index) => {
      console.log(`${index + 1}. ${prof.libelle}`);
      console.log(`   📋 Code ROME: ${prof.code}`);
      console.log(`   💰 Salaire: ${prof.salaire || 'N/A'}`);
      console.log(`   📈 Débouchés: ${prof.debouches || 'N/A'}`);
      console.log(`   🎓 Niveau: ${prof.niveau_etudes || 'N/A'}`);
      console.log(`   🏷️ Thèmes: ${Array.isArray(prof.themes) ? prof.themes.map(t=>t.libelle).join(', ') : 'N/A'}`);
      console.log(`   📅 Créé le: ${new Date(prof.created_at).toLocaleDateString('fr-FR')}`);
      console.log('');
    });

    // 4. Validate data integrity
    const issues = [];
    professions.forEach(prof => {
      if (!prof.libelle) issues.push(`${prof.code}: Missing libelle`);
      if (!prof.description) issues.push(`${prof.code}: Missing description`);
    });

    if (issues.length > 0) {
      console.warn('⚠️  Data integrity issues found:');
      issues.forEach(issue => console.warn(`   - ${issue}`));
      console.log('');
    } else {
      console.log('✅ All data integrity checks passed!\n');
    }

    return {
      success: true,
      count: count,
      professions,
      issues
    };

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
}

// Auto-run if executed directly
if (typeof window !== 'undefined' && window.location.search.includes('verifyProfessions=true')) {
  verifyProfessionsTable().then(result => {
    console.log(result.success ? "Verification success" : "Verification failed");
  });
}