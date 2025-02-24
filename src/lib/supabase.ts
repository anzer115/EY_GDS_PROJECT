import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your-project-url' || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  throw new Error(
    'Supabase configuration is missing or invalid.\n\n' +
    'Please click the "Connect to Supabase" button in the top right to set up your project.\n' +
    'This will automatically configure the necessary environment variables.'
  );
}

try {
  // Validate the URL before creating the client
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(
    'Invalid Supabase URL format.\n\n' +
    'Please click the "Connect to Supabase" button in the top right to set up your project correctly.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);