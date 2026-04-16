import { supabase } from '@/lib/customSupabaseClient';

/**
 * planService — CRUD for personalized_plans table.
 *
 * Supabase is the primary storage. localStorage is used as a transparent
 * read-through fallback if Supabase returns an error (e.g. RLS, network).
 */

const LS_KEY = 'mock_personalized_plans';

const lsGet = (userId) => {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return all[userId] || null;
  } catch { return null; }
};

const lsSet = (userId, plan) => {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[userId] = plan;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch { /* ignore quota errors */ }
};

const lsDel = (userId) => {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    delete all[userId];
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
};

export const planService = {
  /* ── Create ─────────────────────────────────────────────────────────── */
  async createPlan(userId, planData) {
    try {
      const payload = {
        user_id:             userId,
        riasec_profile:      planData.riasec_profile      || {},
        recommended_metiers: planData.recommended_metiers || [],
        selected_metiers:    planData.selected_metiers    || [],
        selected_formations: planData.selected_formations || [],
        test_score:          planData.test_score          || 0,
      };

      const { data, error } = await supabase
        .from('personalized_plans')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.warn('[planService] Supabase insert failed, using localStorage:', error.message);
        const plan = { id: Date.now().toString(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        lsSet(userId, plan);
        return plan;
      }

      lsSet(userId, data); // keep LS in sync
      return data;
    } catch (err) {
      console.error('[planService] createPlan error:', err);
      throw new Error('Impossible de créer le plan.');
    }
  },

  /* ── Read ────────────────────────────────────────────────────────────── */
  async getPlanByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[planService] Supabase read failed, using localStorage:', error.message);
        return lsGet(userId);
      }

      if (data) {
        lsSet(userId, data); // keep LS in sync
        return data;
      }

      // Nothing in Supabase — try localStorage (offline / new device)
      return lsGet(userId);
    } catch (err) {
      console.error('[planService] getPlanByUserId error:', err);
      return lsGet(userId);
    }
  },

  /* ── Update ──────────────────────────────────────────────────────────── */
  async updatePlan(userId, planData) {
    try {
      const updatePayload = {
        ...planData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('personalized_plans')
        .update(updatePayload)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.warn('[planService] Supabase update failed, using localStorage:', error.message);
        const current = lsGet(userId) || {};
        const updated = { ...current, ...updatePayload };
        lsSet(userId, updated);
        return updated;
      }

      lsSet(userId, data);
      return data;
    } catch (err) {
      console.error('[planService] updatePlan error:', err);
      throw new Error('Impossible de mettre à jour le plan.');
    }
  },

  /* ── Delete ──────────────────────────────────────────────────────────── */
  async deletePlan(userId) {
    try {
      const { error } = await supabase
        .from('personalized_plans')
        .delete()
        .eq('user_id', userId);

      if (error) console.warn('[planService] Supabase delete failed:', error.message);
      lsDel(userId);
      return true;
    } catch (err) {
      console.error('[planService] deletePlan error:', err);
      lsDel(userId);
      return true;
    }
  },

  /* ── Compatibility score ─────────────────────────────────────────────── */
  /**
   * Computes a RIASEC-based compatibility score (0-100) between a user
   * profile and a metier's RIASEC weights.
   *
   * Formula: weighted dot-product normalised to 100.
   */
  calculateCompatibilityScore(userRiasec, metierRiasec) {
    if (!userRiasec || !metierRiasec) return 75;
    let score = 0;
    let maxPossible = 0;

    for (const [dim, weight] of Object.entries(metierRiasec)) {
      const w = Number(weight) || 0;
      const userVal = Number(userRiasec[dim.toUpperCase()]) || 0;
      score += (userVal / 100) * w;
      maxPossible += w;
    }

    return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 75;
  },
};
