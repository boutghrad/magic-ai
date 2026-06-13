import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPaths = ['/', '/login', '/register', '/pricing']
const publicApiPaths = ['/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next()
  }

  // Allow public API paths (NextAuth routes)
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check for JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready',
  })

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If not authenticated and trying to access protected routes
  if (!token) {
    // API routes return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Page routes redirect to login with callbackUrl
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
     * - public files (logo.svg, robots.txt, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|logo\\.svg|robots\\.txt).*)',
  ],
}
