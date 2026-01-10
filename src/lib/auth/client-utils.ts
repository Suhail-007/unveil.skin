/**
 * Auth Utilities - Client-side authentication helpers with automatic token refresh
 */

import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Handle authentication errors and refresh tokens automatically
 */
export async function handleAuthError(error: { code?: string; status?: number; message?: string; }): Promise<boolean> {
  // Check if this is a refresh token error
  const isTokenError = 
    error?.code === 'refresh_token_not_found' ||
    error?.status === 401 ||
    error?.message?.includes('refresh') ||
    error?.message?.includes('token');

  if (!isTokenError) {
    return false;
  }

  const supabase = createClient();

  try {
    // Try to refresh the session
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

    if (!refreshError && session) {
      // Successfully refreshed
      console.log('Session refreshed successfully');
      return true;
    }

    // Refresh failed, logout user
    console.warn('Session refresh failed, logging out user');
    await logoutAndRedirect();
    return false;
  } catch (refreshError) {
    console.error('Error refreshing session:', refreshError);
    await logoutAndRedirect();
    return false;
  }
}

/**
 * Logout user and redirect to home page
 */
export async function logoutAndRedirect(): Promise<void> {
  try {
    const supabase = createClient();
    
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Call logout API to clear server-side session
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error calling logout API:', error);
    }

    // Clear any local storage items
    if (typeof window !== 'undefined') {
      // Clear any app-specific storage
      localStorage.removeItem('cart');
      sessionStorage.clear();
    }

    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Force redirect even if logout fails
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

/**
 * Get current user with automatic token refresh
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      const refreshed = await handleAuthError(error);
      if (refreshed) {
        // Try again after refresh
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();
        return refreshedUser;
      }
      return null;
    }

    return user;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await handleAuthError(error);
    return null;
  }
}

/**
 * Check if user is authenticated with automatic refresh
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Wrapper for API calls with automatic token refresh and retry
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // Check if response indicates auth error
    if (response.status === 401) {
      const supabase = createClient();
      
      // Try to refresh session
      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (!error && session) {
        // Retry the request with refreshed session
        const retryResponse = await fetch(url, options);
        
        if (retryResponse.status === 401) {
          // Still unauthorized, logout
          await logoutAndRedirect();
        }
        
        return retryResponse;
      } else {
        // Refresh failed, logout
        await logoutAndRedirect();
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
