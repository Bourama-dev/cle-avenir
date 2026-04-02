import { supabase } from '@/lib/customSupabaseClient';

export const initialRomeMetiers = [
  {
    code: 'M1805',
    libelle: 'Études et développement informatique',
    description: 'Conçoit, développe et met au point un projet d\'application informatique...',
    salaire: '35000 - 55000 €',
    debouches: 'Excellents',
    niveau_etudes: 'Bac+3 à Bac+5',
    competencesMobilisees: [{ libelle: 'Développement web' }, { libelle: 'Programmation' }],
    contextesTravail: [{ libelle: 'Entreprise de services du numérique (ESN)' }],
    themes: [{ libelle: 'Informatique' }]
  },
  {
    code: 'M1810',
    libelle: 'Production et exploitation systèmes d\'information',
    description: 'Maintient en condition opérationnelle les systèmes d\'information...',
    salaire: '40000 - 65000 €',
    debouches: 'Très bons',
    niveau_etudes: 'Bac+5',
    competencesMobilisees: [{ libelle: 'Data Science' }, { libelle: 'Machine Learning' }],
    contextesTravail: [{ libelle: 'Grande entreprise' }],
    themes: [{ libelle: 'Data' }]
  },
  {
    code: 'M1403',
    libelle: 'Études et prospectives socio-économiques',
    description: 'Analyse les données socio-économiques pour orienter la stratégie...',
    salaire: '45000 - 70000 €',
    debouches: 'Bons',
    niveau_etudes: 'Bac+5',
    competencesMobilisees: [{ libelle: 'Analyse de données' }, { libelle: 'Stratégie' }],
    contextesTravail: [{ libelle: 'Cabinet de conseil' }],
    themes: [{ libelle: 'Stratégie' }]
  }
];

export async function populateRomeMetiers() {
  console.log('🚀 Starting rome_metiers population...');
  
  try {
    for (const metier of initialRomeMetiers) {
      const { error } = await supabase
        .from('rome_metiers')
        .upsert(metier, { onConflict: 'code' });
        
      if (error) {
        console.error(`❌ Error inserting ${metier.code}:`, error);
      } else {
        console.log(`✅ Successfully inserted/updated ${metier.code} - ${metier.libelle}`);
      }
    }
    
    console.log('🎉 Population completed!');
    return { success: true };
  } catch (err) {
    console.error('Population failed:', err);
    return { success: false, error: err };
  }
}