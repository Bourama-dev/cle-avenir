/**
 * User Profile Service
 * Retrieves user preferences (education, salary, status, etc.) for smarter job recommendations
 */

import { supabase } from '@/lib/customSupabaseClient';

export const userProfileService = {
  /**
   * Fetch current user profile with all preferences
   */
  async getCurrentUserProfile() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.warn('No authenticated user found');
        return null;
      }

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn('Error fetching profile:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  },

  /**
   * Get user constraints/criteria for filtering métiers
   * Returns: { education_level, salary_min, salary_max, current_status, constraints }
   */
  async getUserRecommendationCriteria() {
    const profile = await this.getCurrentUserProfile();

    if (!profile) {
      return {
        education_level: null,
        salary_min: null,
        salary_max: null,
        current_status: null,
        constraints: [],
        found: false,
      };
    }

    return {
      education_level: profile.education_level,
      salary_min: profile.salary_range_min,
      salary_max: profile.salary_range_max,
      current_status: profile.user_status,
      constraints: profile.constraints?.selected || [],
      found: true,
      full_profile: profile,
    };
  },

  /**
   * Check if a métier matches user criteria
   * Returns matching score (0-1) and reason
   */
  matchMetierToCriteria(metier, criteria) {
    if (!criteria || !criteria.found) {
      return { match: true, score: 1.0, reason: 'No user criteria to filter' };
    }

    let score = 1.0;
    const issues = [];

    // 1. Check education level compatibility
    if (criteria.education_level) {
      const userEdLevel = this._normalizeEducationLevel(criteria.education_level);
      const metierEdLevel = this._normalizeEducationLevel(metier.niveau_etudes);

      // If user has lower education than required, it's a mismatch
      if (userEdLevel < metierEdLevel) {
        score *= 0.5; // Significant penalty
        issues.push(`Requires ${metier.niveau_etudes} (you have ${criteria.education_level})`);
      }
    }

    // 2. Check salary compatibility
    if (criteria.salary_min && criteria.salary_max) {
      const metierSalary = this._extractSalaryRange(metier.salaire);

      if (metierSalary) {
        const [metierMin, metierMax] = metierSalary;
        const [userMin, userMax] = [criteria.salary_min, criteria.salary_max];

        // If métier salary is significantly higher than user expectation
        if (metierMin > userMax * 1.5) {
          score *= 0.8; // Minor penalty
          issues.push(`Salary too high (${metierMin}k€+ vs your ${userMax}k€ max)`);
        }

        // If métier salary is significantly lower than user expectation
        if (metierMax < userMin * 0.8) {
          score *= 0.7; // Penalty
          issues.push(`Salary too low (${metierMax}k€ max vs your ${userMin}k€ min)`);
        }
      }
    }

    // 3. Check current status and career transition logic
    if (criteria.current_status) {
      const status = criteria.current_status.toLowerCase();

      if (status.includes('étudiant') && metier.niveau_etudes === 'Doctorat') {
        // Student can't reach doctorat-level jobs immediately
        score *= 0.7;
        issues.push('Student - Doctorat jobs require long studies');
      }

      if (status.includes('chômeur') && metier.niveau_etudes && !this._canAchieveEducation(metier.niveau_etudes, criteria.education_level)) {
        // Unemployed person can't easily achieve high education requirements
        score *= 0.6;
        issues.push('Your education doesn\'t match requirement');
      }
    }

    return {
      match: score > 0.5, // If score > 50%, it's still a valid match
      score,
      issues,
      reason: issues.length > 0 ? issues.join('; ') : 'Perfect match for your criteria',
    };
  },

  /**
   * Normalize education levels to comparable scale
   * Returns: 1 (Bac), 2 (Bac+1/2), 3 (Bac+3), 4 (Master/Bac+5), 5 (Doctorat)
   */
  _normalizeEducationLevel(level) {
    if (!level) return 0;

    const normalized = level.toLowerCase();

    if (normalized.includes('bac') && !normalized.includes('+')) return 1;
    if (normalized.includes('bac+1') || normalized.includes('bac+2')) return 2;
    if (normalized.includes('bac+3') || normalized.includes('licence')) return 3;
    if (normalized.includes('master') || normalized.includes('bac+5')) return 4;
    if (normalized.includes('doctorat') || normalized.includes('phd')) return 5;

    return 1; // Default to Bac equivalent
  },

  /**
   * Extract salary range from métier salary string
   * E.g. "28 000 - 35 000 €" → [28, 35]
   */
  _extractSalaryRange(salaryStr) {
    if (!salaryStr) return null;

    const match = salaryStr.match(/(\d+)\s*(?:000)?\s*-\s*(\d+)\s*(?:000)?/);
    if (!match) return null;

    let min = parseInt(match[1]);
    let max = parseInt(match[2]);

    // Normalize if values are like "28" instead of "28000"
    if (min < 100) min *= 1000;
    if (max < 100) max *= 1000;

    return [min / 1000, max / 1000]; // Return in k€
  },

  /**
   * Check if user education level can achieve required level
   * Through further studies
   */
  _canAchieveEducation(requiredLevel, currentLevel) {
    const required = this._normalizeEducationLevel(requiredLevel);
    const current = this._normalizeEducationLevel(currentLevel);

    // Can always study further
    return true;
  },
};
