/**
 * Service to manage, classify and evaluate competencies (Hard/Soft Skills)
 */

const SOFT_SKILLS_DICT = [
  'autonomie', 'rigueur', 'travail en équipe', 'communication', 'leadership', 
  'créativité', 'gestion du stress', 'adaptation', 'curiosité', 'organisation',
  'empathie', 'résolution de problèmes', 'critique', 'pédagogie', 'écoute'
];

const HARD_SKILLS_DICT = [
  'javascript', 'python', 'react', 'sql', 'anglais', 'gestion de projet',
  'comptabilité', 'droit', 'mécanique', 'électronique', 'photoshop', 'excel',
  'ventes', 'négociation', 'soins infirmiers'
];

export const competenciesService = {
  /**
   * Classify a skill as 'savoir-être' (soft) or 'savoir-faire' (hard)
   */
  classifySkill(skillName) {
    if (!skillName) return 'unknown';
    const lower = skillName.toLowerCase().trim();
    
    if (SOFT_SKILLS_DICT.some(s => lower.includes(s))) return 'soft';
    return 'hard'; // Default to hard for specific technical terms
  },

  /**
   * Define mastery level based on context or user input
   * @param {string|number} input - Years of experience or self-rating (1-5)
   */
  defineMasteryLevel(input) {
    if (typeof input === 'string') {
      // Heuristic based on text
      const lower = input.toLowerCase();
      if (lower.includes('expert') || lower.includes('senior')) return 'Expert';
      if (lower.includes('confirmé') || lower.includes('intermédiaire')) return 'Intermédiaire';
      return 'Débutant';
    }
    
    // Numeric logic (years)
    const years = Number(input);
    if (years >= 5) return 'Expert';
    if (years >= 2) return 'Intermédiaire';
    return 'Débutant';
  },

  /**
   * Compare user skills with job requirements to calculate a match score
   */
  calculateSkillMatch(userSkills = [], jobSkills = []) {
    if (!jobSkills.length) return 100; // No requirements
    
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase().trim()));
    let matchCount = 0;
    
    jobSkills.forEach(skill => {
      // Direct match
      if (userSkillSet.has(skill.toLowerCase().trim())) {
        matchCount++;
      }
      // Partial match logic could go here
    });

    return Math.round((matchCount / jobSkills.length) * 100);
  }
};