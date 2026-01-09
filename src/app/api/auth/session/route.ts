import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Use getUser() instead of getSession() for security - it validates with the server
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Session error:', error);
      return NextResponse.json(
        { session: null, user: null },
        { status: 200 }
      );
    }

    // If we have a user, construct a minimal session object
    const session = user ? {
      user,
      access_token: '', // Not exposing tokens to client
      refresh_token: '',
      expires_at: 0,
      expires_in: 0,
      token_type: 'bearer'
    } : null;

    return NextResponse.json(
      {
        session,
        user: user || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
