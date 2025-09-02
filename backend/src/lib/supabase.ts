import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_API_KEY) {
  throw new Error('Missing SUPABASE_API_KEY environment variable');
}

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token'
  },
  db: {
    schema: 'public'
  }
});

// Export typed helpers
export type SupabaseClient = typeof supabase;
export type Tables = Database['public']['Tables'];
export type TasksTable = Tables['tasks'];

// Type-safe table access
export const tables = {
  tasks: supabase.from('tasks'),
  applications: supabase.from('applications'),
  user_app_subscriptions: supabase.from('user_app_subscriptions')
} as const;