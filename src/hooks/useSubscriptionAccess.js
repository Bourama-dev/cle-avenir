import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { TIER_ACCESS } from '@/constants/subscriptionTiers';

export function useSubscriptionAccess(trigger = 0) {
  const { user } = useAuth();
  const [tier, setTier] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchTier() {
      if (!user) {
        setTier('free');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid PGRST116

        if (mounted) {
          if (data?.subscription_tier) {
            setTier(data.subscription_tier);
          } else {
            setTier('free');
          }
        }
      } catch (err) {
        console.error('Error fetching subscription tier:', err);
        if (mounted) setTier('free');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTier();

    return () => { mounted = false; };
  }, [user, trigger]);

  const hasAccess = useCallback((feature) => {
    const allowedFeatures = TIER_ACCESS[tier] || [];
    return allowedFeatures.includes(feature);
  }, [tier]);

  return {
    currentTier: tier,
    isPremium: tier === 'premium' || tier === 'premium_plus',
    isPremiumPlus: tier === 'premium_plus',
    loading,
    hasAccess
  };
}