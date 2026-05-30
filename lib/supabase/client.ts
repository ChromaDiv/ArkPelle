import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Browser-side Supabase client.
 * Uses the anon key only — never the service role key.
 * All queries operate under active RLS policies.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('placeholder') || anonKey.includes('placeholder')) {
    // Return a dummy client during build time/server compilation to prevent crashing.
    // Real fetches are guarded by isSupabaseConfigured() checks.
    return createBrowserClient<Database>(
      'https://placeholder-url.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key'
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
