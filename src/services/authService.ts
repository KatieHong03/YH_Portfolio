import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AdminAuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isCloudAuth: boolean;
}

const AUTH_LISTENERS = new Set<(state: AdminAuthState) => void>();

let currentAuthState: AdminAuthState = {
  isAuthenticated: false,
  user: null,
  session: null,
  isCloudAuth: false
};

function notifyListeners() {
  AUTH_LISTENERS.forEach(cb => cb(currentAuthState));
}

// Initialize session listener if Supabase is available
export function initAuthListener() {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        currentAuthState = {
          isAuthenticated: true,
          user: session.user,
          session,
          isCloudAuth: true
        };
      } else {
        // Check if there is an existing local fallback session
        const localActive = localStorage.getItem('portfolio_admin_active') === 'true';
        currentAuthState = {
          isAuthenticated: localActive,
          user: null,
          session: null,
          isCloudAuth: false
        };
      }
      notifyListeners();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      currentAuthState = {
        isAuthenticated: Boolean(session),
        user: session?.user || null,
        session,
        isCloudAuth: Boolean(session)
      };
      notifyListeners();
    });
  } else {
    // Local fallback
    const localActive = localStorage.getItem('portfolio_admin_active') === 'true';
    currentAuthState = {
      isAuthenticated: localActive,
      user: null,
      session: null,
      isCloudAuth: false
    };
    notifyListeners();
  }
}

export function getAdminAuthState(): AdminAuthState {
  return currentAuthState;
}

export function subscribeToAuth(callback: (state: AdminAuthState) => void): () => void {
  AUTH_LISTENERS.add(callback);
  callback(currentAuthState);
  return () => {
    AUTH_LISTENERS.delete(callback);
  };
}

export async function loginAdminWithPassword(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = (password || '').trim();

  // Primary administrator passcode check
  if (trimmed === '030226' || trimmed === 'admin') {
    currentAuthState = {
      isAuthenticated: true,
      user: null,
      session: null,
      isCloudAuth: false
    };
    localStorage.setItem('portfolio_admin_active', 'true');
    notifyListeners();
    return { success: true };
  }

  // Cloud Auth via Supabase if configured and user provides custom Supabase credentials
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured() && email && email.trim()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: trimmed
    });

    if (!error && data?.session) {
      currentAuthState = {
        isAuthenticated: true,
        user: data.user,
        session: data.session,
        isCloudAuth: true
      };
      localStorage.setItem('portfolio_admin_active', 'true');
      notifyListeners();
      return { success: true };
    }
  }

  return { success: false, error: 'Invalid password. Please enter administrator password 030226.' };
}

export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }

  currentAuthState = {
    isAuthenticated: false,
    user: null,
    session: null,
    isCloudAuth: false
  };
  localStorage.removeItem('portfolio_admin_active');
  notifyListeners();
}
