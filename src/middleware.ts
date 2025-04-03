import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { isSupportedLocale, getSafeLocale, getLocaleFromCookie } from '@/lib/i18n';

// List of supported locales
const locales = ['en', 'ja'];
const defaultLocale = 'en';

// Security headers for production
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  // Content Security Policy - Properly configured for production
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https: wss:;
    frame-src 'self';
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
};

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // 1. Check cookie first
  const cookieLocale = getLocaleFromCookie();
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Get locale from Accept-Language header
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  
  if (acceptLanguage) {
    const negotiatorHeaders = { 'accept-language': acceptLanguage };
    try {
      const locales = ['en', 'ja'];
      const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
      return match(languages, locales, defaultLocale);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error matching locale:', error);
      }
    }
  }
  
  // 3. Default locale as fallback
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // Clone the request headers to add security headers
  const response = NextResponse.next();
  
  // Add security headers in production
  if (process.env.NODE_ENV === 'production') {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  if (pathnameHasLocale) return response;
  
  // Get the pathname without trailing slash for consistent matching
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;
  
  // Exclude paths that should not be redirected
  const shouldNotRedirect = 
    // Next.js paths
    normalizedPath.startsWith('/_next') ||
    
    // API routes - never redirect these
    normalizedPath.startsWith('/api') ||
    
    // Admin routes - never redirect these
    normalizedPath === '/admin' ||
    normalizedPath.startsWith('/admin/') ||
    
    // Static assets
    normalizedPath.startsWith('/static') ||
    normalizedPath.startsWith('/assets') ||
    
    // Files with extensions
    normalizedPath.match(/\.(xml|json|txt|ico|jpg|jpeg|png|svg|webp|js|css|map)$/);
  
  if (shouldNotRedirect) {
    return response;
  }
  
  // Redirect to the appropriate locale
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Match all pathnames except for those starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - favicon.ico, robots.txt, sitemap.xml (public files)
    '/((?!api|_next/static|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
