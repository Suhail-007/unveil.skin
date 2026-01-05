import { headers } from 'next/headers';

export interface SessionData {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

/**
 * Get session data from middleware-verified headers
 * This replaces direct Supabase client calls in API routes
 */
export async function getSessionFromHeaders(): Promise<SessionData> {
  const headersList = await headers();
  const isVerified = headersList.get('x-session-verified') === 'true';
  
  if (!isVerified) {
    return {
      userId: null,
      email: null,
      isAuthenticated: false,
    };
  }

  return {
    userId: headersList.get('x-user-id'),
    email: headersList.get('x-user-email'),
    isAuthenticated: true,
  };
}

/**
 * Require authenticated session or throw 401 response
 */
export async function requireAuth(): Promise<{ userId: string; email: string }> {
  const session = await getSessionFromHeaders();
  
  if (!session.isAuthenticated || !session.userId) {
    throw new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return {
    userId: session.userId,
    email: session.email || '',
  };
}
