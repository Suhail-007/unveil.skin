import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return existing instance if available (singleton pattern)
  if (clientInstance) {
    return clientInstance;
  }

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Auto refresh session
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Set up auth state change listener
        flowType: 'pkce',
      },
    }
  );

  // Listen for auth state changes and handle errors
  clientInstance.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // Clear client instance
      clientInstance = null;
    } else if (event === 'USER_UPDATED') {
      console.log('User updated');
    }
  });

  return clientInstance;
}
