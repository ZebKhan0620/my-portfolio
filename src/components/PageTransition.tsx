'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createLogger } from '@/lib/logging';

const logger = createLogger('PageTransition');

interface PageTransitionProps {
  children: React.ReactNode;
}

// For tracking route change timer between renders
declare global {
  interface Window {
    __routeChangeTimer?: NodeJS.Timeout | null;
  }
}

/**
 * PageTransition component to improve route change performance.
 * Addresses Issue #99 by:
 * - Prefetching linked pages for faster transitions
 * - Adding smooth fade transitions between route changes
 * - Tracking and optimizing route change performance
 * - Preconnecting to required origins
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track route change progress
  const incrementProgress = useCallback(() => {
    setProgress(current => {
      // Slow down as we get closer to 100%
      const increment = Math.max(1, Math.round((100 - current) / 10));
      const next = Math.min(99, current + increment);
      return next;
    });
  }, []);
  
  // Handle route start change
  const handleChangeStart = useCallback((url: string) => {
    logger.debug('Route change started', { url });
    setIsChanging(true);
    setProgress(10);
    
    // Start incrementing progress
    const timer = setInterval(incrementProgress, 100);
    timerRef.current = timer;
    
    // Also store in window for cross-component access
    window.__routeChangeTimer = timer;
  }, [incrementProgress]);
  
  // Handle route change complete
  const handleChangeComplete = useCallback((url: string) => {
    logger.debug('Route change completed', { url });
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Also clear from window
    if (window.__routeChangeTimer) {
      clearInterval(window.__routeChangeTimer);
      window.__routeChangeTimer = null;
    }
    
    // Complete the progress bar
    setProgress(100);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsChanging(false);
      setProgress(0);
    }, 400);
  }, []);
  
  // Optimize page loading by prefetching links in viewport
  useEffect(() => {
    const prefetchVisibleLinks = () => {
      // Find all links in the viewport
      const links = document.querySelectorAll('a[href^="/"]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('/api/')) {
          // Use Intersection Observer to determine visibility
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Prefetch the link that's in viewport
                logger.debug('Prefetching visible link', { href });
                router.prefetch(href);
                observer.unobserve(link);
              }
            });
          });
          
          observer.observe(link);
        }
      });
    };
    
    // Initial prefetch and on content changes
    prefetchVisibleLinks();
    
    // Setup a mutation observer to detect new links
    const mutationObserver = new MutationObserver(prefetchVisibleLinks);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      mutationObserver.disconnect();
    };
  }, [router]);
  
  // Add preconnect for external resources
  useEffect(() => {
    // Create preconnect links for commonly used domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    domains.forEach(domain => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'preconnect';
      linkEl.href = domain;
      linkEl.crossOrigin = 'anonymous';
      document.head.appendChild(linkEl);
    });
  }, []);
  
  // Since Next.js App Router doesn't have the same events API as Pages Router,
  // we need to use a different approach to simulate route changes.
  useEffect(() => {
    // Custom route change detection for App Router
    const handleRouteChangeStart = () => {
      // We can't directly detect route changes in App Router,
      // but we can trigger the loading state on specific actions
      
      // For now, manually add click handlers to links
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => {
        link.addEventListener('click', () => {
          const href = link.getAttribute('href');
          if (href) {
            handleChangeStart(href);
          }
        });
      });
    };
    
    handleRouteChangeStart();
    
    // Listen for navigation events from the router
    const handleRouteComplete = () => {
      handleChangeComplete(window.location.pathname);
    };
    
    // Use browser history api to detect navigation
    window.addEventListener('popstate', handleRouteComplete);
    
    return () => {
      window.removeEventListener('popstate', handleRouteComplete);
    };
  }, [handleChangeStart, handleChangeComplete]);
  
  return (
    <>
      {/* Progress bar for route changes */}
      {isChanging && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
          <div
            className="h-full bg-emerald-500 transition-all ease-out duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Page content with transition effect */}
      <div
        className={`transition-opacity duration-200 ${
          isChanging ? 'opacity-80' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
} 