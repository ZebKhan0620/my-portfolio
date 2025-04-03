'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { createLogger } from '@/lib/logging';

const logger = createLogger('DynamicTitle');

/**
 * Component that dynamically updates the browser title based on current locale and page
 * This is a client-side only component since it needs to react to language changes
 */
export default function DynamicTitle() {
  const { t, locale, isLoaded } = useLanguage();
  const pathname = usePathname();
  
  useEffect(() => {
    // Only update when translations are loaded
    if (!isLoaded) return;
    
    try {
      // Extract the current route from the pathname
      const routeSegments = pathname.split('/').filter(Boolean);
      const currentRoute = routeSegments.length > 1 ? routeSegments[1] : 'home';
      
      // Default title translation key
      let titleKey = 'meta.title';
      
      // Try to get page-specific title
      if (currentRoute && currentRoute !== 'home') {
        const pageSpecificKey = `meta.pages.${currentRoute}.title`;
        // Only use the page-specific key if it exists in translations
        const translated = t(pageSpecificKey);
        if (translated !== pageSpecificKey) {
          titleKey = pageSpecificKey;
        }
      }
      
      // Get the title from translations
      const title = t(titleKey);
      const siteName = t('meta.siteName');
      
      // Update the document title
      document.title = title === titleKey 
        ? siteName // Fallback to just the site name if translation not found
        : `${title} | ${siteName}`;
        
      logger.debug(`Updated page title to "${document.title}" for route: ${currentRoute}`);
    } catch (error) {
      logger.error('Error updating document title', error);
      // In case of error, set a basic title with the locale
      document.title = `My Portfolio (${locale})`;
    }
  }, [pathname, locale, t, isLoaded]);
  
  // This component doesn't render anything visible
  return null;
} 