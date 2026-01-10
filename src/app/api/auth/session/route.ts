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

    return NextResponse.json(
      {
        session: null,
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
