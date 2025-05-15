import { verify } from 'jsonwebtoken'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/', '/auth/login', '/auth/register', '/api/auth/refresh']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Allow access to auth API endpoints
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // Protect other API routes
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!)
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user', JSON.stringify(decoded))
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
  }

  // Protect all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /public files
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. All files inside /public (e.g. /favicon.ico)
     */
    '/((?!public|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ]
}