'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { handleAuthError } from '@/lib/auth/client-utils';

/**
 * Auth Error Boundary - Listens for auth errors and handles them globally
 */
export default function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting to home');
          if (typeof window !== 'undefined') {
            // Only redirect if not already on home page or auth pages
            const currentPath = window.location.pathname;
            if (!['/login', '/signup', '/'].includes(currentPath)) {
              window.location.href = '/';
            }
          }
        }
      }
    );

    // Set up global error handler for unhandled auth errors
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's an auth error
      if (
        error?.code === 'refresh_token_not_found' ||
        error?.__isAuthError ||
        error?.status === 401
      ) {
        console.error('Global auth error caught:', error);
        handleAuthError(error);
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Check if it's an auth error
      if (
        error?.code === 'refresh_token_not_found' ||
        error?.__isAuthError ||
        error?.status === 401
      ) {
        console.error('Unhandled auth rejection:', error);
        handleAuthError(error);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
