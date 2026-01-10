import { createClient } from "../supabase/server";
import { metadata } from './../../app/layout';

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
  const supabaseClient = await createClient();
  const session = await supabaseClient.auth.getSession();
  const isVerified = session.data.session?.user?.user_metadata['email_verified']  ? true : false;
  const userId = session.data.session?.user?.id || null;
  const email = session.data.session?.user?.email || null;

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

  if (!session.isAuthenticated || !session.userId) {
    console.error('❌ Authentication failed - throwing 401');
    throw new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return {
    userId: session.userId,
    email: session.email || '',
  };
}
