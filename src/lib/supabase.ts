import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vonldovtaxdsazzeapdu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbmxkb3Z0YXhkc2F6emVhcGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYwMzUsImV4cCI6MjA5MTYwMjAzNX0.X_lQRPPmFosIUJA_7TUI4jMnuoIn6BSPZQeDNX3d3lA';

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
