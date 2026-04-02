/**
 * Standardized Event Types for System Logging
 */
export const EVENT_TYPES = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_PROFILE_UPDATED: 'user_profile_updated',
  
  TEST_STARTED: 'test_started',
  TEST_COMPLETED: 'test_completed',
  TEST_ABANDONED: 'test_abandoned',
  
  PLAN_GENERATED: 'plan_generated',
  PLAN_VIEWED: 'plan_viewed',
  
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  
  SCHOOL_CREATED: 'school_created',
  SCHOOL_UPDATED: 'school_updated',
  SCHOOL_LICENSE_ACTIVATED: 'school_license_activated',
  SCHOOL_LICENSE_EXPIRED: 'school_license_expired',
  
  FORMATION_CREATED: 'formation_created',
  FORMATION_UPDATED: 'formation_updated',
  
  ERROR_OCCURRED: 'error_occurred',
  
  // Security Events
  PASSWORD_GENERATED: 'password_generated',
  PASSWORD_VALIDATED: 'password_validated',
  PASSWORD_CHANGED: 'password_changed'
};

/**
 * Example metadata structures for documentation and validation reference
 */
export const METADATA_EXAMPLES = {
  [EVENT_TYPES.USER_SIGNUP]: {
    email_domain: 'gmail.com',
    plan: 'free',
    source: 'web_app',
    referrer: 'google'
  },
  
  [EVENT_TYPES.TEST_COMPLETED]: {
    test_id: 'adaptive_orientation_v1',
    score: 85,
    duration_seconds: 420,
    completion_rate: 100,
    top_careers: ['dev', 'designer']
  },
  
  [EVENT_TYPES.PAYMENT_SUCCEEDED]: {
    provider: 'stripe',
    amount: 2999, // cents
    currency: 'eur',
    plan: 'premium_annual',
    transaction_id: 'ch_123456'
  },
  
  [EVENT_TYPES.PAYMENT_FAILED]: {
    provider: 'stripe',
    amount: 2999,
    currency: 'eur',
    reason: 'card_declined',
    error_code: 'insufficient_funds'
  },
  
  [EVENT_TYPES.SCHOOL_CREATED]: {
    school_name: 'Lycée Example',
    city: 'Paris',
    seats: 500,
    license_type: 'trial'
  },
  
  [EVENT_TYPES.ERROR_OCCURRED]: {
    component: 'SignupForm',
    error_message: 'Network timeout',
    stack_trace: '...'
  },
  
  [EVENT_TYPES.PASSWORD_CHANGED]: {
     action: 'password_regenerated',
     changed_by: 'user_id'
  }
};