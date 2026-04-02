import { supabase } from '@/lib/customSupabaseClient';

/**
 * Validates if a specific column exists in a table.
 * Helpful for avoiding unhandled errors when migrating schema.
 */
export const checkColumnExists = async (table, column) => {
  try {
    const { error } = await supabase.from(table).select(column).limit(1);
    
    // PGRST204 is PostgREST's error code for "Could not find the column"
    if (error && error.code === 'PGRST204') {
      return false;
    }
    
    // If there's another error (like table missing), we might want to log it, 
    // but for column existence check, we assume it's true unless we get PGRST204
    if (error && error.code !== 'PGRST116') { // Ignore zero rows returned
       console.warn(`Unexpected error checking column ${column} on ${table}:`, error);
    }
    
    return true;
  } catch (err) {
    console.error(`Error validating schema for ${table}.${column}:`, err);
    return false;
  }
};