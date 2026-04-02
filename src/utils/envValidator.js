export const validateEnvironment = () => {
  console.log('[Environment] Validating environment variables...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missing.push('VITE_SUPABASE_ANON_KEY');
  
  if (missing.length > 0) {
    console.warn(`[Environment] Warning: Missing Supabase environment variables: ${missing.join(', ')}.`);
    console.warn('[Environment] App will fallback to localStorage for data persistence.');
    return false;
  }
  
  console.log('[Environment] Environment variables validated successfully.');
  return true;
};