import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Attempt to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Session refresh error:', error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No active session to refresh' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        session: data.session,
        user: data.user,
        message: 'Session refreshed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Refresh session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
