import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if accessing console pages
  if (pathname.startsWith('/console')) {
    // Check for authentication token in cookies or headers
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  // Add timing headers for tracking
  const response = NextResponse.next()
  response.headers.set('x-request-start', Date.now().toString())
  response.headers.set('x-request-path', pathname)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}