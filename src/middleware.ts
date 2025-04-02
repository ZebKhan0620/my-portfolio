import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDevMode = process.env.NODE_ENV === 'development';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  if (isDevMode) console.log(`Middleware running for path: ${path}`);

  // Check if this is an admin route
  if (path.startsWith('/admin')) {
    // Allow access to the login page
    if (path === '/admin/login') {
      if (isDevMode) console.log('Allowing access to login page');
      return NextResponse.next();
    }

    // Check for admin key
    const adminKey = request.cookies.get('adminKey')?.value;
    if (isDevMode) console.log(`Admin key in middleware: ${adminKey ? 'Found' : 'Not found'}`);

    // If no key, redirect to login
    if (!adminKey) {
      if (isDevMode) console.log('No admin key found, redirecting to login page');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    if (isDevMode) console.log('Admin key found, allowing access to admin route');
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 