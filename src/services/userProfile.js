/**
 * User Profile Service
 * Manages user profile data in localStorage and helper functions
 */

import { supabase } from '@/lib/customSupabaseClient';

const PROFILE_KEY = 'user_profile';

/**
 * Get the current user profile from localStorage
 * @returns {Object|null} User profile object or null if not found
 */
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
};

/**
 * Save user profile to localStorage
 * @param {Object} profile - User profile object to save
 */
export const saveUserProfile = (profile) => {
  try {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

/**
 * Clear user profile from localStorage
 */
export const clearUserProfile = () => {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing user profile:', error);
  }
};

/**
 * Check if user is admin
 * @param {Object} profile - User profile object
 * @returns {boolean} True if user is admin
 */
export const isUserAdmin = (profile) => {
  if (!profile) return false;
  return profile.role === 'admin';
};

/**
 * Get user full name
 * @param {Object} profile - User profile object
 * @returns {string} Full name or empty string
 */
export const getUserFullName = (profile) => {
  if (!profile) return '';
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  return profile.first_name || profile.last_name || '';
};

/**
 * Fetch user profile from Supabase with error handling
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
export const fetchUserProfileFromApi = async (userId) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile from API:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching profile:', err);
    return null;
  }
};