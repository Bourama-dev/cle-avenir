export const TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PREMIUM_PLUS: 'premium_plus'
};

export const TIER_NAMES = {
  [TIERS.FREE]: 'Découverte',
  [TIERS.PREMIUM]: 'Premium',
  [TIERS.PREMIUM_PLUS]: 'Premium+'
};

// Map Stripe Price IDs - Updated with likely new price IDs or placeholders if not provided, 
// but based on prompt I should ensure the UI reflects the price change regardless of the backend ID for now.
export const STRIPE_PRICES = {
  PREMIUM: 'price_1SdCxGLKwUP9TofOQHRacfQa',       // One-time payment (9.90€)
  PREMIUM_PLUS: 'price_1SdD0DLKwUP9TofOTw3qPFXl'  // Subscription (19.90€/mo)
};

export const STRIPE_MODES = {
  [TIERS.PREMIUM]: 'payment', 
  [TIERS.PREMIUM_PLUS]: 'subscription'
};

export const PRICE_MODES = {
  [STRIPE_PRICES.PREMIUM]: 'payment',
  [STRIPE_PRICES.PREMIUM_PLUS]: 'subscription'
};

export const FEATURES = {
  // Freemium (Visible)
  BASIC_TEST: 'basic_test',
  BASIC_RESULTS_VIEW: 'basic_results_view',
  JOB_LIST_VIEW: 'job_list_view',
  
  // Premium (Gated for Free)
  DETAILED_ANALYSIS: 'detailed_analysis',
  FULL_JOB_DETAILS: 'full_job_details',
  COMPATIBILITY_EXPLANATION: 'compatibility_explanation',
  FORMATION_DETAILS: 'formation_details',
  PDF_EXPORT: 'pdf_export',
  
  // Premium+ (Gated for Premium)
  FULL_ACTION_PLAN: 'full_action_plan',
  AI_COACH: 'ai_coach', // Cleo is AI_COACH
  MONTHLY_FOLLOWUP: 'monthly_followup',
  PRIORITY_SUPPORT: 'priority_support',
  HUMAN_CHECKIN: 'human_checkin'
};

export const TIER_ACCESS = {
  [TIERS.FREE]: [
    FEATURES.BASIC_TEST,
    FEATURES.BASIC_RESULTS_VIEW,
    FEATURES.JOB_LIST_VIEW
  ],
  [TIERS.PREMIUM]: [
    FEATURES.BASIC_TEST,
    FEATURES.BASIC_RESULTS_VIEW,
    FEATURES.JOB_LIST_VIEW,
    FEATURES.DETAILED_ANALYSIS,
    FEATURES.FULL_JOB_DETAILS,
    FEATURES.COMPATIBILITY_EXPLANATION,
    FEATURES.FORMATION_DETAILS,
    FEATURES.PDF_EXPORT
  ],
  [TIERS.PREMIUM_PLUS]: [
    FEATURES.BASIC_TEST,
    FEATURES.BASIC_RESULTS_VIEW,
    FEATURES.JOB_LIST_VIEW,
    FEATURES.DETAILED_ANALYSIS,
    FEATURES.FULL_JOB_DETAILS,
    FEATURES.COMPATIBILITY_EXPLANATION,
    FEATURES.FORMATION_DETAILS,
    FEATURES.PDF_EXPORT,
    FEATURES.FULL_ACTION_PLAN,
    FEATURES.AI_COACH,
    FEATURES.MONTHLY_FOLLOWUP,
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.HUMAN_CHECKIN
  ]
};