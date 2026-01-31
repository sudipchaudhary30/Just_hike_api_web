/**
 * Get authentication token from localStorage
 * This utility ensures safe access to localStorage (client-side only)
 */
export function getAuthToken(): string {
  if (typeof window === 'undefined') return '';
  
  const token = localStorage.getItem('auth_token');
  
  // Handle various edge cases
  if (!token || token === 'null' || token === 'undefined') {
    console.warn('[Auth] No valid token found in localStorage');
    return '';
  }
  
  console.log('[Auth] Token found:', token.substring(0, 20) + '...');
  return token;
}

/**
 * Build authorization headers with token
 */
export function getAuthHeaders(token?: string): Record<string, string> {
  const authToken = token || getAuthToken();
  
  if (!authToken) {
    console.warn('[Auth] No token provided to getAuthHeaders');
    return {};
  }
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
  };
  
  console.log('[Auth] Authorization header set');
  return headers;
}

/**
 * Verify token is available
 */
export function hasAuthToken(): boolean {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return !!token;
}
