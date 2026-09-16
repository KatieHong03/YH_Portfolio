export interface AdminAuthState {
  isAuthenticated: boolean;
}

const AUTH_LISTENERS = new Set<(state: AdminAuthState) => void>();

let currentAuthState: AdminAuthState = {
  isAuthenticated: false
};

function notifyListeners() {
  AUTH_LISTENERS.forEach(cb => cb(currentAuthState));
}

// Initialize session listener using local storage
export function initAuthListener() {
  const localActive = typeof window !== 'undefined' && localStorage.getItem('portfolio_admin_active') === 'true';
  currentAuthState = {
    isAuthenticated: localActive
  };
  notifyListeners();
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

export async function loginAdminWithPassword(_email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = (password || '').trim();

  // Primary administrator passcode check
  if (trimmed === '030226' || trimmed === 'admin') {
    currentAuthState = {
      isAuthenticated: true
    };
    localStorage.setItem('portfolio_admin_active', 'true');
    notifyListeners();
    return { success: true };
  }

  return { success: false, error: 'Invalid password. Please enter administrator password.' };
}

export async function logoutAdmin(): Promise<void> {
  currentAuthState = {
    isAuthenticated: false
  };
  localStorage.removeItem('portfolio_admin_active');
  notifyListeners();
}
