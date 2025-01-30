import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { createClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'X-Data-Source': 'fluent-web',
    }
  },
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Query wrapper with error handling
export const safeQuery = async (query: Promise<any>) => {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data');
  }
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);