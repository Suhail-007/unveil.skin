import { NextResponse } from 'next/server';
import { getSessionFromHeaders } from '@/lib/auth/session';

export async function GET() {
  try {
    // Get session from middleware headers
    const session = await getSessionFromHeaders();

    return NextResponse.json(
      {
        session: session.isAuthenticated ? {
          user: {
            id: session.userId,
            email: session.email,
          },
        } : null,
        user: session.isAuthenticated ? {
          id: session.userId,
          email: session.email,
        } : null,
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
