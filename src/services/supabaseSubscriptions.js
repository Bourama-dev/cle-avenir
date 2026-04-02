import { supabase } from '@/lib/customSupabaseClient';

const TABLE = 'subscriptions';

const assertString = (v, name) => {
  if (typeof v !== 'string' || !v.trim()) throw new Error(`${name} invalide`);
};
const assertNumber = (v, name) => {
  if (typeof v !== 'number' || Number.isNaN(v)) throw new Error(`${name} invalide`);
};

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj?.[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

export class SubscriptionService {
  /**
   * IMPORTANT:
   * - On ne fait PAS confiance à data.email.
   * - On récupère l'email depuis la session Supabase.
   */
  static async createSubscription(data) {
    // Validation minimaliste
    assertString(data?.planName, 'planName');
    assertNumber(data?.amount, 'amount');
    assertString(data?.stripeSubscriptionId, 'stripeSubscriptionId');
    assertString(data?.stripeCustomerId, 'stripeCustomerId');

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    const userEmail = authData?.user?.email;
    if (!userEmail) throw new Error('Utilisateur non authentifié');

    const payload = {
      user_email: userEmail,
      plan_name: data.planName.trim(),
      amount: data.amount,
      status: 'active',
      stripe_subscription_id: data.stripeSubscriptionId.trim(),
      stripe_customer_id: data.stripeCustomerId.trim(),
      // created_at : laisse Postgres gérer (DEFAULT now())
    };

    const { data: rows, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .limit(1);

    if (error) throw error;
    if (!rows?.[0]) throw new Error("Création abonnement: aucune ligne retournée");

    return rows[0];
  }

  /**
   * Récupère les abonnements du user connecté par défaut
   * (si tu passes un email, on le vérifie contre la session)
   */
  static async getUserSubscriptions(email) {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const sessionEmail = authData?.user?.email;
      if (!sessionEmail) return [];

      // Si email fourni, on empêche de lire ceux des autres (sécurité client-side)
      const targetEmail = email?.trim() || sessionEmail;
      if (targetEmail !== sessionEmail) throw new Error('Accès interdit');

      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('user_email', targetEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération abonnements:', error);
      return [];
    }
  }

  /**
   * Annule un abonnement.
   * Idéalement: annulation Stripe côté serveur + webhook => update DB.
   */
  static async cancelSubscription(subscriptionId) {
    assertString(subscriptionId, 'subscriptionId');

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData?.user?.email) throw new Error('Utilisateur non authentifié');

    const { data: rows, error } = await supabase
      .from(TABLE)
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)
      .select()
      .limit(1);

    if (error) throw error;
    if (!rows?.[0]) throw new Error("Annulation: abonnement introuvable ou non autorisé");

    return rows[0];
  }

  /**
   * Update contrôlé: on whitelist ce qu'on accepte.
   */
  static async updateSubscription(subscriptionId, updates) {
    assertString(subscriptionId, 'subscriptionId');
    if (!updates || typeof updates !== 'object') throw new Error('updates invalide');

    // whitelist stricte
    const allowed = pick(updates, [
      'status',
      'plan_name',
      'amount',
      'stripe_subscription_id',
      'stripe_customer_id'
    ]);

    if (Object.keys(allowed).length === 0) {
      throw new Error('Aucun champ autorisé dans updates');
    }

    // validations simples
    if (allowed.status) assertString(allowed.status, 'status');
    if (allowed.plan_name) assertString(allowed.plan_name, 'plan_name');
    if (allowed.amount !== undefined) assertNumber(allowed.amount, 'amount');

    const { data: rows, error } = await supabase
      .from(TABLE)
      .update(allowed)
      .eq('id', subscriptionId)
      .select()
      .limit(1);

    if (error) throw error;
    if (!rows?.[0]) throw new Error("Mise à jour: abonnement introuvable ou non autorisé");

    return rows[0];
  }

  /**
   * ATTENTION:
   * Cette méthode doit être réservée à l'admin.
   * Sinon c'est une fuite massive de données.
   */
  static async getActiveSubscriptions() {
    try {
      // sécurité client-side minimale: check role via app_metadata/user_metadata si tu l’as
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const role =
        authData?.user?.app_metadata?.role ||
        authData?.user?.user_metadata?.role ||
        null;

      if (role !== 'admin') throw new Error('Admin requis');

      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération actifs:', error);
      return [];
    }
  }
}