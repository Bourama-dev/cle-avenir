import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dppalhbzyglfesbiozsr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcGFsaGJ6eWdsZmVzYmlvenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTc4NjAsImV4cCI6MjA2ODIzMzg2MH0.VMG-9xtcX5WMPoBxrf2m_JALTLQHuDCjKHqAF8PNIHA';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
