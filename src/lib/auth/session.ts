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
  const userId = headersList.get('x-user-id');
  const email = headersList.get('x-user-email');
  
  console.log('🔐 Session Headers:', {
    isVerified,
    userId,
    email,
    allHeaders: Array.from(headersList.entries()).filter(([key]) => key.startsWith('x-'))
  });
  
  if (!isVerified) {
    return {
      userId: null,
      email: null,
      isAuthenticated: false,
    };
  }

  return {
    userId,
    email,
    isAuthenticated: true,
  };
}

/**
 * Require authenticated session or throw 401 response
 */
export async function requireAuth(): Promise<{ userId: string; email: string }> {
  const session = await getSessionFromHeaders();
  
  console.log('🔒 RequireAuth check:', { 
    isAuthenticated: session.isAuthenticated, 
    hasUserId: !!session.userId 
  });
  
  if (!session.isAuthenticated || !session.userId) {
    console.error('❌ Authentication failed - throwing 401');
    throw new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  console.log('✅ Authentication successful:', session.userId);
  return {
    userId: session.userId,
    email: session.email || '',
  };
}
