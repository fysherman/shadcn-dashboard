// Protecting routes with next-auth
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/')
    return NextResponse.redirect(new URL('/sign-in', request.url));
  if (request.nextUrl.pathname === '/dashboard')
    return NextResponse.redirect(new URL('/dashboard/employee', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
