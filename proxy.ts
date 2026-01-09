import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verify session and attach to request headers
  // Use getUser() instead of getSession() for security - it validates with the server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Debug logging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('🔍 Proxy Debug:', {
      path: request.nextUrl.pathname,
      hasUser: !!user,
      userId: user?.id,
      error: error?.message,
      cookies: request.cookies.getAll().map(c => c.name),
    });
  }

  // Add session data to request headers for API routes to access
  if (user) {
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-email', user.email || '')
    response.headers.set('x-session-verified', 'true')
  } else {
    response.headers.set('x-session-verified', 'false')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
