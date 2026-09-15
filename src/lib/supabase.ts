import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys
export const STORAGE_BUCKET = 'portfolio-media';

// Retrieve credentials from Vite env or local config override
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  // Optional manual override in browser for staging / one-time migration
  let localUrl = '';
  let localKey = '';
  try {
    localUrl = localStorage.getItem('portfolio_supabase_url_override') || '';
    localKey = localStorage.getItem('portfolio_supabase_key_override') || '';
  } catch {
    // ignore
  }

  return {
    url: localUrl.trim() || envUrl.trim(),
    anonKey: localKey.trim() || envKey.trim()
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseInstance || lastUrl !== url || lastKey !== anonKey) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'portfolio_supabase_auth_session'
      }
    });
    lastUrl = url;
    lastKey = anonKey;
  }

  return supabaseInstance;
}
