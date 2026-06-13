import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.url ? new URL(request.url) : { pathname: request.nextUrl.pathname }

  // Get the JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready',
  })

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth']
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Static files and API routes (except auth) should pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!token && !isPublicPath) {
    // Allow API routes to return 401 instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
